import App from './App.jsx';

const init = async (socket) => {
  if (!socket) {
    throw new Error('Socket instance is required');
  }

  return <App />;
};

export default init;
