"""
TSP solver: nearest-neighbour heuristic + 2-opt improvement.
Operates on a pre-built distance matrix.
"""
from typing import List
import copy


def nearest_neighbour(dist: List[List[float]], start: int = 0) -> List[int]:
    """Greedy nearest-neighbour tour starting from `start`."""
    n = len(dist)
    visited = [False] * n
    tour = [start]
    visited[start] = True

    for _ in range(n - 1):
        current = tour[-1]
        best_dist = float("inf")
        best_next = -1
        for j in range(n):
            if not visited[j] and dist[current][j] < best_dist:
                best_dist = dist[current][j]
                best_next = j
        tour.append(best_next)
        visited[best_next] = True

    return tour


def tour_length(tour: List[int], dist: List[List[float]]) -> float:
    total = sum(dist[tour[i]][tour[(i + 1) % len(tour)]] for i in range(len(tour)))
    return total


def two_opt(tour: List[int], dist: List[List[float]], max_iter: int = 500) -> List[int]:
    """Improve tour with 2-opt swaps until no improvement or max_iter reached."""
    best = tour[:]
    best_len = tour_length(best, dist)
    improved = True
    iterations = 0

    while improved and iterations < max_iter:
        improved = False
        iterations += 1
        for i in range(1, len(best) - 1):
            for j in range(i + 1, len(best)):
                new_tour = best[:i] + best[i:j + 1][::-1] + best[j + 1:]
                new_len = tour_length(new_tour, dist)
                if new_len < best_len - 1e-6:
                    best = new_tour
                    best_len = new_len
                    improved = True

    return best


def solve_tsp(dist: List[List[float]]) -> List[int]:
    """Return near-optimal tour order for the given distance matrix."""
    if len(dist) <= 1:
        return list(range(len(dist)))
    tour = nearest_neighbour(dist)
    return two_opt(tour, dist)