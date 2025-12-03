import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { getRandomSpherePoint, getTreePoint } from '../utils/math';
import { easing } from 'maath';

interface OrnamentsProps {
  count: number;
  type: 'SPHERE' | 'BOX';
  treeState: TreeState;
  colorPalette: string[];
}

export const Ornaments: React.FC<OrnamentsProps> = ({ count, type, treeState, colorPalette }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate Data
  const data = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      // Tree Position: Offset randomly to be "inside" foliage or on surface
      const tPos = getTreePoint(7.5, 3.2, -4); 
      // Push slightly outward for ornaments to sit on surface
      const dist = Math.sqrt(tPos.x**2 + tPos.z**2);
      if(dist > 0.1) {
          const push = 1.1; // slight extrusion
          tPos.x *= push;
          tPos.z *= push;
      }

      const sPos = getRandomSpherePoint(10);
      const scale = Math.random() * 0.3 + 0.15; // Random size
      
      return {
        treePos: tPos,
        scatterPos: sPos,
        currentPos: sPos.clone(), // Start at scatter
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        scale,
        color: new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]),
        rotSpeed: Math.random() * 0.5 + 0.2
      };
    });
  }, [count, colorPalette]);

  useLayoutEffect(() => {
      if(!meshRef.current) return;
      // Set initial colors
      data.forEach((d, i) => {
          meshRef.current!.setColorAt(i, d.color);
      });
      meshRef.current.instanceColor!.needsUpdate = true;
  }, [data]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const isTree = treeState === TreeState.TREE_SHAPE;
    const time = state.clock.elapsedTime;

    data.forEach((d, i) => {
      const target = isTree ? d.treePos : d.scatterPos;
      
      // Animate Position using Maath for smooth damping
      // We manually update the JS object vector then apply to dummy
      easing.damp3(d.currentPos, target, isTree ? 1.2 : 2.5, delta);

      dummy.position.copy(d.currentPos);
      
      // Add rotation
      dummy.rotation.copy(d.rotation);
      dummy.rotation.y += d.rotSpeed * delta * 0.5;
      dummy.rotation.x += d.rotSpeed * delta * 0.2;

      // Add floating effect when scattered
      if (!isTree) {
         dummy.position.y += Math.sin(time + i) * 0.005;
      }

      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      {type === 'SPHERE' ? (
        <sphereGeometry args={[1, 32, 32]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      <meshStandardMaterial 
        color="#ffffff" // Base color is multiplied by instance color
        roughness={0.15} 
        metalness={0.9} 
        envMapIntensity={1.5}
      />
    </instancedMesh>
  );
};
