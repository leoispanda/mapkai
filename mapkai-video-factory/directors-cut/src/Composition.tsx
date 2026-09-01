import { AbsoluteFill, Composition, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const fps = 30;
const fade = (frame: number, from: number, duration = 18) => interpolate(frame, [from, from + duration, from + duration * 4, from + duration * 5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

const Node = ({ label, x, y, from, accent = "#d89b47" }: { label: string; x: number; y: number; from: number; accent?: string }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [from, from + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ position: "absolute", left: x, top: y, opacity: reveal, translate: `${interpolate(reveal, [0, 1], [-18, 0])}px 0`, display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 10, height: 10, borderRadius: 10, background: accent, boxShadow: `0 0 18px ${accent}` }} /><div style={{ color: "#f2e7d4", fontSize: 19, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Arial, sans-serif", fontWeight: 600 }}>{label}</div></div>;
};

const EconomyProofOfStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const slowPush = interpolate(frame, [0, 20 * fps], [1.04, 1.16], { extrapolateRight: "clamp" });
  const grain = interpolate(frame, [0, 20 * fps], [0.04, 0.09], { extrapolateRight: "clamp" });
  const first = fade(frame, 1 * fps, 22);
  const second = fade(frame, 6.3 * fps, 24);
  const third = fade(frame, 12.2 * fps, 26);
  const final = fade(frame, 17 * fps, 24);
  const mapReveal = interpolate(frame, [10 * fps, 14 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <AbsoluteFill style={{ background: "#06090d", overflow: "hidden", fontFamily: "Georgia, 'Times New Roman', serif" }}>
    <Img src={staticFile("economics-network.png")} style={{ position: "absolute", width, height, objectFit: "cover", scale: slowPush, filter: "saturate(.72) contrast(1.16) brightness(.66)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 62% 40%, transparent 0%, rgba(3,7,11,.10) 24%, rgba(3,7,11,.84) 100%)" }} />
    <AbsoluteFill style={{ opacity: grain, background: "repeating-linear-gradient(112deg, transparent 0px, transparent 5px, rgba(255,255,255,.045) 6px, transparent 7px)" }} />
    <div style={{ position: "absolute", left: 74, top: 62, color: "#d89b47", fontFamily: "Arial, sans-serif", fontSize: 15, letterSpacing: "0.24em", fontWeight: 700 }}>MAPKAI / ECONOMICS</div>
    <div style={{ position: "absolute", left: 74, bottom: 54, color: "#ddcaa8", fontFamily: "Arial, sans-serif", fontSize: 14, letterSpacing: "0.14em", opacity: .78 }}>DIRECTOR’S CUT — PROOF OF STYLE</div>
    <div style={{ position: "absolute", left: 74, top: 154, width: 670, opacity: first }}><div style={{ color: "#f5ead9", fontSize: 66, lineHeight: 1.08, fontWeight: 500, textShadow: "0 4px 36px rgba(0,0,0,.58)" }}>How can choices that make sense alone…</div><div style={{ color: "#d89b47", fontSize: 66, lineHeight: 1.08, fontWeight: 500, marginTop: 6 }}>make the whole system worse?</div></div>
    <div style={{ position: "absolute", left: 74, top: 174, width: 580, opacity: second }}><div style={{ color: "#d89b47", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "0.18em", marginBottom: 22 }}>THE FIRST TURN</div><div style={{ color: "#f5ead9", fontSize: 62, lineHeight: 1.1 }}>Economics begins with a constraint.</div><div style={{ color: "#ddcaa8", fontSize: 31, lineHeight: 1.35, marginTop: 24 }}>Every choice spends time, attention, resources — and closes another possibility.</div></div>
    <div style={{ opacity: third }}><div style={{ position: "absolute", left: 74, top: 150, width: 520, color: "#f5ead9", fontSize: 57, lineHeight: 1.1 }}>But choice never stays private.</div><div style={{ position: "absolute", left: 74, top: 292, width: 520, color: "#ddcaa8", fontSize: 29, lineHeight: 1.35 }}>It becomes a price. A signal. A pressure on everyone else.</div><div style={{ position: "absolute", right: 116, top: 150, width: 450, height: 360, opacity: mapReveal }}><svg width="450" height="360" viewBox="0 0 450 360" style={{ position: "absolute", inset: 0 }}>{[[36,285,210,176],[210,176,394,80],[210,176,385,292],[36,285,385,292],[394,80,385,292]].map(([x1,y1,x2,y2], index) => <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d89b47" strokeWidth="1.5" opacity=".72" />)}</svg><Node label="Choice" x={0} y={258} from={10.2 * fps} /><Node label="Price" x={172} y={150} from={11 * fps} accent="#f5ead9" /><Node label="Institution" x={310} y={55} from={11.8 * fps} /><Node label="Consequence" x={294} y={268} from={12.6 * fps} accent="#f5ead9" /></div></div>
    <div style={{ position: "absolute", left: 74, top: 190, width: 760, opacity: final }}><div style={{ color: "#f5ead9", fontSize: 68, lineHeight: 1.06 }}>Economics is not a story about money.</div><div style={{ color: "#d89b47", fontSize: 68, lineHeight: 1.06, marginTop: 8 }}>It is a map of consequences.</div></div>
  </AbsoluteFill>;
};

export const MyComposition: React.FC = () => <Composition id="EconomicsDirectorsCut" component={EconomyProofOfStyle} durationInFrames={20 * fps} fps={fps} width={1280} height={720} />;
