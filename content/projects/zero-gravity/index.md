+++
date = '2025-12-09T22:20:03-06:00'
draft = false
title = 'Zero Gravity 6-DOF'
summary = "A physics-based 6-DOF controller showcasing advanced vector math and projection techniques."
tags = ["Unity", "C#", "Physics"]
+++

## Overview

**Zero Gravity 6-DOF** is a technical demo focusing on complex physics interactions and 6-Degrees-of-Freedom movement.

## Architecture

The system is structured around a **Finite State Machine (FSM)** pattern, which cleanly separates movement logic into distinct, manageable states. This approach prevents "spaghetti code" and ensures that physics interactions are handled in a modular, predictable way.

### Hybrid Physics Model

The movement system aims to provide players with a "floaty" sensation while enabling precise climbing across a variety of surfaces.

- **Zero-G State:** Utilizes a non-kinematic `Rigidbody`. Movement is force-based, preserving momentum and inertia. Dynamic drag is applied to simulate microgravity and control drifting.
- **Climbing State:** Switches the `Rigidbody` to `isKinematic = true`. Movement is handled via direct translation, projecting input vectors onto the surface plane. This eliminates jitter caused by physics collisions on complex meshes.

#### Zero-G Camera Behavior

The camera features a subtle but noticeable drag effect that enhances the low-gravity feel. This drag is also visible when the player rolls on their Y rotation, creating an immersive weightless experience.

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148473?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

---

## Technical Deep Dive

### Advanced Surface Detection

To enable climbing on any surface and at any angle, as well as seamless transitions between objects, a multilayer detection system is used.

- In climbing mode, the player fires **multiple raycasts** in the direction of input. These raycasts detect edges and trigger transitions to new surface faces.
- To support high-speed jumps between climbing objects, a conditional **spherecast** projects the player's velocity forward. If the player is moving too fast for raycasts to detect a surface, the spherecast "pre-detects" upcoming collisions, enabling smooth landings and transitions.

#### Climbing on Simple Surfaces

Basic climbing movement on a 3D rectangle demonstrates the core mechanics:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148440?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

### Curved Surface Navigation

Navigating curved surfaces required a dedicated curvature detection system.

- While climbing, a **ring of raycasts** is fired around the contact point to calculate the average surface normal.
- The controller samples the surface ahead of the player's movement, **pre-rotating** the character to match upcoming curvature. This results in smooth, natural movement over low-poly spheres and complex geometry.

#### Climbing on a Torus

Complex curved geometry like a torus showcases the adaptive surface detection:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148368?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

#### Climbing on a Sphere

Smooth navigation across a spherical surface:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148319?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

#### Climbing Inside a Pipe

Demonstrating correct concave angle detection and seamless transitions inside a pipe:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148276?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

### Camera System

- In **Zero-G**, the camera controls the body's rotation (yaw/pitch).
- In **Climbing mode**, the camera is decoupled, allowing the player to look around freely while the body remains aligned to the wall.
- The system dynamically adjusts the **field of view** based on speed and state to enhance the sensation of movement.

### Grabbing & Pulling Mechanics

- An extendable hand system, built with raycasts and `LineRenderer`, allows the player to grab specific surfaces.
- When the hand latches onto a surface, a velocity vector is applied toward the anchor point, creating a satisfying, weighty pull.
- If the player pulls themselves into a wall, the system detects the collision and automatically transitions to the **Climbing** state.

#### Basic Grabbing State

The extendable hand mechanic and pull system in action:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148257?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

#### Grabbing While Climbing

The grabbing mechanic integrates seamlessly with climbing mode:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148179?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

#### Grabbing in Zero-G Mode

Using the grab mechanic while floating in zero gravity:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148034?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

#### Grabbing + Jumping Interactions

The grabbing/pull mechanic combined with jumping creates fun force-based interactions:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148120?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

### Jumping Across Objects

Jumping movement across multiple climbing objects demonstrates the seamless state transitions:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147147947?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

---

## Tools & Workflow

A `ScriptableObject` with over **50 parameters** (drag, acceleration, camera smoothing, roll speed, etc.) enables rapid tuning of player movement during development.

### Debug Visualization

Custom gizmos were developed to visualize the system's internal logic:

| Gizmo | Purpose |
|-------|---------|
| **Green/Red Rays** | Indicate successful or failed surface checks |
| **Normal Vectors** | Show the smoothed surface normal vs. the raw polygon normal |
| **Velocity Prediction** | Visualizes where the player is expected to be in 0.5 seconds |

#### Debug Gizmos on Simple Surface

Visualization on a 3D rectangle:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148559?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

#### Debug Gizmos on Low-Poly Sphere

Visualization showing surface normal smoothing on a low-poly sphere:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1147148571?background=1&autoplay=1&loop=1&muted=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>

