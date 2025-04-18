import React from 'react';

const MatrixInput = ({ dimensions, onInputChange, onExampleSelect, showExample, setShowExample, examples }) => {
  return (
    <div className="mb-4">
      <label htmlFor="dimensions" className="block text-sm font-medium text-gray-300 mb-2">
        Enter matrix dimensions (comma separated):
      </label>
      
      <div className="relative">
        <input
          type="text"
          id="dimensions"
          value={dimensions}
          onChange={onInputChange}
          placeholder="e.g., 10, 20, 30, 40"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-400 transition-colors"
          required
        />
        <button 
          type="button"
          onClick={() => setShowExample(!showExample)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
        >
          Examples
        </button>
      </div>
      
      {showExample && (
        <div className="mt-2 p-3 bg-gray-700 rounded-md border border-gray-600">
          <p className="text-sm text-gray-300 mb-2">Select an example:</p>
          <div className="flex flex-wrap gap-2">
            <button 
              type="button" 
              onClick={() => onExampleSelect('simple')} 
              className="px-3 py-1 text-xs bg-blue-900 text-blue-200 rounded hover:bg-blue-800 transition-colors"
            >
              Simple (4 dimensions)
            </button>
            <button 
              type="button" 
              onClick={() => onExampleSelect('medium')} 
              className="px-3 py-1 text-xs bg-blue-900 text-blue-200 rounded hover:bg-blue-800 transition-colors"
            >
              Medium (7 dimensions)
            </button>
            <button 
              type="button" 
              onClick={() => onExampleSelect('complex')} 
              className="px-3 py-1 text-xs bg-blue-900 text-blue-200 rounded hover:bg-blue-800 transition-colors"
            >
              Complex (7 dimensions)
            </button>
          </div>
        </div>
      )}
      
      <p className="mt-2 text-sm text-gray-400">
        For matrices M<sub>1</sub>(10×20), M<sub>2</sub>(20×30), M<sub>3</sub>(30×40) enter "10, 20, 30, 40"
      </p>
    </div>
  );
};

export default MatrixInput; 