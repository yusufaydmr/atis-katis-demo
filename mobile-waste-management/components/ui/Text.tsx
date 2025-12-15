import { Text as RNText, TextProps } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props extends TextProps {
  className?: string;
}

export function Text({ className, ...props }: Props) {
  // NativeWind v4 ile RNText direkt className kabul eder
  return <RNText className={cn("text-base text-gray-900", className)} {...props} />;
}