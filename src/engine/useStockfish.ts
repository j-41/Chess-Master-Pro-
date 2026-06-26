import { useState, useEffect, useCallback, useRef } from 'react';

export interface EngineLine {
  score: number; // in centipawns, or mate in N (large number)
  mate: boolean;
  moves: string[]; // UCI format
}

export interface StockfishState {
  isReady: boolean;
  isEvaluating: boolean;
  bestMove: string | null;
  ponderMove: string | null;
  lines: EngineLine[];
  evaluation: number; // centipawns from White's perspective
}

export function useStockfish(skillLevel: number = 20, multiPV: number = 3) {
  const [state, setState] = useState<StockfishState>({
    isReady: false,
    isEvaluating: false,
    bestMove: null,
    ponderMove: null,
    lines: [],
    evaluation: 0,
  });

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create the worker
    const worker = new Worker(new URL('./StockfishWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, data } = e.data;

      if (type === 'info') {
        const { type: scoreType, score, moves, pvIndex } = data;
        
        setState(prev => {
          const newLines = [...prev.lines];
          const isMate = scoreType === 'mate';
          
          newLines[pvIndex] = {
            score: isMate ? score * 10000 : score, // Normalize mate scores
            mate: isMate,
            moves
          };

          // Update main evaluation based on the primary line (index 0)
          let evalScore = prev.evaluation;
          if (pvIndex === 0) {
            evalScore = isMate ? score * 10000 : score;
          }

          return {
            ...prev,
            lines: newLines,
            evaluation: evalScore,
          };
        });
      }

      if (type === 'bestmove') {
        setState(prev => ({
          ...prev,
          isEvaluating: false,
          bestMove: data.bestMove,
          ponderMove: data.ponder,
        }));
      }
    };

    worker.postMessage({ type: 'init' });
    worker.postMessage({ type: 'setOptions', data: { skillLevel, multiPV } });
    
    setState(prev => ({ ...prev, isReady: true }));

    return () => {
      worker.terminate();
    };
  }, []);

  // Update options if they change
  useEffect(() => {
    if (workerRef.current && state.isReady) {
      workerRef.current.postMessage({ type: 'setOptions', data: { skillLevel, multiPV } });
    }
  }, [skillLevel, multiPV, state.isReady]);

  const evaluatePosition = useCallback((fen: string, depth: number = 15) => {
    if (!workerRef.current || !state.isReady) return;

    setState(prev => ({
      ...prev,
      isEvaluating: true,
      bestMove: null,
      lines: [],
    }));

    workerRef.current.postMessage({ type: 'position', data: { fen } });
    workerRef.current.postMessage({ type: 'go', data: { depth } });
  }, [state.isReady]);

  const stopEvaluation = useCallback(() => {
    if (!workerRef.current || !state.isReady) return;
    workerRef.current.postMessage({ type: 'stop' });
  }, [state.isReady]);

  return {
    ...state,
    evaluatePosition,
    stopEvaluation,
  };
}
