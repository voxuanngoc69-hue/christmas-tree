import React, { useState } from 'react';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  return (
    <div className="w-full h-screen bg-[#001a10] relative overflow-hidden">
      <Experience treeState={treeState} />
      <Overlay treeState={treeState} setTreeState={setTreeState} />
      
      {/* Decorative Vignette Overlay (CSS) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#001a10_100%)] opacity-80" />
      <div className="absolute inset-0 pointer-events-none border-[1px] border-yellow-500/10 m-4" />
    </div>
  );
};

export default App;
