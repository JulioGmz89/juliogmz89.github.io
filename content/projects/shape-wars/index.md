+++
date = '2025-08-06T00:00:00-06:00'
draft = false
title = 'Shape Wars'
summary = "An arcade-style 2D arena shooter built as a technical showcase for high-performance Object Pooling and smart camera systems in Unity."
tags = ["Unity", "C#", "Performance Optimization"]
+++

<br>

{{< button href="https://goshgm.itch.io/shape-wars" target="_blank" >}}
View on itch.io
{{< /button >}}

### Play in Browser

<iframe frameborder="0" src="https://itch.io/embed-upload/16138590?color=1a1a2e" allowfullscreen="" width="960" height="620"><a href="https://goshgm.itch.io/shape-wars">Play Shape Wars on itch.io</a></iframe>

### Controls

| Action | Keyboard & Mouse |
|--------|-----------------|
| Move | WASD / Arrow Keys |
| Aim | Mouse Cursor |
| Fire | Left Mouse Button |
| Pause | ESC |
| Special Ability | Q |

## Overview

**Shape Wars** is an arcade-style 2D Arena Shooter where precision is key and hesitation is fatal. You control an agile ship in a closed arena, fighting off increasingly difficult waves of geometric enemies. Designed as a technical portfolio piece, Shape Wars strips combat down to its essentials: move, shoot, and survive while demonstrating mastery in Unity architecture and performance optimization.

### Game Modes

- **Campaign Mode:** Battle through 10 waves of increasing intensity. Manage your resources carefully, you have limited special ability charges to reach the final Boss encounter.
- **Infinite Mode:** Test your endurance. How long can you survive against an endless onslaught?

### Enemies

- **Chasers:** Relentless units that swarm your position
- **Shooters:** Ranged enemies that force you to keep moving
- **Boss:** A multi-phase challenge that tests all your skills

---

## Architecture

The project is built with a **Finite State Machines** for robust game flow management. Core systems include a Player Controller, Weapon System, Wave Manager, Spawning System, Health/Lives System, Scoring System, and a Game State Manager handling Main Menu, Gameplay, Pause, Victory, and Defeat screens.

---

## Object Pooling System

The primary technical challenge was designing a high-performance **Object Pooling system** to eliminate the overhead of frequently creating and destroying game objects at runtime. Operations like `Instantiate()` and `Destroy()` are slow and generate memory garbage, causing frame rate stutters. This system solves that by recycling a pre-allocated set of objects.

### Success Criteria

The system handles **500+ simultaneous active objects** on screen (distributed among enemies, projectiles, and particle effects) while maintaining a stable **60 FPS**. The Unity Profiler shows **zero bytes of garbage collection allocation (GC Alloc: 0B)** during the main gameplay loop after the initial pooling phase.

### Architecture

The system is composed of a central manager overseeing multiple individual pools, each handling a specific object type.

- **ObjectPoolManager (Singleton):** A globally accessible manager (`ObjectPoolManager.Instance`) holding a dictionary of all object pools. Responsible for initialization and providing public `SpawnFromPool` and `ReturnToPool` methods.
- **Pool (Serializable Class):** Configured in the Unity Inspector. Defines a `tag` (unique identifier), `prefab`, and `size` (pre-allocation count).
- **`Dictionary<string, Queue<GameObject>>`:** The primary data structure. The `string` key is the pool's tag, and the `Queue<GameObject>` stores inactive, ready-to-use objects.
- **IPooledObject (Interface):** Allows pooled objects to reset themselves via `OnObjectSpawn()`, called by the manager immediately after activation.

### Usage Example

Instead of `Instantiate`, any system calls `SpawnFromPool()`:

```csharp
// Inside PlayerController's HandleFiring() method
private void HandleFiring()
{
    if (isFiring && Time.time >= nextFireTime)
    {
        if (firePoint != null)
        {
            ObjectPoolManager.Instance.SpawnFromPool(
                "PlayerProjectile", firePoint.position, firePoint.rotation);
            nextFireTime = Time.time + 1f / fireRate;
        }
    }
}
```

Pooled objects implement `IPooledObject` and manage their own return:

```csharp
public class Projectile : MonoBehaviour, IPooledObject
{
    [SerializeField] private float moveSpeed = 20f;
    [SerializeField] private float lifeTime = 2f;
    private Rigidbody2D rb;

    private void Awake() => rb = GetComponent<Rigidbody2D>();

    public void OnObjectSpawn()
    {
        rb.linearVelocity = transform.up * moveSpeed;
        Invoke(nameof(ReturnToPool), lifeTime);
    }

    private void ReturnToPool()
    {
        ObjectPoolManager.Instance.ReturnToPool("PlayerProjectile", gameObject);
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        CancelInvoke(nameof(ReturnToPool));
        ReturnToPool();
    }
}
```

---

## Camera System

The camera system provides dynamic 2D camera behavior inspired by **Enter the Gungeon**, featuring a dead zone, mouse look-ahead, and smooth interpolation for responsive yet cinematic camera motion.

### Core Features

- **Dead Zone:** The camera remains stationary when the player moves within a central area, only following once the player reaches the edge — reducing unnecessary motion and keeping focus on the action.
- **Mouse Look-Ahead:** The camera pans ahead based on the mouse cursor position, giving the player visibility in the direction they're aiming. 

### Configuration

All behavior is driven by a `ScriptableObject` (`SmartCameraConfig`), enabling rapid tuning without code changes:

### Mouse Look-Ahead Algorithm

1. Calculate mouse world position using camera projection
2. Determine direction and distance from player to mouse
3. Apply mouse influence factor to blend positions
4. Clamp look-ahead distance to maximum allowed
5. Smooth interpolation to target position using `SmoothDamp`

---

## Project Management

This project was managed using a structured workflow in **Notion**, emphasizing traceability and organized task execution.

{{< button href="https://descriptive-prince-468.notion.site/23a37bfa73c581728039f9bbab9dbfe9?v=23a37bfa73c5812790c2000c7be6536e" target="_blank" >}}
View Task Tracker
{{< /button >}}
&nbsp;
{{< button href="https://descriptive-prince-468.notion.site/23a37bfa73c580cc8698c31b568f8993?v=23a37bfa73c581da9d8b000c93d8c66e" target="_blank" >}}
View Daily Work Log
{{< /button >}}

### Task Tracker (Backlog)

All work was organized using a **Kanban-style task board** with statuses: *Not Started*, *In Progress*, *QA*, and *Completed*. Tasks were grouped under **Epics** (large initiatives) and executed in **Sprints** (time-bounded pushes). Bugs were tracked separately to maintain a clean pipeline.

### Daily Work Log

A chronological log of every development session, documenting what was implemented, decisions made, and progress captured with screenshots. Entries range from core systems like basic player movement and the object pooling system to final polish like boss encounters, death animations, and campaign mode creation.