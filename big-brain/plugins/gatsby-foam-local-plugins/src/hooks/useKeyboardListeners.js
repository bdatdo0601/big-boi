import useSearchPopover from '../state/useSearchPopover';

const useKeyboardListeners = () => {
  const { open } = useSearchPopover();

  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && e.code === 'Digit7') {
        open();
      }
    });
  }
};

export default useKeyboardListeners;
