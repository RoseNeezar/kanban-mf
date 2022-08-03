import create from "zustand";
import { combineAndImmer } from "./types/combine-Immer";

export const useRemoteStore = create(
  combineAndImmer(
    {
      token: window.localStorage.getItem("token") ?? (null as string | null),
      appLoaded: false,
      isLoading: false,
      sidebarStatus: true,
    },
    (set, get) => ({
      showSidebar: async (data: boolean) => {
        set((s) => {
          s.sidebarStatus = data;
        });
      },
    })
  )
);
