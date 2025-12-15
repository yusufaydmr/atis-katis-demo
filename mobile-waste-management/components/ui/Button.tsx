import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator } from 'react-native';
import { cn } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  textClassName?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  className,
  textClassName,
  loading,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "flex-row items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 active:bg-blue-700",
    outline: "border border-gray-200 bg-white active:bg-gray-100",
    ghost: "bg-transparent active:bg-gray-100",
    destructive: "bg-red-500 active:bg-red-600",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  };

  const textColors = {
    default: "text-white",
    outline: "text-gray-900",
    ghost: "text-gray-900",
    destructive: "text-white",
  };

  return (
    <TouchableOpacity
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#000' : '#fff'} className="mr-2" />
      ) : null}
      {typeof children === 'string' ? (
        <Text className={cn("font-medium", textColors[variant], textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}