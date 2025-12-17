+++
date = '2023-10-13T00:00:00-06:00'
draft = false
title = 'Mayhem Superstars'
summary = "Un caótico juego party multijugador local que combina mecánicas de shooter top-down con construcción estratégica de escenarios."
tags = ["Unity", "Multijugador", "Diseño de Juegos", "C#", "UI/UX"]
+++

<br>

{{< button href="https://jukeboxgames.itch.io/mayhemsuperstars" target="_blank" >}}
Ver en itch.io
{{< /button >}}

## Resumen

**Mayhem Superstars** es un caótico juego party multijugador donde hasta 4 jugadores compiten en rondas de supervivencia. El giro principal es la "Fase de Ideación": entre rondas de combate, los jugadores eligen entre potenciar su personaje o colocar peligros permanentes (trampas, torretas, peligros ambientales) en la arena. El objetivo es sobrevivir al caos bullet-hell que tú y tus amigos crearon.

{{< vimeo-bg 1147148589 >}}

### Concepto Principal

Cada ronda sigue un loop de **Construir → Pelear → Puntuar**:

1. **Fase de Construcción:** Los jugadores colocan props (enemigos, obstáculos, power-ups) en el escenario
2. **Fase de Pelea:** Combate shooter top-down donde los jugadores luchan por sobrevivir
3. **Fase de Puntuación:** Los sobrevivientes ganan seguidores; quien tenga más seguidores gana la partida

El giro: estás construyendo el escenario que tus oponentes deben sobrevivir, creando un meta-juego estratégico de sabotaje y auto-ventaja.

---

## Mis Contribuciones

Mi enfoque principal fue trabajar junto a un equipo para definir la arquitectura técnica, seguir estándares de desarrollo e ingeniar la lógica de networking multijugador para asegurar gameplay de baja latencia.

---

## Arquitectura de Red Multijugador

Para asegurar una experiencia responsiva esencial para un juego estilo "Bullet Hell", diseñamos la arquitectura de networking usando un **modelo Peer-to-Peer (P2P) con Autoridad Local**.

Este enfoque eliminó la dependencia de un servidor central dedicado, reduciendo costos y asegurando que el juego sea jugable mientras los peers estén conectados. Al otorgar autoridad local a los clientes para su propio movimiento, redujimos significativamente la percepción de lag, haciendo que los controles se sientan "snappy" incluso en momentos caóticos.

### Simulación de Proyectiles del Lado del Cliente

Uno de los mayores desafíos técnicos fue sincronizar cientos de proyectiles sin saturar el ancho de banda de red. Implementé un sistema de **Simulación del Lado del Cliente** para manejar esto.

**El Problema:** Sincronizar la posición de cada bala cada frame genera tráfico de red masivo y latencia.

**La Solución:**

- **Instanciación del Servidor:** El servidor genera el proyectil "lógico" y calcula colisiones/daño de manera autoritativa
- **Client RPC:** En lugar de enviar actualizaciones de posición constantes, el servidor envía un único `ClientRPC` conteniendo posición inicial, dirección y velocidad
- **Ejecución Local:** El cliente instancia una copia solo visual que se mueve independientemente usando los parámetros proporcionados

Esto redujo drásticamente el tamaño del paquete de datos por frame mientras mantenía la fidelidad visual.

{{< mermaid >}}
sequenceDiagram
    participant Client as Procesos Cliente
    participant Server as Procesos Servidor

    Note over Client: Recibir input de disparo
    Client->>Server: ServerRPC
    
    Note over Server: Instanciar proyectil
    Note right of Server: Proyectil mecánico:<br/>Decide efectos del juego.
    
    Server->>Client: ClientRPC
    
    Note over Client: Recibir info del proyectil
    Note over Client: Instanciar proyectil simulado
    Note right of Client: Proyectil simulado:<br/>Solo efecto visual.
{{< /mermaid >}}

### División de Responsabilidades Servidor vs. Cliente

| Tareas del Servidor | Tareas del Cliente |
|---------------------|-------------------|
| Gestión del estado del juego | Movimiento local del jugador (predicción) |
| Comportamiento de IA enemiga | Efectos visuales (VFX) |
| Seguimiento de salud de enemigos | Actualizaciones de UI |
| Colisiones de proyectiles de jugadores | Feedback de audio |

---

## Estándares de Desarrollo & Pipeline

Usamos **metodología Git-Flow**, utilizando `main` para releases estables y `develop` para integración, con feature branches (`develop-[feature]`) para trabajo activo.

---

## Implementación de UX/UI

Diseñé e implementé la lógica del **Heads-Up Display (HUD)** para comunicar estados del juego claramente en medio del caos visual:

- **Display de Salud:** Implementé un sistema de salud basado en corazones que se actualiza en tiempo real basado en eventos de daño
- **UI de Inventario:** Creé un sistema de transparencia para el inventario de items (abajo a la derecha) para asegurar que nunca bloqueara la vista del jugador del área de juego
