import React, { useState, useRef } from 'react';
import Button from '../components/ui/Button';

const steps = [
  { id: 1, name: 'Upload', description: 'Take or upload a photo' },
  { id: 2, name: 'Review', description: 'Check your results' },
];

export default function Endproduct() {
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera capture
  const handleCaptureClick = async () => {
    try {
      setIsCapturing(true);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(d => d.kind === 'videoinput');
      const constraints = {
        video: videoInputDevices.length > 1
          ? { facingMode: 'environment' }
          : { facingMode: 'user' }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera');
      setIsCapturing(false);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageDataURL = canvasRef.current.toDataURL('image/png');
      setImage(imageDataURL);
      handleStopCapture();
    }
  };

  const handleStopCapture = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  // Upload and analyze
  const handleAnalyze = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}generate-info`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ b64: image }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.text();
      if (data === ' ERROR') {
        setError('This doesn\'t appear to be a meal. Please try another image.');
      } else {
        setNutritionData(data);
        setActiveStep(1);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to start over
  const handleReset = () => {
    setActiveStep(0);
    setImage(null);
    setNutritionData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-coral absolute -top-40 -left-40 opacity-15" />
        <div className="blob blob-lg blob-teal absolute bottom-0 -right-40 opacity-15" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-in">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal mb-2">
            Meal Tracking
          </h1>
          <p className="text-warm-gray">
            Snap a photo and get instant nutritional insights
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 animate-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm
                      transition-all duration-normal
                      ${index <= activeStep
                        ? 'bg-coral text-white shadow-glow-coral'
                        : 'bg-sand text-stone'
                      }
                    `}
                  >
                    {index < activeStep ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`font-medium text-sm ${index <= activeStep ? 'text-charcoal' : 'text-stone'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-stone">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 ${index < activeStep ? 'bg-coral' : 'bg-sand'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {activeStep === 0 && (
          <div className="animate-in" style={{ animationDelay: '150ms' }}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="p-6 sm:p-8"
              >
                {!image ? (
                  <div
                    className={`
                      border-2 border-dashed border-stone/30 rounded-xl
                      p-8 sm:p-12 text-center
                      transition-all duration-normal
                      hover:border-coral hover:bg-coral-light/30
                      ${isCapturing ? 'border-coral bg-coral-light/20' : ''}
                    `}
                  >
                    {!isCapturing ? (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-sand rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-warm-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="font-display font-semibold text-charcoal mb-1">
                          Drop your meal photo here
                        </p>
                        <p className="text-sm text-warm-gray mb-6">
                          or use the buttons below
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <input
                            type="file"
                            ref={inputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <Button
                            variant="primary"
                            onClick={() => inputRef.current?.click()}
                            icon={() => (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                            )}
                          >
                            Choose File
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={handleCaptureClick}
                            icon={() => (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                          >
                            Take Photo
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full max-h-64 rounded-xl mx-auto bg-charcoal"
                        />
                        <div className="flex justify-center gap-3">
                          <Button variant="teal" onClick={handleCaptureImage}>
                            Capture
                          </Button>
                          <Button variant="secondary" onClick={handleStopCapture}>
                            Cancel
                          </Button>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={image}
                        alt="Selected meal"
                        className="w-full max-h-80 object-contain rounded-xl bg-sand"
                      />
                      <button
                        onClick={() => setImage(null)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-charcoal hover:bg-white transition-colors shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="primary"
                        size="lg"
                        loading={isLoading}
                        onClick={handleAnalyze}
                      >
                        Analyze Meal
                      </Button>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-error-light rounded-lg flex items-center gap-2 text-error">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeStep === 1 && nutritionData && (
          <div className="animate-in">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                {/* Image Preview */}
                {image && (
                  <div className="mb-6">
                    <img
                      src={image}
                      alt="Analyzed meal"
                      className="w-full max-h-48 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Results */}
                <div className="mb-6">
                  <h2 className="font-display font-bold text-xl text-charcoal mb-4">
                    Nutritional Information
                  </h2>
                  <div className="bg-sand/50 rounded-xl p-4">
                    <pre className="whitespace-pre-wrap text-sm text-charcoal font-mono">
                      {nutritionData}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button variant="primary" onClick={() => {
                    // TODO: Save to tracking
                    alert('Meal saved to your tracking!');
                    handleReset();
                  }}>
                    Save to Tracking
                  </Button>
                  <Button variant="secondary" onClick={handleReset}>
                    Track Another Meal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
