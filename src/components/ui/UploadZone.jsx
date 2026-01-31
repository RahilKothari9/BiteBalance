import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * UploadZone Component
 *
 * Drag-and-drop file upload with animations.
 * States: default, hover, drag-over, uploading, success, error
 */

const UploadZone = ({
  onUpload,
  onCapture,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
}) => {
  const [preview, setPreview] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 10MB.');
      } else {
        setError('Invalid file type. Please upload an image.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Trigger upload callback
      if (onUpload) {
        setUploadState('uploading');
        onUpload(file)
          .then(() => setUploadState('success'))
          .catch((err) => {
            setUploadState('error');
            setError(err.message || 'Upload failed');
          });
      }
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const handleCameraCapture = async () => {
    if (onCapture) {
      try {
        const result = await onCapture();
        if (result) {
          setPreview(result);
        }
      } catch (err) {
        setError('Camera capture failed');
      }
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setUploadState('idle');
    setError(null);
  };

  // Render preview state
  if (preview && uploadState !== 'error') {
    return (
      <div className={`relative ${className}`}>
        <div className="relative rounded-2xl overflow-hidden bg-sand">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          {uploadState === 'uploading' && (
            <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white font-medium">Analyzing...</p>
              </div>
            </div>
          )}
          {uploadState === 'success' && (
            <div className="absolute inset-0 bg-teal/20 flex items-center justify-center animate-fade-in-scale">
              <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center shadow-glow-teal">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={clearPreview}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-charcoal hover:bg-white transition-colors shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`
          relative
          min-h-[240px]
          border-2 border-dashed
          rounded-2xl
          p-8
          flex flex-col items-center justify-center
          text-center
          cursor-pointer
          transition-all duration-normal ease-out-expo
          ${isDragActive && !isDragReject
            ? 'border-coral bg-coral-light scale-[1.02]'
            : isDragReject
            ? 'border-error bg-error-light'
            : error
            ? 'border-error bg-error-light'
            : 'border-stone/30 bg-sand/30 hover:border-coral hover:bg-coral-light/50'
          }
        `}
      >
        <input {...getInputProps()} />

        {/* Icon */}
        <div
          className={`
            w-16 h-16
            flex items-center justify-center
            rounded-2xl
            mb-4
            transition-all duration-normal
            ${isDragActive ? 'bg-coral text-white scale-110 animate-bounce-gentle' : 'bg-sand text-warm-gray'}
          `}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Text */}
        <p className="font-display font-semibold text-charcoal mb-1">
          {isDragActive ? 'Drop your image here' : 'Drag & drop your meal photo'}
        </p>
        <p className="text-sm text-warm-gray mb-4">
          or click to browse
        </p>

        {/* Error */}
        {error && (
          <p className="text-sm text-error flex items-center gap-1 mt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* File info */}
        <p className="text-xs text-stone mt-2">
          PNG, JPG, WEBP up to 10MB
        </p>
      </div>

      {/* Camera Button */}
      {onCapture && (
        <button
          onClick={handleCameraCapture}
          className="
            w-full mt-4
            flex items-center justify-center gap-2
            py-3 px-4
            bg-white
            border border-stone/30
            rounded-xl
            font-medium text-charcoal
            transition-all duration-fast
            hover:border-coral hover:text-coral hover:shadow-md
            active:scale-[0.98]
          "
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Take a Photo
        </button>
      )}
    </div>
  );
};

export default UploadZone;
