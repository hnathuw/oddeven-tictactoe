import React from 'react';
import { Trophy } from 'lucide-react';

const ScoreBoard = ({ score }) => {
  return (
    <div className="w-full max-w-md bg-gray-800 rounded-xl p-4 mb-4">
      <h2 className="text-center text-lg font-semibold mb-3 flex items-center justify-center gap-2 text-yellow-400">
        <Trophy className="text-yellow-400" /> BẢNG ĐIỂM
      </h2>

      <div className="grid grid-cols-3 text-center text-sm">
        <div>
          <div className="text-2xl font-bold text-green-400">{score.wins}</div>
          <div className="text-gray-300">THẮNG</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-blue-400">{score.draws}</div>
          <div className="text-gray-300">HÒA</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-red-400">{score.losses}</div>
          <div className="text-gray-300">THUA</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
