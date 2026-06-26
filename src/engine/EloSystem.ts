// ChessMaster Pro — Elo Rating System
// Standard FIDE-style Elo calculation with K-factor adjustments

export interface EloResult {
  newPlayerRating: number;
  newOpponentRating: number;
  playerChange: number;
  opponentChange: number;
}

export interface GameRecord {
  id: string;
  date: string;
  opponent: string;
  opponentRating: number;
  playerRating: number;
  result: 'win' | 'loss' | 'draw';
  ratingChange: number;
  timeControl: string;
  moves: number;
  pgn: string;
  mode: 'ai' | 'local';
}

/**
 * Calculate the expected score for a player
 */
function expectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Get K-factor based on rating and games played
 * Higher K for new players, lower for established players
 */
function getKFactor(rating: number, gamesPlayed: number): number {
  if (gamesPlayed < 30) return 40; // New player
  if (rating < 2400) return 20;    // Standard
  return 10;                        // Master level
}

/**
 * Calculate new Elo ratings after a game
 */
export function calculateElo(
  playerRating: number,
  opponentRating: number,
  result: 'win' | 'loss' | 'draw',
  playerGamesPlayed: number = 30,
  opponentGamesPlayed: number = 30
): EloResult {
  const expectedPlayer = expectedScore(playerRating, opponentRating);
  const expectedOpponent = 1 - expectedPlayer;

  let actualPlayer: number;
  let actualOpponent: number;

  switch (result) {
    case 'win':
      actualPlayer = 1;
      actualOpponent = 0;
      break;
    case 'loss':
      actualPlayer = 0;
      actualOpponent = 1;
      break;
    case 'draw':
      actualPlayer = 0.5;
      actualOpponent = 0.5;
      break;
  }

  const kPlayer = getKFactor(playerRating, playerGamesPlayed);
  const kOpponent = getKFactor(opponentRating, opponentGamesPlayed);

  const playerChange = Math.round(kPlayer * (actualPlayer - expectedPlayer));
  const opponentChange = Math.round(kOpponent * (actualOpponent - expectedOpponent));

  return {
    newPlayerRating: Math.max(100, playerRating + playerChange),
    newOpponentRating: Math.max(100, opponentRating + opponentChange),
    playerChange,
    opponentChange,
  };
}

/**
 * Get estimated AI Elo rating based on Stockfish skill level (0-20)
 */
export function getAIRating(skillLevel: number): number {
  // Approximate Elo mapping for Stockfish skill levels
  const ratings: Record<number, number> = {
    0: 400,
    1: 500,
    2: 600,
    3: 700,
    4: 850,
    5: 1000,
    6: 1150,
    7: 1300,
    8: 1400,
    9: 1500,
    10: 1600,
    11: 1700,
    12: 1850,
    13: 2000,
    14: 2150,
    15: 2300,
    16: 2450,
    17: 2600,
    18: 2750,
    19: 2900,
    20: 3200,
  };
  return ratings[skillLevel] ?? 1500;
}

/**
 * Get a title based on Elo rating
 */
export function getRatingTitle(rating: number): string {
  if (rating >= 2700) return 'Super GM';
  if (rating >= 2500) return 'Grandmaster';
  if (rating >= 2400) return 'International Master';
  if (rating >= 2300) return 'FIDE Master';
  if (rating >= 2200) return 'Candidate Master';
  if (rating >= 2000) return 'Expert';
  if (rating >= 1800) return 'Class A';
  if (rating >= 1600) return 'Class B';
  if (rating >= 1400) return 'Class C';
  if (rating >= 1200) return 'Class D';
  if (rating >= 1000) return 'Class E';
  if (rating >= 800) return 'Beginner';
  return 'Novice';
}

/**
 * Get rating tier color for visual display
 */
export function getRatingColor(rating: number): string {
  if (rating >= 2700) return '#ff4444';
  if (rating >= 2500) return '#ff8800';
  if (rating >= 2300) return '#ffcc00';
  if (rating >= 2000) return '#44ff44';
  if (rating >= 1800) return '#00ccff';
  if (rating >= 1600) return '#4488ff';
  if (rating >= 1400) return '#8844ff';
  if (rating >= 1200) return '#cc44ff';
  if (rating >= 1000) return '#aaaaaa';
  return '#777777';
}
