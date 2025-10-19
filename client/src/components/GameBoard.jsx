import React from 'react';

const GameBoard = ({ board, onSquareClick, winningLine, pendingSquares, disabled }) => {
  const getSquareColor = (value) => {
    if (value === 0) return '#1a1a1a'; // ô trống
    return value % 2 === 1 ? '#1e3a8a' : '#064e3b'; // lẻ: xanh đậm, chẵn: xanh lá đậm
  };

  return (
    <div
      className="grid gap-2 mb-6"
      style={{
        gridTemplateColumns: 'repeat(5, 64px)',
        gridTemplateRows: 'repeat(5, 64px)',
      }}
    >
      {board.map((value, index) => {
        const isWinning = winningLine.includes(index);
        const isPending = pendingSquares.has(index);

        return (
          <button
            key={index}
            onClick={() => onSquareClick(index)}
            disabled={disabled}
            style={{
              aspectRatio: '1',
              borderRadius: '8px',
              fontSize: '24px',
              fontWeight: 'bold',
              backgroundColor: getSquareColor(value),
              border: isWinning ? '3px solid #fbbf24' : '2px solid #00ff88',
              color: value % 2 === 1 ? '#60a5fa' : '#00ff88',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              transform: isWinning ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isPending ? '0 0 10px 2px #eab308' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.filter = 'brightness(1.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isWinning) {
                e.target.style.transform = 'scale(1)';
                e.target.style.filter = 'brightness(1)';
              }
            }}
          >
            {value > 0 && value}
          </button>
        );
      })}
    </div>
  );
};

export default GameBoard;
