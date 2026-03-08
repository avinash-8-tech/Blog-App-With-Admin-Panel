import { forwardRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<any, ButtonProps>(({
  children,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  const baseStyles = 'flex flex-row items-center justify-center rounded-lg';
  
  const variantStyles = {
    default: 'bg-blue-600 active:bg-blue-700',
    destructive: 'bg-red-600 active:bg-red-700',
    outline: 'border border-gray-300 dark:border-gray-600 active:bg-gray-100 dark:active:bg-gray-800',
    ghost: 'active:bg-gray-100 dark:active:bg-gray-800',
  };

  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3',
    lg: 'h-12 px-6',
  };

  const textStyles = {
    default: 'text-white font-medium',
    destructive: 'text-white font-medium',
    outline: 'text-gray-900 dark:text-gray-100 font-medium',
    ghost: 'text-gray-900 dark:text-gray-100 font-medium',
  };

  return (
    <TouchableOpacity
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#000' : '#fff'} />
      ) : (
        <Text className={textStyles[variant]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';
export { Button };