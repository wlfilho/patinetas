# Feature: Department Map & Quick Navigation Component

## Overview

This document describes the implementation of the **Department Map & Quick Navigation** component for individual department pages (`/departamentos/[departamento]`). This two-column layout provides users with an interactive map view and a quick navigation list to easily find and access businesses within a department.

---

## Component Location

**File:** `src/components/ui/DepartmentMapNavigation.tsx`

**Integrated in:** `src/app/departamentos/[departamento]/DepartmentPageClient.tsx`

**Position:** Between the "Cities Grid" section and the "Businesses by City" sections

---

## Features

### 1. Two-Column Layout

#### Desktop (lg and above):
- **Left Column:** Interactive map showing the department region
- **Right Column:** Scrollable quick navigation list with search functionality
- **Layout:** Side-by-side with equal heights
- **Gap:** 6 units (gap-6)

#### Mobile (< lg):
- **Stacked Layout:** Map on top, navigation list below
- **Full Width:** Both columns take full width
- **Responsive Heights:** Adjusted for better mobile UX

---

### 2. Left Column: Interactive Map

#### Technology:
- **Library:** Leaflet (via react-leaflet)
- **Tile Provider:** OpenStreetMap
- **No API Key Required:** Free and open-source

#### Features:
- Displays the department region centered on approximate coordinates
- Zoom controls and pan functionality
- Responsive container with min-height constraints
- Loading state with placeholder message

#### Current Limitation:
- **Coordinates Not Available:** Since the database doesn't have latitude/longitude fields for businesses, an overlay message is displayed informing users that the interactive map with business markers is coming soon
- **Future Enhancement:** Once coordinates are added to the database, markers can be displayed for each business location

#### Styling:
- Border: `rounded-xl border border-gray-200`
- Shadow: `shadow-md`
- Height: `min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]`
- Background: `bg-white`

---

### 3. Right Column: Quick Navigation List

#### Features:

**Sticky Header:**
- Title: "📋 Navegación Rápida"
- Business count indicator
- Search input field
- Stays visible while scrolling the list

**Search Functionality:**
- Real-time filtering of businesses and cities
- Case-insensitive search
- Searches in: business name, description, and city name
- Clear button to reset search
- Results counter

**Business List:**
- Grouped by city
- City headers are clickable (scroll to city section)
- Business count per city
- Each business item shows:
  - Business name (truncated if too long)
  - Category (smaller, gray text)
  - Clickable to scroll directly to the business card

**Scroll Behavior:**
- Smooth scroll to business card on click
- Highlights selected business temporarily (2 seconds)
- Centers the business card in the viewport

**Empty State:**
- Displays when no results match the search query
- Shows search icon and helpful message

#### Styling:
- Border: `rounded-xl border border-gray-200`
- Shadow: `shadow-md`
- Background: `bg-white`
- Padding: `p-4 sm:p-6`
- Max Height: `max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]`
- Overflow: `overflow-y-auto` (scrollable)

---

## Technical Implementation

### Dependencies Installed:
```bash
npm install leaflet react-leaflet @types/leaflet
```

### CSS Import:
Added to `src/app/globals.css`:
```css
@import "leaflet/dist/leaflet.css";
```

### Component Structure:

```tsx
<DepartmentMapNavigation
  businesses={businesses}
  businessesByCity={businessesByCity}
  departmentName={departmentName}
/>
```

### Props:
- `businesses`: Array of all businesses in the department
- `businessesByCity`: Object mapping city names to arrays of businesses
- `departmentName`: Name of the department (for display)

---

## Department Coordinates

The component includes approximate center coordinates for all 33 Colombian departments:

```typescript
const DEPARTMENT_COORDINATES: Record<string, [number, number]> = {
  'Antioquia': [6.2476, -75.5658],
  'Bogotá D.C.': [4.7110, -74.0721],
  'Cundinamarca': [5.0269, -74.0380],
  'Valle del Cauca': [3.4516, -76.5320],
  // ... all 33 departments
}
```

Default fallback: Colombia center `[4.5709, -74.2973]`

---

## Business Card Enhancement

### Added ID Attribute:
Each `BusinessCard` component now has a unique ID for scroll targeting:

```tsx
<div id={`business-${business.id}`} className="...">
```

### Added Scroll Margin:
```css
scroll-mt-20
```

This ensures the business card is properly positioned when scrolled to (accounting for any sticky headers).

---

## User Experience Flow

1. **User lands on department page**
2. **Scrolls down to Map & Navigation section**
3. **Options:**
   - **Option A:** Use search box to filter businesses/cities
   - **Option B:** Click on a city header to scroll to that city's section
   - **Option C:** Click on a specific business to scroll directly to its card
4. **Selected business is highlighted temporarily**
5. **User can view business details or contact information**

---

## Responsive Behavior

### Desktop (lg: 1024px+):
- Two columns side by side
- Map: 50% width
- Navigation: 50% width
- Heights: 600px

### Tablet (md: 768px - 1023px):
- Two columns side by side (narrower)
- Heights: 500px

### Mobile (< 768px):
- Stacked layout
- Map on top (full width)
- Navigation below (full width)
- Heights: 400px

---

## Accessibility

- **ARIA Labels:** Search input has proper labels
- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **Focus States:** Visible focus indicators on all buttons
- **Semantic HTML:** Proper heading hierarchy (h2, h3, h4)
- **Screen Reader Support:** Descriptive text for all actions

---

## SEO Considerations

- **Heading Structure:** Proper H2 for section title
- **Descriptive Text:** Clear section description
- **Internal Links:** Smooth scroll to business cards (not actual links, but enhances UX)
- **No Negative Impact:** Component is client-side only, doesn't affect SSR

---

## Performance

- **Dynamic Import:** Map components are dynamically imported to avoid SSR issues
- **Client-Side Only:** Component uses 'use client' directive
- **Memoization:** Search filtering uses `useMemo` for efficiency
- **Lazy Loading:** Map tiles load on demand
- **Small Bundle:** Leaflet is lightweight compared to Google Maps

---

## Future Enhancements

### Phase 1: Add Coordinates to Database
1. Add `latitude` and `longitude` fields to `diretorio_patinetas` table
2. Implement geocoding service to convert addresses to coordinates
3. Update `NegocioDirectorio` interface to include coordinates

### Phase 2: Display Business Markers
1. Remove overlay message
2. Add markers for each business on the map
3. Implement marker clustering for dense areas
4. Add popups with business info on marker click

### Phase 3: Advanced Features
1. **Filter by City:** Add city filter buttons above the map
2. **Active State Sync:** Highlight business in list when marker is clicked
3. **Custom Markers:** Use category-specific icons for markers
4. **Directions:** Add "Get Directions" button for each business
5. **Heatmap:** Show business density heatmap

---

## Testing Checklist

- [x] Component renders without errors
- [x] Map displays correctly on desktop
- [x] Map displays correctly on mobile
- [x] Navigation list is scrollable
- [x] Search functionality works
- [x] Clear button resets search
- [x] City headers scroll to city sections
- [x] Business links scroll to business cards
- [x] Selected business is highlighted
- [x] Responsive layout works on all screen sizes
- [x] No console errors
- [x] TypeScript compiles without errors
- [x] Leaflet CSS is loaded correctly

---

## Files Modified

| File | Type | Changes |
|------|------|---------|
| `src/components/ui/DepartmentMapNavigation.tsx` | New | Main component (300+ lines) |
| `src/app/departamentos/[departamento]/DepartmentPageClient.tsx` | Modified | Added component integration |
| `src/components/ui/BusinessCard.tsx` | Modified | Added ID attribute and scroll margin |
| `src/app/globals.css` | Modified | Added Leaflet CSS import |
| `package.json` | Modified | Added leaflet dependencies |
| `docs/FEATURE_DEPARTMENT_MAP_NAVIGATION.md` | New | This documentation |

---

## Dependencies

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.8"
}
```

---

## Known Issues

1. **No Business Markers:** Coordinates are not available in the database yet
2. **Map Overlay:** Informational overlay covers the map (intentional for now)

---

## Conclusion

The Department Map & Quick Navigation component provides a modern, user-friendly way to explore businesses within a department. While the map functionality is currently limited due to missing coordinates, the quick navigation list offers excellent UX for finding and accessing businesses quickly. Once coordinates are added to the database, the map will become fully functional with business markers and enhanced interactivity.

---

**Implemented by:** Augment Agent  
**Date:** 2025-10-01  
**Status:** ✅ Completed (Phase 1 - Navigation List)  
**Next Phase:** Add coordinates to database for full map functionality

