+++
date = '2020-02-01T00:00:00-06:00'
draft = false
title = 'I Want My Toys'
summary = "A game jam winner acquired by TLM Partners, featuring P2P multiplayer using Photon."
tags = ["Unity", "C#", "Multiplayer", "Game Jam"]
+++

## Overview

**I Want My Toys** is a multiplayer game originally created during a game jam sponsored by **TLM Partners**. Our team won the competition, and the company acquired the idea to continue development professionally.

{{< vimeo-bg 1147148646 >}}

---

## Achievement

<div class="alert" style="padding: 1rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.75rem; background-color: #fbbf24; color: #000;">
  <span style="font-size: 1.5rem;">🏆</span>
  <span><strong>Game Jam Winner</strong> — Our prototype impressed TLM Partners enough that they acquired the project for commercial development.</span>
</div>

<style>
  .dark .alert {
    background-color: #8D6F01 !important;
    color: #fff !important;
  }
</style>

---

## My Contributions

### P2P Multiplayer Implementation (Photon)

I implemented the online multiplayer system using **Photon PUN (Photon Unity Networking)**:

- **Room Management:** Lobby system for creating and joining game sessions
- **Player Synchronization:** Real-time position and state sync across clients
- **RPC Communication:** Remote procedure calls for game events and interactions

### Player Mechanics

Developed the core player mechanics including:

- **Movement System:** Responsive character controls
- **Interaction Logic:** Player-to-object and player-to-player interactions
- **State Management:** Player states synchronized across the network

### Asset Integration

Handled the integration of art and audio assets into Unity:

- Sprite setup and animation configuration
- Audio system implementation
- UI element integration