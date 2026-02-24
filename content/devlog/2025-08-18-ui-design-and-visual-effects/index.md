+++
date = '2025-08-18T00:00:00-06:00'
title = 'UI Design and Visual Effects'
draft = false
tags = ['Shape Wars']
showTableOfContents = true
showReadingTime = true
showAuthor = false
+++

## UI Elements Design in Illustrator

Designed UI elements in Illustrator with a focus on minimalistic, geometric art to facilitate seamless in-game integration. The visual inspiration draws from the paper cut animation style of South Park and the vibrant aesthetics of Geometry Wars. For the color palette, I chose neon tones, aiming to create a glowing effect in the engine that enhances the low-light atmosphere.

![entry13](entry13.png)

![entry14](entry14.png)

## Health Bar System, Wave UI, and Font Update

Implemented a dynamic Health Bar system and UI, utilizing a script and horizontal group layout to generate health points based on the player's maximum health. The health bar visually updates its color according to the remaining health, providing clear feedback. Enhanced the wave system by integrating a UI script with the existing Wave Manager, which activates and deactivates UI elements to represent the current wave. Additionally, updated the game's font to LemonMilk for a more polished look.

![entry15](entry15.gif)

## Screen Shake System

Implemented a configurable screen shake system that responds to key gameplay events, including enemy deaths, player taking damage, and player death. The script also features debug options for testing and fine-tuning shake parameters, enhancing the overall impact and feedback during gameplay.

![entry16](entry16.gif)

## Trail Renderer System

Implemented a Trail Renderer Manager, along with a Trail Controller Scriptable Object that dynamically generates individual trails based on the assigned object and material. This system allows for flexible and visually distinct trail effects tailored to each game object.

![entry17](entry17.gif)
