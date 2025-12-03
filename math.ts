import * as THREE from 'three';

// Helper to get random point in sphere
export const getRandomSpherePoint = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Helper to get point on a cone surface (Tree shape)
export const getTreePoint = (
  height: number,
  baseRadius: number,
  yOffset: number = -2
): THREE.Vector3 => {
  const y = Math.random() * height; // Height from 0 to height
  const radiusAtHeight = (baseRadius * (height - y)) / height;
  
  // Add some spiral or noise distribution
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radiusAtHeight; // Uniform disk distribution at slice y

  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  
  return new THREE.Vector3(x, y + yOffset, z);
};
