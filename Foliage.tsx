import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { getRandomSpherePoint, getTreePoint } from '../utils/math';
import { easing } from 'maath';

interface FoliageProps {
  count: number;
  treeState: TreeState;
}

export const Foliage: React.FC<FoliageProps> = ({ count, treeState }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Colors
  const emeraldPrimary = new THREE.Color('#004225');
  const emeraldBright = new THREE.Color('#006b3c');
  const goldDust = new THREE.Color('#FFD700');

  const { positions, treePositions, scatterPositions, colors, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const treePos = new Float32Array(count * 3);
    const scatterPos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 1. Calculate Targets
      const tPos = getTreePoint(8, 3.5, -4);
      const sPos = getRandomSpherePoint(12);

      // 2. Set Arrays
      treePos[i * 3] = tPos.x;
      treePos[i * 3 + 1] = tPos.y;
      treePos[i * 3 + 2] = tPos.z;

      scatterPos[i * 3] = sPos.x;
      scatterPos[i * 3 + 1] = sPos.y;
      scatterPos[i * 3 + 2] = sPos.z;

      // Initialize at scatter
      pos[i * 3] = sPos.x;
      pos[i * 3 + 1] = sPos.y;
      pos[i * 3 + 2] = sPos.z;

      // 3. Colors (Mix of deep emerald and occasional gold sparkles)
      const isGold = Math.random() > 0.9;
      const color = isGold ? goldDust : (Math.random() > 0.5 ? emeraldPrimary : emeraldBright);
      
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;

      // 4. Phase for breathing animation
      phs[i] = Math.random() * Math.PI * 2;
    }

    return {
      positions: pos,
      treePositions: treePos,
      scatterPositions: scatterPos,
      colors: cols,
      phases: phs,
    };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const isTree = treeState === TreeState.TREE_SHAPE;
    const time = state.clock.elapsedTime;

    // We manually interpolate positions in the loop for maximum control over individual particle movement
    // Note: For 100k+ particles, use a vertex shader. For <10k, this is fine in JS/WASM.
    const dampSpeed = isTree ? 1.5 : 0.8;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Target selection
      const tx = isTree ? treePositions[ix] : scatterPositions[ix];
      const ty = isTree ? treePositions[iy] : scatterPositions[iy];
      const tz = isTree ? treePositions[iz] : scatterPositions[iz];

      // Add "Breathing" / "Floating" noise
      // In Tree mode: small vibration. In Scatter mode: wide float.
      const floatAmp = isTree ? 0.02 : 0.5;
      const floatFreq = isTree ? 2.0 : 0.5;
      const noiseY = Math.sin(time * floatFreq + phases[i]) * floatAmp;

      // Smooth interpolation (Lerp)
      // Current positions
      const cx = positionsAttr.array[ix];
      const cy = positionsAttr.array[iy];
      const cz = positionsAttr.array[iz];

      // Simple Lerp factor based on frame time
      // using maath's damp logic manually or simple lerp for performance
      const lerpFactor = THREE.MathUtils.clamp(delta * dampSpeed, 0, 1);
      
      positionsAttr.array[ix] = THREE.MathUtils.lerp(cx, tx, lerpFactor);
      positionsAttr.array[iy] = THREE.MathUtils.lerp(cy, ty + noiseY, lerpFactor);
      positionsAttr.array[iz] = THREE.MathUtils.lerp(cz, tz, lerpFactor);
    }

    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
