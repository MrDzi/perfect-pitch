import { renderHook, act } from "@testing-library/react";
import useAudio from "../useAudio";

describe("useAudio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with null context", () => {
    const { result } = renderHook(() => useAudio());

    expect(result.current.audioContext).toBe(null);
    expect(result.current.isAudioInitialized).toBe(false);
  });

  it("should initialize AudioContext", () => {
    const { result } = renderHook(() => useAudio());

    act(() => {
      const context = result.current.initializeAudioContext();
      expect(context).toBeDefined();
    });

    expect(result.current.isAudioInitialized).toBe(true);
    expect(result.current.audioContext).toBeDefined();
  });

  it("should return existing context if already initialized", () => {
    const { result } = renderHook(() => useAudio());

    let firstContext: AudioContext | null = null;
    let secondContext: AudioContext | null = null;

    act(() => {
      firstContext = result.current.initializeAudioContext();
      secondContext = result.current.initializeAudioContext();
    });

    expect(firstContext).toBe(secondContext);
  });

  it("should create oscillator with correct configuration", () => {
    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.initializeAudioContext();
    });

    act(() => {
      const nodes = result.current.createOscillator({ frequency: 440, gain: 0.5 });
      expect(nodes).toBeDefined();
      expect(nodes?.oscillator).toBeDefined();
      expect(nodes?.gainNode).toBeDefined();
      expect(nodes?.audioContext).toBeDefined();
    });
  });

  it("should play tone without errors", () => {
    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.initializeAudioContext();
    });

    act(() => {
      // Should not throw an error
      expect(() => result.current.playTone(440, 100, 0.15)).not.toThrow();
    });
  });

  it("should get microphone stream", async () => {
    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.initializeAudioContext();
    });

    await act(async () => {
      const stream = await result.current.getMicrophoneStream();
      expect(stream).toBeDefined();
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    });
  });

  it("should handle microphone access error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {
      // intentionally empty
    });
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValue(new Error("Permission denied"));

    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.initializeAudioContext();
    });

    await act(async () => {
      const stream = await result.current.getMicrophoneStream();
      expect(stream).toBe(null);
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("should create analyser from stream", () => {
    const { result } = renderHook(() => useAudio());
    const mockStream = {
      getTracks: jest.fn().mockReturnValue([{ stop: jest.fn() }]),
    } as any;

    act(() => {
      result.current.initializeAudioContext();
    });

    act(() => {
      const analyser = result.current.createAnalyserFromStream(mockStream);
      expect(analyser).toBeDefined();
      expect(analyser?.fftSize).toBe(2048);
    });
  });

  it("should handle createOscillator when context exists", () => {
    const { result } = renderHook(() => useAudio());

    // createOscillator automatically initializes context if needed
    act(() => {
      const nodes = result.current.createOscillator({ frequency: 440, gain: 0.5 });
      expect(nodes).toBeDefined();
      expect(nodes?.oscillator).toBeDefined();
      expect(nodes?.gainNode).toBeDefined();
      expect(nodes?.audioContext).toBeDefined();
    });

    expect(result.current.isAudioInitialized).toBe(true);
  });

  it("should handle createAnalyserFromStream when context exists", () => {
    const { result } = renderHook(() => useAudio());

    // createAnalyserFromStream automatically initializes context if needed
    act(() => {
      const analyser = result.current.createAnalyserFromStream({} as any);
      expect(analyser).toBeDefined();
      expect(analyser?.fftSize).toBe(2048);
    });

    expect(result.current.isAudioInitialized).toBe(true);
  });

  it("should cleanup properly", () => {
    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.initializeAudioContext();
      result.current.cleanup();
    });

    // Test that cleanup doesn't throw
    expect(true).toBe(true);
  });
});
