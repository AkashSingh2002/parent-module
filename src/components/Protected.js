import React from 'react';

const PartnerSection = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-12">Why Partner With Us?</h2>

      {/* Flexbox Layout */}

      {/* Section 1 */}
      <div className="flex flex-col md:flex-row items-center mb-12">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src="https://via.placeholder.com/400x200"
            alt="AI Video Solutions"
            className="w-full object-cover"
          />
        </div>
        {/* Text */}
        <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0 text-left">
          <h3 className="text-xl font-semibold mb-4">Leading AI Video Solutions</h3>
          <p className="text-gray-600">
            Collaborate on advanced video comprehension technologies to solve real-world problems across industries like retail, transportation, public safety, and more.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="flex flex-col md:flex-row-reverse items-center mb-12">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src="https://via.placeholder.com/400x200"
            alt="Innovative Projects"
            className="w-full object-cover"
          />
        </div>
        {/* Text */}
        <div className="md:w-1/2 md:pr-8 mt-8 md:mt-0 text-left">
          <h3 className="text-xl font-semibold mb-4">Innovative Projects</h3>
          <p className="text-gray-600">
            With over 752 successful ANPR (Automatic Number Plate Recognition) projects, we offer opportunities to work on impactful initiatives.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div className="flex flex-col md:flex-row items-center">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src="https://via.placeholder.com/400x200"
            alt="Scalable Growth"
            className="w-full object-cover"
          />
        </div>
        {/* Text */}
        <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0 text-left">
          <h3 className="text-xl font-semibold mb-4">Scalable Growth</h3>
          <p className="text-gray-600">
            Join a forward-thinking team that's redefining the possibilities of AI-powered video analytics, from human detection and intrusion alerts to traffic management and anomaly detection.
          </p>
        </div>
      </div>

    </div>
  );
};

export default PartnerSection;
