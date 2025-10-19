import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

const GameOver = ({ winner, player, onNewGame }) => {
  const isWinner = winner === player;

  return (
    <div className="mt-6 bg-gray-800 p-6 rounded-2xl text-center max-w-md">
      <div className="flex flex-col items-center gap-2">
        <Trophy size={40} className={isWinner ? 'text-yellow-400' : 'text-gray-500'} />
        <h2 className={`text-2xl font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
          {isWinner ? 'BẠN THẮNG! 🎉' : 'BẠN THUA! 😢'}
        </h2>
        <p className="text-gray-300 mb-4">
          Người chơi {winner === 'ODD' ? 'LẺ' : 'CHẴN'} đã chiến thắng
        </p>

        <button
          onClick={onNewGame}
          className="inline-flex items-center gap-2 bg-green-400 text-black font-semibold px-5 py-2 rounded-lg hover:scale-105 transition-transform"
        >
          <RotateCcw size={18} /> CHƠI LẠI
        </button>
      </div>
    </div>
  );
};

export default GameOver;
