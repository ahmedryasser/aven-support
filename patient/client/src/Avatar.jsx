import React from 'react';
import './Avatar.css';

function Avatar({ speaking }) {
  return (
    <div className={`avatar ${speaking ? 'speaking' : ''}`}>
      <div className="avatar-eyes">
        <div className="eye" />
        <div className="eye" />
      </div>
      <div className="avatar-mouth" />
    </div>
  );
}

export default Avatar;
