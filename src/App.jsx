import React, { useState } from 'react';
import MatrixInput from './components/MatrixInput/MatrixInput';
import MatrixDisplay from './components/MatrixDisplay/MatrixDisplay';
import { parseDimensions, generateMatrices, matrixChainOrder, getOptimalParenthesization } from './utils/matrixChainUtils';

const App = () => {
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

  const examples = {
    simple: '10, 20, 30, 40',
    medium: '5, 10, 3, 12, 5, 50, 6',
    complex: '30, 35, 15, 5, 10, 20, 25'
  };

  const handleInputChange = (e) => {
    setDimensions(e.target.value);
    setError('');
  };

  const handleExampleSelect = (example) => {
    setDimensions(examples[example]);
    setShowExample(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      try {
        const dims = parseDimensions(dimensions);
        const generatedMatrices = generateMatrices(dims).map((matrix, index) => ({
          ...matrix,
          name: `M${index + 1}`,
          size: `${matrix.rows}×${matrix.cols}`
        }));
        setMatrices(generatedMatrices);

        const { m: cost, s: split } = matrixChainOrder(dims);
        setCostTable(cost);
        setSplitTable(split);

        const n = dims.length - 1;
        const parenthesization = getOptimalParenthesization(split, 0, n - 1);
        setOptimalParenthesization(parenthesization);
        setMinCost(cost[0][n - 1]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500);
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
          <h1 className="text-2xl font-bold text-white">ChainReactions</h1>
          <p className="text-blue-200 text-sm mt-1">Visualizing Matrix Chain Multiplication with Dynamic Programming</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="mb-8">
            <MatrixInput
              dimensions={dimensions}
              onInputChange={handleInputChange}
              onExampleSelect={handleExampleSelect}
              showExample={showExample}
              setShowExample={setShowExample}
              examples={examples}
            />
            
            {error && (
              <div className="mt-2 p-2 bg-red-900/50 border-l-4 border-red-500 text-red-200 text-sm">
                {error}
              </div>
            )}
            
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

          <MatrixDisplay
            matrices={matrices}
            costTable={costTable}
            splitTable={splitTable}
            optimalParenthesization={optimalParenthesization}
            minCost={minCost}
          />
          
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
                  <h3 className="text-md font-semibold text-blue-300 mb-2">Pseudocode</h3>
                  <div className="bg-black/50 p-4 rounded-lg border border-gray-800 font-mono text-sm">
                    <pre className="text-gray-300">
{`function MATRIX-CHAIN-ORDER(p):
    n = length(p) - 1
    let m[1..n, 1..n] and s[1..n-1, 2..n] be new tables
    
    for i = 1 to n:
        m[i, i] = 0
    
    for l = 2 to n:           // l is the chain length
        for i = 1 to n-l+1:   // i is the starting index
            j = i + l - 1     // j is the ending index
            m[i, j] = ∞
            
            for k = i to j-1: // k is the split point
                q = m[i, k] + m[k+1, j] + p[i-1]*p[k]*p[j]
                if q < m[i, j]:
                    m[i, j] = q
                    s[i, j] = k
    
    return m and s

function PRINT-OPTIMAL-PARENS(s, i, j):
    if i == j:
        print "A" + i
    else:
        print "("
        PRINT-OPTIMAL-PARENS(s, i, s[i, j])
        PRINT-OPTIMAL-PARENS(s, s[i, j]+1, j)
        print ")"`}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    <p className="mb-2">Where:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code className="text-blue-400">p</code>: Array of matrix dimensions</li>
                      <li><code className="text-blue-400">m[i, j]</code>: Minimum number of scalar multiplications needed to compute A<sub>i</sub>...A<sub>j</sub></li>
                      <li><code className="text-blue-400">s[i, j]</code>: Index of the optimal split point</li>
                      <li><code className="text-blue-400">l</code>: Length of the chain being considered</li>
                      <li><code className="text-blue-400">k</code>: Split point being evaluated</li>
                    </ul>
                  </div>
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
            ChainReactions • Matrix Chain Multiplication Optimizer
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;