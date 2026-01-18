import { useNavigate } from "react-router-dom";

const useNavigateWithTransition = (): [(route: string, isBackNavigation?: boolean) => Promise<void>] => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    // Use requestAnimationFrame to ensure DOM updates are complete
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      // Double requestAnimationFrame for better reliability on slow devices
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    });
  };

  const navigateWithTransition = async (route: string, isBackNavigation = false) => {
    // Fallback for browsers that don't support View Transitions:
    if (!(document as any).startViewTransition) {
      navigate(route);
      // Immediate scroll to top for browsers without View Transitions
      scrollToTop();
      return;
    }

    if (isBackNavigation) {
      document.documentElement.classList.add("back-transition");
    }

    // With View Transitions:
    const transition = (document as any).startViewTransition(() => navigate(route));

    try {
      // Scroll to top immediately after navigation starts
      scrollToTop();

      // Wait for transition to complete
      await transition.finished;

      // Additional scroll to top to ensure it worked
      scrollToTop();
    } finally {
      document.documentElement.classList.remove("back-transition");
    }
  };

  return [navigateWithTransition];
};

export default useNavigateWithTransition;
