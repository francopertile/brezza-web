# Informe de Cambios y Configuración — BREZZA Web

**Proyecto:** BREZZA Complejo Residencial (San Bernardino, Paraguay)  
**Repositorio GitHub:** [francopertile/brezza-web](https://github.com/francopertile/brezza-web)  
**Fecha:** Septiembre 2026  

---

## 1. Diagnóstico y Corrección del Logo (Navbar y Hero)

### Problema Detectado
- Al cargar la página, el logo aparecía como un recuadro blanco opaco.
- **Causa:** El archivo de imagen original (`logo-brezza.png`) poseía un fondo blanco sólido y dimensiones de `4096x4096px` con más de un 75% de espacio transparente/vacío en los bordes. El filtro CSS `brightness(0) invert(1)` convertía el fondo blanco en un bloque sólido.

### Solución Aplicada
1. **Transparencia Real:** Se procesó el archivo para eliminar el fondo blanco residual, logrando transparencia alfa pura en todo el contorno.
2. **Recorte de Límites (Bounding Box Crop):** Se recortó el logo exactamente a su caja visible (`3633x926px`), eliminando márgenes artificiales y permitiendo un control exacto de espaciados mediante CSS.
3. **Conversión a WebP:** Se generó la versión optimizada `logo-brezza.webp` con compresión sin pérdidas de calidad.

---

## 2. Rediseño y Ajustes de la Barra de Navegación (Header)

### Dimensiones y Proporciones
- **Tamaño del Logo:** Ajustado a `34px` de alto en estado normal y `28px` al hacer scroll (con escalado responsive a `28px` en tablets y `24px` en móviles).
- **Separador Vertical:** Altura calibrada a `24px` con opacidad suave (`0.45`).
- **Subtítulo "San Bernardino":** Tipografía ajustada a `0.85rem` con espaciado entre letras expandido (`0.12em`) para mayor elegancia.
- **Enlaces de Navegación:** Distribución equilibrada con `gap: 2.25rem` y botón de contacto destacado (*Call to Action*).

### Comportamiento Dinámico (Smart Auto-Hide)
- **Desplazamiento hacia abajo:** La barra superior se oculta suavemente deslizándose hacia arriba (`transform: translateY(-100%)`).
- **Desplazamiento hacia arriba:** La barra reaparece de inmediato para facilitar la navegación del usuario.
- **Fondo con efecto Blur:** Al hacer scroll, se activa un fondo blanco traslúcido con filtro de desenfoque (`backdrop-filter: blur(8px)`).

---

## 3. Rediseño de la Sección Principal (Hero)

### Cambios Visuales y Estructurales
- **Eliminación de Títulos Secundarios:** Se removieron los textos *"San Bernardino"* y *"Cordillera, Paraguay"* del Hero para dar protagonismo total al imagotipo.
- **Centrado Absoluto:** El logo BREZZA se encuentra perfectamente centrado de forma vertical y horizontal en el primer plano visual (`100vh / 100dvh`).
- **Descripción / Tagline:**
  - Ubicada directamente debajo del logo con espaciado limpio (`margin-top: 1.25rem`).
  - Tamaño de fuente aumentado a `clamp(1.15rem, 2vw, 1.45rem)`.
  - Sombra de texto suave (`text-shadow`) para máxima legibilidad sobre todas las fotografías del carrusel.
- **Protección para Pantallas de Menor Altura:** Implementación de límites fluidos (`clamp()` y `min-height`) para evitar que el texto se superponga con los indicadores del carrusel (`.hero-dots`) en laptops o resoluciones panorámicas bajas.

---

## 4. Optimización Integral de Imágenes (WebP)

Se realizó una conversión masiva de todos los recursos gráficos del proyecto:

| Categoría | Archivos | Formato Anterior | Formato Actual |
|---|---|---|---|
| **Logo** | `logo-brezza` | PNG | **WebP (Alpha Lossless)** |
| **Hero Slider** | `hero-1` al `hero-5` | JPG (13.5 MB c/u) | **WebP (Q85 / 2560px)** |
| **Galería** | `g1` al `g8` | JPG | **WebP (Q85)** |
| **Secciones** | `fachada`, `piscina`, `dusk`, `cenital`, `pool-lake` | JPG | **WebP (Q85)** |
| **Plantas / Masterplan** | `bloque-a`, `bloque-b`, `master-plan` | PNG | **WebP (Q95)** |

### Resultados de Rendimiento
- **Peso total inicial:** `83.65 MB`
- **Peso total final:** `9.61 MB`
- **Ahorro de transferencia:** **`88.5% de reducción`**
- **Impacto:** Carga casi instantánea en conexiones móviles y máxima puntuación en Google PageSpeed / Core Web Vitals.

---

## 5. Publicación y Despliegue en GitHub

### Repositorio Git
- **Ubicación:** `brezza-web/`
- **Rama principal:** `main`
- **URL Remota:** [https://github.com/francopertile/brezza-web.git](https://github.com/francopertile/brezza-web.git)
- **Documentación:** Archivo `README.md` generado con descripción, características técnicas y lista de tecnologías.

### Activación de GitHub Pages
1. Ingresar a: [https://github.com/francopertile/brezza-web/settings/pages](https://github.com/francopertile/brezza-web/settings/pages)
2. En **Source** / **Branch**, seleccionar `main` y carpeta `/(root)`.
3. Guardar cambios.
4. **URL de Producción:**  
   👉 **`https://francopertile.github.io/brezza-web/`**
