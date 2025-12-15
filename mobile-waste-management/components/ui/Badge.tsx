import { View, ViewProps, Text } from 'react-native';
import { cn } from './Text';

interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-900 border-transparent",
    secondary: "bg-gray-100 border-transparent",
    destructive: "bg-red-500 border-transparent",
    outline: "text-gray-950 border-gray-200",
    success: "bg-green-100 border-transparent",
    warning: "bg-yellow-100 border-transparent",
    info: "bg-blue-100 border-transparent",
  };

  const textColors = {
    default: "text-white",
    secondary: "text-gray-900",
    destructive: "text-white",
    outline: "text-gray-900",
    success: "text-green-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  };

  return (
    <View
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5",
        variants[variant],
        className
      )}
      {...props}
    >
      <Text className={cn("text-xs font-semibold", textColors[variant])}>
        {children}
      </Text>
    </View>
  );
}