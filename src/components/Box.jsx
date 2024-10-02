import React from 'react';
import '../css/home.css'

const Box = ({ page, imageSrc, altText, title, description }) => {
  const loadPage = () => {
    window.location.href = page;
  };

  return (
    <div className="box" onClick={loadPage}>
      <img src={imageSrc} alt={altText} className="box-image" />
      <h2>{title}</h2>
      <p>{description}</p>
      {/* <iframe title={title}></iframe> */}
    </div>
  );
};

export default Box;
