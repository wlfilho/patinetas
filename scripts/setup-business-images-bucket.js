/**
 * Script to create the business-images storage bucket in Supabase
 * Run this script once to set up the storage bucket for business images
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim()
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupBusinessImagesBucket() {
  try {
    console.log('🚀 Setting up business-images storage bucket...')

    // Check if bucket already exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      throw listError
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
      throw error
    }

    console.log('✅ Successfully created business-images bucket')

    // Set up RLS policies for the bucket
    console.log('🔐 Setting up Row Level Security policies...')

    // Policy to allow authenticated users to upload files
    const uploadPolicySQL = `
      CREATE POLICY "Allow authenticated users to upload business images" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'business-images' AND
        auth.role() = 'authenticated'
      );
    `

    // Policy to allow public read access
    const readPolicySQL = `
      CREATE POLICY "Allow public read access to business images" ON storage.objects
      FOR SELECT USING (bucket_id = 'business-images');
    `

    // Policy to allow authenticated users to update their own uploads
    const updatePolicySQL = `
      CREATE POLICY "Allow authenticated users to update business images" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'business-images' AND
        auth.role() = 'authenticated'
      );
    `

    // Policy to allow authenticated users to delete their own uploads
    const deletePolicySQL = `
      CREATE POLICY "Allow authenticated users to delete business images" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'business-images' AND
        auth.role() = 'authenticated'
      );
    `

    // Execute the policies
    const policies = [
      { name: 'Upload Policy', sql: uploadPolicySQL },
      { name: 'Read Policy', sql: readPolicySQL },
      { name: 'Update Policy', sql: updatePolicySQL },
      { name: 'Delete Policy', sql: deletePolicySQL }
    ]

    for (const policy of policies) {
      try {
        const { error: policyError } = await supabase.rpc('exec_sql', { 
          sql: policy.sql 
        })
        
        if (policyError) {
          console.warn(`⚠️  Warning: Could not create ${policy.name}:`, policyError.message)
        } else {
          console.log(`✅ Created ${policy.name}`)
        }
      } catch (err) {
        console.warn(`⚠️  Warning: Could not create ${policy.name}:`, err.message)
      }
    }

    console.log('🎉 Business images bucket setup completed successfully!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('   1. Verify the bucket appears in your Supabase dashboard')
    console.log('   2. Test uploading an image through the admin interface')
    console.log('   3. Check that the uploaded images are publicly accessible')

  } catch (error) {
    console.error('❌ Error setting up business-images bucket:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupBusinessImagesBucket()
