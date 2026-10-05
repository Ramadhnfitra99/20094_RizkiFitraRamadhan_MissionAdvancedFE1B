"use client";

import { useCallback, useEffect, useState } from "react";
import { initialManagedMovies, type ManagedMovie, type MovieDraft } from "../data/managedMovies";
import {
  addMovie as addMovieRequest,
  deleteMovie as deleteMovieRequest,
  getMovies,
  updateMovie as updateMovieRequest,
} from "../services/api/movieApi";

const STORAGE_KEY = "chill-fe3b-api-movie-ids";

function readIds() {
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === null) return null;

  const parsed: unknown = JSON.parse(value);
  return Array.isArray(parsed)
    ? parsed.filter((id): id is string => typeof id === "string" && id.length > 0)
    : [];
}

function writeIds(movies: ManagedMovie[]) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(movies.map((movie) => movie.id)),
  );
}

function errorMessage(reason: unknown) {
  if (reason instanceof Error) return reason.message;
  return "API film belum dapat dihubungi. Silakan coba lagi.";
}

export function useMoviesApi() {
  const [movies, setMovies] = useState<ManagedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let ids = readIds();

      if (ids === null) {
        const seededMovies: ManagedMovie[] = [];
        for (const movie of initialManagedMovies) {
          const draft: MovieDraft = {
            title: movie.title,
            genre: movie.genre,
            rating: movie.rating,
            year: movie.year,
            poster: movie.poster,
          };
          seededMovies.push(await addMovieRequest(draft));
        }
        writeIds(seededMovies);
        ids = seededMovies.map((movie) => movie.id);
      }

      const remoteMovies = await getMovies(ids);
      setMovies(remoteMovies);
      writeIds(remoteMovies);
      setLastSyncedAt(new Date());
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) void loadMovies();
    });
    return () => {
      active = false;
    };
  }, [loadMovies]);

  const createMovie = useCallback(async (draft: MovieDraft) => {
    setPending(true);
    setError("");
    try {
      const created = await addMovieRequest(draft);
      setMovies((current) => {
        const next = [created, ...current];
        writeIds(next);
        return next;
      });
      setLastSyncedAt(new Date());
      return created;
    } catch (reason) {
      const message = errorMessage(reason);
      setError(message);
      throw new Error(message);
    } finally {
      setPending(false);
    }
  }, []);

  const updateMovie = useCallback(async (id: string, draft: MovieDraft) => {
    setPending(true);
    setError("");
    try {
      const updated = await updateMovieRequest(id, draft);
      setMovies((current) => {
        const next = current.map((movie) => (movie.id === id ? updated : movie));
        writeIds(next);
        return next;
      });
      setLastSyncedAt(new Date());
      return updated;
    } catch (reason) {
      const message = errorMessage(reason);
      setError(message);
      throw new Error(message);
    } finally {
      setPending(false);
    }
  }, []);

  const removeMovie = useCallback(async (id: string) => {
    setPending(true);
    setError("");
    try {
      await deleteMovieRequest(id);
      setMovies((current) => {
        const next = current.filter((movie) => movie.id !== id);
        writeIds(next);
        return next;
      });
      setLastSyncedAt(new Date());
    } catch (reason) {
      const message = errorMessage(reason);
      setError(message);
      throw new Error(message);
    } finally {
      setPending(false);
    }
  }, []);

  return {
    movies,
    loading,
    pending,
    error,
    lastSyncedAt,
    refresh: loadMovies,
    createMovie,
    updateMovie,
    deleteMovie: removeMovie,
  };
}
