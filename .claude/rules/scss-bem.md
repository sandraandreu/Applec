---
paths:
  - "src/**/*.scss"
---

# SCSS — BEM y consolidación de estilos

## Nomenclatura BEM obligatoria

Todas las clases siguen BEM sin excepciones:
```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

## Un archivo SCSS por carpeta funcional

Cada carpeta tiene un único archivo SCSS con el mismo nombre que la carpeta:
- `member-card/member-card.scss` ✓
- `member-card/card.scss` ✗
- `member-card/avatar.scss` + `member-card/name.scss` ✗

No atomizar estilos por micro-componente. Si la carpeta tiene varios componentes relacionados, todos sus estilos van en el único archivo de la carpeta.
