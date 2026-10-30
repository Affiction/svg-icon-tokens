import type { CSSProperties } from 'react';
import type { IconName } from './icon-name';
import './Icon.css';

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const style = { '--icon': `url(/icons/${name}.svg)` } as CSSProperties;

  return (
    <span
      className={className ? `icon ${className}` : 'icon'}
      style={style}
      aria-hidden="true"
    />
  );
}
