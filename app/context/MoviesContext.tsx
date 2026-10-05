"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useMoviesApi } from "../hooks/useMoviesApi";

type MoviesContextValue = ReturnType<typeof useMoviesApi>;

const MoviesContext = createContext<MoviesContextValue | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const value = useMoviesApi();
  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error("useMovies harus digunakan di dalam MoviesProvider.");
  }
  return context;
}
