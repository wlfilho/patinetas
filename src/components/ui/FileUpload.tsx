'use client'

import { useState, useRef, useCallback } from 'react'
import { uploadService } from '@/lib/supabase'

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  onUploadStart?: () => void
  onUploadError?: (error: string) => void
  currentImageUrl?: string
  brandId?: string
  className?: string
}

export default function FileUpload({
  onUploadComplete,
  onUploadStart,
  onUploadError,
  currentImageUrl,
  brandId,
  className = ''
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    setError(null)
    
    // Validate file
    const validation = uploadService.validateFile(file)
    if (!validation.valid) {
      setError(validation.error!)
      onUploadError?.(validation.error!)
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)
      onUploadStart?.()

      // Show preview immediately
      const preview = await uploadService.getFilePreview(file)
      setPreviewUrl(preview)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload file
      const logoUrl = await uploadService.uploadBrandLogo(file, brandId)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Update preview with actual uploaded URL
      setPreviewUrl(logoUrl)
      onUploadComplete(logoUrl)

      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
      }, 1000)

    } catch (error: any) {
      console.error('Upload error:', error)
      const errorMessage = error.message || 'Error al subir el archivo'
      setError(errorMessage)
      onUploadError?.(errorMessage)
      setIsUploading(false)
      setUploadProgress(0)
      setPreviewUrl(currentImageUrl || null)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    setError(null)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        } ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">Subiendo archivo...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isDragging ? 'Suelta el archivo aquí' : 'Arrastra una imagen aquí'}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              o haz clic para seleccionar un archivo
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, JPEG, SVG, WebP (máx. 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Vista Previa del Logo
          </label>
          <div className="relative inline-block">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <img
                src={previewUrl}
                alt="Vista previa del logo"
                className="w-32 h-32 object-contain mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-logo.svg'
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Eliminar imagen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleBrowseClick}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Cambiar imagen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
