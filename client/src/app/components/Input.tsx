import { ChangeEvent, FC } from "react";
import tw from "twin.macro";

interface InputGroupProps {
  type: string;
  placeholder: string;
  value: string;
  error?: string | undefined | null;
  setValue: (
    name: string
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputGroup: FC<InputGroupProps> = ({
  type,
  placeholder,
  value,
  error,
  setValue,
}) => {
  return (
    <>
      <input
        type={type}
        css={[
          tw`w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white`,
          error && tw`border-red-500`,
        ]}
        placeholder={placeholder}
        value={value}
        onChange={setValue(type)}
      />
      <small tw="font-medium text-red-600">{error}</small>
    </>
  );
};

export default InputGroup;
