+++
date = '2020-02-01T00:00:00-06:00'
draft = false
title = 'I Want My Toys'
summary = "Ganador de game jam adquirido por TLM Partners, con multijugador P2P usando Photon."
tags = ["Unity", "C#", "Multijugador", "Game Jam"]
+++

## Resumen

**I Want My Toys** es un juego multijugador creado originalmente durante una game jam patrocinada por **TLM Partners**. Nuestro equipo ganó la competencia, y la empresa adquirió la idea para continuar el desarrollo profesionalmente.

{{< vimeo-bg 1147148646 >}}

---

## Logro

<div class="alert" style="padding: 1rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.75rem; background-color: #fbbf24; color: #000;">
  <span style="font-size: 1.5rem;">🏆</span>
  <span><strong>Ganador de Game Jam</strong> — Nuestro prototipo impresionó a TLM Partners lo suficiente como para que adquirieran el proyecto para desarrollo comercial.</span>
</div>

<style>
  .dark .alert {
    background-color: #8D6F01 !important;
    color: #fff !important;
  }
</style>

---

## Mis Contribuciones

### Implementación Multijugador P2P (Photon)

Implementé el sistema multijugador online usando **Photon PUN (Photon Unity Networking)**:

- **Gestión de Salas:** Sistema de lobby para crear y unirse a sesiones de juego
- **Sincronización de Jugadores:** Sincronización de posición y estado en tiempo real entre clientes
- **Comunicación RPC:** Llamadas de procedimiento remoto para eventos e interacciones del juego

### Mecánicas de Jugador

Desarrollé las mecánicas principales del jugador incluyendo:

- **Sistema de Movimiento:** Controles de personaje responsivos
- **Lógica de Interacción:** Interacciones jugador-objeto y jugador-jugador
- **Gestión de Estados:** Estados del jugador sincronizados a través de la red

### Integración de Assets

Manejé la integración de assets de arte y audio en Unity:

- Configuración de sprites y animaciones
- Implementación del sistema de audio
- Integración de elementos de UI
