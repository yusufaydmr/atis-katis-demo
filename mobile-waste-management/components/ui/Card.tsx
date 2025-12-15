import { View, ViewProps } from 'react-native';
import { cn } from './Text';

interface CardProps extends ViewProps {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn("bg-white rounded-xl border border-gray-200 shadow-sm p-4", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <View className={cn("mb-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return <View className={cn("", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <View className={cn("", className)} {...props} />;
}