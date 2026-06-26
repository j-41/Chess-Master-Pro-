// ChessMaster Pro — Opening Database (ECO Codes)
// Maps move sequences to opening names

export interface Opening {
  eco: string;
  name: string;
  moves: string;
}

export const openings: Opening[] = [
  { eco: "A00", name: "Uncommon Opening", moves: "" },
  { eco: "A02", name: "Bird's Opening", moves: "1. f4" },
  { eco: "A04", name: "Réti Opening", moves: "1. Nf3" },
  { eco: "A10", name: "English Opening", moves: "1. c4" },
  { eco: "A40", name: "Queen's Pawn Game", moves: "1. d4" },
  { eco: "A45", name: "Indian Defense", moves: "1. d4 Nf6" },
  { eco: "A80", name: "Dutch Defense", moves: "1. d4 f5" },
  { eco: "B00", name: "King's Pawn Game", moves: "1. e4" },
  { eco: "B01", name: "Scandinavian Defense", moves: "1. e4 d5" },
  { eco: "B02", name: "Alekhine's Defense", moves: "1. e4 Nf6" },
  { eco: "B06", name: "Modern Defense", moves: "1. e4 g6" },
  { eco: "B07", name: "Pirc Defense", moves: "1. e4 d6" },
  { eco: "B10", name: "Caro-Kann Defense", moves: "1. e4 c6" },
  { eco: "B12", name: "Caro-Kann: Advance Variation", moves: "1. e4 c6 2. d4 d5 3. e5" },
  { eco: "B13", name: "Caro-Kann: Exchange Variation", moves: "1. e4 c6 2. d4 d5 3. exd5 cxd5" },
  { eco: "B20", name: "Sicilian Defense", moves: "1. e4 c5" },
  { eco: "B21", name: "Sicilian: Smith-Morra Gambit", moves: "1. e4 c5 2. d4 cxd4 3. c3" },
  { eco: "B22", name: "Sicilian: Alapin Variation", moves: "1. e4 c5 2. c3" },
  { eco: "B23", name: "Sicilian: Closed", moves: "1. e4 c5 2. Nc3" },
  { eco: "B27", name: "Sicilian: Hyper-Accelerated Dragon", moves: "1. e4 c5 2. Nf3 g6" },
  { eco: "B30", name: "Sicilian: Rossolimo Variation", moves: "1. e4 c5 2. Nf3 Nc6 3. Bb5" },
  { eco: "B33", name: "Sicilian: Sveshnikov", moves: "1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5" },
  { eco: "B40", name: "Sicilian: French Variation", moves: "1. e4 c5 2. Nf3 e6" },
  { eco: "B50", name: "Sicilian: Open", moves: "1. e4 c5 2. Nf3 d6 3. d4" },
  { eco: "B54", name: "Sicilian: Dragon Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6" },
  { eco: "B60", name: "Sicilian: Najdorf", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6" },
  { eco: "C00", name: "French Defense", moves: "1. e4 e6" },
  { eco: "C02", name: "French: Advance Variation", moves: "1. e4 e6 2. d4 d5 3. e5" },
  { eco: "C03", name: "French: Tarrasch Variation", moves: "1. e4 e6 2. d4 d5 3. Nd2" },
  { eco: "C10", name: "French: Winawer Variation", moves: "1. e4 e6 2. d4 d5 3. Nc3 Bb4" },
  { eco: "C20", name: "King's Pawn: Open Game", moves: "1. e4 e5" },
  { eco: "C21", name: "Center Game", moves: "1. e4 e5 2. d4 exd4 3. Qxd4" },
  { eco: "C23", name: "Bishop's Opening", moves: "1. e4 e5 2. Bc4" },
  { eco: "C25", name: "Vienna Game", moves: "1. e4 e5 2. Nc3" },
  { eco: "C30", name: "King's Gambit", moves: "1. e4 e5 2. f4" },
  { eco: "C34", name: "King's Gambit Accepted", moves: "1. e4 e5 2. f4 exf4" },
  { eco: "C40", name: "King's Knight Opening", moves: "1. e4 e5 2. Nf3" },
  { eco: "C41", name: "Philidor Defense", moves: "1. e4 e5 2. Nf3 d6" },
  { eco: "C42", name: "Petrov's Defense", moves: "1. e4 e5 2. Nf3 Nf6" },
  { eco: "C44", name: "Scotch Game", moves: "1. e4 e5 2. Nf3 Nc6 3. d4" },
  { eco: "C46", name: "Three Knights Game", moves: "1. e4 e5 2. Nf3 Nc6 3. Nc3" },
  { eco: "C47", name: "Four Knights Game", moves: "1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6" },
  { eco: "C50", name: "Italian Game", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4" },
  { eco: "C51", name: "Evans Gambit", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4" },
  { eco: "C53", name: "Giuoco Piano", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5" },
  { eco: "C55", name: "Two Knights Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6" },
  { eco: "C57", name: "Fried Liver Attack", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7" },
  { eco: "C60", name: "Ruy López", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5" },
  { eco: "C65", name: "Ruy López: Berlin Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6" },
  { eco: "C68", name: "Ruy López: Exchange Variation", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6" },
  { eco: "C70", name: "Ruy López: Morphy Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6" },
  { eco: "C78", name: "Ruy López: Arkhangelsk", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O b5" },
  { eco: "C80", name: "Ruy López: Open Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4" },
  { eco: "C84", name: "Ruy López: Closed Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7" },
  { eco: "D00", name: "Queen's Pawn Game", moves: "1. d4 d5" },
  { eco: "D02", name: "London System", moves: "1. d4 d5 2. Nf3 Nf6 3. Bf4" },
  { eco: "D06", name: "Queen's Gambit", moves: "1. d4 d5 2. c4" },
  { eco: "D07", name: "Chigorin Defense", moves: "1. d4 d5 2. c4 Nc6" },
  { eco: "D10", name: "Slav Defense", moves: "1. d4 d5 2. c4 c6" },
  { eco: "D20", name: "Queen's Gambit Accepted", moves: "1. d4 d5 2. c4 dxc4" },
  { eco: "D30", name: "Queen's Gambit Declined", moves: "1. d4 d5 2. c4 e6" },
  { eco: "D35", name: "QGD: Exchange Variation", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5" },
  { eco: "D37", name: "QGD: Classical Variation", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3 Be7" },
  { eco: "D43", name: "Semi-Slav Defense", moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6" },
  { eco: "D70", name: "Grünfeld Defense", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 d5" },
  { eco: "E00", name: "Catalan Opening", moves: "1. d4 Nf6 2. c4 e6 3. g3" },
  { eco: "E12", name: "Queen's Indian Defense", moves: "1. d4 Nf6 2. c4 e6 3. Nf3 b6" },
  { eco: "E20", name: "Nimzo-Indian Defense", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4" },
  { eco: "E60", name: "King's Indian Defense", moves: "1. d4 Nf6 2. c4 g6" },
  { eco: "E70", name: "King's Indian: Classical", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6" },
  { eco: "E80", name: "King's Indian: Sämisch", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f3" },
];

/**
 * Find the opening name from a PGN move string
 * Returns the most specific match
 */
export function findOpening(pgn: string): Opening | null {
  const cleanPgn = pgn.replace(/\d+\.\s*/g, '').replace(/\s+/g, ' ').trim();
  
  let bestMatch: Opening | null = null;
  let bestMatchLength = 0;

  for (const opening of openings) {
    const openingMoves = opening.moves.replace(/\d+\.\s*/g, '').replace(/\s+/g, ' ').trim();
    if (!openingMoves) continue;
    
    if (cleanPgn.startsWith(openingMoves) || cleanPgn === openingMoves) {
      if (openingMoves.length > bestMatchLength) {
        bestMatch = opening;
        bestMatchLength = openingMoves.length;
      }
    }
  }

  return bestMatch;
}

/**
 * Get opening name with ECO code
 */
export function getOpeningName(pgn: string): string {
  const opening = findOpening(pgn);
  if (!opening) return 'Starting Position';
  return `${opening.eco}: ${opening.name}`;
}
