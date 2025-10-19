import React from 'react';
import { Wifi, WifiOff, Users } from 'lucide-react';

const StatusBar = ({ connected, gameStatus, player }) => {
  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'CONNECTING':
        return 'Đang kết nối...';
      case 'WAITING':
        return 'Đang chờ đối thủ...';
      case 'PLAYING':
        return 'Đang chơi';
      case 'GAME_OVER':
        return 'Kết thúc';
      case 'DISCONNECTED':
        return 'Đối thủ đã thoát';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-xl p-3 flex justify-between items-center mb-4">
      {/* Trạng thái kết nối */}
      <div className="flex items-center gap-2 text-sm">
        {connected ? (
          <Wifi className="text-green-400" size={18} />
        ) : (
          <WifiOff className="text-red-400" size={18} />
        )}
        <span className="text-gray-200">{getStatusMessage()}</span>
      </div>

      {/* Người chơi */}
      {player && (
        <div className="flex items-center gap-2 text-sm text-yellow-300">
          <Users size={18} />
          <span>{player === 'ODD' ? 'NGƯỜI LẺ' : 'NGƯỜI CHẴN'}</span>
        </div>
      )}
    </div>
  );
};

export default StatusBar;
