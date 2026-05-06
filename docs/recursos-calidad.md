# Recursos de calidad — Falles App

Herramientas y referencias para mantener los estándares de accesibilidad, performance y buenas prácticas. Identificados durante la auditoría del 21/04/2026.

---

## Accesibilidad

### The A11y Project · Checklist
**https://www.a11yproject.com/checklist/**

Lista de verificación de accesibilidad corta y práctica. Cada punto es una acción concreta: «¿tiene este botón un aria-label?», «¿hay suficiente contraste?». No es un documento teórico — es algo que puedes repasar antes de entregar una pantalla o hacer un PR con cambios visuales.

---

### WebAIM Contrast Checker
**https://webaim.org/resources/contrastchecker/**

Introduces dos colores (texto y fondo) y te dice si el contraste cumple WCAG AA o no, con el ratio exacto. Hay que usarlo antes de dar por buena cualquier combinación de colores nueva.

- Texto normal → mínimo **4.5:1**
- Texto grande o negrita (≥18px o ≥14px bold) → mínimo **3:1**

Pendiente: resolver el contraste del botón secundario (`#0068ff` sobre `#cce1ff` da 3.56:1, no cumple).

---

### axe DevTools
**Extensión de Chrome** — buscar «axe DevTools» en la Chrome Web Store

Analiza la página que tienes abierta y lista automáticamente todos los problemas de accesibilidad que encuentra: botones sin aria-label, inputs sin label, contraste insuficiente, landmarks que faltan, etc. Detecta automáticamente el 40-60% de los problemas de accesibilidad. Hay que pasarlo antes de mergear cualquier cambio visual.

---

### WCAG 2.2
**https://www.w3.org/TR/WCAG22/**

El estándar oficial de accesibilidad web del W3C. Define todos los criterios con niveles A, AA y AAA. No es para leerlo entero — es para consultar cuando tienes una duda específica del tipo «¿qué nivel de contraste necesito exactamente para texto grande?» o «¿qué requisitos tiene un modal accesible?».

---

### MDN · `<html lang>`
**https://developer.mozilla.org/docs/Web/HTML/Element/html**

Documentación del atributo `lang` del elemento `<html>`. La sección «Accessibility concerns» explica por qué importa para los lectores de pantalla y el SEO. Relevante porque la app es bilingüe (es/ca) y el atributo se actualiza dinámicamente al cambiar el idioma.

---

### React Router · Navigating y Links
**https://reactrouter.com**

Documentación oficial sobre navegación en React Router. Las secciones «Navigating» y «Links» explican cuándo usar `<Link>`, `<NavLink>` o `useNavigate`. Relevante porque todos los `<a href>` internos de la app deben ser `<Link>` para evitar recargas completas de React.

---

## Performance

### web.dev · Learn Performance
**https://web.dev/learn/performance/**

Curso gratuito de Google sobre performance web con vídeos cortos y ejemplos prácticos. Cubre carga de imágenes, fuentes, JavaScript y caché. Relevante para entender el CLS de las fuentes y optimizar los assets de la app.

---

### web.dev · Core Web Vitals
**https://web.dev/explore/learn-core-web-vitals**

Explica en detalle las tres métricas que Google usa para rankear:
- **LCP** (Largest Contentful Paint) — velocidad de carga del elemento principal. Actualmente 345ms, excelente.
- **CLS** (Cumulative Layout Shift) — estabilidad del layout. Actualmente 0.15, necesita mejorar (umbral bueno < 0.10). Causado por la carga de fuentes externas.
- **INP** (Interaction to Next Paint) — respuesta a interacciones del usuario.

---

## Principio de orden para resolver problemas de calidad

Cuando algo no funciona o hay que mejorar la app, seguir siempre este orden:

1. **Compilar** — si el build falla, nada más importa. Sin compilación no hay app.
2. **Renderizar** — si la app no se ve, no se puede medir. Primero que funcione.
3. **Medir** — una vez funciona y se ve, usar Lighthouse y las herramientas para saber qué mejorar.
4. **Optimizar** — solo después de medir. Si optimizas sin medir, no sabes si estás mejorando algo.

No saltes pasos. No optimices lo que no puedes medir; no midas lo que no puedes ver renderizar; no renderices lo que no puedes compilar.

---

## Checklist antes de un PR con cambios visuales

1. Pasar **axe DevTools** sobre las pantallas modificadas
2. Verificar contraste de colores nuevos en **WebAIM Contrast Checker**
3. Comprobar que todos los textos visibles pasan por `t()` en ambos idiomas
4. Verificar que los botones-icono tienen `aria-label` y los SVGs tienen `aria-hidden="true"`
5. Confirmar que la navegación interna usa `<Link>` y no `<a href>`
