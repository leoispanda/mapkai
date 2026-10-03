class MicrophoneProcessor extends AudioWorkletProcessor {
  constructor() { super(); this.packet = new Int16Array(1600); this.index = 0; this.phase = 0; this.sum = 0; this.count = 0; }
  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    for (const value of channel) {
      this.sum += value; this.count++; this.phase += 16000;
      if (this.phase >= sampleRate) {
        this.phase -= sampleRate;
        const sample = Math.max(-1, Math.min(1, this.sum / this.count));
        this.packet[this.index++] = sample < 0 ? sample * 32768 : sample * 32767;
        this.sum = 0; this.count = 0;
        if (this.index === this.packet.length) {
          const packet = this.packet; this.port.postMessage(packet.buffer, [packet.buffer]);
          this.packet = new Int16Array(1600); this.index = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor('mapkai-mic', MicrophoneProcessor);
