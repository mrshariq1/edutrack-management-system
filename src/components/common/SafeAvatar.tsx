import React, { useState } from 'react';
import { getInitialsAvatarSvg } from '../../assets';

interface SafeAvatarProps {
  src?: string;
  alt: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-20 h-20 text-xl font-bold',
};

const PIXEL_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export const SafeAvatar: React.FC<SafeAvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const displayName = name || alt || 'User';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ED';

  const px = PIXEL_MAP[size];

  if (!src || hasError) {
    return (
      <div
        className={`${SIZE_MAP[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#0F2747] to-[#1769E0] text-white flex items-center justify-center font-semibold shadow-xs select-none ${className}`}
        aria-label={alt}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={px}
      height={px}
      loading={priority ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${SIZE_MAP[size]} shrink-0 rounded-xl object-cover ring-1 ring-slate-200/80 dark:ring-slate-700/80 shadow-xs ${className}`}
    />
  );
};
