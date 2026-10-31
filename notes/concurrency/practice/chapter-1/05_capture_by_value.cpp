// Exercise 05 — Capture a value in a thread lambda
// Goal: understand capture-by-value and why it avoids a dangling reference.
//
// PROBLEM:
// A local variable message is initialized in main.
// Create a thread whose lambda captures message by value and prints it.
// Join the thread.
//
// TODO: complete the lambda capture and output.

#include <iostream>
#include <thread>
#include <string>

int main() {
    std::string message = "Hello from a copied capture";

    // TODO: create a thread with a lambda that captures message by value
    // Hint: [message] { ... }

    // TODO: join worker
    return 0;
}
