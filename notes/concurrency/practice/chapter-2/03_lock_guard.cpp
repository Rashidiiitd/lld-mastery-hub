// Exercise 03 — Use RAII with std::lock_guard
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
        // TODO: create a std::lock_guard<std::mutex> for counterMutex.
        // Then increment counter. The guard should leave scope each iteration.
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