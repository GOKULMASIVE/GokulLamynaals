import {create} from 'zustand';

const useLoadingStore = create((set) => ({
  loading: false,
  setLoading: (isLoading) => set({ loading: isLoading }),
}));
export default useLoadingStore;