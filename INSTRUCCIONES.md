# 🦈 La aventura del Tiburoncito Elías — Instrucciones

## 1. Instalar dependencias

```bash
cd "proeycto elias tiburon2.0"
npm install
```

## 2. Correr localmente

```bash
npm run dev
```

Abre el navegador en **http://localhost:5173**

## 3. Dónde poner imágenes

Las imágenes van en la carpeta `/public/assets/`.
Cada archivo tiene un comentario `📁 Reemplaza imagen:` en `src/data/storyData.js`.

| Archivo esperado | Descripción |
|---|---|
| `public/assets/characters/shark_happy.png` | Tiburón feliz (portada y otras escenas) |
| `public/assets/characters/shark_idle.png` | Tiburón tranquilo |
| `public/assets/characters/shark_swim.png` | Tiburón nadando |
| `public/assets/characters/shark_body.png` | Tiburón de cuerpo completo |
| `public/assets/backgrounds/ocean_home.webp` | Fondo océano principal |
| `public/assets/backgrounds/coral_reef.webp` | Fondo arrecife de coral |
| `public/assets/backgrounds/chilean_coast.webp` | Fondo costa chilena |
| `public/assets/backgrounds/deep_ocean.webp` | Fondo océano profundo |
| `public/assets/objects/map_chile.png` | Mapa de Chile |
| `public/assets/objects/egg.png` | Huevo de tiburón |
| `public/assets/objects/baby_shark.png` | Bebé tiburón |
| `public/assets/audio/ocean_loop.mp3` | Música de fondo (loop) |
| `public/assets/audio/scene_01.mp3` | Narración escena 1 (portada) |
| `public/assets/audio/scene_02.mp3` | Narración "¿Quién soy?" |
| `public/assets/audio/scene_03.mp3` | Narración "¿Qué como?" |
| `public/assets/audio/scene_04.mp3` | Narración "¿Dónde vivo?" |
| `public/assets/audio/scene_05.mp3` | Narración "¿Cómo es mi cuerpo?" |
| `public/assets/audio/scene_06.mp3` | Narración "Reproducción" |
| `public/assets/audio/scene_07.mp3` | Narración "Dato curioso" |
| `public/assets/audio/scene_08.mp3` | Narración "Cierre" |

> Si un archivo no existe, la app lo ignora automáticamente — no se rompe.

## 4. Cómo cambiar textos

Abre el archivo `src/data/storyData.js`.
Cada escena es un objeto con sus textos. Puedes modificar:
- `title` — Título de la escena
- `text` — Texto principal
- `buttonText` — Texto del botón de avance
- `foods` — Lista de alimentos en la escena interactiva
- `bodyParts` — Descripción de partes del cuerpo

## 5. Cómo desplegarlo y compartir con QR

### Opción A — Netlify Drop (más fácil, gratis)

1. Corre: `npm run build`
2. Ve a **https://app.netlify.com/drop**
3. Arrastra la carpeta `dist/` que se generó
4. Netlify te da una URL pública en segundos
5. Genera el QR con cualquier generador online (ej. qr-code-generator.com)

### Opción B — GitHub Pages

1. Sube el repo a GitHub
2. En `vite.config.js` agrega `base: '/nombre-repo/'`
3. Corre `npm run build`
4. Sube la carpeta `dist/` a la rama `gh-pages`

### Opción C — Compartir en red local (jardín)

1. Corre: `npm run dev -- --host`
2. El terminal muestra una IP local (ej. `192.168.1.5:5173`)
3. Conéctate desde cualquier tablet/computador en la misma WiFi

## Controles de la app

| Acción | Forma |
|---|---|
| Avanzar escena | Botón en pantalla, flecha → o Enter |
| Retroceder | Botón ◀ o flecha ← |
| Ir a escena específica | Tocar los puntos de progreso |
| Pantalla completa | Botón ⛶ (esquina superior derecha) |
| Música de fondo | Botón 🔊/🔇 (esquina superior derecha) |

---
*Presentación preparada con ❤️ para Elías — Mes del Mar*
