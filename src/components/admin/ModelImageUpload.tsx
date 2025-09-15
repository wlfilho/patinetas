'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { uploadService } from '@/lib/supabase'

interface ModelImageUploadProps {
  onUploadComplete: (url: string) => void
  onUploadStart?: () => void
  onUploadError?: (error: string) => void
  currentImageUrl?: string
  modelId?: string
  className?: string
}

export default function ModelImageUpload({
  onUploadComplete,
  onUploadStart,
  onUploadError,
  currentImageUrl,
  modelId,
  className = ''
}: ModelImageUploadProps) {
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

  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file
    const validation = uploadService.validateFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Archivo no válido')
      onUploadError?.(validation.error || 'Archivo no válido')
      return
    }

    setError(null)

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

      // Upload file using model image upload service
      const imageUrl = await uploadService.uploadModelImage(file, modelId)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Update preview with actual uploaded URL
      setPreviewUrl(imageUrl)
      onUploadComplete(imageUrl)

      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
      }, 1000)

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al subir el archivo'
      setError(errorMessage)
      onUploadError?.(errorMessage)
      setIsUploading(false)
      setUploadProgress(0)
      setPreviewUrl(currentImageUrl || null)
    }
  }, [modelId, currentImageUrl, onUploadComplete, onUploadError, onUploadStart])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

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
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-lg">
            <div className="w-16 h-16 mb-4">
              <svg className="animate-spin w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">Subiendo imagen...</p>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-600 mb-1">Error al subir</p>
            <p className="text-xs text-red-500 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Upload Instructions */}
        {!isUploading && !error && !previewUrl && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen del modelo aquí'}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              o haz clic para seleccionar un archivo
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, JPEG, WebP (máx. 5MB)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Recomendado: 800x600px o superior
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && !isUploading && (
        <div className="space-y-3">
          <div className="relative inline-block">
            <div className="relative w-48 h-36 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <Image
                src={previewUrl}
                alt="Vista previa del modelo"
                fill
                className="object-cover"
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
