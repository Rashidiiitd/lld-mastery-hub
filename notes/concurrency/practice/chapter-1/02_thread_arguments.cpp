// Exercise 02 — Pass arguments to a thread
// Goal: understand callable + arguments in std::thread.
//
// PROBLEM:
// Implement printNumber(int n) to print "Worker received: n".
// Start a thread that calls printNumber with 42.
// Join it before printing "Main: done".
//
// TODO: implement the function and thread creation.

#include <iostream>
#include <thread>

using namespace std;

void printNumber(int n) {
    // TODO: print "Worker received: " followed by n

    cout<<"Worker received: " << n << endl;

}

int main() {
    // TODO: create thread with printNumber and argument 42
    // Hint: std::thread worker(printNumber, 42);

    // TODO: join worker
    thread worker(printNumber, 42);
    worker.join();
    std::cout << "Main: done\n";
    return 0;
}
