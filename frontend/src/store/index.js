import { create } from "zustand";

const useGlobalStore = create((set) => ({
  user_did: null,
  setUserDid: () => set((state) => ({ user_did: state.user_did })),
}));

export default useGlobalStore;
