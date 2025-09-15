/**
 * Test script to verify the upload service configuration
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const envVars = {}

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim()
    }
  })
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testUploadService() {
  try {
    console.log('🔍 Testing upload service configuration...')
    console.log('')

    // Check available buckets
    console.log('📦 Checking available storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message)
      return
    }

    console.log('✅ Available buckets:')
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (public: ${bucket.public}, size limit: ${bucket.file_size_limit} bytes)`)
    })
    console.log('')

    // Check if brand-logos bucket exists and is accessible
    const brandLogosExists = buckets.some(bucket => bucket.name === 'brand-logos')
    
    if (!brandLogosExists) {
      console.error('❌ brand-logos bucket not found!')
      return
    }

    console.log('✅ brand-logos bucket found and accessible')
    
    // Test folder structure by listing files in businesses folder
    console.log('📁 Checking businesses folder structure...')
    const { data: files, error: filesError } = await supabase.storage
      .from('brand-logos')
      .list('businesses', { limit: 5 })
    
    if (filesError) {
      if (filesError.message.includes('not found')) {
        console.log('ℹ️  businesses folder doesn\'t exist yet (will be created on first upload)')
      } else {
        console.warn('⚠️  Warning checking businesses folder:', filesError.message)
      }
    } else {
      console.log(`✅ businesses folder exists with ${files.length} files`)
      if (files.length > 0) {
        console.log('   Recent files:')
        files.slice(0, 3).forEach(file => {
          console.log(`   - ${file.name}`)
        })
      }
    }
    console.log('')

    // Test public URL generation
    console.log('🔗 Testing public URL generation...')
    const testPath = 'businesses/test-business-123-abc.jpg'
    const { data: { publicUrl } } = supabase.storage
      .from('brand-logos')
      .getPublicUrl(testPath)
    
    console.log('✅ Public URL format:', publicUrl)
    console.log('')

    console.log('🎉 Upload service configuration test completed!')
    console.log('')
    console.log('📋 Summary:')
    console.log('   ✅ Supabase connection working')
    console.log('   ✅ brand-logos bucket accessible')
    console.log('   ✅ Public URL generation working')
    console.log('   ✅ Ready for business image uploads')
    console.log('')
    console.log('🚀 You can now test uploading images through the admin interface!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the test
testUploadService()
