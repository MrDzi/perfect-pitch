import React from "react";
import { render } from "@testing-library/react";
import PitchVisualization from "../index";

// Mock the PitchIcon component
jest.mock("../icons/pitch", () => {
  return function MockPitchIcon() {
    return <div data-testid="pitch-icon">Pitch Icon</div>;
  };
});

describe("PitchVisualization Component", () => {
  it("should render with default props", () => {
    const { container } = render(<PitchVisualization detune={null} shouldVisualize={false} progress={0} />);

    expect(container.querySelector(".pitch-visualization")).toBeInTheDocument();
    expect(container.querySelector(".pitch-visualization_progress")).toBeInTheDocument();
    expect(container.querySelector(".pitch-visualization_pitch")).toBeInTheDocument();
  });

  it("should apply correct progress bar transform", () => {
    const { container } = render(<PitchVisualization detune={null} shouldVisualize={false} progress={50} />);

    const progressBar = container.querySelector(".pitch-visualization_progress-bar");
    expect(progressBar).toHaveStyle("transform: translateX(-100px)"); // -200 + 50 * 2
  });

  it("should apply correct pitch indicator transform when detune is provided", () => {
    const { container } = render(<PitchVisualization detune={25} shouldVisualize={true} progress={0} />);

    const pitchIndicatorWrapper = container.querySelector(".pitch-indicator-wrapper");
    expect(pitchIndicatorWrapper).toHaveStyle("transform: translateX(25px)");
  });

  it("should apply active class when detune is not null", () => {
    const { container } = render(<PitchVisualization detune={10} shouldVisualize={true} progress={0} />);

    const pitchIndicator = container.querySelector(".pitch-indicator");
    expect(pitchIndicator).toHaveClass("pitch-indicator--active");
  });

  it("should not apply active class when detune is null", () => {
    const { container } = render(<PitchVisualization detune={null} shouldVisualize={false} progress={0} />);

    const pitchIndicator = container.querySelector(".pitch-indicator");
    expect(pitchIndicator).not.toHaveClass("pitch-indicator--active");
  });

  it("should apply green background when in center range", () => {
    const { container } = render(
      <PitchVisualization
        detune={20} // within -25 to 25 range
        shouldVisualize={true}
        progress={0}
      />
    );

    const target = container.querySelector(".target");
    expect(target).toHaveStyle("background: #6A994E");
  });

  it("should not apply green background when outside center range", () => {
    const { container } = render(
      <PitchVisualization
        detune={30} // outside -25 to 25 range
        shouldVisualize={true}
        progress={0}
      />
    );

    const target = container.querySelector(".target");
    expect(target).not.toHaveStyle("background: #6A994E");
  });

  it("should not apply green background when shouldVisualize is false", () => {
    const { container } = render(<PitchVisualization detune={20} shouldVisualize={false} progress={0} />);

    const target = container.querySelector(".target");
    expect(target).not.toHaveStyle("background: #6A994E");
  });
});
