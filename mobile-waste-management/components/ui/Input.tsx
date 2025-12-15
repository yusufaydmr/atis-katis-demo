import { TextInput, TextInputProps } from 'react-native';
import { cn } from './Text';

interface InputProps extends TextInputProps {
  className?: string;
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500",
        error && "border-red-500",
        className
      )}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}