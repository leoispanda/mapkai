// Read-only 2026-10-18 numerical audit of the existing 001–054 recordings.
// Each estimate is pinned to the exact existing song ID, audio ETag and byte
// length. These values are pulse candidates, not verified quarter-note tempo.
// Keep full candidate precision here; presentation may round with an ≈ marker.
// Data columns: id, ETag, bytes, BPM candidates, confidence, section conflict,
// near-180 pulse evidence. No source paths, provider identity or object keys.
const AUDITED_RECORDINGS = [
  ["5acde69b-c30b-4b39-8b76-b544737135f5", "a3f5810939c4475d00072cb863fea676", 2897721, [95.9784, 191.9572], "strong", false, false],
  ["bb5957e7-9e91-45e1-a978-5643451d7820", "0b0524d2f016746c7c3a6578ff8b4137", 1457643, [156.0763], "moderate", false, false],
  ["ccb37c55-bae6-4f72-a80a-d1bc94e40ae0", "1d36aaefd5673bb56ce3a337f31e4481", 2897721, [192.0228], "strong", false, false],
  ["e4363fdb-2354-4e5c-98f0-9549b689b5c3", "5a8aea1e24aec5ce815751d453cedede", 2897721, [95.9848, 191.9623], "strong", false, false],
  ["4fa6e4f7-9995-4768-9958-3c7e5c74ea99", "42b5cadd8f65c1b7da7384ccfbfb148b", 2897721, [94.9983, 190.0155], "moderate", false, false],
  ["6e294673-6d7c-4c16-8464-f43c88a4d3e2", "02e0c13a9f2e5fca8a18f467d5f1a41e", 2897721, [119.9777, 239.966], "strong", false, false],
  ["ba310ae6-7b5f-4807-934a-9e0ddd849491", "1dcb84d1069e1bd87946d5a8efc195f2", 2897721, [95.9868, 191.9867], "strong", false, false],
  ["c2a4a749-933b-4b4b-95fb-0d2d3f12ac6f", "ec7803d4adeeacc24dcf54e4338d42b6", 2897721, [96.0075, 192.0072], "strong", false, false],
  ["392f97bd-307f-4e0d-b047-bfe78ae2f219", "0fd67093e42c26566d489f85582fe92c", 2897721, [83.2837, 166.6029], "moderate", false, false],
  ["82953edb-e939-4c66-9c3d-51cfff0aec1d", "7f9dc0e0e5df938391e522f55d78e9e9", 2897721, [96.0244, 192.0733], "moderate", false, false],
  ["bcfa3547-7b75-44bd-ab1c-dc711762ad7b", "934412a709c4d52275787c82f67081c7", 2897721, [91.9972, 183.9823], "moderate", false, false],
  ["03578f8b-14e7-42db-a713-bbbfbd05c571", "1ffd8939a5aa6708fd6aa985d5efc356", 2897721, [87.9841, 175.9994], "moderate", false, false],
  ["4e1d3520-26ad-4d1b-9c80-3a55b9c2660b", "c0376bc4de18bd7c0fc7e1cf7bfd7874", 2897721, [95.9376, 191.9016], "strong", false, false],
  ["87412ae5-8cd8-4543-8dac-a4fe8b43879a", "1c04ae09dde101f73ccfec7226585f6b", 2897721, [107.9955, 215.9883], "strong", false, false],
  ["9b9acef3-3260-47d2-89a4-4a001090263f", "0fb4ac7a050dc5e9efcfbc07c98a7eb8", 2897721, [100.0165, 200.0256], "moderate", false, false],
  ["d2b9dd41-919b-4392-8488-5fabee707c40", "be7e4ef3fc9c30fccb05f1d7ceac553a", 2897721, [90.0556, 180.0629], "strong", false, true],
  ["e0133c7a-ca30-4789-a7e3-63041f0d090b", "020d77a19f0ada7b53b2815eb586a550", 2897721, [104.0167, 208.0392], "moderate", false, false],
  ["738f6165-d1c7-4d94-864b-a88f484318d9", "24f7f83c263d6a78254f47b68a665b04", 2897721, [96.0026, 192.0189], "strong", false, false],
  ["1977976d-4585-4194-bbee-49068a5620f1", "0421032b5903ebb00f3b642f91caf369", 2737884, [81.9814, 163.9832], "strong", false, false],
  ["06f9d872-0c71-4bb5-aaef-8a0b07116c47", "4d8fbb5acd632ab2dba5e0ec5114526d", 2897721, [95.9938, 191.9959], "strong", false, false],
  ["30be18b4-94ec-4acf-87c4-dc4298cd38f4", "9ecd7dd1e0ca9c3f56c5261502e51b87", 3618074, [84.9915, 170.0076], "moderate", false, false],
  ["4dd21df7-9ea8-40f9-92ae-8458102f9ceb", "6b44de7a6d1b37b984bf0e8f2c8f60f6", 2897721, [95.9861, 192.0013], "strong", false, false],
  ["51bfd6b7-e28e-4bcd-9a84-70841309d8c9", "9629cfbdef2c997500ae05c70ec229fe", 2897721, [169.9375], "moderate", false, false],
  ["90fdbcee-57ee-4014-a34a-a6c797da2acb", "2cae4b6846090aaad90bc8e8f9b4ef60", 2897721, [81.9888, 163.9657], "strong", false, false],
  ["cbbdef58-3ec6-40f7-be79-0d7fc96f4c70", "37587d40e3c23cc3728d3761f8094fae", 3377956, [167.9501], "moderate", false, false],
  ["dd6263c6-5da3-4e67-8856-c97f0e293663", "af39be31f7b90e135390b15ecb1a8c5d", 2897721, [81.9846, 163.9927], "strong", false, false],
  ["3ac342f9-51cd-4f3b-a43a-8a8dc57cde12", "7d1d1fbebf383b82ed2ab815d407b237", 2897721, [95.9806, 192.0037], "strong", false, false],
  ["d2049be8-7ee0-43a1-a80f-766f2a468439", "19e33856fb2cd0cefc6dd0d99b05cda0", 2897721, [92.0294, 184.0713], "moderate", false, false],
  ["fdfd14ce-3e3a-439c-91d2-f9e364be14a5", "4a336293c528996235f89577a176468b", 2609956, [87.9823, 175.9876], "strong", false, false],
  ["69ba1ff7-d151-4082-b17e-e2626ef04fd3", "6ecb656ed37f9718561dbdaebf7139ca", 2897721, [95.9956, 191.9693], "strong", false, false],
  ["d6a470e4-db68-4023-81dc-9b04b8e662a2", "c08f7c8a791a81bbac66bc8916c4be1b", 2898975, [88.0422, 176.0696], "moderate", false, false],
  ["deecc5a6-ca8c-4726-9ef1-8f36dfeff6e0", "d293d6cfe1674c3703d83fcb483d90cf", 2897721, [87.9885, 176.0013], "moderate", false, false],
  ["03c29a5d-917f-4beb-b3a5-182f4bc147dc", "f1efaa3ad6a27afbe88823666a6c3243", 2897721, [91.9948, 184.0091], "strong", false, false],
  ["361ce603-1e4b-4446-8473-89cffba7ada1", "d6c1b1eee3315b9590d13ae3f038f0e1", 2897721, [91.976, 183.9983], "strong", false, false],
  ["5466f114-fcea-468a-8eb3-da2d38456d5d", "454c7d890cacf77ac3e9ed9fd8831e97", 2897721, [175.9569], "moderate", false, false],
  ["0f8944c6-fd4e-45cd-ac5a-22e0a4552bae", "32898100c078f60aaac84fc5ae611fdc", 2897721, [91.9963, 183.9657], "strong", false, false],
  ["1eaa815d-a3ee-4a44-b9b0-0d17f25fe8fb", "99ac07bb361972079446488fa35f0402", 2897721, [95.9805, 191.9564], "strong", false, false],
  ["4a0fb76e-cb24-4bfe-8a63-165001b61f0a", "1ac2e47bfb7d66e98e535460456b8576", 2897721, [96.0079, 192.0134], "strong", false, false],
  ["38a9863f-c874-4cb1-ad34-6ac12dfafb31", "57dc86962e9985aad4c284dbe86b04c4", 2801800, [175.9243], "moderate", false, false],
  ["3e8a31da-c412-4c6b-8ffb-1aac28a56763", "dce252c3dcdca0f24e7f2f40474e931e", 2897721, [88.0002, 176.0487], "moderate", false, false],
  ["f371a248-b6c3-4ad9-89c5-467aa2886313", "f4ec0145fda80131c2bd9f1d0cdc585d", 2897721, [85.9968, 172.0244], "review", true, false],
  ["35a50c6d-c221-4231-b4b0-1110fa0b6433", "9c60f014d55d101808c4225119c4822a", 2897720, [94.9964, 189.9844], "strong", false, false],
  ["46b5a636-42ae-40fd-aeec-52989eece8be", "febb1fda18c4cb32cc06eedd5cc28a2a", 2897720, [94.0084, 187.9761], "moderate", false, false],
  ["b3e949de-bca1-4ab9-b188-deeb79b19639", "038c933c34a30cebf30e349834f6a136", 2897720, [85.9992, 172.0026], "moderate", false, false],
  ["19294308-f15b-4fd4-b26b-2fe060633aaf", "442afbe5cc91413a13d260019bc0e429", 2897720, [83.9962, 168.0118], "moderate", false, false],
  ["27124e5d-996a-4acc-98b2-37451861e50e", "7730d99ede208e5a47fef959e7b19a6b", 2897720, [96.0132, 192.0153], "moderate", false, false],
  ["b7fc894c-e97a-49a9-92b6-d4ac21dc30fd", "5d939798c35d64efae8de29a0e515826", 2897720, [94.0014, 187.9983], "strong", false, false],
  ["c72ee55f-ee05-4e97-82eb-1fcb34ac1234", "07f80a0ccd93ec3cfcc60a8d3eb743ce", 2897720, [163.9869], "moderate", false, false],
  ["8119cee8-55f1-4374-b1a4-25f3c7522935", "89745f56d1519ac45b6722b3a96960f9", 2897720, [90.0076, 180.004], "moderate", false, true],
  ["3ff31ae1-2e8d-4fc2-83c3-d8d5dd4f9e88", "688258e2d508a03d91ab029c8b71848e", 2897720, [89.9952, 179.983], "strong", false, true],
  ["451bf81c-35ae-4fc1-b53d-8a6f8bb92725", "444cd129d6cc9d8e6a14809deafc1e49", 2897720, [179.9767], "moderate", false, true],
  ["071f823e-75d8-4414-93d8-d6036cddb44f", "730193809381326d2132b27979c6efde", 2897720, [95.0041, 190.0549], "moderate", false, false],
  ["4f8a674a-4647-470c-b591-fdf11d6e0886", "adc870133b54a9047d4cbd45801420b9", 2897720, [90.0045, 179.9902], "moderate", false, true],
  ["5107ad5f-8340-43b4-9feb-774beaaa0e2f", "1b5b557d72e371af58562b55ddb27e0d", 2897720, [90.0312, 180.0114], "moderate", false, true],
];

const recordingsById = new Map(AUDITED_RECORDINGS.map(([id, audioEtag, fileSize, bpmCandidates,
  confidence, sectionAmbiguity, near180]) => [id, Object.freeze({
  audioEtag, fileSize, bpmCandidates: Object.freeze(bpmCandidates), confidence, sectionAmbiguity, near180,
})]));

// A changed, replaced or unknown recording has no inherited audit result.
// Stored metadata and ordinary uploads cannot create or override this estimate.
export function auditedTempoEstimate(track) {
  const audited = recordingsById.get(track?.id);
  if (!audited || track.audioEtag !== audited.audioEtag || track.fileSize !== audited.fileSize) return null;
  return { bpmCandidates: [...audited.bpmCandidates], confidence: audited.confidence,
    metricalAmbiguity: true, sectionAmbiguity: audited.sectionAmbiguity,
    near180: audited.near180, analyzedAt: '2026-10-18' };
}
