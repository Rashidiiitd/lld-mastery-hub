// Exercise 02 — Protect a shared counter with std::mutex
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

int counter = 0;
std::mutex counterMutex;
constexpr int THREADS = 8;
constexpr int ITERATIONS = 100000;

void incrementManyTimes() {
    for (int i = 0; i < ITERATIONS; ++i) {
        // TODO: lock counterMutex, increment counter, then unlock.
        // Keep the lock around the shared update only.
    }
}

int main() {
    std::vector<std::thread> workers;
    for (int i = 0; i < THREADS; ++i)
        workers.emplace_back(incrementManyTimes);
    for (auto& worker : workers) worker.join();
    std::cout << "Expected: " << THREADS * ITERATIONS
              << "\nActual:   " << counter << '\n';
}