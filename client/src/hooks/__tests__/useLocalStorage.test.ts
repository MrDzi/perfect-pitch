import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "../useLocalStorage";

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default-value"));

    expect(result.current[0]).toBe("default-value");
  });

  it("should return stored value from localStorage", () => {
    localStorageMock.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "default-value"));

    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated-value");
    });

    expect(result.current[0]).toBe("updated-value");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify("updated-value"));
  });

  it("should handle complex objects", () => {
    const initialObject = { count: 0, name: "test" };
    const updatedObject = { count: 1, name: "updated" };

    const { result } = renderHook(() => useLocalStorage("object-key", initialObject));

    act(() => {
      result.current[1](updatedObject);
    });

    expect(result.current[0]).toEqual(updatedObject);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("object-key", JSON.stringify(updatedObject));
  });

  it("should handle localStorage errors gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation((...args) => void args);
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });

    const { result } = renderHook(() => useLocalStorage("error-key", "fallback"));

    expect(result.current[0]).toBe("fallback");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle invalid JSON gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation((...args) => void args);
    localStorageMock.getItem.mockReturnValue("invalid-json{");

    const { result } = renderHook(() => useLocalStorage("invalid-json-key", "fallback"));

    expect(result.current[0]).toBe("fallback");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
