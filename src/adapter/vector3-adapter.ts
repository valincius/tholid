import * as THREE from "three";
import type { Adapter } from "./adapter";

export type Vector3Prop =
  | THREE.Vector3
  | { x: number; y: number; z: number }
  | [number, number, number]
  | number;

export type Vector3Like = {
  set: (x: number, y: number, z: number) => unknown;
  copy?: (v: unknown) => unknown;
  setScalar?: (scalar: number) => unknown;
  x?: number;
  y?: number;
  z?: number;
  order?: unknown;
  isVector3?: boolean;
};

export function isVector3Like(v: unknown): v is THREE.Vector3 {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as { set?: unknown }).set === "function" &&
    (v as { isVector3?: boolean }).isVector3 === true
  );
}

export function setVector3Like(target: THREE.Vector3, value: Vector3Prop) {
  if (!isVector3Like(target)) return;

  if (typeof value === "number") {
    if (typeof target.setScalar === "function") target.setScalar(value);
    else target.set(value, value, value);
    return;
  }

  if (value instanceof THREE.Vector3) {
    if (typeof target.copy === "function") target.copy(value);
    else target.set(value.x, value.y, value.z);
    return;
  }

  if (Array.isArray(value)) {
    target.set(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0);
    return;
  }

  target.set(value.x ?? 0, value.y ?? 0, value.z ?? 0);
}

export const vector3Adapter: Adapter<Vector3Prop, THREE.Vector3> = {
  compare: isVector3Like,
  adapt: setVector3Like,
};
