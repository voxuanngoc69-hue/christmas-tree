import React from 'react';
import { TreeState } from '../types';

interface OverlayProps {
  treeState: TreeState;
  setTreeState: (s: TreeState) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ treeState, setTreeState }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      
      {/* Header */}
      <header className="flex flex-col items-start gap-2 animate-fade-in-down">
        <h1 className="font-cinzel text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          ARIX SIGNATURE
        </h1>
        <h2 className="font-serif italic text-xl md:text-2xl text-emerald-200 tracking-wide">
          The Holiday Collection
        </h2>
      </header>

      {/* Main Center Control (Only visible/interactive via pointer-events-auto on buttons) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto group">
         {/* Optional Center Prompt if needed, otherwise kept clean for the 3D view */}
      </div>

      {/* Footer Controls */}
      <footer className="flex flex-col md:flex-row justify-between items-end md:items-center w-full gap-6">
        
        <div className="text-emerald-400/60 text-sm font-serif max-w-md">
            <p>Experience the convergence of luxury and technology. Toggle the form to reveal the structure of elegance.</p>
        </div>

        <div className="flex gap-4 pointer-events-auto">
            <button
                onClick={() => setTreeState(TreeState.SCATTERED)}
                className={`
                    px-6 py-2 border border-yellow-600/50 transition-all duration-700 font-cinzel tracking-widest text-sm
                    ${treeState === TreeState.SCATTERED 
                        ? 'bg-yellow-600/20 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                        : 'bg-transparent text-emerald-100 hover:text-yellow-200 hover:border-yellow-500'}
                `}
            >
                CHAOS
            </button>
            <button
                onClick={() => setTreeState(TreeState.TREE_SHAPE)}
                className={`
                    px-6 py-2 border border-yellow-600/50 transition-all duration-700 font-cinzel tracking-widest text-sm
                    ${treeState === TreeState.TREE_SHAPE 
                        ? 'bg-yellow-600/20 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                        : 'bg-transparent text-emerald-100 hover:text-yellow-200 hover:border-yellow-500'}
                `}
            >
                ORDER
            </button>
        </div>
      </footer>
    </div>
  );
};
