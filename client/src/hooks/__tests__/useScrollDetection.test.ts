import { renderHook, act } from "@testing-library/react";
import useScrollDetection from "../useScrollDetection";

describe("useScrollDetection", () => {
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    // Clean up event listeners
    jest.clearAllMocks();
  });

  it("should return false initially when not scrolled", () => {
    const { result } = renderHook(() => useScrollDetection());
    expect(result.current).toBe(false);
  });

  it("should return true when scrolled past default threshold", () => {
    const { result } = renderHook(() => useScrollDetection());

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 10 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("should use custom threshold", () => {
    const { result } = renderHook(() => useScrollDetection(50));

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 30 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 60 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrollDetection());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
