+++
date = '2025-12-09T22:20:03-06:00'
draft = false
title = 'Zero Gravity 6-DOF'
summary = "Un controlador 6-DOF basado en física mostrando matemáticas vectoriales avanzadas y técnicas de proyección."
tags = ["Unity", "C#", "Física"]
+++

## Resumen

**Zero Gravity 6-DOF** es una demo técnica enfocada en interacciones de física complejas y movimiento de 6 Grados de Libertad.

## Arquitectura

El sistema está estructurado alrededor de un patrón de **Máquina de Estados Finitos (FSM)**, que separa limpiamente la lógica de movimiento en estados distintos y manejables. Este enfoque previene "código espagueti" y asegura que las interacciones de física se manejen de manera modular y predecible.

### Modelo de Física Híbrido

El sistema de movimiento busca proporcionar a los jugadores una sensación "flotante" mientras habilita escalada precisa a través de una variedad de superficies.

- **Estado Zero-G:** Utiliza un `Rigidbody` no-cinemático. El movimiento está basado en fuerzas, preservando momentum e inercia. Se aplica arrastre dinámico para simular microgravedad y controlar la deriva.
- **Estado de Escalada:** Cambia el `Rigidbody` a `isKinematic = true`. El movimiento se maneja mediante traslación directa, proyectando vectores de input sobre el plano de la superficie. Esto elimina el jitter causado por colisiones de física en meshes complejos.

#### Comportamiento de Cámara Zero-G

La cámara presenta un efecto de arrastre sutil pero notable que mejora la sensación de baja gravedad. Este arrastre también es visible cuando el jugador rota en su eje Y, creando una experiencia inmersiva de ingravidez.

{{< vimeo-bg 1147148473 >}}

---

## Análisis Técnico Profundo

### Detección Avanzada de Superficies

Para habilitar escalada en cualquier superficie y en cualquier ángulo, así como transiciones fluidas entre objetos, se utiliza un sistema de detección multicapa.

- En modo escalada, el jugador dispara **múltiples raycasts** en la dirección del input. Estos raycasts detectan bordes y activan transiciones a nuevas caras de superficie.
- Para soportar saltos de alta velocidad entre objetos de escalada, un **spherecast** condicional proyecta la velocidad del jugador hacia adelante. Si el jugador se mueve demasiado rápido para que los raycasts detecten una superficie, el spherecast "pre-detecta" colisiones próximas, habilitando aterrizajes y transiciones suaves.

#### Escalada en Superficies Simples

Movimiento básico de escalada en un rectángulo 3D demuestra las mecánicas principales:

{{< vimeo-bg 1147148440 >}}

### Navegación en Superficies Curvas

Navegar superficies curvas requirió un sistema dedicado de detección de curvatura.

- Mientras escala, un **anillo de raycasts** se dispara alrededor del punto de contacto para calcular la normal promedio de la superficie.
- El controlador muestrea la superficie adelante del movimiento del jugador, **pre-rotando** al personaje para coincidir con la curvatura próxima. Esto resulta en movimiento suave y natural sobre esferas low-poly y geometría compleja.

#### Escalada en un Toro

Geometría curva compleja como un toro muestra la detección adaptativa de superficie:

{{< vimeo-bg 1147148368 >}}

#### Escalada en una Esfera

Navegación suave a través de una superficie esférica:

{{< vimeo-bg 1147148319 >}}

#### Escalada Dentro de un Tubo

Demostrando detección correcta de ángulos cóncavos y transiciones fluidas dentro de un tubo:

{{< vimeo-bg 1147148276 >}}

### Sistema de Cámara

- En **Zero-G**, la cámara controla la rotación del cuerpo (yaw/pitch).
- En **modo Escalada**, la cámara está desacoplada, permitiendo al jugador mirar alrededor libremente mientras el cuerpo permanece alineado a la pared.
- El sistema ajusta dinámicamente el **campo de visión** basado en velocidad y estado para mejorar la sensación de movimiento.

### Mecánicas de Agarre y Tirón

- Un sistema de mano extensible, construido con raycasts y `LineRenderer`, permite al jugador agarrar superficies específicas.
- Cuando la mano se engancha a una superficie, se aplica un vector de velocidad hacia el punto de anclaje, creando un tirón satisfactorio y con peso.
- Si el jugador se jala hacia una pared, el sistema detecta la colisión y automáticamente transiciona al estado de **Escalada**.

#### Estado Básico de Agarre

La mecánica de mano extensible y sistema de tirón en acción:

{{< vimeo-bg 1147148257 >}}

#### Agarre Mientras Escala

La mecánica de agarre se integra perfectamente con el modo escalada:

{{< vimeo-bg 1147148179 >}}

#### Agarre en Modo Zero-G

Usando la mecánica de agarre mientras flota en gravedad cero:

{{< vimeo-bg 1147148034 >}}

#### Interacciones de Agarre + Salto

La mecánica de agarre/tirón combinada con salto crea interacciones divertidas basadas en fuerza:

{{< vimeo-bg 1147148120 >}}

### Salto Entre Objetos

Movimiento de salto a través de múltiples objetos de escalada demuestra las transiciones de estado fluidas:

{{< vimeo-bg 1147147947 >}}

---

## Herramientas & Flujo de Trabajo

Un `ScriptableObject` con más de **50 parámetros** (arrastre, aceleración, suavizado de cámara, velocidad de rotación, etc.) permite ajuste rápido del movimiento del jugador durante el desarrollo.

### Visualización de Debug

Se desarrollaron gizmos personalizados para visualizar la lógica interna del sistema:

| Gizmo | Propósito |
|-------|-----------|
| **Rayos Verde/Rojo** | Indican chequeos de superficie exitosos o fallidos |
| **Vectores Normales** | Muestran la normal de superficie suavizada vs. la normal cruda del polígono |
| **Predicción de Velocidad** | Visualiza dónde se espera que esté el jugador en 0.5 segundos |

#### Gizmos de Debug en Superficie Simple

Visualización en un rectángulo 3D:

{{< vimeo-bg 1147148559 >}}

#### Gizmos de Debug en Esfera Low-Poly

Visualización mostrando suavizado de normal de superficie en una esfera low-poly:

{{< vimeo-bg 1147148571 >}}
