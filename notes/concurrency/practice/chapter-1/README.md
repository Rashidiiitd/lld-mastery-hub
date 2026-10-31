## What I learned in this chapter

### Creating a thread

Create a thread with `std::thread`, passing it a callable and any arguments:

```cpp
std::thread threadName(function, argument);
```

The argument is optional. Call `join()` to wait fo rthe thread to finish:

```cpp
threadName.join();
```

Joining does not destroy the thread object. A joinable `std::thread` must be
joined or detached before its object is destroyed.

Threads can also run a lambda:

```cpp
std::thread threadName([capture] {
    // Function body
});
```
