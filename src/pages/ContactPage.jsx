import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useProfile } from "../hooks";
import { useApiHost } from "../hooks";
import Swal from "sweetalert2";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Ensure Quill's CSS is loaded
import DOMPurify from 'dompurify';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { API_HOST } = useApiHost();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API_HOST}/contact/`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Your message has been sent to the admin. We'll get back to you soon.",
        });

        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(res.data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Contact Us
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@uwindsor.ca"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Question about courses"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6 text-center items-stretch">
          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center">
            <div className="text-blue-600 text-2xl mb-3">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p className="text-gray-600">401 Sunset Ave, Windsor, ON N9B 3P4</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center">
            <div className="text-blue-600 text-2xl mb-3">
              <i className="fas fa-phone"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-gray-600">(519) 253-3000</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center">
            <div className="text-blue-600 text-2xl mb-3">
              <i className="fas fa-envelope"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            
            {/* Mark Finerty */}
            <p className="text-gray-600 text-sm mb-2">
              Mark Finerty{" "}
              <a
                href="mailto:finertym@uwindsor.ca"
                className="text-blue-500 underline"
              >
                finertym@uwindsor.ca
              </a>
            </p>

            {/* Saleena Farrukh */}
            <p className="text-gray-600 text-sm mb-2">
              Saleena Farrukh{" "}
              <a
                href="mailto:farrukhs@uwindsor.ca"
                className="text-blue-500 underline"
              >
                farrukhs@uwindsor.ca
              </a>
            </p>

            {/* Markos Mora Naranjo */}
            <p className="text-gray-600 text-sm mb-2 whitespace-normal break-words">
              Markos Mora Naranjo{" "}
              <a
                href="mailto:markos.moranaranjo@uwindsor.ca"
                className="text-blue-500 underline whitespace-normal break-words"
              >
                markos.moranaranjo@uwindsor.ca
              </a>
            </p>

            {/* Shahir Khan */}
            <p className="text-gray-600 text-sm">
              Shahir Khan{" "}
              <a
                href="mailto:khan99@uwindsor.ca"
                className="text-blue-500 underline"
              >
                khan99@uwindsor.ca
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;