const useTransition = () => {
  const transition = (callback: any) => {
    // Fallback for browsers that don't support View Transitions:
    if (!(document as any).startViewTransition) {
      callback();
      return;
    }

    // With View Transitions:
    return (document as any).startViewTransition(() => callback());
  };

  return [transition];
};

export default useTransition;
