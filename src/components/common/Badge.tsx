import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { EvidenceStatus } from '../../types/evidence';

interface BadgeProps {
  status: EvidenceStatus | 'MATCH' | 'MODIFIED' | 'NOT_FOUND';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
      case 'MATCH':
        return {
          label: status === 'MATCH' ? 'Verified Match' : 'Verified',
          icon: ShieldCheck,
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        };
      case 'modified':
      case 'MODIFIED':
        return {
          label: status === 'MODIFIED' ? 'Modified / Tampered' : 'Modified',
          icon: ShieldAlert,
          className: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        };
      case 'NOT_FOUND':
        return {
          label: 'Unregistered ID',
          icon: ShieldAlert,
          className: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
      case 'registered':
      default:
        return {
          label: 'Registered & Immutable',
          icon: Shield,
          className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${config.className} ${sizeClasses}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
