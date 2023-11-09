import classNames from 'classnames';
import { ReactNode } from 'react';

export interface ChangingBackgroundProps {
  code?: number;
  main?: string;
  children: ReactNode;
}

export const ChangingBackground = ({
  code,
  main,
  children,
}: ChangingBackgroundProps) => {
  const drizzle = 'bg-gradient-to-r from-slate-300 to-slate-500';
  const snow = 'bg-gradient-to-br from-sky-50 to-neutral-50';
  const bgClass = classNames('min-w-screen, min-h-screen', snow);

  return <div className="bg-cover bg-thunderstorm">{children}</div>;
};
