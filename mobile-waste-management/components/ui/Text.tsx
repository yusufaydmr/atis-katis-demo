import { View, Text as RNText, TextProps } from 'react-native';
import { styled } from 'nativewind';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StyledText = styled(RNText);

interface Props extends TextProps {
  className?: string;
}

export function Text({ className, ...props }: Props) {
  return <StyledText className={cn("text-base text-gray-900", className)} {...props} />;
}
