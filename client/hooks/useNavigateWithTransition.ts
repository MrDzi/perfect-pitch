import { useNavigate } from "react-router-dom";

const useNavigateWithTransition = () => {
  const navigate = useNavigate();

  const navigateWithTransition = (route: string) => {
    // Fallback for browsers that don't support View Transitions:
    if (!(document as any).startViewTransition) {
      navigate(route);
      return;
    }

    // With View Transitions:
    return (document as any).startViewTransition(() => navigate(route));
  };

  return [navigateWithTransition];
};

export default useNavigateWithTransition;
