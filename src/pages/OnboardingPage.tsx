import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MessageCircle, DollarSign, MapPin } from 'lucide-react';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const onboardingSteps = [
    {
      title: 'Welcome to Rebazzar',
      description: 'Your one-stop marketplace for pre-loved treasures. Buy, sell, and connect with our community.',
      icon: <ShoppingBag className="w-16 h-16 text-blue-600" />,
    },
    {
      title: 'Find What You Need',
      description: 'Browse thousands of items across multiple categories. Filter by location to find items near you.',
      icon: <MapPin className="w-16 h-16 text-blue-600" />,
    },
    {
      title: 'Communicate Safely',
      description: 'Our built-in messaging system helps you connect with buyers and sellers securely.',
      icon: <MessageCircle className="w-16 h-16 text-blue-600" />,
    },
    {
      title: 'Flexible Transactions',
      description: 'Buy items at fixed prices or negotiate with the bidding system to get the best deal.',
      icon: <DollarSign className="w-16 h-16 text-blue-600" />,
    },
  ];
  
  const goToNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // End of onboarding, redirect to login
      navigate('/login');
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    navigate('/login');
  };
  
  const currentSlide = onboardingSteps[currentStep];
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-end p-4">
        <button 
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700"
        >
          Skip
        </button>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8">
          {currentSlide.icon}
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{currentSlide.title}</h1>
        <p className="text-gray-600 mb-12 max-w-xs">{currentSlide.description}</p>
        
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="p-6 flex justify-between">
        <button
          onClick={goToPrevStep}
          className={`px-6 py-2 rounded-md ${
            currentStep === 0 ? 'invisible' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Back
        </button>
        
        <button
          onClick={goToNextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;