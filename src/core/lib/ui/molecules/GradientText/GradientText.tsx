import React, { type ReactNode } from 'react';

type GradientTextProps = {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function GradientText({
  children,
  className = '',
  colors = ['#2a2a2a', '#FF0000', '#FFCC00', '#2a2a2a', '#FF0000', '#FFCC00'],
  animationSpeed = 600,
  showBorder = false,
  onMouseEnter,
  onMouseLeave,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed.toString()}s`,
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        relative flex max-w-fit cursor-pointer flex-row items-center justify-center overflow-hidden rounded-[1.25rem]
        font-medium backdrop-blur transition-shadow duration-500
        ${className}
      `}
    >
      {showBorder && (
        <div
          className='animate-gradient pointer-events-none absolute inset-0 z-0 bg-cover'
          style={{
            ...gradientStyle,
            backgroundSize: '300% 100%',
          }}
        >
          <div
            className='absolute inset-0 z-[-1] rounded-[1.25rem] bg-black'
            style={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>
        </div>
      )}
      <div
        className='animate-gradient relative z-2 inline-block bg-cover text-transparent'
        style={{
          ...gradientStyle,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          backgroundSize: '300% 100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
