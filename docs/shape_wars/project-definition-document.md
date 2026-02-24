## **Project Definition Document: Shape Wars**

### **1. Core Concept**

Shape Wars is an arcade-style 2D Arena Shooter, designed as a portfolio piece to demonstrate mastery in gameplay programming and performance optimization. The player controls an agile ship, survives increasingly difficult enemy waves, and utilizes short-term power-ups to achieve a maximum score.

### **2. Core Gameplay Loop**

The player maneuvers a ship to destroy waves of enemies with defined attack patterns, collecting temporary power-ups to overcome escalating challenges and clear each wave until the level is complete.

### **3. Minimum Viable & Polished Product (MVPP) - Defined Scope**

This is the **non-negotiable** scope. Nothing further will be added until every item on this list is implemented, functional, and polished to a high standard.

- **Architecture & Systems:**
    - **Player Controller:** Responsive, physics-based twin-stick controller.
    - **Weapon System:** Manual firing logic, rate of fire.
    - **Wave Manager:** Logic to define and execute enemy spawn sequences.
    - **Spawning System:** Mechanism to instantiate enemies at designated points.
    - **Health/Lives System:** Management of player state and collisions.
    - **Scoring System:** Simple point tracking for enemy destruction.
    - **Game State Manager:** State machine to manage Main Menu, Gameplay, Pause, Victory, and Defeat screens.
    - **Object Pooling System:** Implementation of the primary technical challenge.
- **Content:**
    - **Player Ship:** 1
    - **Enemy Types:** 3 (e.g., a short-range "Chaser" and a long-range "Shooter" and a “Boss”).
    - **Power-up Types:** 2 (e.g., temporary "Rapid Fire" and a temporary "Shield").
    - **Levels:** 1 enclosed arena with 10 waves of increasing difficulty.
- **Polish (UX/UI & "Juice"):**
    - **UI:** Functional menus, in-game HUD (lives, score, current wave).
    - **Visual Effects (VFX):** Particle system for (1) ship's muzzle flash, (2) enemy explosion, (3) player explosion. Visual trails for the ship and projectiles.
    - **Physical Feedback:** A `ScreenShake` system with intensity/duration parameters, triggered by explosions and player death.

### **4. Primary Technical Challenge & Success Criteria**

- **Challenge:** To design and implement a high-performance **Object Pooling system** for managing projectiles and enemies.
- **Quantifiable Success Criteria:** The system must handle **500 simultaneous active objects** on screen (distributed among enemies, projectiles, and particle effects) while maintaining a stable **60 FPS** on a mid-range target machine. The Unity Profiler must show **zero bytes of garbage collection memory allocation (GC Alloc: 0B)** during the main gameplay loop after the initial pooling phase.