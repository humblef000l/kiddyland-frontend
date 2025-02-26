import { StateCreator } from "zustand";

export interface MallSlice {
  mall: string | null;
  setMall: (mall: string) => void;
}

export const createMallSlice: StateCreator<MallSlice> = (set) => ({
    mall:null,
    setMall: (mall: string) => set({ mall }),
})

