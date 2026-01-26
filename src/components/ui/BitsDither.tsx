import { useEffect, useRef } from 'react';

interface BitsDitherProps {
  className?: string;
  colors?: string[];
  intensity?: number;
}

export function BitsDither({ className = '', colors, intensity = 0.3 }: BitsDitherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawDither();
    };

    const drawDither = () => {
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Default colors if not provided - dark theme with red accent
      const ditherColors = colors || ['#0a0a0a', '#121212', '#1a1a1a', '#242424', '#ff3131'];

      // Create image data
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Ordered dither matrix (Bayer 8x8 for smoother effect)
      const bayerMatrix = [
        [0, 32, 8, 40, 2, 34, 10, 42],
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44, 4, 36, 14, 46, 6, 38],
        [60, 28, 52, 20, 62, 30, 54, 22],
        [3, 35, 11, 43, 1, 33, 9, 41],
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47, 7, 39, 13, 45, 5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21],
      ];

      const cellSize = 8;
      const threshold = intensity * 64;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;

          // Get Bayer matrix value
          const bayerX = x % cellSize;
          const bayerY = y % cellSize;
          const bayerValue = bayerMatrix[bayerY][bayerX];

          // Create subtle gradient pattern
          const gradient = (x * 0.003 + y * 0.003) % 1;
          const pattern = (gradient * 255 + bayerValue * 4) % 256;

          // Select color based on pattern
          const normalizedPattern = pattern / 255;
          const colorIndex = Math.min(
            Math.floor(normalizedPattern * ditherColors.length),
            ditherColors.length - 1
          );
          const color = ditherColors[colorIndex] || ditherColors[0];

          // Parse hex color
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);

          // Apply dither - use threshold to create visible pattern
          const shouldShow = bayerValue < threshold;
          const alpha = shouldShow ? intensity * 200 : intensity * 80;

          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = Math.min(alpha, 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [colors, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-[1] ${className}`}
    />
  );
}
