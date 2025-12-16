+++
date = '2023-10-13T00:00:00-06:00'
draft = false
title = 'Mayhem Superstars'
summary = "A chaotic local multiplayer party game combining top-down action shooter mechanics with strategic stage building."
tags = ["Unity", "Multiplayer", "Game Design", "C#", "UI/UX"]
+++

<br>

{{< button href="https://jukeboxgames.itch.io/mayhemsuperstars" target="_blank" >}}
View on itch.io
{{< /button >}}

## Overview

**Mayhem Superstars** is a chaotic multiplayer party game where up to 4 players compete in survival rounds. The core twist is the "Phase of Ideation": between combat rounds, players choose between powering up their character or placing permanent hazards (traps, turrets, environmental dangers) in the arena. The goal is to survive the bullet-hell chaos you and your friends created.

<video src="/videos/mayhem-superstars/mayhem-superstars-video.mp4" autoplay loop muted playsinline style="width: 100%; border-radius: 8px;"></video>

### Core Concept

Each round follows a **Build → Fight → Score** loop:

1. **Build Phase:** Players place props (enemies, obstacles, power-ups) on the stage
2. **Fight Phase:** Top-down shooter combat where players battle to survive
3. **Score Phase:** Survivors earn followers; most followers wins the match

The twist: you're building the stage your opponents must survive, creating a strategic meta-game of sabotage and self-advantage.

---

## My Contributions

My primary focus was defining the technical architecture, establishing development standards, and engineering the multiplayer networking logic to ensure low-latency gameplay.

---

## Multiplayer Network Architecture

To ensure a responsive experience essential for a "Bullet Hell" style game, we designed the networking architecture using a **Peer-to-Peer (P2P) model with Local Authority**.

This approach eliminated the reliance on a dedicated central server, reducing costs and ensuring the game is playable as long as peers are connected. By granting local authority to clients for their own movement, we significantly reduced the perception of lag, making the controls feel "snappy" even in chaotic moments.

### Client-Side Projectile Simulation

One of the biggest technical challenges was synchronizing hundreds of projectiles without clogging the network bandwidth. I implemented a **Client-Side Simulation** system to handle this.

**The Problem:** Syncing the position of every bullet every frame generates massive network traffic and latency.

**The Solution:**

- **Server Instantiation:** The server spawns the "logical" projectile and calculates collisions/damage authoritatively
- **Client RPC:** Instead of sending constant position updates, the server sends a single `ClientRPC` containing initial position, direction, and velocity
- **Local Execution:** The client instantiates a visual-only copy that moves independently using the provided parameters

This drastically reduced the data packet size per frame while maintaining visual fidelity.

{{< mermaid >}}
sequenceDiagram
    participant Client as Client Processes
    participant Server as Server Processes

    Note over Client: Receive fire input
    Client->>Server: ServerRPC
    
    Note over Server: Instantiate projectile
    Note right of Server: Mechanical projectile:<br/>Decides game effects.
    
    Server->>Client: ClientRPC
    
    Note over Client: Receive projectile info
    Note over Client: Instantiate simulated projectile
    Note right of Client: Simulated projectile:<br/>Visual effect only.
{{< /mermaid >}}

### Server vs. Client Responsibility Split

| Server Tasks | Client Tasks |
|--------------|--------------|
| Game state management | Local player movement (prediction) |
| Enemy AI behavior | Visual effects (VFX) |
| Enemy health tracking | UI updates |
| Player projectile collisions | Audio feedback |

---

## Development Standards & Pipeline

We used **Git-Flow methodology**, utilizing `main` for stable releases and `develop` for integration, with feature branches (`develop-[feature]`) for active work.

---

## UX/UI Implementation

I designed and implemented the **Heads-Up Display (HUD)** logic to communicate game states clearly amidst visual chaos:

- **Health Display:** Implemented a heart-based health system that updates in real-time based on damage events
- **Inventory UI:** Created a transparency system for the item inventory (bottom right) to ensure it never blocked the player's view of the play area