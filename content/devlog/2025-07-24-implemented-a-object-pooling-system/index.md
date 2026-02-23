+++
date = '2025-07-24T00:00:00-06:00'
title = 'Implemented a object pooling system'
draft = false
showTableOfContents = false
showReadingTime = true
showAuthor = false
+++

Implemented an object pooling system to optimize performance by eliminating the overhead of frequent object instantiation and destruction during gameplay. Developed a GamePoolManager that pre-instantiates a configurable number of prefabs and manages their activation and deactivation using a queue-based approach, rather than creating and destroying objects at runtime. This ensures zero garbage collection allocations (0B GC Alloc), resulting in smoother and more efficient gameplay

## Images

![entry6](entry6.png)
