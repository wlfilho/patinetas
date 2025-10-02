/**
 * Script to geocode all businesses in the database and save GPS coordinates
 *
 * Usage:
 *   npx tsx scripts/geocode-businesses.ts
 *
 * This script will:
 * 1. Fetch all businesses from Supabase
 * 2. Geocode addresses using Nominatim API (OpenStreetMap)
 * 3. Update the gps_coordinates column in the database
 * 4. Respect rate limits (1 request per second)
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface Business {
  id: number
  nombre: string
  direccion?: string
  ciudad: string
  departamento: string
  gps_coordinates?: {
    latitude: number
    longitude: number
  }
}

interface GeocodingResult {
  id: number
  nombre: string
  success: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
  error?: string
}

/**
 * Geocode an address using Nominatim API
 */
async function geocodeAddress(
  address: string,
  city: string,
  department: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const fullAddress = `${address}, ${city}, ${department}, Colombia`
    const encodedAddress = encodeURIComponent(fullAddress)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`

    console.log(`   🔍 Geocoding: ${fullAddress}`)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PatinetaElectrica.com.co Geocoding Script'
      }
    })

    if (!response.ok) {
      console.error(`   ❌ HTTP Error: ${response.status}`)
      return null
    }

    const data = await response.json()
    if (data && data.length > 0) {
      const coords = {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      }
      console.log(`   ✅ Found: ${coords.latitude}, ${coords.longitude}`)
      return coords
    }

    console.log(`   ⚠️  No results found`)
    return null
  } catch (error) {
    console.error(`   ❌ Geocoding error:`, error)
    return null
  }
}

/**
 * Update business GPS coordinates in database
 */
async function updateBusinessCoordinates(
  businessId: number,
  coordinates: { latitude: number; longitude: number }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('diretorio_patinetas')
      .update({ gps_coordinates: coordinates })
      .eq('id', businessId)

    if (error) {
      console.error(`   ❌ Database error:`, error.message)
      return false
    }

    console.log(`   💾 Saved to database`)
    return true
  } catch (error) {
    console.error(`   ❌ Update error:`, error)
    return false
  }
}

/**
 * Main geocoding function
 */
async function geocodeAllBusinesses() {
  console.log('🚀 Starting geocoding process...\n')

  // Fetch all businesses
  console.log('📥 Fetching businesses from database...')
  const { data: businesses, error } = await supabase
    .from('diretorio_patinetas')
    .select('id, nombre, direccion, ciudad, departamento, gps_coordinates')
    .eq('activo', true)
    .order('id')

  if (error) {
    console.error('❌ Error fetching businesses:', error)
    process.exit(1)
  }

  if (!businesses || businesses.length === 0) {
    console.log('⚠️  No businesses found')
    process.exit(0)
  }

  console.log(`✅ Found ${businesses.length} businesses\n`)

  // Filter businesses that need geocoding
  const businessesToGeocode = businesses.filter(
    (b: Business) => 
      !b.gps_coordinates && 
      b.direccion && 
      b.direccion.trim() !== ''
  )

  const businessesWithCoords = businesses.filter((b: Business) => b.gps_coordinates)

  console.log(`📊 Statistics:`)
  console.log(`   - Total businesses: ${businesses.length}`)
  console.log(`   - Already have coordinates: ${businessesWithCoords.length}`)
  console.log(`   - Need geocoding: ${businessesToGeocode.length}`)
  console.log(`   - Missing address: ${businesses.length - businessesWithCoords.length - businessesToGeocode.length}\n`)

  if (businessesToGeocode.length === 0) {
    console.log('✅ All businesses already have coordinates!')
    process.exit(0)
  }

  // Ask for confirmation
  console.log(`⏱️  Estimated time: ~${businessesToGeocode.length} seconds (1 request/second)\n`)
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n')
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Geocode businesses
  const results: GeocodingResult[] = []
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < businessesToGeocode.length; i++) {
    const business = businessesToGeocode[i] as Business
    console.log(`\n[${i + 1}/${businessesToGeocode.length}] Processing: ${business.nombre}`)

    if (!business.direccion) {
      results.push({
        id: business.id,
        nombre: business.nombre,
        success: false,
        error: 'No address'
      })
      failCount++
      continue
    }

    // Geocode
    const coordinates = await geocodeAddress(
      business.direccion,
      business.ciudad,
      business.departamento
    )

    if (coordinates) {
      // Update database
      const updated = await updateBusinessCoordinates(business.id, coordinates)
      
      if (updated) {
        results.push({
          id: business.id,
          nombre: business.nombre,
          success: true,
          coordinates
        })
        successCount++
      } else {
        results.push({
          id: business.id,
          nombre: business.nombre,
          success: false,
          error: 'Database update failed'
        })
        failCount++
      }
    } else {
      results.push({
        id: business.id,
        nombre: business.nombre,
        success: false,
        error: 'Geocoding failed'
      })
      failCount++
    }

    // Rate limit: wait 1 second between requests
    if (i < businessesToGeocode.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 GEOCODING SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📍 Total processed: ${businessesToGeocode.length}`)
  console.log('='.repeat(60))

  // Print failed businesses
  if (failCount > 0) {
    console.log('\n❌ Failed businesses:')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.nombre} (ID: ${r.id}): ${r.error}`)
      })
  }

  console.log('\n✅ Geocoding process completed!')
}

// Run the script
geocodeAllBusinesses().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

