import { useNavigate } from "react-router-dom";
import { useHistory } from "../../bootstrap";
import create from "zustand";
import { ILogin, IRegister } from "./types/auth.types";
import { combineAndImmer } from "./types/combine-Immer";
import queryApi from "@api/queryApi";

export const useAuthStore = create(
  combineAndImmer(
    {
      user: null as any | null,
    },
    (set, get) => ({
      login: async (data: ILogin) => {
        try {
          const result = await queryApi.authService.login(data);
          set((s) => {
            s.user = result;
          });
          useHistory.go(-1);
        } catch (error) {
          console.log(error);
        }
      },
      register: async (data: IRegister) => {
        try {
          const result = await queryApi.authService.signup(data);
          set((s) => {
            s.user = result;
          });
          useHistory.go(-1);
        } catch (error) {
          console.log(error);
        }
      },
      getMe: async () => {
        try {
          const result = await queryApi.authService.getMe();
          set((s) => {
            s.user = result;
          });
        } catch (error) {
          console.log("Err", error);
          useHistory.push("/landing");
        }
      },
      logout: async () => {
        try {
          await queryApi.authService.logout();

          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      },
    })
  )
);
