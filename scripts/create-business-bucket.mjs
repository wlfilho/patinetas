/**
 * Script to create the business-images storage bucket in Supabase
 * This uses ES modules to work with the Supabase client
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
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createBusinessImagesBucket() {
  try {
    console.log('🚀 Creating business-images storage bucket...')

    // Check if bucket already exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message)
      return
    }

    const bucketExists = existingBuckets.some(bucket => bucket.name === 'business-images')
    
    if (bucketExists) {
      console.log('✅ business-images bucket already exists')
      return
    }

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('business-images', {
      public: true,
      allowedMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp'
      ],
      fileSizeLimit: 5242880 // 5MB in bytes
    })

    if (error) {
      console.error('❌ Error creating bucket:', error.message)
      console.log('ℹ️  Note: You may need admin privileges to create buckets.')
      console.log('ℹ️  The app will continue to work using the brand-logos bucket as fallback.')
      return
    }

    console.log('✅ Successfully created business-images bucket')
    console.log('🎉 Setup completed successfully!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.log('ℹ️  The app will continue to work using the brand-logos bucket as fallback.')
  }
}

// Run the setup
createBusinessImagesBucket()
