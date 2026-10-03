import { GoogleGenAI } from '/speaking/google-genai.js';
function base64(buffer) { let binary = ''; for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte); return btoa(binary); }
// Avoid routing speech into silent loopback devices such as BlackHole.
export function selectMicrophone(devices, requested = '') {
  const inputs = devices.filter(device => device.kind === 'audioinput');
  if (requested) {
    if (!inputs.some(device => device.deviceId === requested)) throw new Error('所选麦克风已断开，请重新选择麦克风。');
    return requested;
  }
  const physical = inputs.filter(device => !['default', 'communications'].includes(device.deviceId) && device.label && !/blackhole|virtual|loopback|soundflower|vb-audio|aggregate|虚拟|聚集/i.test(device.label));
  return (physical.find(device => /macbook|built.in|内建|内置/i.test(device.label)) || physical[0])?.deviceId;
}
export const Conversation = {
  async startSession(options) {
    let stream, input, output, microphone, source, silent, session;
    let lastVoiceAt = Date.now();
    let closed = false, muted = false, clock = 0, startupTimer;
    let transcriptSequence = 0, interruptedTurn = false, typedEcho = null;
    const transcriptTurns = { user: null, ai: null };
    const savedTurns = new Map();
    let currentLevel = options.level || 'B1';
    function emitTurn(record, final = false) {
      savedTurns.set(record.id, { role: record.source === 'user' ? 'user' : 'model', parts: [{ text: record.text }] });
      options.onMessage?.({ source: record.source, message: record.text, event_id: record.id, sequence: record.sequence, final });
    }
    function finishTurn(role) {
      const record = transcriptTurns[role];
      if (!record) return;
      transcriptTurns[role] = null;
      emitTurn(record, true);
    }
    function appendTurn(role, text) {
      if (!text) return;
      let record = transcriptTurns[role];
      if (!record) {
        if (role === 'ai') finishTurn('user');
        const sequence = ++transcriptSequence;
        record = transcriptTurns[role] = { source: role, text: '', sequence, id: `${role}-${sequence}` };
      }
      record.text += text; emitTurn(record);
      return record;
    }
    function appendInput(text) {
      if (!text) return;
      // Typed messages already have their own row. If a provider echoes one in
      // chunks, consume only that matching prefix, never a later spoken answer.
      if (typedEcho) {
        const candidate = typedEcho.received + text;
        if (typedEcho.text.startsWith(candidate)) {
          typedEcho.received = candidate;
          if (candidate === typedEcho.text) typedEcho = null;
          return;
        }
        text = candidate.startsWith(typedEcho.text) ? candidate.slice(typedEcho.text.length) : candidate;
        typedEcho = null;
      }
      appendTurn('user', text);
    }
    const nodes = new Set();
    let rejectReady = () => {};
    let connectionId = 0, resumeHandle = '', reconnecting = false, goAway = false;
    let credentials = { token: options.conversationToken, expiresAt: options.expiresAt };
    function stopOutput() {
      for (const node of nodes) { node.onended = null; try { node.stop(); } catch {} node.disconnect(); }
      nodes.clear(); clock = output?.currentTime || 0;
      if (!closed) options.onModeChange?.({ mode: 'listening' });
    }
    const client = {
      async endSession() {
        if (closed) return;
        closed = true; connectionId++; clearTimeout(startupTimer); rejectReady(new DOMException('Cancelled', 'AbortError'));
        finishTurn('user'); finishTurn('ai'); typedEcho = null;
        options.signal?.removeEventListener('abort', abort); stopOutput();
        if (microphone) { microphone.port.onmessage = null; microphone.disconnect(); }
        source?.disconnect(); silent?.disconnect(); stream?.getTracks().forEach(track => track.stop());
        try { session?.close(); } catch {}
        await Promise.allSettled([input?.close(), output?.close()]);
      },
      setMicMuted(value) {
        muted = value; stream?.getAudioTracks().forEach(track => { track.enabled = !value; });
        if (value && !reconnecting) session?.sendRealtimeInput({ audioStreamEnd: true });
      },
      sendUserMessage(text) {
        if (closed || reconnecting || !session) throw new Error('Disconnected');
        stopOutput(); session.sendRealtimeInput({ text });
        finishTurn('user');
        const record = appendTurn('user', String(text));
        finishTurn('user');
        typedEcho = { text: String(text), received: '' };
        return record?.id;
      },
      updateDifficulty(level) {
        if (!['A2','B1','B2','C1'].includes(level) || closed || reconnecting || !session) throw new Error('Disconnected');
        session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: `Conversation setting update: use ${level} English from your next reply. Adapt vocabulary, sentence complexity and question depth. Keep the same topic, do not restart or announce this update.` }] }], turnComplete: false });
        currentLevel = level;
      },
      async switchVoice(nextVoice) {
        if (closed || reconnecting || !session) throw new Error('Disconnected');
        if (!['Kore','Aoede','Sulafat','Puck','Orus','Algenib'].includes(nextVoice)) throw new Error('Invalid voice');
        reconnecting = true; goAway = false; connectionId++;
        stopOutput(); finishTurn('user'); finishTurn('ai'); typedEcho = null; interruptedTurn = false;
        options.onStatus?.('正在切换声音，请稍等一下…');
        try {
          session.close(); resumeHandle = '';
          credentials = await options.renewToken(); assertOpen();
          options.voice = nextVoice;
          await connect(); assertOpen();
          // Restore history and continuation in one ordered client-content
          // message; realtime input has no ordering guarantee relative to it.
          session.sendClientContent({ turns: [...savedTurns.values(), { role: 'user', parts: [{ text: 'The voice setting has changed. Continue our existing conversation naturally from the latest exchange, without greeting again or repeating previous answers. If the latest question is awaiting an answer, briefly invite me to continue.' }] }], turnComplete: true });
          reconnecting = false; lastVoiceAt = Date.now();
          options.onStatus?.('声音已切换，可以继续聊。');
        } catch (error) {
          const cancelled = closed || options.signal?.aborted;
          await client.endSession();
          if (!cancelled) options.onDisconnect?.({ reason: 'error' });
          throw error;
        }
      },
      sendContextualUpdate() {}, sendUserActivity() {},
    };
    function abort() { void client.endSession(); }
    options.signal?.addEventListener('abort', abort, { once: true });
    if (options.signal?.aborted) { await client.endSession(); throw new DOMException('Cancelled', 'AbortError'); }
    function assertOpen() { if (closed) throw new DOMException('Cancelled', 'AbortError'); }
    function play(data, mimeType = '') {
      const binary = atob(data); const raw = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) raw[i] = binary.charCodeAt(i);
      const pcm = new DataView(raw.buffer); const rate = Number(mimeType.match(/rate=(\d+)/)?.[1] || 24000);
      const buffer = output.createBuffer(1, Math.floor(raw.byteLength / 2), rate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = pcm.getInt16(i * 2, true) / 32768;
      const node = output.createBufferSource(); node.buffer = buffer; node.connect(output.destination); nodes.add(node);
      node.onended = () => { nodes.delete(node); node.disconnect(); if (!closed && !nodes.size) options.onModeChange?.({ mode: 'listening' }); };
      clock = Math.max(clock, output.currentTime + .015); node.start(clock); clock += buffer.duration;
      options.onModeChange?.({ mode: 'speaking' });
    }
    async function connect() {
      const ai = new GoogleGenAI({ apiKey: credentials.token, httpOptions: { apiVersion: 'v1beta' } });
      let resolveReady;
      const ready = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
      void ready.catch(() => {});
      const id = ++connectionId;
      startupTimer = setTimeout(() => { rejectReady(new Error('连接超时，请检查网络后重试。')); void client.endSession(); }, 20000);
      const connected = await ai.live.connect({
        model: credentials.model || options.model,
        config: {
          responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: options.voice || 'Kore' } } },
          sessionResumption: resumeHandle ? { handle: resumeHandle } : {},
          contextWindowCompression: { slidingWindow: {} },
          systemInstruction: `${options.prompt}\nCurrent English difficulty: ${currentLevel}. Apply later learner conversation-setting updates to this level without restarting the topic.`, inputAudioTranscription: {}, outputAudioTranscription: {},
          realtimeInputConfig: { automaticActivityDetection: { disabled: false, endOfSpeechSensitivity: 'END_SENSITIVITY_LOW', silenceDurationMs: options.patience || 800, prefixPaddingMs: 100 }, activityHandling: 'START_OF_ACTIVITY_INTERRUPTS' },
        },
        callbacks: {
          onmessage(message) {
            if (closed || id !== connectionId) return;
            if (message.setupComplete) resolveReady();
            if (message.sessionResumptionUpdate) {
              const update = message.sessionResumptionUpdate;
              resumeHandle = update.resumable ? (update.newHandle || resumeHandle) : '';
            }
            if (message.goAway) goAway = true;
            if (goAway && resumeHandle && !reconnecting) { void resumeConnection(); return; }
            const content = message.serverContent; if (!content) return;
            if (content.interrupted) {
              // The interruption belongs to the old AI turn. The new user's
              // transcription may already be arriving, so do not reset it.
              if (content.outputTranscription?.text) appendTurn('ai', content.outputTranscription.text);
              stopOutput(); finishTurn('ai'); interruptedTurn = true;
              appendInput(content.inputTranscription?.text);
            } else {
              appendInput(content.inputTranscription?.text);
              if (content.outputTranscription?.text) {
                typedEcho = null;
                appendTurn('ai', content.outputTranscription.text);
              }
            }
            if (!content.interrupted) for (const part of content.modelTurn?.parts || []) {
              if (part.inlineData?.data && part.inlineData.mimeType?.startsWith('audio/pcm')) play(part.inlineData.data, part.inlineData.mimeType);
            }
            if (content.turnComplete) {
              finishTurn('ai');
              if (!interruptedTurn) { finishTurn('user'); typedEcho = null; }
              interruptedTurn = false;
            }
          },
          onerror() { if (!closed && id === connectionId) { rejectReady(new Error('语音连接出错，请检查网络后重试。')); options.onError?.(); } },
          onclose(event) {
            if (closed || id !== connectionId) return;
            if (goAway && resumeHandle && !reconnecting) { void resumeConnection(); return; }
            rejectReady(new Error('语音连接被关闭。')); void client.endSession();
            options.onDisconnect?.({ reason: event.code === 1000 ? 'agent' : 'error', code: event.code });
          },
        },
      });
      if (closed || id !== connectionId) { connected.close(); assertOpen(); return; }
      session = connected;
      await ready; clearTimeout(startupTimer); assertOpen();
    }
    async function resumeConnection() {
      if (closed || reconnecting || !resumeHandle) return;
      reconnecting = true; goAway = false; connectionId++;
      options.onStatus?.('正在续接语音，请稍等一下…');
      try {
        // Resume only a provider-requested rollover, never retry a quota error.
        session?.close();
        if (!credentials.expiresAt || credentials.expiresAt - Date.now() < 120000) {
          credentials = await options.renewToken();
        }
        assertOpen();
        await connect(); assertOpen();
        reconnecting = false;
        options.onStatus?.('已续接，继续聊吧。');
      } catch {
        const cancelled = options.signal?.aborted;
        await client.endSession();
        if (!cancelled) options.onDisconnect?.({ reason: 'error' });
      }
    }
    try {
      output = options.audioContexts?.output || new AudioContext({ sampleRate: 24000 }); input = options.audioContexts?.input || new AudioContext({ sampleRate: 16000 });
      options.onStatus?.('正在启动浏览器音频…');
      await Promise.all([output.resume(), input.resume()]); assertOpen();
      options.onStatus?.('正在等待麦克风权限，请在弹窗中允许…');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const selectedDevice = selectMicrophone(devices, options.microphoneId);
      const audio = { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true };
      stream = await navigator.mediaDevices.getUserMedia({ audio: { ...audio, ...(selectedDevice ? { deviceId: { exact: selectedDevice } } : {}) } });
      // Before first permission, labels may be hidden. Re-evaluate after permission.
      if (!options.microphoneId && !selectedDevice && !closed) {
        const preferred = selectMicrophone(await navigator.mediaDevices.enumerateDevices());
        if (preferred && preferred !== stream.getAudioTracks()[0]?.getSettings().deviceId) {
          stream.getTracks().forEach(track => track.stop());
          stream = await navigator.mediaDevices.getUserMedia({ audio: { ...audio, deviceId: { exact: preferred } } });
        }
      }
      if (closed) { stream.getTracks().forEach(track => track.stop()); assertOpen(); }
      await input.audioWorklet.addModule('/speaking/mic-worklet.js'); assertOpen();
      options.onMicrophone?.({ device: stream.getAudioTracks()[0]?.label || '默认麦克风', level: 0, waiting: true });
      options.onStatus?.('麦克风已就绪，正在连接 Gemini…');
      // Ask for the one-minute startup token only after the visitor permits audio.
      // Leaving a permission dialog open must not consume its start window.
      if (options.createToken) credentials = await options.createToken();
      assertOpen();
      await connect();
      source = input.createMediaStreamSource(stream); microphone = new AudioWorkletNode(input, 'mapkai-mic'); silent = input.createGain(); silent.gain.value = 0;
      source.connect(microphone); microphone.connect(silent); silent.connect(input.destination);
      microphone.port.onmessage = ({ data }) => {
        if (closed || muted || reconnecting) return;
        const pcm = new Int16Array(data);
        let energy = 0; for (const sample of pcm) energy += (sample / 32768) ** 2;
        const rms = Math.sqrt(energy / pcm.length);
        if (rms > 0.005) lastVoiceAt = Date.now();
        options.onMicrophone?.({ level: Math.min(1, rms * 8), quiet: Date.now() - lastVoiceAt > 6000 });
        try { session.sendRealtimeInput({ audio: { data: base64(data), mimeType: 'audio/pcm;rate=16000' } }); } catch { options.onError?.(); }
      };
      options.onConversationCreated?.(client);
      session.sendRealtimeInput({ text: options.openingMessage || 'Begin in the selected session mode. Greet me briefly, then ask one easy, specific question grounded in my story notes and episode focus. Respect my topic boundaries.' });
      return client;
    } catch (error) { await client.endSession(); throw error; }
  },
};
