// Exercise 04 — Join two threads
// Goal: understand that join waits for a specific thread to finish.
//
// PROBLEM:
// Implement taskA() and taskB() so each prints its start and finish.
// Launch both tasks on separate threads, then join both.
// Do not assume which task's output appears first.
//
// TODO: implement the two tasks and launch/join them.

#include <iostream>
#include <thread>

void taskA() {
    // TODO: print "A: working" then "A: finished"
}

void taskB() {
    // TODO: print "B: working" then "B: finished"
}

int main() {
    // TODO: create thread a for taskA and thread b for taskB

    // TODO: join both threads

    std::cout << "Main: both workers joined\n";
    return 0;
}
