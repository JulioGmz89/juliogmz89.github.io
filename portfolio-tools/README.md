# Portfolio Tools

Herramienta gráfica para gestionar el devlog del portafolio.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
cd portfolio-tools
npm install
```

## Uso

```bash
npm start
```

Se abrirá automáticamente en tu navegador: `http://localhost:3000`

## Funcionalidades

### Nueva Entrada de Devlog

1. **Título**: Nombre de la entrada (requerido)
2. **Fecha**: Por defecto es hoy
3. **Contenido**: Escribe en Markdown
4. **Imágenes**: Arrastra o selecciona imágenes/GIFs

### Acciones

- **Guardar Borrador**: Crea la entrada con `draft: true` (no se publica)
- **Publicar**: Crea la entrada y hace `git push` automáticamente

## Estructura de Archivos Generados

Cada entrada crea una carpeta en `content/devlog/`:

```
content/devlog/
└── 2025-12-20-mi-entrada/
    ├── index.md      # Contenido de la entrada
    ├── imagen1.png   # Imágenes adjuntas
    └── demo.gif
```

## Desarrollo

Para desarrollo con recarga automática:

```bash
npm run dev
```
