# CSS Optimization Testing Guide

## Quick Start Testing

### 1. Build Production Version

```bash
# Clean previous builds
rm -rf .next

# Build with optimizations (production mode)
npm run build

# Start production server
npm start
```

**Note**: The `inlineCss` optimization **only works in production builds**, not in development mode.

### 2. Verify CSS Inlining

#### Method 1: View Page Source
1. Open http://localhost:3000 in your browser
2. Right-click → "View Page Source" (or Ctrl+U / Cmd+U)
3. Look for `<style>` tags in the `<head>` section
4. Verify CSS is inlined (not loaded via `<link>` tags)

**Expected Result**:
```html
<head>
  <!-- CSS should be inlined in style tags -->
  <style data-next-inline-css>
    /* Tailwind utilities and custom CSS here */
  </style>
  
  <!-- Font files still use link tags (this is correct) -->
  <link rel="preload" href="/_next/static/media/..." as="font" />
</head>
```

**What NOT to see**:
```html
<!-- These should NOT be present -->
<link rel="stylesheet" href="/_next/static/chunks/2473c16c0c2f6b5f.css" />
<link rel="stylesheet" href="/_next/static/chunks/a9621e396411a1d1.css" />
```

#### Method 2: Chrome DevTools Network Tab
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Reload the page (Ctrl+R / Cmd+R)
5. Filter by "CSS" in the network tab
6. Verify: **No CSS file requests** (only HTML, JS, images, fonts)

**Expected Result**:
- ✅ No `.css` files in network requests
- ✅ Only HTML document, JavaScript bundles, images, and fonts

### 3. Performance Testing

#### Using Chrome DevTools Lighthouse

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select:
   - ✅ Performance
   - ✅ Desktop or Mobile
   - ✅ Clear storage
4. Click "Analyze page load"

**Metrics to Check**:
- **First Contentful Paint (FCP)**: Should improve by 100-200ms
- **Largest Contentful Paint (LCP)**: Should improve by 150ms+
- **Total Blocking Time (TBT)**: Should remain similar or improve
- **Cumulative Layout Shift (CLS)**: Should remain the same

#### Using WebPageTest

1. Go to https://www.webpagetest.org/
2. Enter: `http://localhost:3000` (or your production URL)
3. Select test location and browser
4. Click "Start Test"

**Compare Before/After**:
- Start Render time
- First Contentful Paint
- Largest Contentful Paint
- Number of requests (should be 2 fewer)

### 4. Visual Regression Testing

Test all major page types to ensure no visual changes:

#### Homepage
```bash
# Open homepage
open http://localhost:3000
```
- ✅ Hero section displays correctly
- ✅ Featured businesses load
- ✅ Colors and styling intact

#### Business Listing Pages
```bash
# Test category pages
open http://localhost:3000/tiendas
open http://localhost:3000/servicio-tecnico
```
- ✅ Business cards display correctly
- ✅ Filters work
- ✅ Images load properly

#### Business Detail Pages
```bash
# Test individual business pages
open http://localhost:3000/tiendas/bogota/[business-slug]
```
- ✅ Business information displays
- ✅ Contact buttons work
- ✅ Social media links visible

#### Department Pages with Maps
```bash
# Test map functionality
open http://localhost:3000/departamentos/cundinamarca
```
- ✅ Map loads correctly
- ✅ Markers display
- ✅ Map interactions work
- ✅ Custom marker styles applied

#### Catalog Pages
```bash
# Test catalog
open http://localhost:3000/catalogo
open http://localhost:3000/marcas
```
- ✅ Product listings display
- ✅ Brand pages work
- ✅ Navigation functions

### 5. Cross-Browser Testing

Test in multiple browsers:

- ✅ **Chrome** (latest)
- ✅ **Firefox** (latest)
- ✅ **Safari** (latest)
- ✅ **Edge** (latest)
- ✅ **Mobile Safari** (iOS)
- ✅ **Chrome Mobile** (Android)

### 6. Mobile Testing

Test on actual devices or using Chrome DevTools:

1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M / Cmd+Shift+M)
3. Select different devices:
   - iPhone 12/13/14
   - Samsung Galaxy S20/S21
   - iPad
4. Test all major pages

**Check**:
- ✅ Responsive design works
- ✅ Touch interactions function
- ✅ Performance is good on mobile

## Automated Testing

### Performance Budget Test

Create a simple script to verify performance:

```javascript
// test-performance.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port
  };
  
  const runnerResult = await lighthouse('http://localhost:3000', options);
  
  const { lcp, fcp } = runnerResult.lhr.audits;
  
  console.log('Performance Metrics:');
  console.log('FCP:', fcp.displayValue);
  console.log('LCP:', lcp.displayValue);
  
  await chrome.kill();
}

runLighthouse();
```

### Visual Regression Test

Use tools like:
- **Percy**: https://percy.io/
- **Chromatic**: https://www.chromatic.com/
- **BackstopJS**: https://github.com/garris/BackstopJS

## Production Deployment Testing

### Pre-Deployment Checklist

- [ ] Production build completes successfully
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] All pages render correctly
- [ ] Performance metrics improved
- [ ] Visual regression tests pass
- [ ] Cross-browser testing complete

### Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or use Vercel CLI
npm run build
vercel deploy --prod
```

### Post-Deployment Verification

1. **Test Production URL**:
   ```bash
   # Replace with your actual URL
   open https://patinetaelectrica.com.co
   ```

2. **Run Lighthouse on Production**:
   ```bash
   lighthouse https://patinetaelectrica.com.co --view
   ```

3. **Check Real User Monitoring**:
   - Google Search Console → Core Web Vitals
   - Vercel Analytics → Web Vitals
   - Monitor for 24-48 hours

4. **Verify in Multiple Locations**:
   - Use WebPageTest with different locations
   - Test from different countries/regions

## Troubleshooting

### Issue: CSS Not Inlined

**Symptoms**:
- Still seeing `<link rel="stylesheet">` tags
- CSS files in network requests

**Solutions**:
1. Verify you're running production build: `npm run build && npm start`
2. Check `next.config.ts` has `experimental.inlineCss: true`
3. Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
4. Verify Next.js version supports this feature (15.5.3+)

### Issue: Styles Not Applied

**Symptoms**:
- Page looks unstyled
- Missing colors or layouts

**Solutions**:
1. Check browser console for errors
2. Verify all CSS imports are correct
3. Check if Tailwind CSS is compiling correctly
4. Inspect `<style>` tags in page source

### Issue: Performance Worse

**Symptoms**:
- LCP/FCP metrics worse than before
- Slower page loads

**Solutions**:
1. Check HTML size (should not be significantly larger)
2. Verify no JavaScript errors blocking render
3. Test on different network conditions
4. Consider if CSS bundle is too large (>50KB)

### Issue: Visual Differences

**Symptoms**:
- Styles look different
- Layout shifts
- Missing styles

**Solutions**:
1. Check CSS import order
2. Verify all CSS files are included
3. Check for CSS specificity issues
4. Test in different browsers

## Rollback Procedure

If critical issues occur:

1. **Quick Rollback**:
   ```bash
   # Edit next.config.ts - remove experimental section
   # Rebuild and redeploy
   npm run build
   vercel --prod
   ```

2. **Git Rollback**:
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Vercel Rollback**:
   - Go to Vercel Dashboard
   - Select deployment
   - Click "Rollback to this deployment"

## Success Criteria

The optimization is successful if:

- ✅ No CSS file requests in network tab
- ✅ CSS is inlined in `<style>` tags
- ✅ LCP improves by 150ms or more
- ✅ FCP improves by 100ms or more
- ✅ No visual regressions
- ✅ All functionality works correctly
- ✅ Performance improvements visible in production

## Next Steps

After successful testing:

1. Monitor Core Web Vitals for 1 week
2. Collect user feedback
3. Document any issues or improvements
4. Consider additional optimizations:
   - Image optimization
   - JavaScript code splitting
   - Preloading critical resources
   - Service Worker for caching

---

**Testing Status**: Ready for testing
**Estimated Testing Time**: 30-60 minutes
**Risk Level**: Low (easy rollback available)

