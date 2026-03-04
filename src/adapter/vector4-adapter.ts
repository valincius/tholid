import * as THREE from "three";
import { Adapter } from "./adapter";

export type Vector4Prop =
  | THREE.Vector4
  | { x: number; y: number; z: number; w: number }
  | [number, number, number, number]
  | number;

export type Vector4Like = {
  set: (x: number, y: number, z: number, w: number) => any;
  copy?: (v: any) => any;
  setScalar?: (scalar: number) => any;
  x?: number;
  y?: number;
  z?: number;
  w?: number;
  isVector4?: boolean;
};

export function isVector4Like(v: any): v is THREE.Vector4 {
  return (
    !!v &&
    typeof v === "object" &&
    typeof v.set === "function" &&
    v.isVector4 === true
  );
}

export function setVector4Like(target: THREE.Vector4, value: Vector4Prop) {
  if (!isVector4Like(target)) return;

  if (typeof value === "number") {
    if (typeof target.setScalar === "function") target.setScalar(value);
    else target.set(value, value, value, value);
    return;
  }

  if (value instanceof THREE.Vector4) {
    if (typeof target.copy === "function") target.copy(value);
    else target.set(value.x, value.y, value.z, value.w);
    return;
  }

  if (Array.isArray(value)) {
    target.set(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0, value[3] ?? 0);
    return;
  }

  target.set(value.x ?? 0, value.y ?? 0, value.z ?? 0, value.w ?? 0);
}

export const vector4Adapter: Adapter<Vector4Prop, THREE.Vector4> = {
  compare: isVector4Like,
  adapt: setVector4Like,
};
