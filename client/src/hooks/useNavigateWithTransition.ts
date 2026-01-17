import { useNavigate } from "react-router-dom";

const useNavigateWithTransition = (): [(route: string, isBackNavigation?: boolean) => Promise<void>] => {
  const navigate = useNavigate();

  const navigateWithTransition = async (route: string, isBackNavigation = false) => {
    // Fallback for browsers that don't support View Transitions:
    if (!(document as any).startViewTransition) {
      navigate(route);
      // Scroll to top for browsers without View Transitions
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      return;
    }

    if (isBackNavigation) {
      document.documentElement.classList.add("back-transition");
    }

    // With View Transitions:
    const transition = (document as any).startViewTransition(() => navigate(route));

    try {
      await transition.finished;
      // Scroll to top after transition completes
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    } finally {
      document.documentElement.classList.remove("back-transition");
    }
  };

  return [navigateWithTransition];
};

export default useNavigateWithTransition;
