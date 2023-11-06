import React from 'react';

const ErrorMessage = ({ error, setError }) => (
  <>
  {error && (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 flex justify-between" role="alert">
      <div>
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
      <div>
        <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
          <span className="text-xl">&times;</span>
        </button>
      </div>
    </div>
  )}
  </>
);

export default ErrorMessage;
