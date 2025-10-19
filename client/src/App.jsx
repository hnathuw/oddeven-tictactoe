import React, { useState, useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';
import StatusBar from './components/StatusBar';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import GameOver from './components/GameOver';

const App = () => {
  const [board, setBoard] = useState(Array(25).fill(0));
  const [player, setPlayer] = useState(null);
  const [gameStatus, setGameStatus] = useState('CONNECTING');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [connected, setConnected] = useState(false);
  const [pendingSquares, setPendingSquares] = useState(new Set());
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const wsRef = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      setConnected(true);
      setGameStatus('WAITING');
      console.log('✅ Connected to server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleServerMessage(message);
    };

    ws.onclose = () => {
      setConnected(false);
      setGameStatus('DISCONNECTED');
      console.log('❌ Disconnected from server');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    wsRef.current = ws;
  };

  const handleServerMessage = (message) => {
    console.log('📨 Received:', message.type);

    switch (message.type) {
      case 'PLAYER_ASSIGNED':
        setPlayer(message.player);
        setBoard(message.board);
        break;

      case 'GAME_START':
        setGameStatus('PLAYING');
        break;

      case 'UPDATE':
        setBoard(prev => {
          const newBoard = [...prev];
          newBoard[message.square] = message.value;
          return newBoard;
        });
        setPendingSquares(prev => {
          const newSet = new Set(prev);
          newSet.delete(message.square);
          return newSet;
        });
        break;

      case 'GAME_OVER':
        setWinner(message.winner);
        setWinningLine(message.winningLine || []);
        setGameStatus('GAME_OVER');
        if (message.winner === player) {
          setScore(prev => ({ ...prev, wins: prev.wins + 1 }));
        } else {
          setScore(prev => ({ ...prev, losses: prev.losses + 1 }));
        }
        break;

      case 'NEW_GAME':
        setBoard(message.board);
        setWinner(null);
        setWinningLine([]);
        setGameStatus('PLAYING');
        setPendingSquares(new Set());
        break;

      case 'OPPONENT_DISCONNECTED':
        setGameStatus('DISCONNECTED');
        setWinner(null);
        break;

      case 'ERROR':
        alert(message.message);
        break;

      default:
        break;
    }
  };

  const handleSquareClick = (index) => {
    if (gameStatus !== 'PLAYING' || winner) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // Optimistic update
    setBoard(prev => {
      const newBoard = [...prev];
      newBoard[index] = prev[index] + 1;
      return newBoard;
    });

    setPendingSquares(prev => new Set(prev).add(index));

    wsRef.current.send(JSON.stringify({
      type: 'INCREMENT',
      square: index
    }));
  };

  const handleNewGame = () => {
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    // gửi yêu cầu reset về server
    wsRef.current.send(JSON.stringify({ type: 'NEW_GAME' }));

    // reset tạm UI để không phải đợi server phản hồi
    setBoard(Array(25).fill(0));
    setWinner(null);
    setWinningLine([]);
    setPendingSquares(new Set());
    setGameStatus('PLAYING');
  } else {
    console.warn('WebSocket chưa sẵn sàng để gửi yêu cầu NEW_GAME');
  }
};


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Zap className="text-yellow-400" /> ODD/EVEN TIC-TAC-TOE
        </h1>
        <p className="text-gray-400">5x5 Multiplayer Game</p>
      </header>

      {/* Status Bar */}
      <StatusBar status={gameStatus} connected={connected} player={player} />

      {/* Score Board */}
      {player && <ScoreBoard score={score} player={player} />}

      {/* Game Board */}
      <GameBoard
        board={board}
        onSquareClick={handleSquareClick}
        winningLine={winningLine}
        pendingSquares={pendingSquares}
        disabled={gameStatus !== 'PLAYING' || winner !== null}
      />

      {/* Game Over */}
      {winner && (
        <GameOver winner={winner} player={player} onNewGame={handleNewGame} />
      )}

      {/* Rules */}
      <div className="mt-6 bg-gray-800 p-4 rounded-xl max-w-md text-sm">
        <h2 className="text-lg font-semibold mb-2 text-yellow-400">Luật chơi:</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Nhấp vào ô để tăng số lên 1</li>
          <li>Người chơi <b>LẺ</b> thắng khi có 5 số lẻ liên tiếp (hàng / cột / chéo)</li>
          <li>Người chơi <b>CHẴN</b> thắng khi có 5 số chẵn liên tiếp</li>
          <li>Cả hai người có thể nhấp bất kỳ ô nào bất cứ lúc nào!</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
