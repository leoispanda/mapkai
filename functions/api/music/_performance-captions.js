// Existing MV subtitles, bound to its exact published recording. Written lyrics stay unchanged.
// Approximate phrase timing; ellipses retain the two uncertain phrase endings from the MV.
const recording = Object.freeze({
  id: 'efc8308c-614f-4845-94ce-3b32425c2e4a',
  audioEtag: '9cdf198a59ac0e6bdf48bff5e4b12536', fileSize: 2801799,
});
const phrases = [
  [
    0.0,
    4.22,
    "Before your time, before your town,"
  ],
  [
    4.48,
    8.18,
    "We fell, we built, we passed it down."
  ],
  [
    9.84,
    12.8,
    "Van Gogh, Starry Night, storms in the sky,"
  ],
  [
    13.24,
    15.36,
    "Sunflowers burn as the world walks by."
  ],
  [
    15.36,
    18.04,
    "Rembrandt, Night Watch, shadows hold flame,"
  ],
  [
    18.44,
    20.5,
    "Kept my brush, kept my name."
  ],
  [
    20.5,
    23.26,
    "Vermeer, pearl earring, a quiet glance stays clear,"
  ],
  [
    23.74,
    25.88,
    "Mondrian, red, blue, yellow, black line,"
  ],
  [
    25.88,
    27.92,
    "Broke it down, made a new design."
  ],
  [
    28.88,
    30.82,
    "Erasmus, Folly, made the mighty strange,"
  ],
  [
    31.5,
    33.56,
    "Spinoza, Ethics, thinking through the doubt,"
  ],
  [
    33.64,
    36.28,
    "They closed the circle; thoughts still found a way out."
  ],
  [
    36.7,
    38.74,
    "Huygens found Titan, watched the pendulum swing,"
  ],
  [
    39.02,
    41.32,
    "Measured time, still chasing Saturn’s ring."
  ],
  [
    41.84,
    44.08,
    "Leeuwenhoek, one lens, one drop,"
  ],
  [
    44.44,
    45.56,
    "Saw tiny lives…"
  ],
  [
    46.66,
    49.3,
    "No crown, no crowd, no guaranteed win,"
  ],
  [
    49.73,
    51.68,
    "Even when they doubt you, you can still begin."
  ],
  [
    51.68,
    54.48,
    "Take the fall, take the lesson, let the next page turn,"
  ],
  [
    54.48,
    57.0,
    "Keep the fire low and steady, let it quietly burn."
  ],
  [
    57.0,
    59.72,
    "Different names, different roads they knew,"
  ],
  [
    59.8,
    62.42,
    "William of Orange, led a long fight,"
  ],
  [
    62.42,
    64.94,
    "Gerard Philips, built his lamps by hand,"
  ],
  [
    64.94,
    67.7,
    "A factory in Eindhoven, a growing brand."
  ],
  [
    67.7,
    70.02,
    "ASML, born in eighty-four,"
  ],
  [
    70.02,
    72.68,
    "Chipmaking tools, with light at the core."
  ],
  [
    72.68,
    75.74,
    "Guido van Rossum, Python, clear to read,"
  ],
  [
    75.74,
    77.46,
    "One line of code, one…"
  ],
  [
    78.0,
    80.58,
    "Cruyff, number fourteen, made the whole field breathe,"
  ],
  [
    80.58,
    83.06,
    "Total Football, move together, make the space you need."
  ],
  [
    83.96,
    86.38,
    "Max, chasing every apex, keeping focus through each turn,"
  ],
  [
    86.38,
    89.48,
    "The wins look quick on Sunday, but they take years to earn."
  ],
  [
    89.48,
    93.04,
    "They wrote their lines, they walked their roads,"
  ],
  [
    93.04,
    95.04,
    "The beat is passing through."
  ],
  [
    95.04,
    97.64,
    "The past can lend a rhythm,"
  ],
  [
    97.64,
    100.26,
    "But the next verse comes from you."
  ]
];

export function performanceCaptions(track) {
  if (track?.id !== recording.id || track.audioEtag !== recording.audioEtag || track.fileSize !== recording.fileSize) return null;
  return { text: phrases.map(phrase => phrase[2]).join('\n'),
    timing: phrases.map(([start, end], line) => ({ line, start, end })),
    source: 'music-video', approximate: true };
}
