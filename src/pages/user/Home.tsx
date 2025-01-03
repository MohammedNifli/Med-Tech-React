import React from "react";


import { Heart, Eye, Baby, Smile, Clock, MessageCircle, Shield } from "lucide-react";

const Home: React.FC = () => {
  
  return (
    <section className="bg-white py-8 mt-16 sm:mt-24">
      <div className="container mx-auto px-4 ">
        

        {/* Banner Container */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl overflow-hidden shadow-lg mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4">
                Find Your Doctor and Make An Appointment
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Easy, fast, and convenient way to book your medical appointments
                online.
              </p>
              <button className="bg-purple-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full hover:bg-blue-600 transition duration-300">
                Book Now
              </button>
            </div>
            <div className="w-full lg:w-1/2">
              <img
                className="w-full h-auto object-cover"
                src="pictures/banImg.jpg"
                alt="Doctor appointment banner"
              />
            </div>
          </div>
        </div>

        {/* Easy Steps Section */}
        <div className="bg-teal-500 rounded-xl p-6 sm:p-8 text-white mt-8 sm:mt-16">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-0">
              Easy Steps To Get Your Solution
            </h2>
            <div className="text-center font-arial font-bold lg:text-right">
              <p className="mb-2">
                Easy Make Appointment With Our Best Doctor For
              </p>
              <p>Your Families In Same Day Or The Next Day</p>
            </div>
            <button className="bg-white text-teal-500 font-bold py-2 px-4 sm:px-6 rounded-full mt-4 lg:mt-0">
              Make an Appointment
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: "👨‍⚕️",
                title: "Search Doctor",
                description:
                  "Before booking an appointment, first search for a doctor by category",
              },
              {
                icon: "📍",
                title: "Choose Your Location",
                description:
                  "Enter your location and we will help you find appointments near you",
              },
              {
                icon: "📅",
                title: "Schedule Appointment",
                description:
                  "Select a date to schedule an appointment with your doctor",
              },
              {
                icon: "🎉",
                title: "Get Your Solution",
                description:
                  "We will help you find and provide solutions for your health",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 sm:p-6 text-teal-500 transition duration-300 ease-in-out transform hover:shadow-lg hover:scale-105 hover:bg-teal-50"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        

        <div className="mt-12 w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row w-full h-auto">
            {/* <!-- Left Section --> */}
            <div className="w-full md:w-1/2 bg-slate-100 p-4 flex justify-center items-center">
              <div className="relative w-96">
                {/* Floating Black Div */}
                <div className="absolute top-0 left-0 w-64 h-40 bg-white shadow-sm rounded-xl z-10 ml-72 mt-4 ">
                  <h1 className="px-12 py-5 font-sans font-semibold ">
                    Meet Our Doctors
                  </h1>
                  <div className="flex items-center justify-evenly space-x-3">
                    <div className="absolute rounded-full border bg-gray-300 border-white hover:scale-50 duration-150 shadow-sm w-8 left-0 h-8 "></div>
                    <div className="absolute rounded-full border bg-gray-300 border-white hover:scale-50 duration-150 shadow-sm w-8 left-3 h-8 "></div>
                    <div className="absolute rounded-full border bg-gray-300 border-white hover:scale-50 duration-150 shadow-sm w-8 left-9 h-8 "></div>
                    <div className="absolute rounded-full border bg-gray-300 border-white hover:scale-50 duration-150 shadow-sm w-8 left-14 h-8 "></div>
                  </div>
                </div>

                {/* Image Section */}
                <img
                  src="/pictures/wow.jpg"
                  className="w-96 h-auto rounded-md object-cover"
                  alt="Meet a doctor"
                />
              </div>
            </div>

            {/* <!-- Right Section --> */}
            <div className="w-full md:w-1/2 flex flex-col mt-10 px-8 ">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                We Are Always Ensure Best Medical Treatment For Your Health
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center">
                  <span className="text-yellow-500 font-bold mr-2">✓</span>
                  <span className="font-sans text-gray-500">
                    {" "}
                    Top Specialist Doctor
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 font-bold mr-2">✓</span>
                  <span className="font-sans text-gray-500">
                    State Of The Art Doctor Services
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500  font-bold mr-2">✓</span>
                  <span className="font-sans text-gray-500">
                    {" "}
                    Discount For All Medical Treatment
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 font-bold mr-2">✓</span>
                  <span className="font-sans text-gray-500">
                    {" "}
                    Enrollment Is Quick And Easy
                  </span>
                </li>
              </ul>
              <div className="mt-4">
                <button className="w-1/2 mt-6 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600">
                  Make an Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full bg-white mt-6 rounded-lg shadow-lg border">
      {/* Left Content Section */}
      <div className="w-full md:w-1/2 h-auto p-8 flex flex-col">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          Different Types Of Department
          <br />
          To Service For Your Health
        </h2>
        <p className="text-gray-600 mb-6 text-base leading-relaxed">
          In terms of patient demand, we have different sorts of departments
          to serve the best treatment in the city.
        </p>
        <a
          href="#"
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm mb-10"
        >
          Read More
        </a>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cardiology Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-purple-600 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-blue-50 group-hover:bg-white/20">
              <Heart
                className="text-blue-500 group-hover:text-white"
                size={28}
              />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
              Cardiology
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
              Specialized care for heart conditions, including diagnostic
              testing, treatment, and prevention of cardiovascular diseases.
            </p>
          </div>

          {/* Pediatrics Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-purple-600 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-purple-500 group-hover:bg-white/20">
              <Baby className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
              Pediatrics
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
              Comprehensive healthcare for children from birth through
              adolescence, focusing on growth, development, and wellness.
            </p>
          </div>

          {/* Ophthalmology Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-purple-600 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-cyan-50 group-hover:bg-white/20">
              <Eye
                className="text-cyan-500 group-hover:text-white"
                size={28}
              />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
              Ophthalmology
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
              Expert eye care services including diagnosis, treatment, and
              surgery for various vision and eye health conditions.
            </p>
          </div>

          {/* Dentistry Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-purple-600 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-yellow-50 group-hover:bg-white/20">
              <Smile
                className="text-yellow-500 group-hover:text-white"
                size={28}
              />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
              Dentistry
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
              Complete dental care services including preventive,
              restorative, and cosmetic treatments for optimal oral health.
            </p>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="w-full md:w-1/2 h-auto relative p-8 flex justify-center items-center">
        {/* Floating Card */}
        <div className="bg-white shadow-lg rounded-xl w-72 absolute bottom-12 left-12 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Available Doctors
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Verified Doctors
          </p>

          {/* Profile Section */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="rounded-full w-12 h-12 bg-gray-900"></div>
            <div>
              <p className="text-gray-900 text-base font-semibold">
                Dr. Tamara Dai
              </p>
              <p className="text-gray-500 text-sm">Cardiologist</p>
            </div>
          </div>

          {/* Button */}
          <button className="w-full px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
            Select Doctor
          </button>
        </div>

        {/* Main Image */}
        <img
          className="w-4/5 h-auto ml-auto object-cover rounded-lg shadow-lg"
          src="/pictures/doctor-in-video.jpg"
          alt="Doctor consulting patient"
        />
      </div>
    </div>

   
    <div className="bg-white w-full mt-8 rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[600px]">
        {/* Left side - Image Container */}
        <div className="md:w-[520px] h-[600px] relative bg-gray-100">
          <img
            src="/pictures/feedback.jpg"
            alt="Medical professional"
            className="w-full h-full object-cover"
          />
          {/* Doctor info overlay */}
          <div className="absolute bottom-8 left-8 flex items-center bg-white rounded-xl p-4 shadow-lg transform transition-transform hover:scale-105">
            <img
              src="/"
              alt="Dr. Tamara Dai"
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="ml-4">
              <h4 className="font-semibold text-base text-gray-900">Dr. Tamara Dai</h4>
              <p className="text-gray-600 text-sm">Cardiologist</p>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              What They Say About{" "}
              <span className="text-cyan-500">Med-Tech</span>
            </h2>
            <p className="text-gray-600 text-base mb-10 leading-relaxed">
              Most of our users give us feedback regarding our services. 
              You can see their comments below
            </p>

            {/* Rating */}
            <div className="flex items-center mb-8">
              <div className="flex text-yellow-400 text-2xl space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="transform hover:scale-110 transition-transform">★</span>
                ))}
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">4.8</span>
              <span className="ml-2 text-gray-500 text-sm">/5.0</span>
            </div>

            {/* Testimonial */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 text-6xl text-cyan-500 opacity-20">&quot;</div>
              <blockquote className="text-gray-700 italic text-xl leading-relaxed mb-8 relative z-10">
                You won&apos;t regret it. I love it. I didn&apos;t even need training. 
                I will let my mum know about this, she could really make use of it!
              </blockquote>
            </div>

            <div className="flex items-center">
              <div>
                <p className="font-semibold text-gray-900 text-lg">Yolanda Tamara</p>
                <p className="text-gray-500 text-sm">Olivia Pope & Associates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
       

  

    <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] relative -bottom-8 sm:-bottom-12 md:-bottom-16 left-1/2 transform -translate-x-1/2">
      <div className="min-h-[24rem] rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl">
          <div className="absolute top-0 left-0 w-48 h-48 bg-violet-400/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-violet-400/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content Container */}
        <div className="relative flex flex-col items-center justify-center p-6 md:p-8 lg:p-12 text-center">
          {/* Main Heading */}
          <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl max-w-3xl leading-tight">
            Connect Instantly with Doctors
            <span className="block mt-2">Chat for Expert Health Advice</span>
          </h1>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6 w-full max-w-2xl">
            <div className="flex flex-col items-center text-white">
              <div className="bg-white/20 p-2 rounded-full mb-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <p className="text-sm">24/7 Doctor Access</p>
            </div>
            <div className="flex flex-col items-center text-white">
              <div className="bg-white/20 p-2 rounded-full mb-2">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-sm">Verified Specialists</p>
            </div>
            <div className="flex flex-col items-center text-white">
              <div className="bg-white/20 p-2 rounded-full mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm">Quick Response Time</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-sm md:text-base max-w-xl mb-6">
            Get instant access to verified medical professionals for personalized health advice 
            and consultation, anytime and anywhere.
          </p>

          {/* CTA Button */}
          <button className="bg-white text-violet-600 hover:bg-violet-50 transition-colors 
            duration-200 font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg">
            Upgrade to Premium
          </button>

          {/* Badge */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-white text-xs font-medium">Limited Time Offer</span>
          </div>
        </div>
      </div>
    </div>
      </div>
    </section>
  );
};

export default Home;
