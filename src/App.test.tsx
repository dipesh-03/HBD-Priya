import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("birthday experience", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    cleanup();
    vi.useRealTimers();
  });

  it("opens the gift into the main experience", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /open your birthday gift/i }));
    act(() => vi.advanceTimersByTime(900));
    expect(screen.getByRole("heading", { name: /birthday magic/i })).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });

  it("shows Priya's date invitation directly after the photos", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /open your birthday gift/i }));
    act(() => vi.advanceTimersByTime(900));
    expect(screen.getByRole("heading", { name: /will you go out with me/i })).toBeInTheDocument();
    expect(screen.queryByText(/what kind of birthday/i)).not.toBeInTheDocument();
  });

  it("moves the no option five times and then leaves yes centered", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /open your birthday gift/i }));
    act(() => vi.advanceTimersByTime(900));

    fireEvent.click(screen.getByRole("button", { name: /^no$/i }), { detail: 0 });
    fireEvent.click(screen.getByRole("button", { name: /are you sure/i }), { detail: 0 });
    fireEvent.click(screen.getByRole("button", { name: /think again/i }), { detail: 0 });
    fireEvent.click(screen.getByRole("button", { name: /nice try/i }), { detail: 0 });
    fireEvent.click(screen.getByRole("button", { name: /still no/i }), { detail: 0 });
    act(() => vi.advanceTimersByTime(1200));

    expect(screen.queryByRole("button", { name: /last chance/i })).not.toBeInTheDocument();
    expect(screen.getByText(/option has quietly disappeared/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yes, i would love to/i })).toHaveClass("centered");
  });

  it("builds the bouquet, opens the note, and then enables the finale", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /open your birthday gift/i }));
    act(() => vi.advanceTimersByTime(900));
    fireEvent.click(screen.getByRole("button", { name: /yes, i would love to/i }));

    expect(screen.getByRole("heading", { name: /something beautiful is blooming/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /see the birthday wish/i })).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(15000));

    expect(screen.getByRole("heading", { name: /a bouquet for priya/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open the note/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /see the birthday wish/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /open the note/i }));
    expect(screen.getByRole("heading", { name: /^happy birthday$/i })).toBeInTheDocument();
    expect(screen.getByText(/some things feel too honest/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /see the birthday wish/i }));
    expect(screen.getByRole("heading", { name: /happy birthday,\s*priya/i })).toBeInTheDocument();
  });
});
