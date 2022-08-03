import { ChangeEvent, useState } from "react";

const useFormInput = <T extends {}>(data: T) => {
  const [formState, setFormState] = useState(data);

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const resetText = () => {
    setFormState({
      ...data,
    });
  };

  return {
    fields: formState,
    onChangeText: onChangeText,
    resetText: resetText,
  };
};

export default useFormInput;
