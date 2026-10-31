// Exercise 05 — Transfer safely between two accounts
// Use std::scoped_lock (C++17) to lock both account mutexes together.
#include <iostream>
#include <mutex>

class Account {
    friend bool transfer(Account&, Account&, int);
    mutable std::mutex mutex_;
    int balance_;
public:
    explicit Account(int balance) : balance_(balance) {}
    int balance() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return balance_;
    }
};

bool transfer(Account& from, Account& to, int amount) {
    // TODO: reject invalid amount or self-transfer as appropriate.
    // TODO: acquire both mutexes with std::scoped_lock.
    // TODO: check funds, then update both balances atomically under the locks.
    return false;
}

int main() {
    Account a(1000), b(500);
    // TODO: perform a valid transfer and an insufficient-funds transfer.
    std::cout << "A: " << a.balance() << " B: " << b.balance() << '\n';
    // Total balance should remain 1500.
}