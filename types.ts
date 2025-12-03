import { Vector3 } from 'three';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface ParticleData {
  scatterPos: Vector3;
  treePos: Vector3;
  color: string;
  size: number;
  speed: number;
  phase: number;
}

export interface OrnamentData {
  id: number;
  scatterPos: Vector3;
  treePos: Vector3;
  rotation: Vector3;
  scale: number;
  type: 'SPHERE' | 'BOX';
}
