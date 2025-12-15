import { TextInput, TextInputProps, View } from 'react-native';
import { styled } from 'nativewind';
import { cn } from './Text';

const StyledTextInput = styled(TextInput);
const StyledView = styled(View);

interface InputProps extends TextInputProps {
  className?: string;
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <StyledTextInput
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
