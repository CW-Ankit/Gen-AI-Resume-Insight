import '../styles/loadingScreen.scss';

const LoadingScreen = () => {
  return (
    <div className="loading-container" role="status" aria-label="Loading content">
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
