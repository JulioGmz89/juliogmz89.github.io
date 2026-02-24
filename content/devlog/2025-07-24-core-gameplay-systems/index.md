+++
date = '2025-07-24T00:00:00-06:00'
title = 'Core Gameplay Systems'
draft = false
tags = ['Shape Wars']
showTableOfContents = true
showReadingTime = true
showAuthor = false
+++

## Player Movement with Input System

Implemented basic player movement by integrating the new input system. The player can now move using either the WASD keys or the arrow keys, providing responsive and intuitive controls. This marks the completion of the initial movement functionality.

![entry1](entry1.png)

## Rotation with Input System

Implemented player rotation with full input system support. The player now smoothly rotates to face the mouse cursor when using a keyboard and mouse, and responds to the right joystick when using a controller. 

![entry2](entry2.png)

## Shooting Mechanics

Implemented shooting mechanics using the new input system. The player can now fire projectiles, which currently travel forward upon being shot.

![entry3](entry3.png)

## Movement Enhancement: Acceleration and Drag

Added acceleration and drag to player movement, resulting in smoother and more responsive controls. These enhancements improve the overall feel and realism of gameplay, making movement more dynamic and engaging.

![entry4](entry4.gif)

## Game State Manager

Implemented a Game State Manager to handle overall game flow. Added a basic pause mechanic, allowing the game to be paused and resumed, and introduced debugging functions to assist with development and testing.

![entry5](entry5.png)

## Object Pooling System

Implemented an object pooling system to optimize performance by eliminating the overhead of frequent object instantiation and destruction during gameplay. Developed a GamePoolManager that pre-instantiates a configurable number of prefabs and manages their activation and deactivation using a queue-based approach, rather than creating and destroying objects at runtime. This ensures zero garbage collection allocations (0B GC Alloc), resulting in smoother and more efficient gameplay.

![entry6](entry6.png)

## Wave Manager

Implemented a Wave Manager system to coordinate enemy spawning alongside with the object pooling system. This allows for efficient and seamless management of enemy waves, ensuring smooth gameplay and optimal performance.

![entry7](entry7.gif)
