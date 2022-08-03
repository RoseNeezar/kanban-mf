import InputGroup from "@components/Input";
import { Dialog, Transition } from "@headlessui/react";
import useFormInput from "@shared-hooks/useFormInput";
import { useAuthStore } from "@store/useAuth.store";
import { errorHelper } from "@utils/errorHelper";
import React, { ChangeEvent, FC, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>({});
  const { login } = useAuthStore();
  const {
    onChangeText,
    resetText,
    fields: { username, password },
  } = useFormInput({
    username: "",
    password: "",
  });

  const handleSubmit = async () => {
    await login({
      username,
      password,
    });
    resetText();
  };

  const onDismiss = () => {
    navigate(-1);
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        tw="fixed inset-0 z-50 overflow-y-auto top-52"
        onClose={() => onDismiss()}
      >
        <div tw="min-h-screen px-4 text-center">
          <Dialog.Overlay tw="fixed inset-0 bg-gray-500 opacity-25" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div tw="inline-block w-full max-w-sm my-16 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl bg-dark-main">
              <div tw="flex flex-col w-full p-5 pt-3 m-auto rounded-md ">
                <div tw="flex flex-col py-4">
                  <Dialog.Title tw="font-bold text-3xl text-dark-txt text-center space-x-1">
                    Login
                  </Dialog.Title>
                </div>
                <div tw="flex flex-col">
                  <InputGroup
                    type="username"
                    value={username}
                    setValue={onChangeText}
                    placeholder="Email"
                    error={errorHelper(errors.message, "Username")}
                  />
                  <div tw="h-3" />
                  <div tw="bg-red-300" />

                  <InputGroup
                    type="password"
                    value={password}
                    setValue={onChangeText}
                    placeholder="Password"
                    error={errorHelper(errors.message, "Password")}
                  />
                  <button
                    tw=" w-full py-2 mt-2 mb-2 text-base rounded-xl font-bold text-white bg-indigo-800 border-indigo-800 focus:outline-none focus:border-indigo-800 hover:bg-indigo-400"
                    onClick={() => handleSubmit()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Login;
