import { forwardRef, useState } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<any, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  editable = true,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </Text>
      )}

      <View
        className={cn(
          'flex-row items-center border rounded-lg bg-white dark:bg-gray-800',
          isFocused ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600',
          error && 'border-red-500',
          !editable && 'opacity-50 bg-gray-100 dark:bg-gray-900',
          className
        )}
      >
        {leftIcon && <View className="pl-3">{leftIcon}</View>}

        <TextInput
          ref={ref}
          className={cn(
            'flex-1 h-10 px-3 text-gray-900 dark:text-white',
            leftIcon && 'pl-2',
            rightIcon && 'pr-2'
          )}
          placeholderTextColor="#9ca3af"
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && <View className="pr-3">{rightIcon}</View>}
      </View>

      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';
export { Input };