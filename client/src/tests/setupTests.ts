import "@testing-library/jest-dom";

// Mock Web Audio API
let mockAudioContext: any = null;

Object.defineProperty(window, "AudioContext", {
  writable: true,
  value: jest.fn().mockImplementation(() => {
    if (!mockAudioContext) {
      mockAudioContext = {
        createOscillator: jest.fn().mockReturnValue({
          connect: jest.fn(),
          start: jest.fn(),
          stop: jest.fn(),
          frequency: {
            value: 0,
            setValueAtTime: jest.fn(),
            exponentialRampToValueAtTime: jest.fn(),
          },
          type: "sine",
        }),
        createGain: jest.fn().mockReturnValue({
          connect: jest.fn(),
          gain: {
            value: 0,
            setValueAtTime: jest.fn(),
            exponentialRampToValueAtTime: jest.fn(),
          },
        }),
        createAnalyser: jest.fn().mockReturnValue({
          connect: jest.fn(),
          getByteFrequencyData: jest.fn(),
          fftSize: 2048,
          frequencyBinCount: 1024,
        }),
        createMediaStreamSource: jest.fn().mockReturnValue({
          connect: jest.fn(),
        }),
        destination: {},
        currentTime: 0,
        sampleRate: 44100,
        state: "running",
        resume: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
      };
    }
    return mockAudioContext;
  }),
});

// Reset mock audio context before each test
beforeEach(() => {
  mockAudioContext = null;
});

// Mock MediaDevices API
Object.defineProperty(navigator, "mediaDevices", {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: jest.fn().mockReturnValue([
        {
          stop: jest.fn(),
        },
      ]),
    }),
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
});
