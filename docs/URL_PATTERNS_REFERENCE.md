# URL Patterns Reference - Patinetas Eléctricas Colombia

## Quick Reference

This document provides a quick reference for all URL patterns used in the patinetaelectrica.com.co website.

## Directory Structure URLs

### Categories

| Pattern | Example | Description | Priority |
|---------|---------|-------------|----------|
| `/categorias` | `/categorias` | All categories index | 0.7 |
| `/:categoria` | `/venta-patinetas-electricas` | Individual category (canonical) | 0.8 |
| `/:categoria/:ciudad` | `/venta-patinetas-electricas/bogota` | Category filtered by city | 0.7 |
| `/:categoria/:ciudad/:negocio` | `/venta-patinetas-electricas/bogota/e-mobyl` | Business detail page | 0.6 |

### Legacy URLs (301 Redirects)

| Old URL | New URL | Status |
|---------|---------|--------|
| `/categorias/:slug` | `/:slug` | 301 Permanent Redirect |
| `/directorio/:slug` | `/:slug` | 301 Permanent Redirect |
| `/negocio/:ciudad/:negocio` | `/:categoria/:ciudad/:negocio` | 308 Permanent Redirect |

### Other Directory URLs

| Pattern | Example | Description |
|---------|---------|-------------|
| `/directorio` | `/directorio` | Full business directory |
| `/directorio/p/:page` | `/directorio/p/2` | Paginated directory |
| `/buscar` | `/buscar` | Search page |

## Catalog URLs

### Brands and Models

| Pattern | Example | Description |
|---------|---------|-------------|
| `/catalogo` | `/catalogo` | All models catalog |
| `/marcas` | `/marcas` | All brands directory |
| `/catalogo/marcas/:brand` | `/catalogo/marcas/xiaomi` | Brand page |
| `/catalogo/marcas/:brand/:model` | `/catalogo/marcas/xiaomi/mi-electric-scooter-pro-2` | Model detail page |

## Static Pages

| URL | Description |
|-----|-------------|
| `/` | Home page |
| `/contacto` | Contact page |
| `/guia` | User guide |
| `/terminos` | Terms of service |
| `/privacidad` | Privacy policy |

## URL Slug Mappings

### Category Slugs

| Category Name | Slug |
|---------------|------|
| Venta de Patinetas Eléctricas | `venta-patinetas-electricas` |
| Reparación y Mantenimiento | `reparacion-mantenimiento` |
| Repuestos y Accesorios | `repuestos-accesorios` |
| Alquiler de Patinetas | `alquiler-patinetas` |
| Servicio Técnico | `servicio-tecnico` |
| Capacitación y Cursos | `capacitacion-cursos` |
| Seguros y Garantías | `seguros-garantias` |
| Financiamiento | `financiamiento` |
| Importación y Distribución | `importacion-distribucion` |
| Personalización y Modificación | `personalizacion-modificacion` |

### City Slugs (Major Cities)

| City Name | Slug |
|-----------|------|
| Bogotá | `bogota` |
| Medellín | `medellin` |
| Cali | `cali` |
| Barranquilla | `barranquilla` |
| Cartagena | `cartagena` |
| Cúcuta | `cucuta` |
| Bucaramanga | `bucaramanga` |
| Pereira | `pereira` |
| Santa Marta | `santa-marta` |
| Ibagué | `ibague` |

## URL Generation Rules

### Slug Generation

All slugs follow these rules:
1. Convert to lowercase
2. Normalize Spanish characters (remove accents)
3. Replace spaces with hyphens
4. Remove special characters
5. Replace multiple consecutive hyphens with single hyphen
6. Remove leading and trailing hyphens

**Example:**
```
"Venta de Patinetas Eléctricas" → "venta-patinetas-electricas"
"Bogotá" → "bogota"
"Reparación y Mantenimiento" → "reparacion-mantenimiento"
```

### Business Slug Generation

Business slugs are generated from the business name and must be unique within a city:
```
Business: "E-Mobyl"
City: "Bogotá"
Slug: "e-mobyl"
Full URL: /venta-patinetas-electricas/bogota/e-mobyl
```

## Breadcrumb Navigation

### Pattern

```
Home → Category → City → Business
```

### Examples

**Category Page:**
```
Home → Venta Patinetas Eléctricas
```

**Category + City Page:**
```
Home → Venta Patinetas Eléctricas → Bogotá
```

**Business Detail Page:**
```
Home → Venta Patinetas Eléctricas → Bogotá → E-Mobyl
```

## Canonical URLs

### Rules

1. **Category pages:** Always point to short form `/:categoria`
2. **Old URLs:** Canonical points to new URL structure
3. **Business pages:** Canonical is the current URL

### Examples

| Current URL | Canonical URL |
|-------------|---------------|
| `/categorias/venta-patinetas-electricas` | `/venta-patinetas-electricas` |
| `/directorio/venta-patinetas-electricas` | `/venta-patinetas-electricas` |
| `/venta-patinetas-electricas` | `/venta-patinetas-electricas` |
| `/venta-patinetas-electricas/bogota` | `/venta-patinetas-electricas/bogota` |

## Sitemap Structure

### Priority Levels

| URL Type | Priority | Change Frequency |
|----------|----------|------------------|
| Home | 1.0 | Daily |
| Directory | 0.9 | Daily |
| Categories Index | 0.7 | Weekly |
| Individual Category | 0.8 | Weekly |
| Category + City | 0.7 | Weekly |
| Business Detail | 0.6 | Weekly |
| Catalog | 0.8 | Weekly |
| Static Pages | 0.5 | Monthly |

## API Endpoints

### Public APIs

| Endpoint | Description |
|----------|-------------|
| `/api/brands/:slug` | Get brand information |
| `/api/models/:brand/:model` | Get model information |

### Internal APIs

| Endpoint | Description |
|----------|-------------|
| `/api/debug/businesses` | Debug business data |

## Structured Data

### Schema Types by Page

| Page Type | Schema.org Type |
|-----------|-----------------|
| Home | WebSite, Organization |
| Category | CollectionPage, ItemList |
| Category + City | CollectionPage, ItemList, BreadcrumbList |
| Business Detail | LocalBusiness, BreadcrumbList |
| Catalog | ItemList |
| Brand | Brand, ItemList |
| Model | Product |

## URL Validation

### Valid Slug Pattern

```regex
^[a-z0-9]+(-[a-z0-9]+)*$
```

**Valid examples:**
- `venta-patinetas-electricas`
- `bogota`
- `e-mobyl`

**Invalid examples:**
- `Venta-Patinetas` (uppercase)
- `venta--patinetas` (double hyphen)
- `-venta-patinetas` (leading hyphen)
- `venta-patinetas-` (trailing hyphen)
- `venta_patinetas` (underscore)

## Testing URLs

### Local Development

```bash
# Category page
http://localhost:3000/venta-patinetas-electricas

# Category + City
http://localhost:3000/venta-patinetas-electricas/bogota

# Business detail
http://localhost:3000/venta-patinetas-electricas/bogota/e-mobyl

# Test redirect
http://localhost:3000/categorias/venta-patinetas-electricas
```

### Production

```bash
# Category page
https://patinetaelectrica.com.co/venta-patinetas-electricas

# Category + City
https://patinetaelectrica.com.co/venta-patinetas-electricas/bogota

# Business detail
https://patinetaelectrica.com.co/venta-patinetas-electricas/bogota/e-mobyl
```

## Common Issues and Solutions

### Issue: 404 on Category Page

**Cause:** Category slug not in database or incorrect slug format

**Solution:**
1. Check category exists in `categorias_patinetas` table
2. Verify slug field is populated
3. Run slug generation script if needed

### Issue: Redirect Loop

**Cause:** Middleware redirect configuration conflict

**Solution:**
1. Check middleware.ts for conflicting rules
2. Verify matcher config includes correct paths
3. Clear browser cache and test

### Issue: Canonical Tag Incorrect

**Cause:** Old canonical URL in metadata

**Solution:**
1. Check page metadata generation
2. Verify baseUrl is correct
3. Update canonical tag to use new URL structure

## Quick Commands

```bash
# Generate category slugs
npm run generate-slugs

# Build and test
npm run build
npm run start

# Deploy to production
vercel --prod

# Check sitemap
curl https://patinetaelectrica.com.co/sitemap.xml

# Test redirect
curl -I https://patinetaelectrica.com.co/categorias/venta-patinetas-electricas
```

