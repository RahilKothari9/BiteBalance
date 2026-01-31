import React, { useState, useRef } from 'react';
import Button from '../components/ui/Button';

const steps = [
  { id: 1, name: 'Ingredients', description: 'Upload your ingredients' },
  { id: 2, name: 'Preferences', description: 'Set your preferences' },
  { id: 3, name: 'Recipe', description: 'Get your recipe' },
];

const difficultyLevels = ['Novice', 'Intermediate', 'Expert'];
const servingSizes = [2, 4, 6];

// Icons
const LeafIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const MeatIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default function Ingredients() {
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Preferences state
  const [cookingTime, setCookingTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState('Novice');
  const [isVeg, setIsVeg] = useState(true);

  const inputRef = useRef(null);

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

  // Analyze ingredients
  const handleAnalyzeIngredients = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}generate-ingredients`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ b64: image }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.text();
      if (data === ' ERROR') {
        setError('Could not identify ingredients. Please try another image.');
      } else {
        setIngredients(data);
        setActiveStep(1);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate recipe
  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}generate-recipe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dietRestrictions: isVeg ? 'veg' : 'non-veg',
            ingredients: JSON.stringify(ingredients),
            cooking_time: cookingTime,
            people: servings,
            difficulty: difficulty.toLowerCase(),
          }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setRecipe(data);
      setActiveStep(2);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to start over
  const handleReset = () => {
    setActiveStep(0);
    setImage(null);
    setIngredients(null);
    setRecipe(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-teal absolute -top-40 -right-40 opacity-15" />
        <div className="blob blob-lg blob-gold absolute bottom-0 -left-40 opacity-15" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-in">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal mb-2">
            Recipe Generator
          </h1>
          <p className="text-warm-gray">
            Upload your ingredients and get personalized recipes
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 animate-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-display font-bold text-xs sm:text-sm
                      transition-all duration-normal
                      ${index <= activeStep
                        ? 'bg-teal text-white shadow-glow-teal'
                        : 'bg-sand text-stone'
                      }
                    `}
                  >
                    {index < activeStep ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 ${index < activeStep ? 'bg-teal' : 'bg-sand'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Upload Ingredients */}
        {activeStep === 0 && (
          <div className="animate-in" style={{ animationDelay: '150ms' }}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="p-6 sm:p-8"
              >
                {!image ? (
                  <div className="border-2 border-dashed border-stone/30 rounded-xl p-8 sm:p-12 text-center transition-all duration-normal hover:border-teal hover:bg-teal-light/30">
                    <div className="w-16 h-16 mx-auto mb-4 bg-teal-light rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-display font-semibold text-charcoal mb-1">
                      Drop your ingredients photo here
                    </p>
                    <p className="text-sm text-warm-gray mb-6">
                      Show us what you have in your kitchen
                    </p>
                    <input
                      type="file"
                      ref={inputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Button variant="teal" onClick={() => inputRef.current?.click()}>
                      Choose Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={image}
                        alt="Ingredients"
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
                      <Button variant="teal" size="lg" loading={isLoading} onClick={handleAnalyzeIngredients}>
                        Identify Ingredients
                      </Button>
                    </div>
                  </div>
                )}

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

        {/* Step 2: Preferences */}
        {activeStep === 1 && (
          <div className="animate-in">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8 space-y-8">
                {/* Detected Ingredients */}
                <div>
                  <h3 className="font-display font-bold text-lg text-charcoal mb-3">
                    Detected Ingredients
                  </h3>
                  <div className="bg-teal-light rounded-xl p-4">
                    <p className="text-sm text-charcoal">{ingredients}</p>
                  </div>
                </div>

                {/* Cooking Time */}
                <div>
                  <h3 className="font-display font-bold text-lg text-charcoal mb-3">
                    Cooking Time
                  </h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={cookingTime}
                      onChange={(e) => setCookingTime(Number(e.target.value))}
                      className="flex-1 h-2 bg-sand rounded-full appearance-none cursor-pointer accent-teal"
                    />
                    <div className="flex items-center gap-2 text-charcoal font-mono font-semibold">
                      <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {cookingTime} min
                    </div>
                  </div>
                </div>

                {/* Servings */}
                <div>
                  <h3 className="font-display font-bold text-lg text-charcoal mb-3">
                    Number of Servings
                  </h3>
                  <div className="flex gap-3">
                    {servingSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setServings(size)}
                        className={`
                          flex-1 py-3 rounded-xl font-semibold transition-all duration-fast
                          ${servings === size
                            ? 'bg-teal text-white shadow-glow-teal'
                            : 'bg-sand text-charcoal hover:bg-teal-light'
                          }
                        `}
                      >
                        {size} people
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <h3 className="font-display font-bold text-lg text-charcoal mb-3">
                    Cooking Skill Level
                  </h3>
                  <div className="flex gap-3">
                    {difficultyLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`
                          flex-1 py-3 rounded-xl font-semibold transition-all duration-fast
                          ${difficulty === level
                            ? 'bg-teal text-white shadow-glow-teal'
                            : 'bg-sand text-charcoal hover:bg-teal-light'
                          }
                        `}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diet Preference */}
                <div>
                  <h3 className="font-display font-bold text-lg text-charcoal mb-3">
                    Diet Preference
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsVeg(true)}
                      className={`
                        flex-1 py-3 rounded-xl font-semibold transition-all duration-fast flex items-center justify-center gap-2
                        ${isVeg
                          ? 'bg-teal text-white shadow-glow-teal'
                          : 'bg-sand text-charcoal hover:bg-teal-light'
                        }
                      `}
                    >
                      <LeafIcon className="w-5 h-5" /> Vegetarian
                    </button>
                    <button
                      onClick={() => setIsVeg(false)}
                      className={`
                        flex-1 py-3 rounded-xl font-semibold transition-all duration-fast flex items-center justify-center gap-2
                        ${!isVeg
                          ? 'bg-coral text-white shadow-glow-coral'
                          : 'bg-sand text-charcoal hover:bg-coral-light'
                        }
                      `}
                    >
                      <MeatIcon className="w-5 h-5" /> Non-Vegetarian
                    </button>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <Button
                    variant="teal"
                    size="lg"
                    loading={isLoading}
                    onClick={handleGenerateRecipe}
                    className="w-full"
                  >
                    Generate Recipe
                  </Button>
                </div>

                {error && (
                  <div className="p-4 bg-error-light rounded-lg flex items-center gap-2 text-error">
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

        {/* Step 3: Recipe Result */}
        {activeStep === 2 && recipe && (
          <div className="animate-in">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-teal rounded-full flex items-center justify-center shadow-glow-teal">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Your Recipe is Ready!
                  </h2>
                </div>

                <div className="bg-sand/50 rounded-xl p-6 mb-6">
                  <pre className="whitespace-pre-wrap text-sm text-charcoal font-body">
                    {typeof recipe === 'string' ? recipe : JSON.stringify(recipe, null, 2)}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button variant="teal" onClick={() => {
                    // Could save to favorites, etc.
                    alert('Recipe saved!');
                  }}>
                    Save Recipe
                  </Button>
                  <Button variant="secondary" onClick={handleReset}>
                    Generate Another
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
