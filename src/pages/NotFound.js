import React from 'react';
import "../css/notfound.css";

const NotFound = () => {
  const handleNavigateHome = () => {
    window.location.href = '/'; // Navigate to the home page
  };

  return (
    <div className="not-found-container">
      <img 
        src="https://cdn.svgator.com/images/2022/01/404-svg-animation.svg" 
        alt="404 Animation" 
        className="not-found-image"
      />
      <div className="not-found-content">
        {/* <h1>404</h1> */}
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <button onClick={handleNavigateHome}>Back to Home</button>
      </div>
    </div>
  );
};

export default NotFound;
