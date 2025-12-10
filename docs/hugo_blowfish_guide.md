# Guía de Hugo y Herramientas Blowfish

Este documento explica la estructura del proyecto y cómo utilizar las "herramientas" (shortcodes) del tema Blowfish para enriquecer tu portafolio.

## 1. Estructura de Carpetas

Entender dónde está cada cosa es clave para administrar tu sitio.

*   **`content/`**: ¡Aquí vive tu contenido!
    *   `projects/`: Tus proyectos (archivos `.md`).
    *   `about/`: Tu página de "Sobre mí".
    *   `posts/`: Entradas de blog (si decides escribir).
    *   **Regla de oro**: Si quieres cambiar texto, ve aquí.
*   **`static/`**: Archivos estáticos que se copian tal cual.
    *   `images/`: Tus imágenes, logos, screenshots.
    *   `resume/`: Tu CV en PDF.
    *   *Ejemplo*: Si pones una imagen en `static/images/foto.jpg`, la usas en tu web como `/images/foto.jpg`.
*   **`themes/blowfish/`**: El código del tema. **NO TOCAR**. Si cambias algo aquí, se romperá cuando actualices el tema.
*   **`hugo.toml`**: El centro de mando. Configuración global (menús, título, idioma, redes sociales).
*   **`public/`**: (Generada automáticamente) Es el sitio web final construido. Esta carpeta es la que se sube a GitHub Pages. No necesitas editar nada aquí.
*   **`.github/workflows/`**: Instrucciones para que GitHub construya tu sitio automáticamente (CI/CD).

## 2. Herramientas de Blowfish (Shortcodes)

Blowfish incluye componentes visuales listos para usar en tus archivos Markdown (`.md`). Aquí tienes los más útiles para un portafolio de ingeniería.

### 2.1 Alertas (`alert`)
Para destacar información importante, warnings o tips.

```markdown
{{< alert icon="lightbulb" cardColor="#e6f7ff" iconColor="#1890ff" >}}
**Tip Pro:** Usa esto para destacar logros clave en un proyecto.
{{< /alert >}}
```

### 2.2 Botones (`button`)
Para llamadas a la acción (Download, Demo, GitHub).

```markdown
{{< button href="https://github.com/tu-repositorio" target="_blank" >}}
Ver Código Fuente
{{< /button >}}
```

### 2.3 Carrusel (`carousel`)
Perfecto para mostrar galerías de screenshots de tus juegos sin ocupar mucho espacio vertical.

```markdown
{{< carousel images="['/images/projects/game1_shot1.jpg', '/images/projects/game1_shot2.jpg']" >}}
```

### 2.4 Habilidades / Badges (`badge`)
Útil para listar tecnologías en tus proyectos.

```markdown
{{< badge >}}Unity{{< /badge >}} {{< badge >}}C#{{< /badge >}} {{< badge >}}Photon{{< /badge >}}
```

### 2.5 Diagramas Mermaid (`mermaid`)
Como ingeniero, esto es oro. Puedes crear diagramas de arquitectura, flujo o clases directamente en código.

```markdown
{{< mermaid >}}
graph TD;
    Client-->|Input| NetworkManager;
    NetworkManager-->|RPC| Server;
    Server-->|State Update| Client;
{{< /mermaid >}}
```

### 2.6 Bloques de Código Mejorados
Hugo ya colorea el código, pero asegúrate de especificar el lenguaje.

```csharp
// Ejemplo de código C#
public void Jump() {
    if (isGrounded) {
        rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
    }
}
```

### 2.7 Youtube
Incrustar videos de gameplay es esencial.

```markdown
{{< youtube id="CÓDIGO_DEL_VIDEO" >}}
```
*(Donde `CÓDIGO_DEL_VIDEO` es la parte final de la URL de youtube).*

## 3. ¿Cómo probar estos cambios?

1.  Abre un archivo de proyecto (ej. `content/projects/i-want-my-toys.md`).
2.  Copia y pega alguno de los ejemplos de arriba.
3.  Corre el servidor local si no está corriendo: `hugo server -D`.
4.  Mira el resultado en `http://localhost:1313`.
