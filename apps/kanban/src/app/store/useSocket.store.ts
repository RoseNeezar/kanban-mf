import { Socket } from "socket.io-client";
import create from "zustand";
import { combineAndImmer } from "./types/combine-Immer";

export const useSocketStore = create(
  combineAndImmer(
    {
      socket: null as Socket | null,
      socketConnected: false,
    },
    (set, get) => ({
      setSocket: async (socketObj: Socket) => {
        set((s) => {
          s.socket = socketObj;
        });
      },
      setSocketLoaded: () => {
        set((s) => {
          s.socketConnected = true;
        });
      },
    })
  )
);
