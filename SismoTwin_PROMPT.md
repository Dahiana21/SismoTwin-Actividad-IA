# SISMOTWIN 4D — PROMPT MAESTRO FINAL CONSOLIDADO (V5)

> **Eslogan:** «Diseña el futuro. Simula sus desafíos».
>
> **Objetivo:** MVP web para concurso que permita **CREAR → DISEÑAR → AMUEBLAR → CONSTRUIR VIRTUALMENTE → SIMULAR → ANALIZAR → MODIFICAR → COMPARAR → EXPORTAR**.

## ROL

Actúa como un equipo senior compuesto por arquitecto de software, desarrollador React/TypeScript, especialista Three.js/React Three Fiber, diseñador UX/UI para SaaS, ingeniero estructural especializado en dinámica (con revisión responsable de supuestos), y especialista en visualización científica. Construye una aplicación funcional y verificable. No crees una landing page ni botones decorativos. Trabaja sobre el código existente de SismoTwin 4D V5 preservando todos los módulos que ya funcionan; si el código no está disponible, crea un proyecto equivalente desde cero.

## 1. STACK OBLIGATORIO

- React + TypeScript + Vite.
- Tailwind CSS y componentes shadcn/ui.
- Three.js y React Three Fiber, con Drei/OrbitControls.
- Zustand para el estado; persistencia en LocalStorage.
- Motion para transiciones e introducción.
- Recharts para gráficas derivadas exclusivamente de resultados numéricos.
- No implementar backend, autenticación, integraciones de IA ni servicios pagos antes de terminar y validar el flujo central.
- Diseño responsive, manejo de errores y accesibilidad básica.

## 2. ESTRUCTURA VISUAL

- Estética oscura profesional: azul marino profundo, cian, blanco, grises de alto contraste y tonos de acento restringidos a indicadores.
- Barra superior: marca, nombre del proyecto, guardar, abrir, exportar, restablecer, botón Modo Jurado.
- Sidebar izquierdo: Planos del edificio, Modelador 3D, Arquitectura e Interiores, Laboratorio Sísmico Avanzado, Comparación A/B, Costos y Cantidades.
- Canvas 3D central, controles contextuales y resultados a la derecha; timeline inferior en construcción y reproducción sísmica.
- Estados de carga, vacíos y error; tooltips pedagógicos, teclado/cámara y navegación adecuada a pantallas pequeñas.
- Cualquier control debe cambiar datos, geometría, vista, archivos o resultados reales. No mostrar botones falsamente funcionales.

## 3. INTRODUCCIÓN ANIMADA

Al abrir la aplicación mostrar una secuencia de inicio cinematográfica pero breve: fondo azul marino; líneas de referencia y retícula; edificio de ocho niveles que se eleva progresivamente desde la cimentación; efectos cian discretos; logo **SismoTwin 4D**; eslogan **«Diseña el futuro. Simula sus desafíos»**; transición al dashboard. Debe existir botón Omitir introducción, respetar prefers-reduced-motion y evitar reproducirla cada vez que se navegue por módulos. Evitar bloquear la interfaz si hay errores de animación.

## 4. MODELADOR ESTRUCTURAL 3D

Iniciar con ocho niveles. Controles: pisos de 3 a 12; altura de piso; ancho y profundidad; columnas por dirección; configuración estructural idealizada; rigidez relativa; cerramientos opcionales. Dibujar con geometrías reales cimentación ilustrativa, columnas, vigas, losas y cerramientos. Cada elemento tendrá ID estable, tipo, planta, dimensiones, fase y metadatos. Actualizar el modelo al modificar parámetros. OrbitControls, zoom, selección, inspección, vistas isométrica/frontal/superior y restablecimiento de cámara. Separar estructuras y acabados para permitir visualizar estructura desnuda o edificio final. No afirmar que los tamaños representan diseño estructural reglamentario.

## 5. CONSTRUCCIÓN 4D

Timeline en seis fases: (1) cimentación; (2) columnas primer nivel; (3) vigas y losas iniciales; (4) estructura de pisos superiores; (5) cerramientos; (6) visualización terminada. Botones reproducir, pausar, reiniciar, paso anterior y siguiente; control de progreso que filtra inmediatamente elementos según fase. Mostrar fase actual y porcentaje temporal educativo. Debe respetar la geometría del proyecto, no utilizar videos prerenderizados como sustituto.

## 6. ARQUITECTURA E INTERIORES

Crear una vista arquitectónica visualmente más realista, independiente de la vista estructural, con volumen exterior, ventanas, marcos, balcones, cubierta y materiales. Cuatro acabados iniciales: moderno blanco/vidrio, ladrillo, hormigón visto y contemporáneo de lujo. Permitir abrir fachada frontal y aislar un piso. Catálogo procedural de objetos: cama, sofá, mesa, silla, muro/división, planta y lámpara; estilos natural, oscuro y color. Acciones reales: seleccionar objeto, indicar piso, agregarlo, editar posición X/Z, girarlo y eliminarlo. Persistir inventario, posiciones y acabados con el proyecto. Mantener consistencia con los planos. Señalar que son objetos conceptuales, no familias BIM profesionales.

Mejoras opcionales después de estabilizar el MVP: colocar objetos por arrastre en el canvas, ajustar a retícula, duplicar, detectar intersecciones, editar dimensiones de muros, puertas y ventanas, mostrar cotas interiores, bibliotecas GLTF optimizadas y materiales PBR. No atribuir estas mejoras a V4 si aún no están implementadas.

## 7. PLANOS DEL EDIFICIO

Módulo de planta por nivel generado de la **misma configuración geométrica** utilizada por Three.js: contorno, dimensiones en metros, retícula y columnas, mobiliario de ese piso y capas de visualización. Herramientas: selector de planta, zoom, selección y arrastre de muebles en SVG, sincronización con el editor de interiores y exportación SVG real. Incluir escala esquemática, leyenda y aviso visible «Plano conceptual — no apto para construcción ni licencias». Evitar inventar detalles reglamentarios, instalaciones o cálculos no modelados.

## 8. LABORATORIO SÍSMICO — NÚCLEO NUMÉRICO

Implementar un modelo lineal de edificio de cortante con **un grado de libertad de traslación lateral por planta**. Matrices M (masa), K (rigidez) y C (amortiguamiento) construidas a partir de supuestos transparentes. Resolver M u¨ + C u˙ + K u = − M r a_g(t) con integración Newmark-beta, beta=1/4, gamma=1/2 y paso dt=0,02 s en el MVP, verificando estabilidad y manejo de matrices singulares.

Entrada sísmica sintética reproducible: a_g(t) = A·9,81·sin(2π f t)·sin²(πt/T), para 0≤t≤T. Controles: aceleración A (g), frecuencia f (Hz), duración T (s), razón de amortiguamiento, rigidez relativa del edificio y amplificación visual de 1× a 80×. Nunca usar magnitud Richter/Mw como entrada directa de desplazamiento. Mostrar unidades en todos los controles.

El solver devuelve: series temporales de desplazamientos por planta, máximo desplazamiento lateral en m/mm, máxima diferencia de desplazamiento entre plantas en m/mm, deriva por planta y deriva normalizada según altura, pico de aceleración de base y número de pasos. Las gráficas deben usar **exactamente** estos datos; sin datos aleatorios ni porcentajes inventados. Separar deformación física calculada de amplificación visual. Animar cada planta con sus desplazamientos resultantes. Indicar que el modelo no considera torsión, respuesta no lineal, conexiones ni interacción suelo-estructura.

### 8A. Mapa de derivas en colores (mejora V4)

Interruptor real «Mapa de derivas en colores». Colorear elementos/plantas a partir de la deriva instantánea normalizada al máximo observado en el ensayo; barras por planta sincronizadas con el tiempo; identificar planta con máxima deriva del ensayo. Usar escala y leyenda relativa, p. ej. cian/ámbar/rosa, sin llamarla escala de daño o de seguridad. El mapa y la gráfica deben actualizarse al variar el tiempo y los parámetros.

### 8B. Explicación numérica (mejora V4)

Panel «Qué muestran los resultados» con valores y unidades, explicación de las hipótesis, de la influencia de la excitación, masa, rigidez y amortiguamiento; identificar el entrepiso con máxima deriva. Explicar claramente que una rigidez mayor no garantiza mejora global de seguridad. Diferenciar el indicador proxy de periodo de un entrepiso del periodo modal real del edificio. No inferir daños, capacidad resistente, seguridad, colapso ni cumplimiento de normas.

### 8C. Tres ensayos sintéticos preconfigurados (mejora V4)

- Pulso suave: amplitud 0,06 g, frecuencia 0,8 Hz, duración 10 s.
- Oscilación sostenida: amplitud 0,18 g, frecuencia 1,35 Hz, duración 12 s.
- Movimiento intenso: amplitud 0,36 g, frecuencia 2,4 Hz, duración 15 s.

Cada ensayo debe aplicar realmente sus parámetros y volver a calcular curva, barras, mapa y animación. Permitir comparar los tres con el mismo edificio y amortiguamiento. Rotularlos como sintéticos, nunca como grabaciones o reproducciones de terremotos reales. Ofrecer también una prueba exploratoria de frecuencia, p. ej. 0,12 g y frecuencia ajustable, advirtiendo que no se conoce a priori la frecuencia de resonancia del edificio.

### 8D. Escenario hipotético de falla

Permitir, si se mantiene, una animación manual didáctica de falla **separada del resultado del solver**, con etiqueta inequívoca «Animación hipotética; no predicción de colapso». El núcleo lineal no puede decidir «aguantó/se derrumbó» ni dar porcentaje de seguridad, probabilidad de colapso o grado de daño. Si se solicita predicción real: describir como fase futura investigación no lineal, propiedades materiales, demandas/capacidades, validación con ensayos y normas aplicables, nunca falsificarla en la versión actual.

## 9. COMPARACIÓN A/B

A = referencia y B = variante editable. Mostrar ambas geometrías y curvas temporales. Al correr el ensayo utilizar **la misma señal a_g(t), dt y duración** para A y B. Permitir modificar parámetros de B (p. ej. número de pisos, retícula, configuración y rigidez) y registrar diferencias exactas. Mostrar desplazamiento máximo, deriva, variación relativa con fórmula y tratamiento de denominador cero. No representar menor desplazamiento automáticamente como certificación de mayor seguridad. Opcional posterior: comparativa de mapa de derivas y modos de visualización lado a lado, con leyendas equivalentes.

## 10. COSTOS Y CANTIDADES

Cuantificar aproximaciones geométricas de concreto, acero, fachadas y formaleta, conforme a reglas de estimación expresadas en el código. Precios unitarios editables en COP con unidades explícitas; comparar A y B y calcular totales y diferencias. Las cantidades deben cambiar con geometría y precios. Mostrar «Estimaciones ilustrativas, no presupuesto profesional». No inventar rendimientos, certificaciones ni exactitud comercial.

## 11. PROYECTOS Y EXPORTACIÓN

Zustand + LocalStorage para guardar y abrir proyectos con nombre: modelo A/B, datos sísmicos, acabado, muebles y posiciones. Evitar pérdidas de estado al recargar. Permitir descargar reporte JSON válido: nombre, fecha, parámetros, unidades, supuestos, resultados A/B, series temporales, derivas máximas por piso, cantidades, precios y decoración. Exportar plano SVG independiente. No sugerir que se genera PDF si no está implementado. Manejar fallos de almacenamiento, entradas inválidas y estados vacíos.

## 12. MODO JURADO / DEMOSTRACIÓN GUIADA

Botón superior «Modo Jurado» que recorra exactamente siete estaciones funcionales con instrucciones contextuales y navegación real:
1. Modelar un edificio y aumentar pisos.
2. Recorrer construcción 4D.
3. Personalizar fachada y agregar mueble.
4. Ver y exportar plano del piso elegido.
5. Aplicar ensayo sísmico, activar mapa y revisar derivas.
6. Modificar B y comparar con excitación idéntica.
7. Evaluar cantidades/costos y exportar informe JSON.

Mostrar botones Anterior, Siguiente, Finalizar y Salir. Mantener claridad de las limitaciones de ingeniería. La narrativa debe ser «Diseñar → Construir → Simular → Comprender → Comparar».

## 13. EXPERIENCIA, ROBUSTEZ Y CALIDAD

- No botones ficticios; loading, mensajes de error, tooltips, estados vacíos y atajos de cámara.
- Buen rendimiento en navegador de escritorio moderno y comportamiento adaptable.
- Validar rangos (pisos 3–12, dimensiones positivas, amortiguamiento permitido, duración positiva, matrices no singulares, posiciones de objetos dentro de planta en el MVP).
- Separación de componentes de UI, cálculo, estado y exportación; TypeScript tipado; reproducibilidad determinista.
- Probar con casos sencillos las matrices y que simulaciones idénticas generen resultados idénticos.
- Evitar problemas de seguridad de dependencias: npm audit y actualizaciones controladas; nunca recomendar npm audit fix --force de forma indiscriminada.
- Cumplir preferencia prefers-reduced-motion y contraste visual.
- Mantener todas las funcionalidades anteriores al extender el código.

## 14. CRITERIOS DE ACEPTACIÓN — PRUEBAS DEMOSTRABLES

1. Cambiar pisos de 8 a 12 cambia geometría real y las plantas seleccionables.
2. Timeline muestra/oculta componentes según fase.
3. Cambiar acabado altera los materiales visibles de fachada.
4. Agregar un sofá al piso 2 aparece en 3D y en el plano 2; al moverlo en planta, cambia su posición guardada.
5. Exportación SVG genera archivo abrible.
6. Controles sísmicos producen resultados deterministas y gráficas derivadas del cálculo.
7. Reproducir sismo anima cada piso según el solver, con indicación de factor visual.
8. Mapa de derivas y barras responden al tiempo y a los parámetros; no muestran daño físico como hecho.
9. Aplicar cada ensayo modifica realmente los parámetros y resultados.
10. Comparación A/B usa señal idéntica en ambos modelos.
11. Costos editados modifican totales.
12. Guardar, recargar y abrir restaura modelo, acabado, muebles y parámetros.
13. Informe JSON incluye resultados y derivas por piso.
14. Modo Jurado navega módulos sin quedarse en pantallas estáticas.
15. La aplicación genera bundle de producción con `npm run build`, sin errores de TypeScript; el jurado accede a una URL publicada sin configurar ambiente local.
16. No se afirma que se predice colapso, daños ni seguridad real.

## 15. ORDEN DE IMPLEMENTACIÓN

Si hay que reconstruir: primero generador 3D; segundo fases 4D; tercero solver y conexión visual; cuarto comparación y costos; quinto persistencia; sexto arquitectura e interiores; séptimo planos; octavo intro y modo jurado; noveno mapa de derivas/escenarios/explicaciones; décimo pruebas, rendimiento y despliegue. Si partes de V4, prioriza corregir errores existentes y validar build antes de añadir extras.

## 16. ENTREGA OBLIGATORIA

Entregar un proyecto completo descargable con `package.json` en la carpeta raíz del proyecto, instrucciones Windows/VS Code, scripts `npm install`, `npm run dev`, `npm run build`, estructura de archivos, instrucciones de deploy estático, lista honesta de funciones probadas y de limitaciones. No afirmar compilación o funcionamiento en navegador si no se ejecutó la prueba. Evitar paquetes obsoletos y advertencias críticas cuando sea viable. Todo debe poder demostrarse: **CREAR → CONSTRUIR → DISEÑAR → AMUEBLAR → VER PLANOS → SIMULAR → ANALIZAR → COMPARAR → EXPORTAR**.

## 17. INNOVACIÓN FUTURA — NO PRESENTAR COMO IMPLEMENTADA

- Importación documentada de acelerogramas reales con historial y unidades.
- Barrido de frecuencia/respuesta espectral y comparación de sensibilidad.
- Exportación de reportes PDF con metodología trazable.
- Biblioteca BIM/IFC y modelos GLTF, puertas y ventanas editables.
- Ensayos de análisis no lineal con validación experimental y normativa aplicable, exclusivamente bajo supervisión especializada.
- Comparación económica de soluciones con supuestos verificables.

**Principio rector:** convincente como producto, reproducible como software y honesto como prototipo de ingeniería.


## 18. V5 — SUPERPOSICIÓN SIMULTÁNEA DE MOVIMIENTO Y COLOR

Requisito prioritario y obligatorio: el módulo Laboratorio Sísmico debe visualizar AL MISMO TIEMPO el movimiento lateral completo y el mapa de derivas por colores sobre el edificio. NO sustituir movimiento por calor ni utilizar animaciones separadas o desincronizadas. Usar el mismo `simFrame` del cálculo Newmark para desplazar cada nodo de piso, deformar columnas conectando los nodos inferior y superior, y calcular `|u_i(t)-u_{i-1}(t)|` por nivel. Pintar vigas, losas y columnas de cada nivel de acuerdo con la deriva instantánea normalizada con respecto al máximo del ensayo completo (escala consistente durante reproducción); cian: deriva menor, ámbar: intermedia, coral: mayor. Actualizar también las barras por piso, la etiqueta del nivel con mayor deriva instantánea, el desplazamiento de cubierta, el tiempo y las cifras en milímetros. Incluir leyenda persistente y botón para activar o desactivar solo la capa de color, sin detener el movimiento. Un control de amplificación visual ×1–×80 modifica exclusivamente la geometría renderizada; los resultados calculados permanecen iguales. Reproducir, pausar, reiniciar y arrastrar la línea de tiempo deben afectar conjuntamente color y movimiento. Validar que en el instante inicial la deriva sea cero y que al retroceder los colores y las posiciones vuelvan a valores anteriores. Los tonos visualizan respuesta elástica relativa y no niveles de daño, seguridad o predicción de colapso.


## 19. GLOSARIO EDUCATIVO INTERACTIVO — AÑADIDO FINAL

Integrar en el Laboratorio Sísmico un botón o icono de información contextual, con explicaciones breves y rigurosas para principiantes. Debe enseñar:

- **Oscilación:** movimiento de ida y vuelta alrededor de la posición de equilibrio; una oscilación completa corresponde a un ciclo.
- **Onda:** perturbación que se propaga transportando energía; distinguir ondas sísmicas del movimiento oscilatorio de un edificio.
- **Amplitud de aceleración de base (g):** valor máximo nominal de la aceleración sinusoidal antes de aplicar la envolvente; expresar también en m/s² usando 1 g = 9,81 m/s². Aclarar que la aceleración máxima efectiva de la señal con envolvente puede ser menor que A·9,81.
- **Frecuencia de excitación (Hz):** ciclos por segundo de la señal sintética aplicada al terreno; no confundir con frecuencias naturales del edificio. Mostrar período de excitación 1/f en segundos.
- **Excitación sísmica:** movimiento de base que entra al modelo por a_g(t), no fuerza arbitraria aplicada al techo. Distinguir señal sintética de acelerograma medido.
- **Duración (s):** intervalo de aplicación de la señal; no equivale automáticamente a tiempo de movimiento residual, porque la estructura puede seguir oscilando después de que termine la excitación. El solver debe simular la cola libre si se desea mostrarla y etiquetarla adecuadamente.
- **Razón de amortiguamiento (%):** fracción del amortiguamiento crítico usada en el modelo lineal, no porcentaje de energía que desaparece en cada ciclo; mostrar cómo afecta el decaimiento y la respuesta, sin afirmar que más amortiguamiento asegura supervivencia.
- **Rigidez relativa:** multiplicador de las rigideces idealizadas, sin pretender ser una propiedad resistente medida de la edificación real.
- **Deriva entre pisos:** diferencia u_i-u_(i-1) y deriva normalizada |u_i-u_(i-1)|/h_i; indicar que el mapa de color compara deformación, no daño físico ni probabilidad de colapso.

Ofrecer tooltips junto a cada control con unidad, rango y un ejemplo sencillo. Incorporar una leyenda fija para las dos animaciones sincronizadas: desplazamiento animado en el eje lateral y colores de deriva. En cada instante, el usuario debe poder leer amplitud, frecuencia, duración, amortiguamiento, rigidez, tiempo actual, desplazamiento de cubierta y máxima deriva instantánea.

## 20. PRUEBAS NUEVAS ESPECÍFICAS DE SINCRONIZACIÓN

1. En t=0, edificio en posición inicial y derivas instantáneas =0.
2. Al reproducir, tanto las posiciones de pisos como sus colores responden al MISMO índice temporal del solver.
3. Al pausar, se congelan posición, color, gráfica/cursor e indicadores.
4. Al arrastrar la barra temporal hacia atrás, tanto posiciones como colores reproducen valores pasados calculados; sin interpolaciones arbitrarias ni colores aleatorios.
5. Desactivar la capa de colores no desactiva la animación física.
6. Multiplicar por 80 la amplificación visual NO modifica desplazamientos numéricos, derivas ni informes.
7. Al cambiar intensidad, frecuencia, duración, amortiguamiento o rigidez, se recalcula todo y se reinicia/reconcilia el timeline de forma coherente.
8. Para mapas comparativos, conservar escala y leyenda fija por ensayo; no reescalar colores cuadro a cuadro, pues ocultaría cambios reales.
9. Las vigas, losas y columnas deben conectar sin huecos visuales a los nodos animados. Si se usa interpolación, debe conservar continuidad.
10. Verificar que `npm run build` pase y probar reproducción, pausa, exportaciones, persistencia y Modo Jurado desde la versión publicada.

## 21. INSTRUCCIONES DE EJECUCIÓN Y ENTREGA

Entregar **código fuente real, no pseudocódigo**, con `package.json` y scripts `dev`, `build` y `preview` en la raíz exacta de la carpeta ejecutable; incluir README paso a paso para Windows/PowerShell. Si el proyecto se entrega en ZIP, evitar carpetas anidadas ambiguas. Incluir capturas reales de la interfaz solo si fueron generadas de una ejecución verificada. No etiquetar funcionalidades como probadas sin haberlas ejecutado y observado. Publicar un despliegue estático para la evaluación del jurado, cuando el entorno permita hacerlo, sin prometer una URL no publicada.

**Cierre obligatorio del producto:** `CREAR → CONSTRUIR → DISEÑAR → AMUEBLAR → CONSULTAR PLANOS → SIMULAR CON MOVIMIENTO Y COLORES SIMULTÁNEOS → ENTENDER LOS RESULTADOS → COMPARAR A/B → EXPORTAR`.
