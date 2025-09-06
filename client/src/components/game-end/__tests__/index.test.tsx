import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GameEnd from "../index";

describe("GameEnd Component", () => {
  const mockProps = {
    totalPoints: 85,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with correct points", () => {
    render(<GameEnd {...mockProps} />);

    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Score:")).toBeInTheDocument();
  });

  it("should call onClick when button is clicked", () => {
    render(<GameEnd {...mockProps} />);

    const tryAgainButton = screen.getByText("Try Again");
    fireEvent.click(tryAgainButton);

    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("should handle zero points", () => {
    render(<GameEnd {...mockProps} totalPoints={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should handle high points", () => {
    render(<GameEnd {...mockProps} totalPoints={999} />);

    expect(screen.getByText("999")).toBeInTheDocument();
  });

  it("should display percentage when withPercentage is true", () => {
    render(<GameEnd {...mockProps} totalPoints={85} withPercentage={true} />);

    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("should not display percentage when withPercentage is false", () => {
    render(<GameEnd {...mockProps} totalPoints={85} withPercentage={false} />);

    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.queryByText("85%")).not.toBeInTheDocument();
  });

  it("should have correct CSS classes", () => {
    const { container } = render(<GameEnd {...mockProps} />);

    expect(container.querySelector(".game-end")).toBeInTheDocument();
    expect(container.querySelector(".full-size")).toBeInTheDocument();
    expect(container.querySelector(".flex")).toBeInTheDocument();
    expect(container.querySelector(".flex-center")).toBeInTheDocument();
  });
});
