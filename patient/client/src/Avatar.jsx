import React, { useEffect, useRef } from 'react';
import animationData from './avatar.json';
import './Avatar.css';

function Avatar({ speaking }) {
  const container = useRef(null);
  const anim = useRef(null);

  useEffect(() => {
    if (window.lottie && container.current) {
      anim.current = window.lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData,
      });
    }
    return () => {
      if (anim.current) {
        anim.current.destroy();
        anim.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!anim.current) return;
    if (speaking) {
      anim.current.play();
    } else {
      anim.current.stop();
    }
  }, [speaking]);

  return <div className="avatar-container" ref={container} />;
}

export default Avatar;
