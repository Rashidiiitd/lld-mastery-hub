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

using namespace std;

void workerTask1() {
    // TODO 1: print the required message
    std::cout<<"Worker: Hello from first  thread\n";
}

void workerTask2() {
    // TODO 1: print the required message
    std::cout<<"Worker: Hello from second thread\n";
}

int main() {
    // TODO 2: create a thread that executes workerTask
    // Hint: std::thread worker(workerTask);

    // TODO 3: join the thread before main exits
    // Hint: worker.join();
    
    std::thread worker1(workerTask1);
    std::thread worker2(workerTask2);
    worker1.join();
    std::cout<< "Main: first worker has finished\n";
    worker2.join();
    std::cout << "Main: workers have finished\n";
    return 0;
}

// Run: g++ -std=c++17 -pthread 01_first_thread.cpp -o 01_first_thread && ./01_first_thread
