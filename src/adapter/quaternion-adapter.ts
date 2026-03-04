import * as THREE from "three";
import { Adapter } from "./adapter";

export type QuaternionProp =
  | THREE.Quaternion
  | { x: number; y: number; z: number; w: number }
  | [number, number, number, number];

export type QuaternionLike = {
  set: (x: number, y: number, z: number, w: number) => any;
  copy?: (q: any) => any;
  x?: number;
  y?: number;
  z?: number;
  w?: number;
  isQuaternion?: boolean;
};

export function isQuaternionLike(v: any): v is THREE.Quaternion {
  return (
    !!v &&
    typeof v === "object" &&
    typeof v.set === "function" &&
    v.isQuaternion === true
  );
}

export function setQuaternionLike(
  target: THREE.Quaternion,
  value: QuaternionProp,
) {
  if (!isQuaternionLike(target)) return;

  if (value instanceof THREE.Quaternion) {
    if (typeof target.copy === "function") target.copy(value);
    else target.set(value.x, value.y, value.z, value.w);
    return;
  }

  if (Array.isArray(value)) {
    target.set(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0, value[3] ?? 1);
    return;
  }

  target.set(value.x ?? 0, value.y ?? 0, value.z ?? 0, value.w ?? 1);
}

export const quaternionAdapter: Adapter<QuaternionProp, THREE.Quaternion> = {
  compare: isQuaternionLike,
  adapt: setQuaternionLike,
};
