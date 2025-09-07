import React from "react";
import { render, screen } from "@testing-library/react";
import Stats from "../index";
import { Stats as StatsType } from "../../../pages/pitchle";

describe("Stats Component", () => {
  const mockStatsData: StatsType = {
    gamesPlayed: 10,
    gamesWon: 7,
    winPercentage: 70,
    streak: 3,
    maxStreak: 5,
    lastCompletedGameDate: "2023-01-01",
    lastGameSolution: {},
    lastGameAttempts: 5,
  };

  it("should render all stats correctly", () => {
    render(<Stats data={mockStatsData} />);

    expect(screen.getByText("Stats")).toBeInTheDocument();
    expect(screen.getByText("Games played")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Wins")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Success rate")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
    expect(screen.getByText("Current streak")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Max streak")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should handle zero values", () => {
    const zeroStats: StatsType = {
      gamesPlayed: 0,
      gamesWon: 0,
      winPercentage: 0,
      streak: 0,
      maxStreak: 0,
      lastCompletedGameDate: "",
      lastGameSolution: {},
      lastGameAttempts: 0,
    };

    render(<Stats data={zeroStats} />);

    expect(screen.getAllByText("0")).toHaveLength(4); // 4 zero values
    expect(screen.getByText("0%")).toBeInTheDocument(); // win percentage
  });

  it("should format win percentage correctly", () => {
    const highPercentageStats: StatsType = {
      gamesPlayed: 100,
      gamesWon: 95,
      winPercentage: 95,
      streak: 10,
      maxStreak: 15,
      lastCompletedGameDate: "2023-01-01",
      lastGameSolution: {},
      lastGameAttempts: 3,
    };

    render(<Stats data={highPercentageStats} />);

    expect(screen.getByText("95%")).toBeInTheDocument();
  });
});
