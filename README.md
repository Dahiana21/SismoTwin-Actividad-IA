# SismoTwin 4D — MVP funcional

Laboratorio web de ingeniería con generación de geometrías reales, construcción por etapas, simulación numérica y comparación A/B.

## Iniciar

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre la dirección que indique Vite. Para entrega al jurado:

```bash
npm run build
```

Publica la carpeta `dist/` en cualquier hosting estático (Vercel, Netlify, GitHub Pages, etc.). No requiere backend ni autenticación. Para presentar **sin instalación**, abre la URL desplegada en un navegador moderno.

## Funciones implementadas

- Edificio paramétrico de 3–12 pisos con columnas, vigas, losas, cimentación y cerramientos opcionales.
- Vista orbital con zoom, selección y vistas isométrica, frontal y superior.
- Cronograma de fases, reproducción y control manual.
- Modelo lineal de edificio de cortante, un grado de libertad por piso. Señal armónica sintética con envolvente, matrices M, K, C y Newmark β=1/4, γ=1/2, Δt=0,02 s.
- Desplazamientos relativos de pisos y comparación A/B con **idéntica entrada**.
- Cantidades geométricas aproximadas, costos editables, informe JSON descargable.
- Proyectos guardados/abiertos con LocalStorage y modo de recorrido guiado.

## Advertencias importantes

El modelo numérico es **idealizado y estrictamente educativo**. Las masas, rigideces y coeficientes de cuantificación se asignan mediante supuestos simplificados; no se derivan de diseño estructural ni ensayos. No incorpora torsión, no linealidad, interacción suelo-estructura, propiedades reales de materiales, dimensionamiento de conexiones ni verificación de normas sismorresistentes. No predice seguridad, daño ni capacidad real y **no sirve para diseñar o evaluar construcciones reales**.

La deformación visual se amplifica ×30 (o ×18 al comparar); no está a escala geométrica. La frecuencia y la aceleración sintética no representan una magnitud Richter.

**Nota de reproducibilidad:** inputs idénticos producen los mismos resultados deterministas.

## Organización

- `src/lib/model.ts` — miembros estructurales y cuantificación
- `src/lib/simulation.ts` — ensamblaje de matrices y solver Newmark
- `src/store/useLab.ts` — estado Zustand y persistencia
- `src/components/Building.tsx` — visualización Three.js / React Three Fiber
- `src/App.tsx` — flujo funcional y gráficas Recharts

## Plan de evolución

Mejoras prioritarias: validaciones dimensionales más robustas, modelo modal completo, importación/exportación de proyectos, pruebas automatizadas y calibración con datos reales; estas capacidades **no** se incluyen en el MVP.

## Novedades — Arquitectura e interiores

El menú **Arquitectura e interiores** permite renderizar una envolvente conceptual más detallada con fachadas, ventanas, marcos, balcones, cubierta, cuatro acabados y un catálogo procedural de siete objetos: cama, sofá, mesa, silla, muro, planta y lámpara. Selecciona el objeto, el piso y el estilo, pulsa **Agregar al edificio** y usa el inspector para modificar X, Z y rotación. Se puede mostrar un único piso, abrir/cerrar la fachada, guardar y recuperar la decoración de cada proyecto.

El **laboratorio sísmico** incorpora amplificación visual ajustable (×1–×80), barras inclinadas según la deriva entre niveles, relación de deriva de entrepiso e hipótesis de animación de falla activable manualmente. Esta última NO es un cálculo de colapso, tampoco una predicción de daño: es únicamente una ilustración conceptual añadida a la geometría deformada. La física subyacente sigue siendo lineal y educativa. Para simular un colapso de forma defendible sería preciso incorporar curvas constitutivas, rótulas plásticas, análisis no lineal, criterios de falla sustentados en normativa aplicable, calibración, interacción suelo-estructura y validación con casos de referencia.

## Novedades v3 · presentación al jurado

- **Intro animada:** edificio de ocho niveles que se ensambla en pantalla antes del laboratorio, nombre SismoTwin 4D y eslogan «Diseña el futuro. Simula sus desafíos». Desaparece automáticamente o puede omitirse. Respeta la preferencia de movimiento reducido.
- **Planos del edificio:** módulo `Planos del edificio` con plantas SVG por piso, dimensiones en metros, retícula de columnas calculadas desde la configuración actual, mobiliario sincronizado con el editor arquitectónico, selección y arrastre de objetos, zoom y capas independientes. Los SVG se descargan y pueden abrirse en un navegador o editor vectorial. Son **esquemas conceptuales, no planos constructivos**.
- **Modo jurado:** botón en la barra superior que inicia un recorrido paso a paso de siete estaciones: modelado, construcción 4D, arquitectura, planos, sismo, comparación A/B y costos. La navegación cambia realmente el módulo activo.
- **Persistencia:** las dimensiones y los objetos de arquitectura ya existentes siguen guardándose mediante Zustand + LocalStorage. No se implementa backend ni autenticación.

## Instalación (Windows / VS Code)

Abre la carpeta que contiene directamente `package.json`. En PowerShell:

```powershell
npm install
npm run dev
```

Abre la URL que indique Vite (normalmente `http://localhost:5173/`). Para comprobar el bundle:

```powershell
npm run build
```

En caso de advertencias de `npm audit`, revisa el informe antes de aplicar cambios y **evita `npm audit fix --force` sin evaluar incompatibilidades**.

**Verificación de esta entrega:** la sintaxis TSX de los componentes modificados ha sido analizada sin errores de parseo. No se pudo completar `npm install` en el entorno de empaquetado y por lo tanto no hay validación de ejecución ni compilación final. No afirmar que se verificó el funcionamiento en el navegador.


## V4 — Laboratorio sísmico avanzado

- Activar «Mapa de derivas en colores» en el inspector sísmico: la escala cian/ámbar/rosa es **relativa** a la deriva máxima calculada en el ensayo, nunca a umbrales de daño.
- Consultar las derivas por piso sincronizadas con el tiempo reproducido y el entrepiso con mayor deriva del ensayo.
- Panel explicativo de hipótesis, desplazamientos y limitaciones.
- Tres escenarios de excitación sintética, comparados usando la misma geometría y amortiguamiento, con resultados calculados por Newmark-beta.
- Seleccionar «Aplicar ensayo» para actualizar parámetros, animación y gráfica temporal.
- El JSON exportado incluye vector de deriva máxima por piso.

**Advertencia:** El modelo sigue siendo educativo, lineal y no predice resistencia última, daño, colapso ni seguridad de edificaciones reales.


## V5 — Movimiento y mapa de derivas en una misma animación

El laboratorio sísmico muestra **simultáneamente** desplazamientos laterales calculados por nivel y una escala de color basada en la deriva absoluta instantánea entre pisos. Una misma marca temporal (`simFrame`, intervalos de 0,02 s) mueve la geometría, pinta el modelo y actualiza los indicadores. Las columnas ahora se inclinan y alargan geométricamente para conectar sus nodos inferior y superior, evitando separaciones visuales durante la deformación amplificada.

En el módulo sísmico, activa «Superponer colores de deriva sobre el movimiento 3D», presiona Reproducir y observa la leyenda, el movimiento lateral y las derivas instantáneas en conjunto. Puedes pausar y desplazar el control temporal para inspeccionar el mismo fotograma en todos los paneles. El control de amplificación visual NO modifica los números. El color expresa la magnitud relativa de deformación, **no daños, riesgo ni probabilidades de falla**.
