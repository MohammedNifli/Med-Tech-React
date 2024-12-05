import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";

interface SpecialtyInfo {
  description: string;
  image: string;
}

// Update the Specialty type to match how you're using it
type Specialty = {
  name: string; // Changed from string[] to string as it seems you're using single strings for names
};

// Define the structure for the entire specialties data object
const specialtiesData: Record<string, SpecialtyInfo> = {
  Cardiology: {
    description: "Specializing in diagnosis and treatment of heart diseases.",
    image: "pictures/cardiology.jpg",
  },
  Neurology: {
    description: "Focusing on disorders of the nervous system.",
    image: "pictures/ped.jpg",
  },
  Pediatrics: {
    description:
      "Providing medical care for infants, children, and adolescents.",
    image: "pictures/ped.jpg", // You'll need to provide the correct image path
  },
  Orthopedics: {
    description:
      "Dealing with conditions involving the musculoskeletal system.",
    image: "pictures/cardiology.jpg", // You'll need to provide the correct image path
  },
  Dermatology: {
    description:
      "Specializing in conditions and diseases of the skin, nails, and hair.",
    image: "pictures/dermatology.jpg", // You'll need to provide the correct image path
  },
};

const Home: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        console.log("Fetching specialties...");
        const response = await axios.get<{ specializations: Specialty[] }>(
          "http://localhost:4444/user/specializations"
        );
        console.log("Response received:", response.data.specializations); // Access the data properly
        setSpecialties(response.data.specializations); // Set the correct field to the state
      } catch (error: any) {
        if (error.response) {
          console.error(
            "Error response from server:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <section className="bg-white py-8 mt-16 sm:mt-24">
      <div className="container mx-auto px-4 border">
        {/* Search Container */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Location"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="w-full sm:w-2/3">
              <input
                type="text"
                placeholder="Search doctors, clinics, hospitals..."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

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

        {/* Specialties Section */}
        {/* <div className="bg-slate-100 rounded-lg w-full py-8 sm:py-12 mt-7">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
            Our Specialties
          </h2>

          <div className="cursor-auto container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Object.entries(specialtiesData).map(([name, info], index) => (
                <div
                  key={index}
                  className="flex bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                >
                  <img
                    src={info.image}
                    alt={`${name} specialty`}
                    className="w-1/2 h-1/2    "
                  />
                  <div className="p-4 sm:p-6 mt-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      {name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

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
        <div className="flex flex-col md:flex-row w-full bg-white mt-4 rounded-lg shadow-lg border">
          {/* Left Content Section */}
          <div className="w-full md:w-1/2 h-auto p-4 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
              Different Types Of Department
              <br />
              To Service For Your Health
            </h2>
            <p className="text-gray-600 mb-3 text-sm">
              In terms of patient demand, we have different sorts of departments
              to serve the best treatment in the city.
            </p>
            <a
              href="#"
              className="text-blue-600 hover:underline font-medium text-sm"
            >
              Read More
            </a>

            {/* First Row of Boxes */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="bg-black w-80 h-52 rounded-lg"></div>
              <div className="bg-green-300 w-80 h-52 rounded-lg"></div>
            </div>

            {/* Second Row of Boxes */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="bg-red-500 w-80 h-52 rounded-lg"></div>
              <div className="bg-yellow-400 w-80 h-52 rounded-lg"></div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="w-full md:w-1/2 h-auto relative p-4 flex justify-center items-center">
            {/* Floating Card */}
            <div className="bg-white shadow-lg rounded-lg w-64 h-64 absolute bottom-6 left-6 p-4">
              <h1 className="font-sans font-semibold text-lg mb-2 ">
                Available Doctors
              </h1>
              <h6 className="font-sans font-thin text-gray-400 mb-4">
                Verified Doctors
              </h6>

              {/* Profile Section */}
              <div className="flex items-center space-x-3">
                <div className="rounded-full w-10 h-10 bg-black"></div>
                <div>
                  <p className="text-gray-800 text-sm font-medium">
                    Dr. Tamara Dai
                  </p>
                  <p className="text-gray-500 text-xs">Cardiologist</p>
                </div>
              </div>

              {/* Button */}
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                Select Doctor
              </button>
            </div>

            {/* Main Image */}
            <img
              className="w-5/6 md:w-4/6 h-auto ml-60 object-cover rounded-lg"
              src="/pictures/doctor-in-video.jpg"
              alt="Doctor"
            />
          </div>
        </div>

        <div className="w-full sm:w-[90vw] md:w-[80vw] lg:w-[75vw] h-auto min-h-[15rem] sm:min-h-[16rem] md:min-h-[18rem] lg:min-h-[20rem] rounded-2xl bg-violet-500 relative -bottom-10 sm:-bottom-16 md:-bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          <h1 className="font-medium text-white text-2xl sm:text-3xl md:text-4xl text-center leading-tight">
            Connect Instantly with Doctors:
            <br className="hidden sm:inline" /> Chat for Expert Health Advice
            and Personalized Care Anytime
          </h1>
          <p className="text-white text-center mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base">
            Chat with doctors and gain valuable advice. You can chat with
            verified doctors.
          </p>
          <button className="rounded hover:bg-green-700 bg-green-500 text-white font-bold h-8 sm:h-9 md:h-10 w-28 sm:w-32 mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base">
            Go Premium
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
 