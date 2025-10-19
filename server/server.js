import { WebSocketServer } from 'ws';
import { checkWinner } from './gameLogic.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const wss = new WebSocketServer({ port: PORT });

let gameState = {
  board: Array(25).fill(0),
  players: [],        // [{ id, ws, role: 'ODD'|'EVEN' }]
  gameStatus: 'WAITING',
  winner: null,
};

function broadcast(payload) {
  const data = JSON.stringify(payload);
  for (const p of gameState.players) {
    if (p.ws.readyState === 1) p.ws.send(data);
  }
}

function sendTo(ws, payload) {
  if (ws.readyState === 1) ws.send(JSON.stringify(payload));
}

function startIfReady() {
  if (gameState.players.length === 2) {
    gameState.gameStatus = 'PLAYING';
    gameState.winner = null;
    broadcast({ type: 'GAME_START' });
  } else {
    gameState.gameStatus = 'WAITING';
  }
}

wss.on('connection', (ws) => {
  console.log('🔌 New client connected');

  if (gameState.players.length >= 2) {
    sendTo(ws, { type: 'ERROR', message: 'Room is full' });
    ws.close();
    return;
  }

  const role = gameState.players.length === 0 ? 'ODD' : 'EVEN';
  const id = Date.now() + Math.random();
  gameState.players.push({ id, ws, role });
  console.log(`👤 Player ${role} joined`);

  // gán player & board hiện tại cho client mới
  sendTo(ws, { type: 'PLAYER_ASSIGNED', player: role, board: gameState.board });

  // nếu đủ 2 người thì bắt đầu
  startIfReady();

  ws.on('message', (buf) => {
    let msg;
    try { msg = JSON.parse(buf.toString()); } catch { return; }

    // CLICK Ô: client gửi { type:'INCREMENT', square }
    if (msg.type === 'INCREMENT' && gameState.gameStatus === 'PLAYING') {
      const i = msg.square;
      if (Number.isInteger(i) && i >= 0 && i < 25) {
        gameState.board[i] = (gameState.board[i] || 0) + 1;

        const res = checkWinner(gameState.board);
        if (res) {
          gameState.gameStatus = 'OVER';
          gameState.winner = res.winner;
          broadcast({ type: 'GAME_OVER', winner: res.winner, winningLine: res.line });
          return;
        }

        // phát UPDATE tối thiểu để client clear pending và set số mới
        broadcast({ type: 'UPDATE', square: i, value: gameState.board[i] });
      }
      return;
    }

    // NÚT CHƠI LẠI: client gửi { type:'NEW_GAME' }
    if (msg.type === 'NEW_GAME') {
      gameState.board = Array(25).fill(0);
      gameState.winner = null;

      // phát NEW_GAME kèm board trống
      broadcast({ type: 'NEW_GAME', board: gameState.board });

      // nếu vẫn đủ 2 người thì phát GAME_START để client set PLAYING
      startIfReady();
      return;
    }
  });

  ws.on('close', () => {
    gameState.players = gameState.players.filter(p => p.id !== id);
    console.log('🔌 Client disconnected');
    // báo cho người còn lại
    broadcast({ type: 'OPPONENT_DISCONNECTED' });

    // reset cơ bản
    gameState.gameStatus = 'WAITING';
    gameState.winner = null;
    gameState.board = Array(25).fill(0);
  });
});

console.log(`🚀 WebSocket Server running on ws://localhost:${PORT}`);
