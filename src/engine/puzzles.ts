// ChessMaster Pro — Puzzle Collection
// Curated chess puzzles with FEN, solution moves, rating, and themes

export interface Puzzle {
  id: string;
  fen: string;
  moves: string[]; // Solution moves in UCI format (e.g., "e2e4")
  rating: number;
  themes: string[];
  title?: string;
}

export const puzzles: Puzzle[] = [
  // === Mate in 1 (400-800) ===
  {
    id: "p001",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    moves: ["h5f7"],
    rating: 400,
    themes: ["mate", "mateIn1", "short"],
    title: "Scholar's Mate"
  },
  {
    id: "p002",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 3",
    moves: ["h4e1"],
    rating: 400,
    themes: ["mate", "mateIn1", "short"],
    title: "Fool's Mate"
  },
  {
    id: "p003",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    moves: ["e1e8"],
    rating: 500,
    themes: ["mate", "mateIn1", "backRankMate"],
    title: "Back Rank Mate"
  },
  {
    id: "p004",
    fen: "r4rk1/ppp2ppp/2n5/3q4/8/2N2Q2/PPP2PPP/R1B1R1K1 w - - 0 1",
    moves: ["f3f7"],
    rating: 550,
    themes: ["mate", "mateIn1"],
  },
  {
    id: "p005",
    fen: "r1bqk2r/pppp1Bpp/2n2n2/2b1p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4",
    moves: ["d8e7", "f7e6"],
    rating: 600,
    themes: ["fork", "advantage"],
  },
  // === Tactical Forks (800-1200) ===
  {
    id: "p006",
    fen: "r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 2",
    moves: ["d7d5"],
    rating: 800,
    themes: ["opening", "center"],
  },
  {
    id: "p007",
    fen: "r2qkb1r/ppp2ppp/2n1bn2/3pp3/4P3/1BN2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
    moves: ["e4d5", "e6d5", "f3e5"],
    rating: 900,
    themes: ["fork", "knight"],
    title: "Knight Fork"
  },
  {
    id: "p008",
    fen: "r1b1kb1r/pppp1ppp/5n2/4N1q1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 5",
    moves: ["e5f7"],
    rating: 850,
    themes: ["fork", "knight", "sacrifice"],
    title: "Royal Fork"
  },
  {
    id: "p009",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
    moves: ["e4d5", "d8d5", "b1c3"],
    rating: 700,
    themes: ["development", "tempo"],
  },
  {
    id: "p010",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    moves: ["f3g5"],
    rating: 950,
    themes: ["attack", "threat"],
    title: "Ng5 Attack"
  },
  // === Pins & Skewers (1000-1400) ===
  {
    id: "p011",
    fen: "rnbq1rk1/ppp2ppp/4pn2/3p2B1/3P4/2N2N2/PPP1PPPP/R2QKB1R w KQ - 5 5",
    moves: ["g5f6", "d8f6"],
    rating: 1000,
    themes: ["pin", "exchange"],
  },
  {
    id: "p012",
    fen: "r2q1rk1/pp2ppbp/2np1np1/8/3NP1b1/2N1BP2/PPPQ2PP/R3KB1R w KQ - 0 9",
    moves: ["f3g4", "f6e4"],
    rating: 1050,
    themes: ["pin", "discovery"],
  },
  {
    id: "p013",
    fen: "5rk1/pp3ppp/3p4/2pP4/2P1r3/1P6/P4PPP/R3R1K1 b - - 0 20",
    moves: ["e4e1", "a1e1", "f8e8"],
    rating: 1100,
    themes: ["skewer", "rook", "endgame"],
    title: "Rook Skewer"
  },
  {
    id: "p014",
    fen: "r1bq1rk1/ppppnppp/4p3/8/1bBP4/2N1P3/PP3PPP/R1BQK1NR w KQ - 3 7",
    moves: ["d1a4"],
    rating: 1100,
    themes: ["pin", "bishop"],
  },
  {
    id: "p015",
    fen: "r2q1rk1/ppp2ppp/2n1bn2/3p4/3P4/2PB1N2/PP3PPP/RNBQ1RK1 w - - 0 8",
    moves: ["d3h7"],
    rating: 1200,
    themes: ["sacrifice", "attack", "greek gift"],
    title: "Greek Gift Sacrifice"
  },
  // === Intermediate (1200-1600) ===
  {
    id: "p016",
    fen: "r1b2rk1/2q1bppp/p2ppn2/1p4B1/3NPP2/1BN5/PPP3PP/R2Q1RK1 w - - 0 12",
    moves: ["d4f5", "e6f5", "e4f5"],
    rating: 1250,
    themes: ["sacrifice", "pawn storm"],
  },
  {
    id: "p017",
    fen: "2rr2k1/pp1qnppp/4p3/3pP3/3P4/1QN5/PP3PPP/R3R1K1 w - - 0 18",
    moves: ["b3b7"],
    rating: 1300,
    themes: ["tactics", "queen"],
  },
  {
    id: "p018",
    fen: "r1bq1rk1/pp2nppp/2n1p3/3pP3/3P4/P1N2N2/1P2BPPP/R1BQ1RK1 b - - 0 10",
    moves: ["f7f6", "e5f6", "e7f5"],
    rating: 1350,
    themes: ["pawn break", "opening"],
  },
  {
    id: "p019",
    fen: "r4rk1/1bq2ppp/pp2p3/2npP3/5B2/P1NQ4/1PP2PPP/R4RK1 w - - 0 15",
    moves: ["d3h7"],
    rating: 1400,
    themes: ["sacrifice", "attack", "mating attack"],
  },
  {
    id: "p020",
    fen: "r1bqr1k1/ppp2ppp/2n2n2/3p4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 3 6",
    moves: ["c4d5", "f6d5", "d1b3"],
    rating: 1450,
    themes: ["opening", "pressure"],
  },
  // === Mate in 2 (1200-1600) ===
  {
    id: "p021",
    fen: "3r2k1/ppp2ppp/6q1/8/3Pp1b1/1QP1P3/PP3P1P/RNB2RK1 b - - 0 15",
    moves: ["g6g2"],
    rating: 1200,
    themes: ["mate", "mateIn1", "queen sacrifice"],
  },
  {
    id: "p022",
    fen: "r1bqr1k1/pppp1ppp/2n2n2/4N3/2B1P3/8/PPPP1PPP/RNBQR1K1 w - - 0 7",
    moves: ["e5f7", "f8f7", "c4f7"],
    rating: 1350,
    themes: ["sacrifice", "mate"],
  },
  {
    id: "p023",
    fen: "6k1/pp3pp1/2p4p/4P3/3N4/4B2P/PP3rP1/5RK1 b - - 0 25",
    moves: ["f2f1", "f1f1"],
    rating: 1300,
    themes: ["exchange", "endgame"],
  },
  {
    id: "p024",
    fen: "2r3k1/p4ppp/1p6/3Pp1q1/4Pn2/2NQ1P2/PP4PP/R4RK1 b - - 0 20",
    moves: ["f4h3", "g2h3", "g5g1"],
    rating: 1500,
    themes: ["sacrifice", "smothered mate"],
    title: "Smothered Idea"
  },
  {
    id: "p025",
    fen: "r1b1kb1r/pp3ppp/1qn1pn2/2pp4/3P4/2NBPN2/PPP2PPP/R1BQK2R w KQkq - 0 6",
    moves: ["c3b5", "b6b5", "d3b5"],
    rating: 1400,
    themes: ["tactics", "discovered attack"],
  },
  // === Advanced (1600-2000) ===
  {
    id: "p026",
    fen: "r2qk2r/pp2bppp/2n1p3/3pP3/3Pn3/3B1N2/PP3PPP/R1BQ1RK1 w kq - 2 10",
    moves: ["d3e4", "d5e4", "f3d2"],
    rating: 1600,
    themes: ["exchange", "centralization"],
  },
  {
    id: "p027",
    fen: "r1bq1rk1/1pp2pbp/p1np1np1/4p3/2PPP3/2N1BN1P/PP2BPP1/R2Q1RK1 w - - 0 10",
    moves: ["d4d5", "c6e7", "c3d5"],
    rating: 1650,
    themes: ["space", "pawn break"],
  },
  {
    id: "p028",
    fen: "2r2rk1/1bqnbppp/pp1ppn2/8/2PNP3/1PN1BP2/P1Q1B1PP/2R2RK1 w - - 0 14",
    moves: ["c3d5", "e6d5", "c4d5"],
    rating: 1700,
    themes: ["breakthrough", "center"],
  },
  {
    id: "p029",
    fen: "r4rk1/pp1b1ppp/1qnppn2/8/2PP4/P1NQPN2/1P3PPP/R1B2RK1 w - - 0 11",
    moves: ["e3e4", "e6e5", "d4d5"],
    rating: 1750,
    themes: ["space advantage", "pawn chain"],
  },
  {
    id: "p030",
    fen: "r2qkb1r/1b1n1ppp/p2ppn2/1p6/3NP3/1BN5/PPP1QPPP/R1B2RK1 w kq - 0 10",
    moves: ["e4e5", "d6e5", "d4f5"],
    rating: 1800,
    themes: ["sacrifice", "attack", "pawn push"],
  },
  // === Endgame Puzzles (1000-1800) ===
  {
    id: "p031",
    fen: "8/8/8/8/8/4K3/8/4k2R w - - 0 1",
    moves: ["e3d3", "e1f2", "h1h2", "f2f1", "d3e3"],
    rating: 1000,
    themes: ["endgame", "rook endgame", "technique"],
    title: "Lucena Position Idea"
  },
  {
    id: "p032",
    fen: "8/5k2/8/8/8/3K4/4P3/8 w - - 0 1",
    moves: ["e2e4"],
    rating: 800,
    themes: ["endgame", "pawn endgame", "promotion"],
    title: "Key Square"
  },
  {
    id: "p033",
    fen: "8/8/1p6/1P1k4/1K6/8/8/8 w - - 0 1",
    moves: ["b4a5"],
    rating: 900,
    themes: ["endgame", "pawn endgame", "opposition"],
  },
  {
    id: "p034",
    fen: "8/2k5/8/1pK5/1P6/8/8/8 w - - 0 1",
    moves: ["c5b5"],
    rating: 850,
    themes: ["endgame", "pawn endgame", "zugzwang"],
    title: "Zugzwang"
  },
  {
    id: "p035",
    fen: "8/p7/P7/8/3K1k2/8/8/8 w - - 0 1",
    moves: ["d4c5"],
    rating: 1100,
    themes: ["endgame", "pawn race"],
  },
  // === More Complex (1400-2000) ===
  {
    id: "p036",
    fen: "r3kb1r/1bq2ppp/p2ppn2/1p6/3QP3/1BN1BN2/PPP2PPP/R4RK1 w kq - 0 11",
    moves: ["d4d2"],
    rating: 1400,
    themes: ["retreat", "regrouping"],
  },
  {
    id: "p037",
    fen: "r2q1rk1/pb1nbppp/1pp1pn2/3p4/2PP4/1PN1PN2/PBQ2PPP/R3KB1R w KQ - 0 9",
    moves: ["c4d5", "e6d5", "f1d3"],
    rating: 1500,
    themes: ["IQP", "isolani", "dynamic"],
  },
  {
    id: "p038",
    fen: "r4rk1/pp2qppp/2nbpn2/3p4/3P4/2NBPN2/PP2QPPP/R1B2RK1 w - - 0 11",
    moves: ["e3e4"],
    rating: 1550,
    themes: ["center", "pawn break"],
  },
  {
    id: "p039",
    fen: "2rr2k1/1b3ppp/pq2pn2/1p2N3/3P4/1B2Q3/PP3PPP/R4RK1 w - - 0 18",
    moves: ["e5f7"],
    rating: 1650,
    themes: ["sacrifice", "knight", "attack"],
  },
  {
    id: "p040",
    fen: "r3r1k1/1ppq1ppp/p1n2n2/3p1b2/3P4/2NB1N2/PPP1QPPP/R1B2RK1 w - - 0 11",
    moves: ["f3e5", "c6e5", "d4e5", "f6e4", "d3e4"],
    rating: 1700,
    themes: ["exchange", "tactics", "center"],
  },
  // === Sacrifice Puzzles (1500-2000) ===
  {
    id: "p041",
    fen: "r1b1r1k1/pp1nqppp/2pbpn2/8/2BP4/2N1PN2/PP2QPPP/R1B2RK1 w - - 0 10",
    moves: ["e3e4"],
    rating: 1500,
    themes: ["center", "expansion"],
  },
  {
    id: "p042",
    fen: "r1bq1r1k/ppp2p1p/2n3pQ/2b1p3/2B1P3/2NP4/PPP2PPP/R3K2R w KQ - 0 10",
    moves: ["h6g7"],
    rating: 1600,
    themes: ["mate", "queen sacrifice"],
  },
  {
    id: "p043",
    fen: "2kr3r/ppp2ppp/2n1bn2/2b1p1B1/4P3/2NP1N2/PPP2PPP/R3KB1R w KQ - 0 8",
    moves: ["g5f6", "g7f6", "d3d4"],
    rating: 1550,
    themes: ["opening", "attack"],
  },
  {
    id: "p044",
    fen: "r2qkb1r/pp1bpppp/2np1n2/1B6/3NP3/2N5/PPP2PPP/R1BQK2R w KQkq - 0 6",
    moves: ["b5c6", "d7c6", "d1f3"],
    rating: 1450,
    themes: ["pressure", "pin"],
  },
  {
    id: "p045",
    fen: "r1bqr1k1/pppn1pbp/3p1np1/4p3/2PPP3/2N2N1P/PP2BPP1/R1BQ1RK1 w - - 0 9",
    moves: ["d4e5", "d6e5", "c4c5"],
    rating: 1700,
    themes: ["pawn break", "space"],
  },
  // === Pattern Recognition (800-1400) ===
  {
    id: "p046",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    moves: ["e7e5"],
    rating: 400,
    themes: ["opening", "center control"],
    title: "Open Game"
  },
  {
    id: "p047",
    fen: "r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2",
    moves: ["d2d4"],
    rating: 600,
    themes: ["opening", "center"],
  },
  {
    id: "p048",
    fen: "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    moves: ["e7e6"],
    rating: 700,
    themes: ["opening", "development"],
  },
  {
    id: "p049",
    fen: "r1bqk2r/ppp2ppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
    moves: ["c4d5", "e6d5", "f1g2"],
    rating: 1100,
    themes: ["opening", "fianchetto"],
  },
  {
    id: "p050",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    moves: ["c2c3"],
    rating: 800,
    themes: ["opening", "Italian", "preparation"],
    title: "Giuoco Piano Setup"
  },
  // === More Mates (1000-1600) ===
  {
    id: "p051",
    fen: "6k1/5ppp/p7/1p6/2n5/8/PPP2PPP/2KR4 b - - 0 25",
    moves: ["c4b2", "d1d8"],
    rating: 1000,
    themes: ["deflection", "tactics"],
  },
  {
    id: "p052",
    fen: "2r3k1/5pp1/1p1p3p/p7/P1P5/1P2R2P/5PP1/6K1 w - - 0 30",
    moves: ["e3e8", "c8e8"],
    rating: 1100,
    themes: ["rook endgame", "exchange"],
  },
  {
    id: "p053",
    fen: "r4rk1/pppb1pp1/2np3p/4pq2/2P1P3/2NP1P2/PP1Q2PP/R4RK1 b - - 0 14",
    moves: ["f5h3"],
    rating: 1300,
    themes: ["attack", "kingside"],
  },
  {
    id: "p054",
    fen: "r2q1rk1/pp2ppbp/2np1np1/8/3PP3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 9",
    moves: ["d4d5", "c6e5", "f3e5", "d6e5"],
    rating: 1400,
    themes: ["center", "opening"],
  },
  {
    id: "p055",
    fen: "r1b1k2r/ppppqppp/2n2n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 5",
    moves: ["e1g1"],
    rating: 600,
    themes: ["castling", "king safety"],
    title: "Castle Early"
  },
  // === Discovery & Deflection (1200-1800) ===
  {
    id: "p056",
    fen: "r1b2rk1/ppppqppp/2n2n2/8/1bBPP3/2N2N2/PP3PPP/R1BQ1RK1 b - - 0 7",
    moves: ["b4c3", "b2c3"],
    rating: 1200,
    themes: ["exchange", "doubled pawns"],
  },
  {
    id: "p057",
    fen: "r3r1k1/ppp2ppp/2n2n2/3qp1B1/3P4/2NB4/PPP2PPP/R2QR1K1 w - - 0 12",
    moves: ["g5f6", "g7f6", "d3h7"],
    rating: 1500,
    themes: ["discovered attack", "sacrifice"],
  },
  {
    id: "p058",
    fen: "r1bq1rk1/pp1pnpbp/2n1p1p1/2p5/2P1P3/2N1BN2/PP2BPPP/R2Q1RK1 w - - 0 8",
    moves: ["d1d2"],
    rating: 1100,
    themes: ["development", "connect rooks"],
  },
  {
    id: "p059",
    fen: "r2q1rk1/1pp2ppp/p1np1n2/2b1p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 8",
    moves: ["c3d5"],
    rating: 1600,
    themes: ["tactics", "central knight"],
  },
  {
    id: "p060",
    fen: "r2qrbk1/1b1n1ppp/p2ppn2/1p4B1/3NPP2/1BN5/PPP1Q1PP/R4R1K w - - 0 14",
    moves: ["e4e5"],
    rating: 1700,
    themes: ["pawn storm", "attack", "kingside"],
  },
  // === Double Attack & Overloading (1300-1900) ===
  {
    id: "p061",
    fen: "r1bq1rk1/ppp1nppp/3p4/3Pp3/2P1P3/5N2/PP3PPP/RNBQ1RK1 b - - 0 9",
    moves: ["f7f5"],
    rating: 1300,
    themes: ["pawn break", "counterattack"],
  },
  {
    id: "p062",
    fen: "r3k2r/ppp2ppp/2n1b3/3np3/8/2NP1NP1/PPP2PBP/R1B1R1K1 b kq - 0 10",
    moves: ["d5c3", "b2c3"],
    rating: 1350,
    themes: ["exchange", "pawn structure"],
  },
  {
    id: "p063",
    fen: "2rr2k1/pp3ppp/2n1bq2/4p3/4P3/1NN1BP2/PPP3PP/2KR3R w - - 0 15",
    moves: ["b3d2"],
    rating: 1400,
    themes: ["retreat", "regrouping", "defense"],
  },
  {
    id: "p064",
    fen: "r1b2rk1/2q1bppp/p1nppn2/1p6/3NPP2/1BN1B3/PPP3PP/R2Q1RK1 w - - 0 11",
    moves: ["f4f5"],
    rating: 1600,
    themes: ["kingside attack", "pawn storm"],
  },
  {
    id: "p065",
    fen: "r4rk1/1p1b1ppp/pq1ppn2/8/1nPNP3/1QN1BP2/PP4PP/R4RK1 w - - 0 14",
    moves: ["a2a3", "b4c6", "d4c6"],
    rating: 1500,
    themes: ["tempo", "knight maneuver"],
  },
  // === Advanced Tactics (1600-2200) ===
  {
    id: "p066",
    fen: "r2q1rk1/ppp1bppp/2n2n2/3pp1B1/2PP4/2NBPN2/PP3PPP/R2QK2R w KQ - 0 8",
    moves: ["c4d5", "e5d4", "e3d4"],
    rating: 1600,
    themes: ["pawn center", "exchange"],
  },
  {
    id: "p067",
    fen: "r1bqr1k1/pp1n1pbp/2pp1np1/4p3/2PPP3/2N1BN1P/PP2BPP1/R2Q1RK1 w - - 0 10",
    moves: ["d4d5", "c6b8"],
    rating: 1700,
    themes: ["space", "restriction"],
  },
  {
    id: "p068",
    fen: "r2q1rk1/1b1nbppp/pp1pp3/8/2PNP3/1PN1B3/P4PPP/R2QKB1R w KQ - 0 12",
    moves: ["f1e2", "a6a5", "e1g1"],
    rating: 1550,
    themes: ["development", "plan"],
  },
  {
    id: "p069",
    fen: "r4rk1/ppq2ppp/2pbpn2/8/2PP4/2N1PN2/PP2QPPP/R1B2RK1 w - - 0 11",
    moves: ["e3e4"],
    rating: 1650,
    themes: ["center expansion", "space"],
  },
  {
    id: "p070",
    fen: "2r1r1k1/pp1q1ppp/2n1pn2/3p4/3P4/P1NBPN2/1PQ2PPP/R4RK1 w - - 0 13",
    moves: ["e3e4"],
    rating: 1750,
    themes: ["pawn break", "opening lines"],
  },
  // === Positional Puzzles (1500-2000) ===
  {
    id: "p071",
    fen: "r1b2rk1/pp1nqppp/2p1pn2/3p4/2PP4/1PN1PN2/PB3PPP/R2QKB1R w KQ - 0 8",
    moves: ["f1d3"],
    rating: 1200,
    themes: ["development", "piece placement"],
  },
  {
    id: "p072",
    fen: "r1bq1rk1/pp2ppbp/2np1np1/8/3PP3/2N2N1P/PP2BPP1/R1BQ1RK1 b - - 0 8",
    moves: ["e7e5", "d4d5", "c6e7"],
    rating: 1400,
    themes: ["KID", "pawn break"],
  },
  {
    id: "p073",
    fen: "r2q1rk1/pp1bbppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9",
    moves: ["d1e2"],
    rating: 1300,
    themes: ["maneuver", "preparation"],
  },
  {
    id: "p074",
    fen: "rn1qkb1r/pb1p1ppp/1p2pn2/2p5/2PP4/5NP1/PP2PPBP/RNBQ1RK1 w kq - 0 6",
    moves: ["d4d5", "e6d5", "f3h4"],
    rating: 1600,
    themes: ["pawn break", "knight maneuver"],
  },
  {
    id: "p075",
    fen: "r1bq1rk1/pppn1pbp/3p1np1/4p3/2PPP3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 8",
    moves: ["d4d5"],
    rating: 1500,
    themes: ["KID", "central pawn push"],
  },
  // === Mixed Difficulty (various) ===
  {
    id: "p076",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    moves: ["f8c5"],
    rating: 500,
    themes: ["opening", "Italian", "development"],
    title: "Italian Game Setup"
  },
  {
    id: "p077",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
    moves: ["g1f3"],
    rating: 500,
    themes: ["opening", "Sicilian", "development"],
  },
  {
    id: "p078",
    fen: "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2",
    moves: ["e4e5"],
    rating: 700,
    themes: ["opening", "Alekhine", "pawn push"],
  },
  {
    id: "p079",
    fen: "r3k2r/pppq1ppp/2n1bn2/2bpp3/4P3/1BNP1N2/PPP2PPP/R1BQK2R w KQkq - 0 7",
    moves: ["e1g1"],
    rating: 750,
    themes: ["castling", "opening"],
  },
  {
    id: "p080",
    fen: "r2qkbnr/ppp2ppp/2np4/4p3/2B1P1b1/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    moves: ["f3e5"],
    rating: 1100,
    themes: ["tactics", "winning material"],
  },
  // === Endgame Technique (1000-1800) ===
  {
    id: "p081",
    fen: "8/8/4k3/8/3PK3/8/8/8 w - - 0 1",
    moves: ["e4e5"],
    rating: 700,
    themes: ["endgame", "opposition", "pawn promotion"],
    title: "Opposition"
  },
  {
    id: "p082",
    fen: "4k3/8/8/8/8/8/4PP2/4K3 w - - 0 1",
    moves: ["e2e4"],
    rating: 600,
    themes: ["endgame", "basic", "pawn push"],
  },
  {
    id: "p083",
    fen: "8/8/8/3k4/8/4K3/3P4/8 w - - 0 1",
    moves: ["e3e4"],
    rating: 800,
    themes: ["endgame", "opposition", "tempo"],
  },
  {
    id: "p084",
    fen: "8/1k6/8/8/2K5/3R4/8/8 w - - 0 1",
    moves: ["d3d7", "b7a6", "c4b4"],
    rating: 900,
    themes: ["endgame", "rook endgame", "cutting off king"],
  },
  {
    id: "p085",
    fen: "8/5pk1/5p1p/8/3R4/6PP/5PK1/2r5 b - - 0 35",
    moves: ["c1c2", "d4d2"],
    rating: 1300,
    themes: ["endgame", "rook endgame", "active rook"],
  },
  // === Queen Sacrifices (1400-2000) ===
  {
    id: "p086",
    fen: "1rbq1rk1/p1b1nppp/1p2p3/8/1B1pN3/P2B4/1P3PPP/2RQ1R1K w - - 0 17",
    moves: ["e4f6", "g7f6"],
    rating: 1500,
    themes: ["sacrifice", "attack"],
  },
  {
    id: "p087",
    fen: "r1b1k2r/ppppqppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 0 5",
    moves: ["b1c3"],
    rating: 900,
    themes: ["development", "opening"],
  },
  {
    id: "p088",
    fen: "r3r1k1/1pp2ppp/p1np1q2/4p1B1/4P3/2NP4/PPP2PPP/R2QR1K1 w - - 0 12",
    moves: ["g5f6", "g7f6", "c3d5"],
    rating: 1400,
    themes: ["exchange", "centralization"],
  },
  {
    id: "p089",
    fen: "r1b1r1k1/pp2qppp/2n1p3/3pP3/3P4/2PB4/P1Q2PPP/R1B1R1K1 w - - 0 14",
    moves: ["d3h7"],
    rating: 1600,
    themes: ["sacrifice", "Greek gift", "attack"],
  },
  {
    id: "p090",
    fen: "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N2N2/PP2PPPP/R2QKB1R w KQ - 0 6",
    moves: ["e2e3"],
    rating: 1000,
    themes: ["opening", "QGD", "development"],
  },
  // === Final Set (various) ===
  {
    id: "p091",
    fen: "r1bq1b1r/ppp2kpp/2n2n2/3pp3/2B1P3/5Q2/PPPP1PPP/RNB1K2R w KQ - 0 5",
    moves: ["f3f7"],
    rating: 1200,
    themes: ["attack", "exposed king"],
  },
  {
    id: "p092",
    fen: "r1bqkb1r/pppppppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
    moves: ["d7d5"],
    rating: 800,
    themes: ["opening", "center counter"],
  },
  {
    id: "p093",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4",
    moves: ["f3e5"],
    rating: 1000,
    themes: ["opening", "tactics"],
  },
  {
    id: "p094",
    fen: "r2qkb1r/ppp2ppp/2n1b3/3np3/8/1B2BN2/PPPP1PPP/RN1QK2R w KQkq - 0 6",
    moves: ["d1e2"],
    rating: 1100,
    themes: ["pin", "defense"],
  },
  {
    id: "p095",
    fen: "r3kb1r/pppq1ppp/2n1bn2/3pp3/8/1B2PN2/PPPPNPPP/R1BQK2R w KQkq - 0 6",
    moves: ["d2d4", "e5d4", "e3d4"],
    rating: 1200,
    themes: ["center", "opening"],
  },
  {
    id: "p096",
    fen: "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 5",
    moves: ["f1e1"],
    rating: 1100,
    themes: ["opening", "Ruy Lopez", "preparation"],
  },
  {
    id: "p097",
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: ["d2d4"],
    rating: 500,
    themes: ["opening", "French", "center"],
  },
  {
    id: "p098",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    moves: ["d5c4"],
    rating: 700,
    themes: ["opening", "QGA"],
    title: "Queen's Gambit Accepted"
  },
  {
    id: "p099",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    moves: ["e7e6"],
    rating: 700,
    themes: ["opening", "QGD"],
    title: "Queen's Gambit Declined"
  },
  {
    id: "p100",
    fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
    moves: ["b1c3"],
    rating: 600,
    themes: ["opening", "KID", "development"],
    title: "King's Indian Setup"
  },
];

/**
 * Get puzzles filtered by rating range and/or themes
 */
export function filterPuzzles(
  minRating?: number,
  maxRating?: number,
  themes?: string[]
): Puzzle[] {
  return puzzles.filter(p => {
    if (minRating && p.rating < minRating) return false;
    if (maxRating && p.rating > maxRating) return false;
    if (themes && themes.length > 0) {
      return themes.some(t => p.themes.includes(t));
    }
    return true;
  });
}

/**
 * Get a random puzzle, optionally within a rating range
 */
export function getRandomPuzzle(minRating?: number, maxRating?: number): Puzzle {
  const filtered = filterPuzzles(minRating, maxRating);
  return filtered[Math.floor(Math.random() * filtered.length)] || puzzles[0];
}

/**
 * Get all unique themes from puzzles
 */
export function getAllThemes(): string[] {
  const themes = new Set<string>();
  puzzles.forEach(p => p.themes.forEach(t => themes.add(t)));
  return Array.from(themes).sort();
}
