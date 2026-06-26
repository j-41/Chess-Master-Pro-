// ChessMaster Pro — Stockfish Web Worker
// Handles communication with the WASM chess engine

let stockfish: Worker | null = null;
let isReady = false;
let currentResolve: ((value: any) => void) | null = null;
let currentDepth = 15;
let multiPV = 1;

const initEngine = () => {
  if (stockfish) return;

  // Ideally, this should point to a local WASM build or a CDN
  // Since this is a client-side app, we can use a CDN for the worker script
  stockfish = new Worker('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

  stockfish.onmessage = (event: MessageEvent) => {
    const line = event.data;
    
    // Engine is ready
    if (line === 'uciok') {
      isReady = true;
      sendCommand('isready');
    }
    
    // Ready ok
    if (line === 'readyok') {
      // Setup options
      sendCommand(`setoption name MultiPV value ${multiPV}`);
      sendCommand('setoption name Skill Level value 20');
    }

    // Parsing evaluation lines
    if (line.startsWith('info depth')) {
      // info depth 15 seldepth 22 multipv 1 score cp 45 nodes 134524 nps 67262 time 2000 pv e2e4 e7e5
      const matchScore = line.match(/score (cp|mate) (-?\d+)/);
      const matchPv = line.match(/pv (.*)/);
      const matchMultiPv = line.match(/multipv (\d+)/);
      
      if (matchScore && matchPv && currentResolve && line.includes(`depth ${currentDepth}`)) {
        const type = matchScore[1];
        const score = parseInt(matchScore[2], 10);
        const moves = matchPv[1].split(' ');
        const pvIndex = matchMultiPv ? parseInt(matchMultiPv[1], 10) - 1 : 0;
        
        // Pass info back, but we don't resolve yet until bestmove
        postMessage({
          type: 'info',
          data: { type, score, moves, pvIndex }
        });
      }
    }

    // Best move found
    if (line.startsWith('bestmove')) {
      const match = line.match(/bestmove\s+(\S+)(?:\s+ponder\s+(\S+))?/);
      if (match) {
        const bestMove = match[1];
        const ponder = match[2];
        
        if (currentResolve) {
          currentResolve({ bestMove, ponder });
          currentResolve = null;
        }
        
        postMessage({
          type: 'bestmove',
          data: { bestMove, ponder }
        });
      }
    }
  };

  sendCommand('uci');
};

const sendCommand = (cmd: string) => {
  if (stockfish) {
    stockfish.postMessage(cmd);
  }
};

// Web Worker message listener
self.addEventListener('message', (e) => {
  const { type, data } = e.data;

  if (type === 'init') {
    initEngine();
  }

  if (type === 'setOptions') {
    if (data.skillLevel !== undefined) sendCommand(`setoption name Skill Level value ${data.skillLevel}`);
    if (data.multiPV !== undefined) {
      multiPV = data.multiPV;
      sendCommand(`setoption name MultiPV value ${data.multiPV}`);
    }
  }

  if (type === 'position') {
    sendCommand(`position fen ${data.fen}`);
  }

  if (type === 'go') {
    currentDepth = data.depth || 15;
    sendCommand(`go depth ${currentDepth}`);
  }
  
  if (type === 'stop') {
    sendCommand('stop');
  }
});
