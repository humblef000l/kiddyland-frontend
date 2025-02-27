import { StateCreator } from "zustand";

export interface MallSlice {
  mall: string | null;
  setMall: (mall: string) => void;
}

export const createMallSlice: StateCreator<MallSlice> = (set, get) => ({
  mall: null,
  setMall: (mall) => set({ mall }),
});
