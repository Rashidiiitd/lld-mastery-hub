// Exercise 01 — Observe a race condition
// Goal: see that concurrent ++ on shared data can lose updates.
// Run several times. The final value is not guaranteed to equal EXPECTED.
#include <iostream>
#include <thread>
#include <vector>

int counter = 0;
constexpr int THREADS = 8;
constexpr int ITERATIONS = 100000;

void incrementManyTimes() {
    // TODO: increment the shared counter ITERATIONS times.
    // This exercise is intentionally unsynchronized.
}

int main() {
    std::vector<std::thread> workers;
    for (int i = 0; i < THREADS; ++i)
        workers.emplace_back(incrementManyTimes);
    for (auto& worker : workers) worker.join();

    const int expected = THREADS * ITERATIONS;
    std::cout << "Expected: " << expected << "\nActual:   " << counter << '\n';
    std::cout << "Explain why the result can be smaller.\n";
}