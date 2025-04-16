import React, { useState, useEffect } from 'react';

const MatrixChainCalculator = () => {
  const [dimensions, setDimensions] = useState('');
  const [matrices, setMatrices] = useState([]);
  const [costTable, setCostTable] = useState([]);
  const [splitTable, setSplitTable] = useState([]);
  const [optimalParenthesization, setOptimalParenthesization] = useState('');
  const [minCost, setMinCost] = useState(null);
  const [error, setError] = useState('');
  const [showExample, setShowExample] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Example matrices for quick testing
  const examples = {
    simple: '10, 20, 30, 40',
    medium: '5, 10, 3, 12, 5, 50, 6',
    complex: '30, 35, 15, 5, 10, 20, 25'
  };

  const handleInputChange = (e) => {
    setDimensions(e.target.value);
    setError('');
  };

  const setExample = (example) => {
    setDimensions(examples[example]);
    setShowExample(false);
  };

  const parseDimensions = () => {
    try {
      const dims = dimensions.split(',').map(d => {
        const num = parseInt(d.trim());
        if (isNaN(num)) throw new Error('Invalid dimension');
        if (num <= 0) throw new Error('Dimensions must be positive');
        return num;
      });
      
      if (dims.length < 2) {
        throw new Error('Please enter at least 2 dimensions (for 1 matrix)');
      }
      
      return dims;
    } catch (err) {
      setError(err.message || 'Please enter valid positive numbers separated by commas');
      return null;
    }
  };

  const generateMatrices = (dims) => {
    const matrices = [];
    for (let i = 0; i < dims.length - 1; i++) {
      matrices.push({
        name: `M${i + 1}`,
        rows: dims[i],
        cols: dims[i + 1],
        size: `${dims[i]}×${dims[i + 1]}`,
      });
    }
    return matrices;
  };

  const matrixChainOrder = (dims) => {
    const n = dims.length - 1;
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    const s = Array.from({ length: n }, () => Array(n).fill(0));

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i < n - len + 1; i++) {
        const j = i + len - 1;
        m[i][j] = Infinity;
        for (let k = i; k < j; k++) {
          const cost = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
          if (cost < m[i][j]) {
            m[i][j] = cost;
            s[i][j] = k;
          }
        }
      }
    }

    return { m, s };
  };

  const getOptimalParenthesization = (s, i, j) => {
    if (i === j) {
      return `M${i + 1}`;
    } else {
      return `(${getOptimalParenthesization(s, i, s[i][j])} × ${getOptimalParenthesization(s, s[i][j] + 1, j)})`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      try {
        const dims = parseDimensions();
        if (!dims) {
          setLoading(false);
          return;
        }

        const matrices = generateMatrices(dims);
        setMatrices(matrices);

        const { m: costTable, s: splitTable } = matrixChainOrder(dims);
        setCostTable(costTable);
        setSplitTable(splitTable);
        setMinCost(costTable[0][dims.length - 2]);
        setOptimalParenthesization(getOptimalParenthesization(splitTable, 0, dims.length - 2));
      } catch (err) {
        setError('Error during calculation. Please check your input.');
      } finally {
        setLoading(false);
      }
    }, 500); // Brief timeout to show loading state
  };

  const resetCalculator = () => {
    setDimensions('');
    setMatrices([]);
    setCostTable([]);
    setSplitTable([]);
    setOptimalParenthesization('');
    setMinCost(null);
    setError('');
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-800 to-blue-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Matrix Chain Multiplication Optimizer</h1>
          <p className="text-blue-200 text-sm mt-1">Calculate the optimal order for multiplying matrices to minimize operations</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="dimensions" className="block text-sm font-medium text-gray-300 mb-2">
                Enter matrix dimensions (comma separated):
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  id="dimensions"
                  value={dimensions}
                  onChange={handleInputChange}
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
                      onClick={() => setExample('simple')} 
                      className="px-3 py-1 text-xs bg-blue-900 text-blue-200 rounded hover:bg-blue-800 transition-colors"
                    >
                      Simple (4 dimensions)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setExample('medium')} 
                      className="px-3 py-1 text-xs bg-blue-900 text-blue-200 rounded hover:bg-blue-800 transition-colors"
                    >
                      Medium (7 dimensions)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setExample('complex')} 
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
              
              {error && (
                <div className="mt-2 p-2 bg-red-900/50 border-l-4 border-red-500 text-red-200 text-sm">
                  {error}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading || !dimensions.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : "Calculate Optimal Order"}
              </button>
              
              {matrices.length > 0 && (
                <button
                  type="button"
                  onClick={resetCalculator}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          {matrices.length > 0 && (
            <div className="space-y-8">
              <div className="bg-gray-750 rounded-lg border border-gray-600 overflow-hidden">
                <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-100">Input Matrices</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Matrix</th>
                        <th className="px-4 py-3 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Dimensions</th>
                        <th className="px-4 py-3 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600 bg-gray-750">
                      {matrices.map((matrix, index) => (
                        <tr key={index} className="hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-200">{matrix.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            p<sub>{index}</sub> × p<sub>{index + 1}</sub>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">{matrix.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {minCost !== null && (
                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-700 p-6">
                  <h2 className="text-lg font-semibold text-blue-200 mb-3">Optimization Results</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-300">Minimum Multiplication Cost:</p>
                      <p className="text-2xl font-bold text-blue-300">{minCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">Optimal Parenthesization:</p>
                      <p className="text-lg font-mono bg-gray-800 p-3 rounded border border-gray-600 overflow-x-auto text-blue-200">
                        {optimalParenthesization}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-750 rounded-lg border border-gray-600 overflow-hidden">
                <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-100">Cost Table (m)</h2>
                  <p className="text-xs text-gray-400 mt-1">The minimum number of scalar multiplications needed to compute each subchain</p>
                </div>
                <div className="overflow-x-auto p-3">
                  <table className="min-w-full bg-gray-750 border border-gray-600">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300"></th>
                        {matrices.map((_, j) => (
                          <th key={j} className="px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300">
                            {j + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {costTable.map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300">{i + 1}</td>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={`px-3 py-2 border border-gray-600 text-sm ${
                                i === 0 && j === costTable.length - 1 
                                  ? 'bg-blue-900 font-semibold text-blue-200' 
                                  : cell === 0 ? 'bg-gray-700 text-gray-500' : 'text-gray-300'
                              }`}
                            >
                              {cell === 0 ? '-' : cell.toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-750 rounded-lg border border-gray-600 overflow-hidden">
                <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-100">Split Table (s)</h2>
                  <p className="text-xs text-gray-400 mt-1">The position at which to split each subchain for optimal multiplication</p>
                </div>
                <div className="overflow-x-auto p-3">
                  <table className="min-w-full bg-gray-750 border border-gray-600">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300"></th>
                        {matrices.map((_, j) => (
                          <th key={j} className="px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300">
                            {j + 1} {/* Updated: Column headers start from 2 */}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {splitTable.map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300">{i + 1}</td>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={`px-3 py-2 border border-gray-600 text-sm ${
                                i === 0 && j === splitTable.length - 1 
                                  ? 'bg-blue-900 font-semibold text-blue-200' 
                                  : cell === 0 ? 'bg-gray-700 text-gray-500' : 'text-gray-300'
                              }`}
                            >
                              {cell === 0 ? '-' : cell + 1}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Algorithm Information Section */}
          <div className="mt-8 bg-gray-750 rounded-lg border border-gray-600 overflow-hidden">
            <div className="bg-gray-700 px-4 py-3 border-b border-gray-600 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-100">Algorithm Information</h2>
              <button
                onClick={toggleInfo}
                className="text-blue-400 hover:text-blue-300 focus:outline-none text-sm flex items-center"
              >
                {showInfo ? "Hide Details" : "Show Details"}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transition-transform ${showInfo ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {showInfo && (
              <div className="p-4 text-gray-300 space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-blue-300 mb-2">About Matrix Chain Multiplication</h3>
                  <p className="text-sm leading-relaxed">
                    Matrix chain multiplication is an optimization problem that seeks to find the most efficient way to multiply a sequence of matrices. The problem is not about actually performing the multiplication, but rather determining the optimal sequence of operations to minimize the total number of scalar multiplications.
                  </p>
                  <p className="text-sm mt-2 leading-relaxed">
                    For matrices, the multiplication operation is associative but not commutative. This means that while the order of matrices cannot be changed (A×B×C must remain in that sequence), we can choose how to group the operations using parentheses: (A×B)×C or A×(B×C).
                  </p>
                  <p className="text-sm mt-2 leading-relaxed">
                    The computational cost of multiplying two matrices depends on their dimensions. For a p×q matrix A and a q×r matrix B, multiplying them requires p×q×r scalar multiplications. The goal is to find the parenthesization that minimizes the total number of scalar multiplications needed.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold text-blue-300 mb-2">Time Complexity</h3>
                  <div className="bg-gray-800 p-3 rounded border border-gray-600">
                    <p className="text-sm font-mono">O(n³)</p>
                    <p className="text-xs mt-1 text-gray-400">Where n is the number of matrices in the chain</p>
                  </div>
                  <p className="text-sm mt-2 leading-relaxed">
                    The algorithm uses dynamic programming to fill two tables:
                  </p>
                  <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                    <li>The cost table (m) stores the minimum number of scalar multiplications needed.</li>
                    <li>The split table (s) stores the optimal position to split each subchain.</li>
                  </ul>
                  <p className="text-sm mt-2 leading-relaxed">
                    The algorithm requires three nested loops:
                    <br />- The outer loop iterates through all possible chain lengths (2 to n).
                    <br />- The middle loop iterates through all possible starting positions.
                    <br />- The inner loop tries all possible split positions for each subproblem.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-blue-300 mb-2">Space Complexity</h3>
                  <div className="bg-gray-800 p-3 rounded border border-gray-600">
                    <p className="text-sm font-mono">O(n²)</p>
                    <p className="text-xs mt-1 text-gray-400">Where n is the number of matrices in the chain</p>
                  </div>
                  <p className="text-sm mt-2 leading-relaxed">
                    The algorithm uses two n×n tables:
                  </p>
                  <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                    <li>The cost table (m) - O(n²) space</li>
                    <li>The split table (s) - O(n²) space</li>
                  </ul>
                  <p className="text-sm mt-2 leading-relaxed">
                    Since both tables are of size n×n, the overall space complexity is O(n²).
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-blue-300 mb-2">Applications</h3>
                  <p className="text-sm leading-relaxed">
                    Matrix chain multiplication optimization is important in many fields:
                  </p>
                  <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                    <li>Linear algebra and scientific computing</li>
                    <li>Computer graphics and 3D transformations</li>
                    <li>Machine learning and neural networks</li>
                    <li>Signal processing and data analysis</li>
                    <li>Operations research and optimization problems</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-blue-300 mb-2">Example</h3>
                  <p className="text-sm leading-relaxed">
                    Consider multiplying matrices with dimensions: 10×30, 30×5, 5×60.
                  </p>
                  <p className="text-sm mt-2 leading-relaxed">
                    Two possible ways to parenthesize:
                    <br />1. (A×B)×C: Cost = (10×30×5) + (10×5×60) = 1,500 + 3,000 = 4,500
                    <br />2. A×(B×C): Cost = (30×5×60) + (10×30×60) = 9,000 + 18,000 = 27,000
                  </p>
                  <p className="text-sm mt-2 leading-relaxed">
                    Clearly, option 1 is better with 4,500 scalar multiplications vs. 27,000.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-850 px-6 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Matrix Chain Multiplication Optimizer • Dynamic Programming Solution
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatrixChainCalculator;