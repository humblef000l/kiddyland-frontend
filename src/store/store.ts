import {create} from "zustand";
import { MallSlice,createMallSlice } from "./slices/mallSlice";

export const useStore = create<MallSlice>()((...a)=>({
    ...createMallSlice(...a),
}));