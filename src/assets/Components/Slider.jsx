import React, { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import "./Home.css";

const images = [
  { src: "images/morning_for_home.jpeg" },
  { src: "images/workout.jpg" },
  { src: "images/go to work.jpg" },
  { src: "images/healthy_eating.avif" },
  { src: "images/spend_time_with_family.avif" },
  { src: "images/travel.avif" },
];

const Slider = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="slider">
      <p className="quote-text">
        "The secret of your future is hidden in your daily routine ."
      </p>

      <button className="arrow left" onClick={prev}>
        <IoIosArrowBack />
      </button>

      <div className="slider-box">
        <img src={images[index].src} alt={images[index].label} />
        <p>{images[index].label}</p>
      </div>

      <button className="arrow right" onClick={next}>
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Slider;
