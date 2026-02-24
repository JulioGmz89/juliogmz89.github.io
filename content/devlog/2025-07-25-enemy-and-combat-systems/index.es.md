+++
date = '2025-07-25T00:00:00-06:00'
title = 'Sistemas de Enemigos y Combate'
draft = false
tags = ['Shape Wars']
showTableOfContents = true
showReadingTime = true
showAuthor = false
+++

## Enemigo Chaser

Se implementó un nuevo tipo de enemigo que persigue activamente la posición del jugador, con velocidad ajustable desde el inspector. Durante el desarrollo, encontramos errores en el sistema de object pooling causados por usar nombres de objetos con FindGameObject, lo que provocaba problemas por errores de escritura. Cambiar a Tags para la identificación de objetos resolvió estos errores y mejoró la fiabilidad.

![entry8](entry8.gif)

## Enemigo Shooter

Se implementó un Enemigo Shooter. Este enemigo puede acercarse al jugador, retroceder para mantener distancia y atacar disparando proyectiles.

![entry10](entry10.gif)

## Sistema de Salud y Daño

Se implementaron scripts de salud tanto para el jugador como para los enemigos, junto con un script de infligir daño que aplica daño al colisionar. Este sistema ahora se usa para las balas y el enemigo perseguidor, permitiendo una gestión de la salud e interacciones.

![entry9](entry9.gif)

## Sistema de Puntuación con UI

Se implementó un sistema de puntuación básico. Cuando un enemigo es derrotado, su valor específico de puntos se establece mediante el script pointsOnDeath y se suma a la puntuación del jugador. La puntuación se muestra y actualiza en tiempo real usando un script adjunto al componente UI TextMeshPro, asegurando retroalimentación inmediata para el jugador.

![entry11](entry11.png)
