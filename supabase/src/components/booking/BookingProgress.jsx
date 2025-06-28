import React from 'react';

const BookingProgress = ({ steps, currentStep }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step.number
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-gray-600 text-gray-400'
              }`}>
                <step.icon className="h-6 w-6" />
              </div>
              <div className="ml-0 sm:ml-3 mt-2 sm:mt-0">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  currentStep >= step.number ? 'text-emerald-400' : 'text-gray-400'
                }`}>
                  Step {step.number}
                </p>
                <p className={`text-sm hidden sm:block transition-colors duration-300 ${
                  currentStep >= step.number ? 'text-white' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 sm:mx-6 transition-colors duration-300 ${
                currentStep > step.number ? 'bg-emerald-600' : 'bg-gray-600'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingProgress;