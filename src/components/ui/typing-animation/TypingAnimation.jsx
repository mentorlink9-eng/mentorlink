import React, { useState, useEffect } from 'react';
import './TypingAnimation.css';

const TypingAnimation = ({ texts, speed = 100, deleteSpeed = 50, delay = 2000 }) => {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const current = texts[textIndex];
    let timer;

    if (!isDeleting && currentText.length < current.length) {
      timer = setTimeout(() => {
        setCurrentText(current.substring(0, currentText.length + 1));
      }, speed);
    } else if (!isDeleting && currentText.length === current.length) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && currentText.length > 0) {
      timer = setTimeout(() => {
        setCurrentText(current.substring(0, currentText.length - 1));
      }, deleteSpeed);
    } else if (isDeleting && currentText.length === 0) {
      setIsDeleting(false);
      setTextIndex((textIndex + 1) % texts.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIndex, texts, speed, deleteSpeed, delay]);

  return (
    <span className="typing-text">
      {currentText}
      <span className="cursor">|</span>
    </span>
  );
};

export default TypingAnimation;
