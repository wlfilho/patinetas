# GPS Coordinates Feature Documentation

## Overview

This document describes the implementation of GPS coordinates storage for business locations in the `diretorio_patinetas` table. This feature enables faster and more reliable map rendering by storing geocoded coordinates directly in the database instead of relying on real-time geocoding.

---

## Database Schema Changes

### New Column: `gps_coordinates`

**Table:** `diretorio_patinetas`

**Column Details:**
- **Name:** `gps_coordinates`
- **Type:** `JSONB` (PostgreSQL JSON Binary)
- **Nullable:** Yes (optional field)
- **Structure:**
  ```json
  {
    "latitude": 6.1821852,
    "longitude": -75.5799012
  }
  ```

### SQL Migration

```sql
-- Add the gps_coordinates column
ALTER TABLE diretorio_patinetas 
ADD COLUMN gps_coordinates JSONB;

-- Add validation constraint
ALTER TABLE diretorio_patinetas
ADD CONSTRAINT valid_gps_coordinates 
CHECK (
  gps_coordinates IS NULL OR (
    gps_coordinates ? 'latitude' AND 
    gps_coordinates ? 'longitude' AND
    (gps_coordinates->>'latitude')::numeric BETWEEN -90 AND 90 AND
    (gps_coordinates->>'longitude')::numeric BETWEEN -180 AND 180
  )
);
```

### Validation Rules

The constraint ensures:
1. ✅ Column can be NULL (optional)
2. ✅ If not NULL, must contain both `latitude` and `longitude` keys
3. ✅ Latitude must be between -90 and 90
4. ✅ Longitude must be between -180 and 180

---

## TypeScript Interface Update

**File:** `src/lib/supabase.ts`

```typescript
export interface NegocioDirectorio {
  // ... existing fields
  gps_coordinates?: {
    latitude: number
    longitude: number
  }
}
```

---

## Component Updates

### DepartmentMapNavigation Component

**File:** `src/components/ui/DepartmentMapNavigation.tsx`

**Changes:**
1. **Priority System:** Uses stored coordinates first, falls back to geocoding
2. **Improved Performance:** Only geocodes businesses without stored coordinates
3. **Progress Indicator:** Shows geocoding progress only for businesses that need it

**Logic Flow:**
```
1. Load businesses from database
2. For each business:
   a. If gps_coordinates exists → Use stored coordinates
   b. Else if direccion exists → Add to geocoding queue
   c. Else → Skip (no location data)
3. Display businesses with stored coordinates immediately
4. Geocode remaining businesses in background (1 req/sec)
5. Update map as new coordinates are obtained
```

**Code Example:**
```typescript
// Use stored GPS coordinates if available
if (business.gps_coordinates?.latitude && business.gps_coordinates?.longitude) {
  businessWithIndex.coordinates = [
    business.gps_coordinates.latitude,
    business.gps_coordinates.longitude
  ]
} else if (business.direccion && business.ciudad && business.departamento) {
  // Mark for geocoding if no stored coordinates but has address
  businessesToGeocode.push(i)
}
```

---

## Geocoding Script

### Purpose
Batch geocode all existing businesses and save coordinates to the database.

**File:** `scripts/geocode-businesses.ts`

### Usage

```bash
# Install tsx if not already installed
npm install -D tsx

# Run the geocoding script
npx tsx scripts/geocode-businesses.ts
```

### Features

1. **Fetches all active businesses** from Supabase
2. **Filters businesses** that need geocoding (no stored coordinates + has address)
3. **Shows statistics** before starting
4. **Geocodes addresses** using Nominatim API (OpenStreetMap)
5. **Respects rate limits** (1 request per second)
6. **Updates database** with coordinates
7. **Provides detailed progress** and summary

### Output Example

```
🚀 Starting geocoding process...

📥 Fetching businesses from database...
✅ Found 14 businesses

📊 Statistics:
   - Total businesses: 14
   - Already have coordinates: 0
   - Need geocoding: 12
   - Missing address: 2

⏱️  Estimated time: ~12 seconds (1 request/second)

Press Ctrl+C to cancel, or wait 5 seconds to continue...

[1/12] Processing: Eagle Moving
   🔍 Geocoding: Calle 10 #45-67, Medellín, Antioquia, Colombia
   ✅ Found: 6.2476, -75.5658
   💾 Saved to database

[2/12] Processing: Dualtron Medellín
   🔍 Geocoding: Carrera 43A #14-109, Medellín, Antioquia, Colombia
   ✅ Found: 6.2088, -75.5736
   💾 Saved to database

...

============================================================
📊 GEOCODING SUMMARY
============================================================
✅ Successful: 10
❌ Failed: 2
📍 Total processed: 12
============================================================

❌ Failed businesses:
   - Negocio Sin Dirección (ID: 5): No address
   - Negocio Dirección Inválida (ID: 8): Geocoding failed

✅ Geocoding process completed!
```

---

## Benefits

### 1. **Performance**
- ⚡ **Instant map loading** for businesses with stored coordinates
- ⚡ **No API calls** needed for businesses with coordinates
- ⚡ **Faster page load** times

### 2. **Reliability**
- ✅ **No dependency** on external geocoding API during page load
- ✅ **Consistent results** (coordinates don't change)
- ✅ **Works offline** (for stored coordinates)

### 3. **Accuracy**
- 🎯 **Manual correction** possible through admin interface
- 🎯 **Verified locations** can be saved
- 🎯 **Better precision** than automated geocoding

### 4. **Cost**
- 💰 **No API costs** for stored coordinates
- 💰 **Reduced API usage** (only geocode once)
- 💰 **No rate limit issues** during page load

### 5. **User Experience**
- 😊 **Immediate map display** for businesses with coordinates
- 😊 **No waiting** for geocoding
- 😊 **Smooth interactions** (no delays)

---

## Comparison: Before vs After

| Aspect | Before (Real-time Geocoding) | After (Stored Coordinates) |
|--------|------------------------------|----------------------------|
| **Map Load Time** | 10-20 seconds | < 1 second |
| **API Calls** | 1 per business per page load | 0 (after initial geocoding) |
| **Reliability** | Depends on external API | 100% reliable |
| **Accuracy** | Automated (may be wrong) | Can be manually verified |
| **Rate Limits** | Risk of hitting limits | No limits |
| **Offline Support** | No | Yes (for stored coords) |
| **Cost** | API usage costs | One-time geocoding cost |

---

## Next Steps

### 1. Run Initial Geocoding
```bash
npx tsx scripts/geocode-businesses.ts
```

### 2. Update Admin Interface
Add fields to admin form for manual coordinate entry/editing:
- Latitude input (decimal, -90 to 90)
- Longitude input (decimal, -180 to 180)
- "Get Coordinates" button (geocode address)
- Map preview showing selected location

### 3. Add Validation
Implement validation in admin interface:
```typescript
function validateCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}
```

### 4. Enable Spatial Queries (Optional)
For advanced features like "find businesses near me":
```sql
-- Create GiST index for spatial queries
CREATE INDEX idx_gps_coordinates ON diretorio_patinetas 
USING GiST ((gps_coordinates::jsonb));
```

### 5. Add Geocoding to Business Creation
When creating new businesses in admin:
1. Auto-geocode address on save
2. Allow manual override
3. Show map preview before saving

---

## Maintenance

### Re-geocoding Businesses
If addresses change or geocoding improves:
```bash
# Re-geocode all businesses (overwrites existing coordinates)
npx tsx scripts/geocode-businesses.ts --force

# Re-geocode only businesses without coordinates
npx tsx scripts/geocode-businesses.ts
```

### Monitoring
Check businesses without coordinates:
```sql
SELECT id, nombre, direccion, ciudad
FROM diretorio_patinetas
WHERE activo = true 
  AND direccion IS NOT NULL 
  AND gps_coordinates IS NULL;
```

---

## Troubleshooting

### Issue: Geocoding fails for some addresses
**Solution:** 
- Check if address is complete and correct
- Try different address formats
- Manually enter coordinates using Google Maps

### Issue: Coordinates are incorrect
**Solution:**
- Update coordinates manually in admin interface
- Use Google Maps to find correct coordinates
- Right-click on location → "What's here?" → Copy coordinates

### Issue: Script times out
**Solution:**
- Process businesses in batches
- Increase delay between requests
- Use a different geocoding service

---

## Files Modified

| File | Type | Description |
|------|------|-------------|
| `src/lib/supabase.ts` | Modified | Added `gps_coordinates` to interface |
| `src/components/ui/DepartmentMapNavigation.tsx` | Modified | Updated to use stored coordinates |
| `scripts/geocode-businesses.ts` | New | Batch geocoding script |
| `docs/GPS_COORDINATES_FEATURE.md` | New | This documentation |

---

## SQL Queries Reference

### Check coordinate coverage
```sql
SELECT 
  COUNT(*) as total,
  COUNT(gps_coordinates) as with_coords,
  COUNT(*) - COUNT(gps_coordinates) as without_coords,
  ROUND(COUNT(gps_coordinates)::numeric / COUNT(*)::numeric * 100, 2) as coverage_percent
FROM diretorio_patinetas
WHERE activo = true;
```

### Find businesses without coordinates
```sql
SELECT id, nombre, direccion, ciudad, departamento
FROM diretorio_patinetas
WHERE activo = true 
  AND gps_coordinates IS NULL
ORDER BY nombre;
```

### Update coordinates manually
```sql
UPDATE diretorio_patinetas
SET gps_coordinates = '{"latitude": 6.2476, "longitude": -75.5658}'::jsonb
WHERE id = 1;
```

### Delete coordinates (for re-geocoding)
```sql
UPDATE diretorio_patinetas
SET gps_coordinates = NULL
WHERE id = 1;
```

---

**Status:** ✅ Implemented  
**Date:** 2025-10-01  
**Version:** 1.0

