import React from 'react';
import { Lock } from 'lucide-react';

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Procedural authentic QR-style matrix renderer with security lock core
 */
export const QrCode: React.FC<QrCodeProps> = ({ 
  value, 
  size = 140, 
  className = '' 
}) => {
  // Deterministic pattern generator based on the value string
  const gridSize = 21;
  const cells: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  // Seed with value hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  // Draw 3 corner finder patterns (Standard QR markers)
  const drawFinderPattern = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        cells[startY + r][startX + c] = isBorder || isCenter;
      }
    }
  };

  drawFinderPattern(0, 0); // Top-left
  drawFinderPattern(14, 0); // Top-right
  drawFinderPattern(0, 14); // Bottom-left

  // Fill data cells deterministically
  let state = Math.abs(hash) + 12345;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder pattern zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= 13;
      const inBottomLeft = r >= 13 && c < 8;
      const inCenterLock = r >= 8 && r <= 12 && c >= 8 && c <= 12;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inCenterLock) {
        state = (state * 1664525 + 1013904223) % 4294967296;
        cells[r][c] = (state % 100) > 46;
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div 
      className={`relative inline-block bg-white p-2.5 rounded-xl border border-slate-700/60 shadow-md ${className}`}
      style={{ width: size + 20, height: size + 20 }}
      title={`Proof Verification QR: ${value}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        {cells.map((row, r) =>
          row.map((active, c) => {
            if (!active) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize - 0.4}
                height={cellSize - 0.4}
                rx={cellSize > 5 ? 1 : 0.5}
                fill="#0f172a"
              />
            );
          })
        )}
      </svg>
      {/* Center Shield Badge */}
      <div 
        className="absolute inset-0 m-auto flex items-center justify-center bg-indigo-600 text-white rounded-md shadow-sm border border-white"
        style={{ width: size * 0.22, height: size * 0.22 }}
      >
        <Lock className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
  );
};
