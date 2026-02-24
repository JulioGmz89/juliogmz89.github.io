+++
date = '2025-08-06T00:00:00-06:00'
draft = false
title = 'Shape Wars'
summary = "Un shooter de arena 2D estilo arcade construido como vitrina técnica de Object Pooling de alto rendimiento y sistemas de cámara inteligente en Unity."
tags = ["Unity", "C#", "Optimización de Rendimiento"]
+++

<br>

{{< button href="https://goshgm.itch.io/shape-wars" target="_blank" >}}
Ver en itch.io
{{< /button >}}
&nbsp;
<a id="toggle-game-btn" class="!rounded-md bg-primary-600 px-4 py-2 !text-neutral !no-underline hover:!bg-primary-500 dark:bg-primary-800 dark:hover:!bg-primary-700" role="button" style="cursor:pointer;" onclick="var g=document.getElementById('game-container');if(g.style.display==='none'){g.style.display='block';this.textContent='Ocultar Juego';}else{g.style.display='none';this.textContent='Jugar en Navegador';}">Jugar en Navegador</a>

<div id="game-container" style="display:none;margin-top:1rem;">
<iframe frameborder="0" src="https://itch.io/embed-upload/16138590?color=1a1a2e" allowfullscreen="" width="960" height="620"><a href="https://goshgm.itch.io/shape-wars">Jugar Shape Wars en itch.io</a></iframe>

### Controles

| Acción | Teclado y Mouse |
|--------|----------------|
| Mover | WASD / Teclas de dirección |
| Apuntar | Cursor del mouse |
| Disparar | Botón izquierdo del mouse |
| Pausa | ESC |
| Habilidad especial | Q |

</div>

## Resumen

**Shape Wars** es un Shooter de Arena 2D estilo arcade donde la precisión es clave y la duda es fatal. Controlas una nave en una arena cerrada, enfrentando oleadas de enemigos geométricos cada vez más difíciles. Diseñado como una demostración técnica de portafolio, Shape Wars muestra el combate a lo esencial: moverse, disparar y sobrevivir, demostrando el conocmimiento en arquitectura Unity y optimización de rendimiento.

{{< vimeo-bg 1167597790 >}}

### Modos de Juego

- **Modo Campaña:** Combate a través de 10 oleadas de intensidad creciente. Administra tus recursos con cuidado, tienes cargas de habilidad especial limitadas para llegar al encuentro final con el Jefe.
- **Modo Infinito:** Pon a prueba tu resistencia. ¿Cuánto tiempo puedes sobrevivir contra un asalto interminable?

### Enemigos

- **Chasers:** Unidades que rodean tu posición
- **Shooters:** Enemigos a distancia que te obligan a seguir moviéndote
- **Boss:** Un desafío de múltiples fases que pone a prueba todas tus habilidades

---

## Arquitectura

El proyecto está construido con **Máquina de Estados Finitos** para una gestión robusta del flujo del juego. Los sistemas principales incluyen un Controlador de Jugador, Sistema de Disparo, Gestor de Oleadas, Sistema de Spawn, Sistema de Salud/Vidas, Sistema de Puntuación y un Gestor de Estado del Juego que maneja las pantallas de Menú Principal, Gameplay, Pausa, Victoria y Derrota.

---

## Sistema de Object Pooling

El principal desafío técnico fue diseñar un **sistema de Object Pooling** de alto rendimiento para eliminar la sobrecarga de crear y destruir objetos del juego en tiempo de ejecución. Operaciones como `Instantiate()` y `Destroy()` son lentas y generan basura de memoria, causando caidas de fotogramas (FPS). Este sistema lo resuelve reciclando un conjunto de objetos pre-asignados.

### Criterios de Éxito

El sistema maneja **500+ objetos activos simultáneamente** en pantalla (distribuidos entre enemigos, proyectiles y efectos de partículas) mientras mantiene **60 FPS estables**. El Unity Profiler muestra **cero bytes de asignación de recolección de basura (GC Alloc: 0B)** durante el loop principal de gameplay tras la fase inicial de pooling.

### Arquitectura

El sistema está compuesto por un gestor central que supervisa múltiples pools individuales, cada uno manejando un tipo de objeto específico.

- **ObjectPoolManager (Singleton):** Un gestor globalmente accesible (`ObjectPoolManager.Instance`) que contiene un diccionario de todos los object pools. Responsable de la inicialización y de proveer los métodos públicos `SpawnFromPool` y `ReturnToPool`.
- **Pool (Clase Serializable):** Configurado en el Inspector de Unity. Define un `tag` (identificador único), `prefab` y `size` (cantidad de pre-asignación).
- **`Dictionary<string, Queue<GameObject>>`:** La estructura de datos principal. La clave `string` es el tag del pool, y el `Queue<GameObject>` almacena objetos inactivos listos para usar.
- **IPooledObject (Interfaz):** Permite que los objetos en el pool se reinicien a sí mismos mediante `OnObjectSpawn()`, llamado por el gestor inmediatamente después de activarlos.

### Ejemplo de Uso

En lugar de `Instantiate`, cualquier sistema llama a `SpawnFromPool()`:

```csharp
// Dentro del método HandleFiring() del PlayerController
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

Los objetos en el pool implementan `IPooledObject` y gestionan su propio retorno:

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

## Sistema de Cámara

El sistema de cámara tiene un comportamiento dinámico de cámara 2D inspirado en **Enter the Gungeon**, con "Death Zone", anticipación del mouse e interpolación suave para un movimiento de cámara responsivo pero cinematográfico.

### Características Principales

- **Death Zone:** La cámara permanece estacionaria cuando el jugador se mueve dentro de un área central, siguiéndolo solo cuando alcanza el borde — reduciendo el movimiento innecesario y manteniendo el foco en la acción.
- **Anticipación del Mouse:** La cámara se desplaza hacia adelante según la posición del cursor del mouse, dando al jugador visibilidad en la dirección en que apunta.

---

## Gestión del Proyecto

Este proyecto fue gestionado usando un flujo de trabajo estructurado en **Notion**, enfatizando la trazabilidad y la ejecución organizada de tareas.

{{< button href="https://descriptive-prince-468.notion.site/23a37bfa73c581728039f9bbab9dbfe9?v=23a37bfa73c58188b2b1000c5f2244f3&pvs=73" target="_blank" >}}
Ver Task Tracker
{{< /button >}}
&nbsp;
{{< button href="/es/devlog/" >}}
Ver Dev Log
{{< /button >}}

### Task Tracker (Backlog)

Todo el trabajo fue organizado usando un **tablero de tareas estilo Kanban** con estatutos: *Sin Iniciar*, *En Progreso*, *QA* y *Completado*. Las tareas se agruparon bajo **Epics** y se ejecutaron en **Sprints**. Los bugs se rastrearon por separado para mantener un pipeline limpio.

### Registro Diario de Trabajo

Un registro cronológico de cada sesión de desarrollo, documentando lo que se implementó, las decisiones tomadas y el progreso capturado con capturas de pantalla. Disponible en la sección [Dev Log](/es/devlog/) de este portafolio.
