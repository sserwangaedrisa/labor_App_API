import React from 'react';
import Icon from './AppIconl';

interface LoadingBoundaryProps {
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingText?: string;
  errorTitle?: string;
  onRetry?: (() => void) | null;
  fullScreen?: boolean;
}

const LoadingBoundary = ({ 
  loading = false, 
  error = null, 
  children,
  loadingText = 'Loading...',
  errorTitle = 'Something went wrong',
  onRetry = null,
  fullScreen = false
}: LoadingBoundaryProps) => {
  if (error) {
    return (
      <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[400px]'} bg-background`}>
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-xl shadow-elevation-3 p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon key='alertCircle' name="AlertCircle" size={32} color="var(--color-destructive)" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {errorTitle}
            </h3>
            
            <p className="text-muted-foreground mb-6">
              {typeof error === 'string' ? error : 'An unexpected error occurred. Please try again.'}
            </p>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover-lift active-press transition-smooth focus-ring"
              >
                <Icon key='refresh' name="RefreshCw" size={18} />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[400px]'} bg-background`}>
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <p className="text-muted-foreground font-medium">
            {loadingText}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const LoadingSpinner = ({ size = 'default', className = '' }: { size?: 'sm' | 'default' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`relative ${sizeClasses[size as keyof typeof sizeClasses]} ${className}`}>
      <div className="absolute inset-0 border-primary/20 rounded-full"></div>
      <div className="absolute inset-0 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export const SkeletonLoader = ({ 
  type = 'text',
  lines = 3,
  className = '' 
}) => {
  if (type === 'card') {
    return (
      <div className={`bg-card rounded-xl p-6 shadow-elevation-2 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`bg-card rounded-xl overflow-hidden shadow-elevation-2 ${className}`}>
        <div className="animate-pulse">
          <div className="h-14 bg-muted"></div>
          {[...Array(5)]?.map((_, i) => (
            <div key={i} className="h-14 bg-muted/50 border-t border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {[...Array(lines)]?.map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-muted rounded"
          style={{ width: `${100 - (i * 10)}%` }}
        ></div>
      ))}
    </div>
  );
};

export default LoadingBoundary;