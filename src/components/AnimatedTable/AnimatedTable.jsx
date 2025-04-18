import React, { useState, useEffect, useRef } from 'react';

const AnimatedTable = ({ table, type, matrices, onAnimationComplete, speed = 300 }) => {
  const [displayedTable, setDisplayedTable] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCalculation, setCurrentCalculation] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const intervalRef = useRef(null);
  const currentStepRef = useRef(0);
  const stepsRef = useRef([]);

  const startAnimation = () => {
    if (!table.length) return;

    // Initialize empty table
    const emptyTable = table.map(row => row.map(() => null));
    setDisplayedTable(emptyTable);
    setIsAnimating(true);
    setIsPaused(false);
    setCurrentCalculation(null);
    currentStepRef.current = 0;

    // Generate steps for filling the table
    const n = table.length;
    stepsRef.current = [];
    for (let l = 2; l <= n; l++) {
      for (let i = 0; i < n - l + 1; i++) {
        const j = i + l - 1;
        stepsRef.current.push({ i, j, value: table[i][j] });
      }
    }

    // Start the animation
    animateStep();
  };

  const animateStep = () => {
    if (currentStepRef.current >= stepsRef.current.length) {
      clearInterval(intervalRef.current);
      setIsAnimating(false);
      setCurrentCalculation(null);
      onAnimationComplete?.();
      return;
    }

    const step = stepsRef.current[currentStepRef.current];
    
    // Calculate and show the calculation steps
    if (type === 'cost') {
      const calculation = calculateCostSteps(step.i, step.j, table, matrices);
      setCurrentCalculation(calculation);
    } else {
      const calculation = calculateSplitSteps(step.i, step.j, table);
      setCurrentCalculation(calculation);
    }

    setDisplayedTable(prev => {
      const newTable = [...prev];
      newTable[step.i][step.j] = step.value;
      return newTable;
    });

    currentStepRef.current++;
  };

  const handlePauseResume = () => {
    if (isPaused) {
      // Resume animation
      setIsPaused(false);
      intervalRef.current = setInterval(animateStep, speed);
    } else {
      // Pause animation
      setIsPaused(true);
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAnimation();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [animationKey]);

  useEffect(() => {
    if (!isPaused && isAnimating) {
      intervalRef.current = setInterval(animateStep, speed);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPaused, speed]);

  const handleRestart = () => {
    clearInterval(intervalRef.current);
    setAnimationKey(prev => prev + 1);
  };

  const calculateCostSteps = (i, j, table, matrices) => {
    if (i === j) return null;
    
    let minCost = Infinity;
    let bestK = -1;
    let steps = [];

    for (let k = i; k < j; k++) {
      const cost = table[i][k] + table[k + 1][j] + 
                  matrices[i].rows * matrices[k].cols * matrices[j].cols;
      
      steps.push({
        k,
        cost,
        left: table[i][k],
        right: table[k + 1][j],
        dimensions: `${matrices[i].rows}×${matrices[k].cols}×${matrices[j].cols}`
      });

      if (cost < minCost) {
        minCost = cost;
        bestK = k;
      }
    }

    return {
      i,
      j,
      steps,
      bestK,
      minCost
    };
  };

  const calculateSplitSteps = (i, j, table) => {
    if (i === j) return null;
    
    let minCost = Infinity;
    let bestK = -1;
    let steps = [];

    for (let k = i; k < j; k++) {
      const cost = table[i][k] + table[k + 1][j];
      steps.push({
        k,
        cost,
        left: table[i][k],
        right: table[k + 1][j]
      });

      if (cost < minCost) {
        minCost = cost;
        bestK = k;
      }
    }

    return {
      i,
      j,
      steps,
      bestK
    };
  };

  const getCellClassName = (value, i, j) => {
    const baseClasses = "px-3 py-2 border border-gray-800 text-sm transition-colors duration-300";
    const highlightClass = "bg-blue-900/50 font-semibold text-blue-400";
    const emptyClass = "bg-black/50 text-gray-500";
    const filledClass = "text-gray-300";

    if (i === 0 && j === table.length - 1) {
      return `${baseClasses} ${highlightClass}`;
    }
    if (value === null) {
      return `${baseClasses} ${emptyClass}`;
    }
    return `${baseClasses} ${filledClass}`;
  };

  return (
    <div className="overflow-x-auto p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400">
          {isAnimating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Filling {type === 'cost' ? 'Cost' : 'Split'} Table...
            </span>
          ) : (
            <span className="text-green-400">✓ Table filled</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAnimating && (
            <button
              onClick={handlePauseResume}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2"
            >
              {isPaused ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Resume
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pause
                </>
              )}
            </button>
          )}
          <button
            onClick={handleRestart}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restart
          </button>
        </div>
      </div>

      {currentCalculation && (
        <div className="mb-4 p-4 bg-black/50 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">
            Calculating {type === 'cost' ? 'Cost' : 'Split'} for m[{currentCalculation.i + 1},{currentCalculation.j + 1}]:
          </h3>
          {type === 'cost' ? (
            <div className="space-y-2">
              {currentCalculation.steps.map((step, index) => (
                <div key={index} className={`text-sm ${step.k === currentCalculation.bestK ? 'text-blue-400' : 'text-gray-400'}`}>
                  <span className="font-mono">
                    k={step.k + 1}: m[{currentCalculation.i + 1},{step.k + 1}] + m[{step.k + 2},{currentCalculation.j + 1}] + {step.dimensions} = {step.left} + {step.right} + {step.dimensions} = {step.cost}
                  </span>
                </div>
              ))}
              <div className="mt-2 text-blue-400 font-semibold">
                Minimum cost: {currentCalculation.minCost} (k = {currentCalculation.bestK + 1})
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {currentCalculation.steps.map((step, index) => (
                <div key={index} className={`text-sm ${step.k === currentCalculation.bestK ? 'text-blue-400' : 'text-gray-400'}`}>
                  <span className="font-mono">
                    k={step.k + 1}: m[{currentCalculation.i + 1},{step.k + 1}] + m[{step.k + 2},{currentCalculation.j + 1}] = {step.left} + {step.right} = {step.cost}
                  </span>
                </div>
              ))}
              <div className="mt-2 text-blue-400 font-semibold">
                Best split: k = {currentCalculation.bestK + 1}
              </div>
            </div>
          )}
        </div>
      )}

      <table className="min-w-full bg-black/50 border border-gray-800">
        <thead>
          <tr>
            <th className="px-3 py-2 border border-gray-800 bg-gray-900/80 text-xs font-medium text-gray-400"></th>
            {matrices.map((_, j) => (
              <th key={j} className="px-3 py-2 border border-gray-800 bg-gray-900/80 text-xs font-medium text-gray-400">
                {j + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedTable.map((row, i) => (
            <tr key={i}>
              <td className="px-3 py-2 border border-gray-800 bg-gray-900/80 text-xs font-medium text-gray-400">{i + 1}</td>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={getCellClassName(cell, i, j)}
                >
                  {cell === null ? '-' : type === 'cost' ? cell.toLocaleString() : cell + 1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnimatedTable; 