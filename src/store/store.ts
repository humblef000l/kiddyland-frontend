import {create} from "zustand";
import { MallSlice,createMallSlice } from "./slices/mallSlice";
import { devtools } from "zustand/middleware";

export const useStore = create<MallSlice>()(
    devtools(createMallSlice, { name: "Store" })
);