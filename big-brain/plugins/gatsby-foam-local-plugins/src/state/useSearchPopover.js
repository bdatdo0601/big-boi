import create from 'zustand';

const useSearchPopover = create((set, get) => ({
  isOpen: false,
  open: () => {
    if (get().isOpen === true) return;
    set(() => ({
      isOpen: true,
    }));
  },
  close: () => {
    if (get().isOpen === false) return;
    set(() => ({
      isOpen: false,
    }));
  },
}));

export default useSearchPopover;
