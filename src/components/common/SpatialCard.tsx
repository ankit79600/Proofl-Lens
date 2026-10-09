import React, { useRef, useState, MouseEvent } from 'react';

interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt in degrees (default 4.5deg)
  perspective?: number; // Perspective depth in pixels (default 1000px)
  glareEffect?: boolean;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  children,
  className = '',
  maxTilt = 4.5,
  perspective = 1000,
  glareEffect = true,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`);

    if (glareEffect) {
      setGlareStyle({
        opacity: 0.12,
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="relative w-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: transform || 'rotateX(0deg) rotateY(0deg)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className={`preserve-3d relative overflow-hidden transition-shadow duration-300 ${className}`}
      >
        {/* Specular Glare Lighting Following Cursor */}
        {glareEffect && (
          <div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              opacity: glareStyle.opacity,
              background: `radial-gradient(circle 350px at ${glareStyle.x}% ${glareStyle.y}%, rgba(56, 189, 248, 0.35), transparent 70%)`,
            }}
          />
        )}

        {children}
      </div>
    </div>
  );
};
