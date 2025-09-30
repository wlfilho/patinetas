# URL Structure Migration Guide

## Overview

This document describes the new SEO-optimized URL structure implemented for patinetaelectrica.com.co and provides testing and deployment instructions.

## New URL Structure

### 1. Categories Index Page
- **URL:** `https://patinetaelectrica.com.co/categorias`
- **Purpose:** Lists all available categories
- **Priority:** 0.7
- **Change Frequency:** Weekly

### 2. Individual Category Page (Canonical)
- **URL:** `https://patinetaelectrica.com.co/venta-patinetas-electricas`
- **Old URLs:** 
  - `/categorias/venta-patinetas-electricas` → 301 redirect to new URL
  - `/directorio/venta-patinetas-electricas` → 301 redirect to new URL
- **Purpose:** Display all businesses in a category
- **Priority:** 0.8
- **Change Frequency:** Weekly

### 3. Category + City Page
- **URL:** `https://patinetaelectrica.com.co/venta-patinetas-electricas/bogota`
- **Purpose:** Display all businesses in a specific category and city
- **Priority:** 0.7
- **Change Frequency:** Weekly

### 4. Business Detail Page
- **URL:** `https://patinetaelectrica.com.co/venta-patinetas-electricas/bogota/e-mobyl`
- **Purpose:** Individual business profile page
- **Priority:** 0.6
- **Change Frequency:** Weekly

## Implementation Details

### Files Created

1. **`src/app/[categoria]/page.tsx`**
   - Canonical category page at root level
   - Generates static params for all active categories
   - Includes proper SEO metadata and canonical tags

2. **`src/app/[categoria]/CategoryPageClient.tsx`**
   - Client component for category page
   - Includes filtering, sorting, and quick city links
   - Structured data for CollectionPage

3. **`src/app/[categoria]/[ciudad]/page.tsx`**
   - Category + city combination page
   - Breadcrumb structured data
   - Proper canonical tags

### Files Modified

1. **`middleware.ts`**
   - Added 301 redirects from `/categorias/:slug` to `/:slug`
   - Added 301 redirects from `/directorio/:slug` to `/:slug`
   - Updated matcher config to include new routes

2. **`src/components/ui/CategoryCard.tsx`**
   - Updated links from `/categorias/:slug` to `/:slug`

3. **`src/components/layout/Footer.tsx`**
   - Updated category links to use new short URLs

4. **`src/app/[categoria]/[cidade]/[negocio]/page.tsx`**
   - Updated breadcrumb navigation to use new URL structure
   - Updated category link to use short URL

5. **`src/app/sitemap.ts`**
   - Added category pages with new URL structure
   - Added category + city combination pages
   - Updated priorities and change frequencies

6. **`src/app/directorio/[slug-da-categoria]/page.tsx`**
   - Updated canonical tag to point to new short URL

## SEO Benefits

### 1. Shorter URLs
- **Before:** `/categorias/venta-patinetas-electricas`
- **After:** `/venta-patinetas-electricas`
- **Benefit:** Better CTR, easier to remember, more user-friendly

### 2. Semantic Clarity
- Categories at domain root signal to Google they are content pillars
- Clear hierarchy: Category → City → Business

### 3. Local SEO Optimization
- Hierarchical model captures search intent like "venta de patinetas Bogotá"
- Dedicated pages for each category-city combination

### 4. Canonical URLs
- Prevents duplicate content issues
- All old URLs redirect to canonical versions

### 5. Improved Sitemap
- All URL levels included with proper priorities
- Better crawl budget allocation

## Testing Checklist

### 1. Redirects Testing

Test that old URLs redirect correctly:

```bash
# Test category redirects
curl -I https://patinetaelectrica.com.co/categorias/venta-patinetas-electricas
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://patinetaelectrica.com.co/venta-patinetas-electricas

curl -I https://patinetaelectrica.com.co/directorio/venta-patinetas-electricas
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://patinetaelectrica.com.co/venta-patinetas-electricas
```

### 2. New URLs Testing

Verify new URLs work correctly:

```bash
# Category page
https://patinetaelectrica.com.co/venta-patinetas-electricas

# Category + City page
https://patinetaelectrica.com.co/venta-patinetas-electricas/bogota

# Business detail page
https://patinetaelectrica.com.co/venta-patinetas-electricas/bogota/e-mobyl
```

### 3. Canonical Tags

Check that canonical tags point to correct URLs:

```bash
# Old URL should have canonical pointing to new URL
curl https://patinetaelectrica.com.co/directorio/venta-patinetas-electricas | grep canonical
# Should contain: <link rel="canonical" href="https://patinetaelectrica.com.co/venta-patinetas-electricas">

# New URL should have canonical pointing to itself
curl https://patinetaelectrica.com.co/venta-patinetas-electricas | grep canonical
# Should contain: <link rel="canonical" href="https://patinetaelectrica.com.co/venta-patinetas-electricas">
```

### 4. Sitemap Validation

```bash
# Check sitemap includes new URLs
curl https://patinetaelectrica.com.co/sitemap.xml | grep -E "(venta-patinetas-electricas|reparacion-mantenimiento)"
```

### 5. Structured Data

Use Google's Rich Results Test:
- https://search.google.com/test/rich-results
- Test category pages for CollectionPage schema
- Test business pages for LocalBusiness schema
- Test breadcrumb structured data

### 6. Internal Links

Verify all internal links use new URL structure:
- Check footer links
- Check category cards
- Check business detail page links
- Check breadcrumb navigation

## Deployment Steps

### 1. Pre-Deployment

```bash
# Run local tests
npm run dev

# Test redirects locally
curl -I http://localhost:3000/categorias/venta-patinetas-electricas

# Verify sitemap generation
curl http://localhost:3000/sitemap.xml
```

### 2. Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### 3. Post-Deployment Verification

1. **Test Redirects:**
   - Visit old URLs and verify 301 redirects
   - Check redirect chain is only one hop

2. **Test New URLs:**
   - Visit all new URL patterns
   - Verify pages load correctly
   - Check no 404 errors

3. **Verify SEO Elements:**
   - Check canonical tags
   - Verify structured data
   - Test breadcrumb navigation

4. **Submit to Google:**
   ```bash
   # Submit new sitemap to Google Search Console
   https://search.google.com/search-console
   ```

### 4. Monitor

- Check Google Search Console for crawl errors
- Monitor 404 errors in analytics
- Track organic traffic changes
- Monitor page load times

## Rollback Plan

If issues are detected:

1. **Immediate Rollback:**
   ```bash
   # Revert to previous deployment
   vercel rollback
   ```

2. **Partial Rollback:**
   - Comment out redirect rules in `middleware.ts`
   - Keep new pages but disable redirects
   - Investigate and fix issues

## Expected Impact

### Positive Impacts

1. **SEO:**
   - Better URL structure for search engines
   - Improved local SEO with category-city pages
   - Cleaner canonical structure

2. **User Experience:**
   - Shorter, more memorable URLs
   - Better breadcrumb navigation
   - Improved site hierarchy

3. **Performance:**
   - Better crawl budget allocation
   - Improved indexation

### Potential Issues

1. **Temporary Ranking Fluctuations:**
   - Normal during URL structure changes
   - Should stabilize within 2-4 weeks

2. **Redirect Chains:**
   - Monitor for any unintended redirect chains
   - Verify all redirects are single-hop

## Support and Maintenance

### Regular Checks

- Weekly: Check Google Search Console for errors
- Monthly: Review organic traffic trends
- Quarterly: Audit internal links

### Documentation

- Keep this guide updated with any changes
- Document any issues and resolutions
- Track SEO performance metrics

## Contact

For questions or issues related to this migration:
- Check GitHub issues
- Review deployment logs in Vercel
- Consult Google Search Console data

