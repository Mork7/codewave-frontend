import { useEffect, useRef, useState } from "react";
import "../index.css";
import slide1 from "/slide1.jpg";
import slide2 from "/slide2.jpg";
import slide3 from "/slide3.jpg";
import slide4 from "/slide4.jpg";
import slide5 from "/slide5.jpg";
import slide6 from "/slide6.jpg";
import aboutus from "/about-us.jpg";
import {
  FaBook,
  FaUsers,
  FaTools,
  FaGraduationCap,
  FaGithub,
  FaLinkedin,
  FaPause,
  FaPlay,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import loginLogo from "/login-logo.png";
import loginLogoDark from "/login-logo-dark.png";

const useFadeInOnScroll = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return sectionRefs;
};

function LandingPage() {
  const sectionRefs = useFadeInOnScroll();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = [slide1, slide2, slide3, slide4, slide5, slide6];
  const slideCaptions = [
    "Welcome to your Student Course Management System",
    "Manage your classes and grades with ease",
    "Building a better tomorrow, together",
    "Select the courses for you",
    "Schedule your favourite classes with the right professors",
    "Empowering students and educators through technology",
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const features = [
    {
      icon: <FaBook className="text-6xl text-[#dc9ee5]" />,
      title: "Organize Your Courses",
      description:
        "Easily manage and organize all your courses in one centralized platform.",
    },
    {
      icon: <FaUsers className="text-6xl text-[#dc9ee5]" />,
      title: "Collaborate with Ease",
      description:
        "Work seamlessly with peers and educators to improve learning outcomes.",
    },
    {
      icon: <FaTools className="text-6xl text-[#dc9ee5]" />,
      title: "Powerful Tools",
      description:
        "Advanced tools to select courses, calculate grades, track progress, and schedule classes.",
    },
    {
      icon: <FaGraduationCap className="text-6xl text-[#dc9ee5]" />,
      title: "Achieve Academic Success",
      description:
        "Stay on top of your academic goals with streamlined and efficient tools and a user-friendly interface.",
    },
  ];

  const teamMembers = [
    {
      name: "Mark",
      role: "Team Lead",
      img: "mark-profile.jpeg",
      description:
        "Mark is the team lead, known for his strong leadership and expertise in both backend and frontend development.",
      github: "https://github.com/Mork7",
      linkedin: "https://www.linkedin.com/in/mark-finerty/",
      logo: loginLogo,
    },
    {
      name: "Markos",
      role: "UX/UI Designer",
      img: "markos-profile.jpeg",
      description:
        "Markos is a talented UX/UI designer and IT tech who creates intuitive and beautiful user interfaces.",
      github: "https://github.com/markosmora",
      linkedin: "https://linkedin.com/in/markosmora",
      logo: loginLogoDark,
    },
    {
      name: "Saleena",
      role: "Frontend Developer",
      img: "saleena-profile.jpeg",
      description:
        "Saleena specializes in frontend development, bringing designs to life with clean and efficient code.",
      github: "https://github.com/SaleenaF",
      linkedin: "https://www.linkedin.com/in/saleenafarrukh/",
      logo: loginLogo,
    },
    {
      name: "Shahir",
      role: "Backend Developer",
      img: "Shahir.jpeg",
      description:
        "Shahir is an expert in backend development, ensuring the server-side logic is robust and scalable.",
      github: "https://github.com/KhanShahir",
      linkedin: "https://www.linkedin.com/in/shahirkhan/",
      logo: loginLogoDark,
    },
  ];

  return (
    <div className="h-auto flex flex-col items-center justify-center text-gray-800 landing-page mt-32 bg-gray-100">
      {/* Background Layer at Lowest Z-Level */}
      <div className="absolute inset-0 w-full h-full bg-gray-100 z-[0]"></div>

      {/* Hero Section with Blue Overlay */}
      <section
        className="relative w-full h-[80vh] flex items-center justify-center text-center"
        ref={(el) => (sectionRefs.current[0] = el)}
      >
        {/* Blue overlay on the left half */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-start"
          style={{ width: "50.6%" }}
        >
          <div className="absolute inset-0 bg-[#1A1E36] opacity-80 z-0"></div>{" "}
          {/* Blue background with low opacity */}
          <div className="z-20 max-w-4xl p-8 text-white text-left ml-16">
            <h1 className="text-6xl font-bold mb-4">
              Codewave Student Solutions
            </h1>
            <p className="text-2xl italic">{slideCaptions[currentSlide]}</p>
            <button
              onClick={togglePause}
              className="mt-4 p-2 bg-white text-[#1A1E36] rounded-full flex items-center gap-2"
            >
              {isPaused ? <FaPlay /> : <FaPause />}
              <span className="text-[#1A1E36] font-semibold">
                {isPaused ? "Play" : "Pause"}
              </span>
            </button>
          </div>
        </div>

        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-0" : "opacity-0"
            }`}
          />
        ))}
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-16 bg-gray-100 transform translate-y-10"
        ref={(el) => (sectionRefs.current[1] = el)}
      >
        <div className="mx-auto px-8 text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-12">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 flex flex-col items-center rounded-lg border-2 border-gray-300"
              >
                {feature.icon}
                <h3 className="text-2xl font-semibold mt-4 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className="w-full py-16 opacity-0 transform translate-y-10 bg-white"
        ref={(el) => (sectionRefs.current[2] = el)}
      >
        <div className="mx-auto px-8 text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-12">
            About Us
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="md:w-1/2 p-4">
              <img
                src={aboutus}
                alt="About Us"
                className="rounded-lg shadow-lg object-cover w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-4 text-left">
              <p className="text-xl leading-relaxed text-gray-700">
                Welcome to{" "}
                <span className="font-semibold text-[#DC9EE5]">
                  Codewave Student Solutions
                </span>
                , an innovative team dedicated to empowering students and
                educators through technology. Our flagship product, the{" "}
                <span className="font-semibold text-[#DC9EE5]">
                  Student Course Management System
                </span>
                , is designed to simplify academic life by streamlining the
                process of tracking classes, managing updates, and calculating
                grades efficiently.
              </p>
              <p className="text-xl leading-relaxed text-gray-700 mt-6">
                At Codewave, we prioritize creating user-friendly solutions that
                address the challenges of modern education. Whether you&apos;re
                a student aiming to stay on top of your assignments or an
                educator seeking efficient tools to manage course data, our
                platform is tailored to meet your needs. Join us on this journey
                to revolutionize education!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <div className="w-full text-center">
        <section
          id="team"
          className="w-full py-16 bg-gray-100 transform translate-y-10"
          ref={(el) => (sectionRefs.current[3] = el)}
        >
          <div className="mx-auto px-8 text-center">
            <h2 className="text-4xl font-semibold text-gray-800 mb-12">
              Meet the Team
            </h2>

            {/* Profiles in a row with minimized spacing */}
            <div className="flex flex-wrap justify-center gap-4">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="relative border-2 border-gray-300 bg-white rounded-lg p-6 flex items-center w-[330px] flex-grow"
                >
                  {/* Member Logo (top right corner) */}
                  <img
                    src={member.logo}
                    alt="Logo"
                    className="absolute top-4 right-4 w-8 h-7"
                  />

                  {/* Left side: Profile Image & Links */}
                  <div className="flex flex-col items-center mr-4">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-28 h-28 rounded-full object-cover mb-3"
                    />

                    {/* Social Links Below Image */}
                    <div className="flex space-x-2">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub className="text-xl text-gray-800 hover-pink" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLinkedin className="text-xl text-gray-800 hover-pink" />
                      </a>
                    </div>
                  </div>

                  {/* Right side: Text Content */}
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-semibold text-gray-800 hover-pink">
                      {member.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{member.role}</p>
                    <p className="text-gray-600 text-sm">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer
        id="contact"
        className="w-full bg-[#1A1E36] text-white py-12 z-[10]"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Codewave Solutions</h3>
              <p className="text-gray-400">
                Empowering students through innovative technology.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="hover-pink">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover-pink">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#team" className="hover-pink">
                    Team
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover-pink">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover-pink">
                  <FaFacebook className="text-2xl" />
                </a>
                <a href="#" className="hover-pink">
                  <FaTwitter className="text-2xl" />
                </a>
                <a href="#" className="hover-pink">
                  <FaInstagram className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 Codewave Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
