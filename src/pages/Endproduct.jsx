import React, { useState, useRef } from 'react';
import Button from '../components/ui/Button';
import { UserAuth } from '../contexts/AuthContext';

const steps = [
  { id: 1, name: 'Upload', description: 'Take or upload a photo' },
  { id: 2, name: 'Review', description: 'Check your results' },
];

export default function Endproduct() {
  const { user } = UserAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('snack');

  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: SunIcon },
    { value: 'lunch', label: 'Lunch', icon: SunHighIcon },
    { value: 'dinner', label: 'Dinner', icon: MoonIcon },
    { value: 'snack', label: 'Snack', icon: CookieIcon },
  ];

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

      const text = await response.text();

      // Check for error response
      if (text.trim() === 'ERROR' || text.includes('ERROR')) {
        setError('This doesn\'t appear to be a meal. Please try another image.');
        return;
      }

      // Try to parse as JSON
      try {
        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = text;
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        } else {
          const objectMatch = text.match(/\{[\s\S]*\}/);
          if (objectMatch) {
            jsonStr = objectMatch[0];
          }
        }

        const data = JSON.parse(jsonStr);
        setNutritionData(data);
        setActiveStep(1);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setError('Failed to parse nutrition data. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save meal to tracking
  const handleSaveMeal = async () => {
    if (!user?.uid || !nutritionData) return;

    setIsSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}calories/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            foodName: nutritionData.foodName || 'Meal',
            mealType: selectedMealType,
            calories: nutritionData.estimatedCalories || nutritionData.calories || 0,
            protein: nutritionData.protein || 0,
            carbs: nutritionData.carbs || 0,
            fat: nutritionData.fat || 0,
            fiber: nutritionData.fiber || 0,
            sugar: nutritionData.sugar || 0,
            sodium: nutritionData.sodium || 0,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to save');

      setSaveSuccess(true);
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      console.error('Error saving meal:', err);
      setError('Failed to save meal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to start over
  const handleReset = () => {
    setActiveStep(0);
    setImage(null);
    setNutritionData(null);
    setError(null);
    setSaveSuccess(false);
    setSelectedMealType('snack');
  };

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-coral absolute -top-40 -left-40 opacity-15 animate-float" />
        <div className="blob blob-lg blob-teal absolute bottom-0 -right-40 opacity-15 animate-float" style={{ animationDelay: '2s' }} />
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
                        ? 'bg-coral text-white shadow-glow-coral scale-110'
                        : 'bg-sand text-stone'
                      }
                    `}
                  >
                    {index < activeStep ? (
                      <svg className="w-5 h-5 animate-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`font-medium text-sm transition-colors ${index <= activeStep ? 'text-charcoal' : 'text-stone'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-stone">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 transition-colors duration-slow ${index < activeStep ? 'bg-coral' : 'bg-sand'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {activeStep === 0 && (
          <div className="animate-in" style={{ animationDelay: '150ms' }}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-normal">
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
                        <div className="w-16 h-16 mx-auto mb-4 bg-sand rounded-2xl flex items-center justify-center animate-pulse-subtle">
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
                    <div className="relative group">
                      <img
                        src={image}
                        alt="Selected meal"
                        className="w-full max-h-80 object-contain rounded-xl bg-sand transition-transform duration-normal group-hover:scale-[1.02]"
                      />
                      <button
                        onClick={() => setImage(null)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-charcoal hover:bg-white hover:scale-110 transition-all shadow-md"
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
                  <div className="mt-4 p-4 bg-error-light rounded-lg flex items-center gap-2 text-error animate-in">
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
            {saveSuccess ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-teal-light rounded-full flex items-center justify-center animate-bounce-in">
                  <svg className="w-10 h-10 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display font-bold text-2xl text-charcoal mb-2">Meal Saved!</h2>
                <p className="text-warm-gray">Your meal has been added to your tracking.</p>
              </div>
            ) : (
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

                  {/* Food Name */}
                  <div className="text-center mb-6">
                    <h2 className="font-display font-bold text-2xl text-charcoal mb-1">
                      {nutritionData.foodName || 'Your Meal'}
                    </h2>
                    {nutritionData.confidence && (
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-xs font-medium
                        ${nutritionData.confidence === 'high' ? 'bg-teal-light text-teal' :
                          nutritionData.confidence === 'medium' ? 'bg-gold-light text-gold' :
                          'bg-coral-light text-coral'}
                      `}>
                        {nutritionData.confidence} confidence
                      </span>
                    )}
                  </div>

                  {/* Nutrition Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 stagger-children">
                    <NutritionCard
                      label="Calories"
                      value={nutritionData.estimatedCalories || nutritionData.calories || 0}
                      unit="kcal"
                      color="coral"
                      icon={<FlameIcon className="w-5 h-5" />}
                    />
                    <NutritionCard
                      label="Protein"
                      value={nutritionData.protein || 0}
                      unit="g"
                      color="teal"
                      icon={<ProteinIcon className="w-5 h-5" />}
                    />
                    <NutritionCard
                      label="Carbs"
                      value={nutritionData.carbs || 0}
                      unit="g"
                      color="gold"
                      icon={<CarbsIcon className="w-5 h-5" />}
                    />
                    <NutritionCard
                      label="Fat"
                      value={nutritionData.fat || 0}
                      unit="g"
                      color="coral"
                      icon={<FatIcon className="w-5 h-5" />}
                    />
                  </div>

                  {/* Additional Nutrition Info */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-sand/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-warm-gray mb-1">Fiber</p>
                      <p className="font-mono font-bold text-charcoal">{nutritionData.fiber || 0}g</p>
                    </div>
                    <div className="bg-sand/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-warm-gray mb-1">Sugar</p>
                      <p className="font-mono font-bold text-charcoal">{nutritionData.sugar || 0}g</p>
                    </div>
                    <div className="bg-sand/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-warm-gray mb-1">Sodium</p>
                      <p className="font-mono font-bold text-charcoal">{nutritionData.sodium || 0}mg</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {nutritionData.notes && (
                    <div className="bg-teal-light/30 rounded-xl p-4 mb-6">
                      <p className="text-sm text-charcoal">
                        <span className="font-semibold">Note:</span> {nutritionData.notes}
                      </p>
                    </div>
                  )}

                  {/* Meal Type Selection */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-charcoal mb-3">Log as:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {mealTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setSelectedMealType(type.value)}
                            className={`
                              flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-fast
                              ${selectedMealType === type.value
                                ? 'bg-coral text-white shadow-glow-coral scale-105'
                                : 'bg-sand text-charcoal hover:bg-coral-light'
                              }
                            `}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      loading={isSaving}
                      onClick={handleSaveMeal}
                    >
                      Save to Tracking
                    </Button>
                    <Button variant="secondary" onClick={handleReset}>
                      Track Another Meal
                    </Button>
                  </div>

                  {/* Error */}
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
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Nutrition Card Component
const NutritionCard = ({ label, value, unit, color, icon }) => {
  const colors = {
    coral: { bg: 'bg-coral-light', text: 'text-coral', border: 'border-coral/20' },
    teal: { bg: 'bg-teal-light', text: 'text-teal', border: 'border-teal/20' },
    gold: { bg: 'bg-gold-light', text: 'text-gold', border: 'border-gold/20' },
  };
  const c = colors[color];

  return (
    <div className={`${c.bg} rounded-xl p-4 border ${c.border} hover:scale-105 transition-transform duration-fast`}>
      <div className={`flex items-center gap-2 mb-2 ${c.text}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`font-mono font-bold text-xl ${c.text}`}>
        {Math.round(value)}
        <span className="text-sm ml-1 opacity-70">{unit}</span>
      </p>
    </div>
  );
};

// Icons
const FlameIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
);

const ProteinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const CarbsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const FatIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const SunIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SunHighIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-4.95l-1.414 1.414M7.464 16.536l-1.414 1.414m10.486 0l-1.414-1.414M7.464 7.464L6.05 6.05M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const CookieIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
