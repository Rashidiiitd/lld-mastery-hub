// Exercise 04 — Design a thread-safe BankAccount
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

class BankAccount {
    mutable std::mutex mutex_;
    int balance_ = 0;
public:
    explicit BankAccount(int initial) : balance_(initial) {}

    void deposit(int amount) {
        // TODO: lock and add amount (ignore non-positive amounts).
    }

    bool withdraw(int amount) {
        // TODO: lock; check balance; subtract only if sufficient funds.
        return false;
    }

    int getBalance() const {
        // TODO: lock and return balance_ safely.
        return -1;
    }
};

int main() {
    BankAccount account(1000);
    std::vector<std::thread> workers;
    for (int i = 0; i < 4; ++i) {
        workers.emplace_back([&] { for (int j = 0; j < 100; ++j) account.deposit(10); });
        workers.emplace_back([&] { for (int j = 0; j < 50; ++j) account.withdraw(5); });
    }
    for (auto& worker : workers) worker.join();
    std::cout << "Final balance: " << account.getBalance() << '\n';
    // Expected: 1000 + 4*100*10 - 4*50*5 = 4000
}