'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { uploadService } from '@/lib/supabase'

interface BusinessImageUploadProps {
  onUploadComplete: (url: string) => void
  onUploadStart?: () => void
  onUploadError?: (error: string) => void
  currentImageUrl?: string
  businessId?: string
  className?: string
}

export default function BusinessImageUpload({
  onUploadComplete,
  onUploadStart,
  onUploadError,
  currentImageUrl,
  businessId,
  className = ''
}: BusinessImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
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
      return
    }

    setError(null)
    setSuccessMessage(null)

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

      // Upload file using business image upload service
      const imageUrl = await uploadService.uploadBusinessImage(file, businessId)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Update preview with actual uploaded URL
      setPreviewUrl(imageUrl)
      onUploadComplete(imageUrl)

      // Show success message
      setSuccessMessage('Imagen subida exitosamente')

      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
        setSuccessMessage(null)
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al subir el archivo'
      setError(errorMessage)
      onUploadError?.(errorMessage)
      setIsUploading(false)
      setUploadProgress(0)
      setPreviewUrl(currentImageUrl || null)
    }
  }, [businessId, currentImageUrl, onUploadComplete, onUploadError, onUploadStart])

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

  const handleBrowseClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }, [isUploading])

  const handleRemoveImage = useCallback(() => {
    setPreviewUrl(null)
    setError(null)
    setSuccessMessage(null)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onUploadComplete])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : error
            ? 'border-red-300 bg-red-50'
            : successMessage
            ? 'border-green-300 bg-green-50'
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
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Loading State */}
        {isUploading && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-primary animate-spin">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">Subiendo imagen...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{uploadProgress}%</p>
          </div>
        )}

        {/* Error State */}
        {error && !isUploading && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-900 mb-1">Error al subir imagen</p>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Success State */}
        {successMessage && !isUploading && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-green-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-900">{successMessage}</p>
          </div>
        )}

        {/* Image Preview */}
        {previewUrl && !isUploading && !error && !successMessage && (
          <div className="text-center">
            <div className="relative inline-block">
              <Image
                src={previewUrl}
                alt="Vista previa de la imagen del negocio"
                width={200}
                height={150}
                className="rounded-lg object-cover border border-gray-200"
                onError={() => {
                  setError('Error al cargar la imagen')
                  setPreviewUrl(null)
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Eliminar imagen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Haz clic para cambiar la imagen</p>
          </div>
        )}

        {/* Upload Instructions */}
        {!isUploading && !error && !successMessage && !previewUrl && (
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
              {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen del negocio aquí'}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              o haz clic para seleccionar un archivo
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, GIF, WebP hasta 5MB
            </p>
          </div>
        )}
      </div>

      {/* File Info */}
      {previewUrl && !isUploading && (
        <div className="text-xs text-gray-500 text-center">
          Imagen cargada correctamente
        </div>
      )}
    </div>
  )
}
