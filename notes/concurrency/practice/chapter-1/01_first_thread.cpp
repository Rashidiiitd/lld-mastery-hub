// Exercise 01 — Start your first worker thread
// Goal: learn <thread>, callable syntax, and join().
//
// PROBLEM:
// Implement workerTask() so it prints:
//   Worker: Hello from another thread
// In main(), create a std::thread that runs workerTask.
// The driver then joins it.
//
// TODO: implement workerTask() and create the thread in main.

#include <iostream>
#include <thread>

void workerTask() {
    // TODO 1: print the required message
}

int main() {
    // TODO 2: create a thread that executes workerTask
    // Hint: std::thread worker(workerTask);

    // TODO 3: join the thread before main exits
    // Hint: worker.join();

    std::cout << "Main: worker has finished\n";
    return 0;
}
