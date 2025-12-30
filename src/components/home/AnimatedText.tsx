import { useState, useEffect } from "react";

const careers = [
  "Software Engineer",
  "Data Scientist",
  "UX Designer",
  "Doctor",
  "Business Analyst",
  "Digital Marketer",
  "Architect",
  "Financial Advisor",
];

export const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % careers.length);
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block gradient-text font-bold transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {careers[currentIndex]}
    </span>
  );
};
