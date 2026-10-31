// Exercise 03 — Run a lambda on a thread
// Goal: recognize lambda syntax as a callable.
//
// PROBLEM:
// Create a thread using a lambda that prints three lines:
//   Worker: step 1
//   Worker: step 2
//   Worker: step 3
// Join the thread.
//
// TODO: write the lambda and launch it.

#include <iostream>
#include <thread>

int main() {
    // TODO: std::thread worker([] { ... });
    // Put a loop inside the lambda to print steps 1 through 3.

    // TODO: join worker
    std::cout << "Main: all steps completed\n";
    return 0;
}
