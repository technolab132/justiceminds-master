import React from 'react';

const LoadingComponent = () => {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
      <style jsx>{`
        .loading {
          display: flex;
          flex-direction: column;
          align-items: top;
          justify-content: center;
          padding:50px;
        }

        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #fff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom:10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingComponent;
