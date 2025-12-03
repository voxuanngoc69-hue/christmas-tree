import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, PerspectiveCamera, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { TreeState } from '../types';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';

interface ExperienceProps {
  treeState: TreeState;
}

const Rig = () => {
    useFrame((state) => {
        // Subtle camera shake or mouse parallax
        const t = state.clock.elapsedTime;
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1 + Math.sin(t / 4) * 0.5, 0.01);
    })
    return null;
}

export const Experience: React.FC<ExperienceProps> = ({ treeState }) => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={45} />
        <Rig />

        <color attach="background" args={['#000502']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} color="#004225" />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} castShadow shadow-mapSize={[2048, 2048]} color="#ffeeb1" />
        <pointLight position={[-10, -5, -10]} intensity={5} color="#00ff88" />
        <pointLight position={[0, 5, 0]} intensity={2} color="#ffaa00" distance={10} decay={2} />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Content Group */}
        <group rotation={[0, 0, 0]}>
            {/* The Green Foliage Particles */}
            <Foliage count={6000} treeState={treeState} />

            {/* Golden Spheres */}
            <Ornaments 
                count={150} 
                type="SPHERE" 
                treeState={treeState} 
                colorPalette={['#FFD700', '#FDB931', '#C5A059', '#E5AA70']} 
            />

            {/* Luxury Boxes (Red/Green/Gold) */}
            <Ornaments 
                count={40} 
                type="BOX" 
                treeState={treeState} 
                colorPalette={['#800020', '#004225', '#FFD700']} 
            />
        </group>

        {/* Floating dust for atmosphere */}
        <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color="#fff" />
        
        {/* Post Processing for Glow */}
        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.6} color="#fff5cc" />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

        <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={true}
            autoRotateSpeed={0.5}
        />
    </Canvas>
  );
};
