import React, { useState } from 'react';
import AnimatedTable from '../AnimatedTable/AnimatedTable';

const MatrixDisplay = ({ matrices, costTable, splitTable, optimalParenthesization, minCost }) => {
  const [costTableComplete, setCostTableComplete] = useState(false);
  const [costTableSpeed, setCostTableSpeed] = useState(1000); // Default speed: 1000ms
  const [splitTableSpeed, setSplitTableSpeed] = useState(1000); // Default speed: 1000ms

  const handleCostTableSpeedChange = (e) => {
    setCostTableSpeed(2000 - e.target.value); // Invert the value so higher slider = faster
  };

  const handleSplitTableSpeedChange = (e) => {
    setSplitTableSpeed(2000 - e.target.value); // Invert the value so higher slider = faster
  };

  return (
    <div className="space-y-8">
      {matrices.length > 0 && (
        <div className="bg-black/50 rounded-lg border border-gray-800 overflow-hidden shadow-lg">
          <div className="bg-gray-900/80 px-4 py-3 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-gray-100">Input Matrices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-900/80">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Matrix</th>
                  <th className="px-4 py-3 border-b border-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dimensions</th>
                  <th className="px-4 py-3 border-b border-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-black/50">
                {matrices.map((matrix, index) => (
                  <tr key={index} className="hover:bg-gray-900/50 transition-colors">
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
      )}

      {minCost !== null && (
        <div className="bg-gradient-to-r from-gray-900/80 to-black/50 rounded-lg border border-gray-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-blue-400 mb-3">Optimization Results</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-300">Minimum Multiplication Cost:</p>
              <p className="text-2xl font-bold text-blue-400">{minCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-300">Optimal Parenthesization:</p>
              <p className="text-lg font-mono bg-black/50 p-3 rounded border border-gray-800 overflow-x-auto text-blue-400">
                {optimalParenthesization}
              </p>
            </div>
          </div>
        </div>
      )}

      {costTable.length > 0 && (
        <div className="bg-black/50 rounded-lg border border-gray-800 overflow-hidden shadow-lg">
          <div className="bg-gray-900/80 px-4 py-3 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-100">Cost Table (m)</h2>
                <p className="text-xs text-gray-400 mt-1">The minimum number of scalar multiplications needed to compute each subchain</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">Slow</span>
                <input
                  type="range"
                  min="0"
                  max="1900"
                  value={2000 - costTableSpeed}
                  onChange={handleCostTableSpeedChange}
                  className="w-32 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
                <span className="text-xs text-gray-400">Fast</span>
              </div>
            </div>
          </div>
          <AnimatedTable
            table={costTable}
            type="cost"
            matrices={matrices}
            speed={costTableSpeed}
            onAnimationComplete={() => setCostTableComplete(true)}
          />
        </div>
      )}

      {splitTable.length > 0 && costTableComplete && (
        <div className="bg-black/50 rounded-lg border border-gray-800 overflow-hidden shadow-lg">
          <div className="bg-gray-900/80 px-4 py-3 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-100">Split Table (s)</h2>
                <p className="text-xs text-gray-400 mt-1">The position at which to split each subchain for optimal multiplication</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">Slow</span>
                <input
                  type="range"
                  min="0"
                  max="1900"
                  value={2000 - splitTableSpeed}
                  onChange={handleSplitTableSpeedChange}
                  className="w-32 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
                <span className="text-xs text-gray-400">Fast</span>
              </div>
            </div>
          </div>
          <AnimatedTable
            table={splitTable}
            type="split"
            matrices={matrices}
            speed={splitTableSpeed}
            onAnimationComplete={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default MatrixDisplay; 