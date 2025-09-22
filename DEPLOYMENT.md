# Deployment Instructions

## Environment Variables Required

The application requires the following environment variables to be set in your deployment platform:

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vbtxusxqhfoaxmdhuxfw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZidHh1c3hxaGZvYXhtZGh1eGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTI0NjksImV4cCI6MjA3MzI4ODQ2OX0.iAFtYaca_MboBh3WMDKkj0d4kV2B2y1jw0x_l1_NMu4

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://patinetaelectrica.com.co
```

## Vercel Deployment

### Option 1: Using Vercel Dashboard

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://vbtxusxqhfoaxmdhuxfw.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZidHh1c3hxaGZvYXhtZGh1eGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTI0NjksImV4cCI6MjA3MzI4ODQ2OX0.iAFtYaca_MboBh3WMDKkj0d4kV2B2y1jw0x_l1_NMu4`
5. Redeploy the application

### Option 2: Using Vercel CLI

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://vbtxusxqhfoaxmdhuxfw.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZidHh1c3hxaGZvYXhtZGh1eGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTI0NjksImV4cCI6MjA3MzI4ODQ2OX0.iAFtYaca_MboBh3WMDKkj0d4kV2B2y1jw0x_l1_NMu4

vercel env add NEXT_PUBLIC_SITE_URL
# Enter: https://patinetaelectrica.com.co

# Deploy
vercel --prod
```

## Other Deployment Platforms

### Netlify
1. Go to Site Settings → Environment Variables
2. Add the same environment variables as above

### Railway
1. Go to your project → Variables
2. Add the same environment variables as above

### Heroku
```bash
heroku config:set NEXT_PUBLIC_SUPABASE_URL=https://vbtxusxqhfoaxmdhuxfw.supabase.co
heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZidHh1c3hxaGZvYXhtZGh1eGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTI0NjksImV4cCI6MjA3MzI4ODQ2OX0.iAFtYaca_MboBh3WMDKkj0d4kV2B2y1jw0x_l1_NMu4
heroku config:set NEXT_PUBLIC_SITE_URL=https://patinetaelectrica.com.co
```

## Verification

After setting the environment variables and redeploying:

1. Check that the homepage loads correctly
2. Verify that the admin interface is accessible
3. Test the catalog functionality
4. Ensure file upload works in the admin panel

## Troubleshooting

### Common Issues

1. **"supabaseUrl is required" error**: Environment variables not set correctly
2. **Build fails**: Check that all environment variables are set for the correct environment (production)
3. **Database connection issues**: Verify Supabase URL and key are correct

### Debug Steps

1. Check deployment logs for specific error messages
2. Verify environment variables are set in the deployment platform
3. Test locally with the same environment variables
4. Check Supabase project status and permissions

## Database Setup

The application expects the following Supabase tables to exist:
- `diretorio_patinetas` (business directory)
- `categorias_patinetas` (categories)
- `marcas_patinetas` (brands)
- `modelos_patinetas` (models)
- Storage bucket: `brand-logos`

Make sure these are properly set up in your Supabase project before deployment.
