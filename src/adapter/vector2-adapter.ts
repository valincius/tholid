import * as THREE from "three";
import { Adapter } from "./adapter";

export type Vector2Prop =
  | THREE.Vector2
  | { x: number; y: number }
  | [number, number]
  | number;

export type Vector2Like = {
  set: (x: number, y: number) => any;
  copy?: (v: any) => any;
  setScalar?: (scalar: number) => any;
  x?: number;
  y?: number;
  isVector2?: boolean;
};

export function isVector2Like(v: any): v is THREE.Vector2 {
  return (
    !!v &&
    typeof v === "object" &&
    typeof v.set === "function" &&
    v.isVector2 === true
  );
}

export function setVector2Like(target: THREE.Vector2, value: Vector2Prop) {
  if (!isVector2Like(target)) return;

  if (typeof value === "number") {
    if (typeof target.setScalar === "function") target.setScalar(value);
    else target.set(value, value);
    return;
  }

  if (value instanceof THREE.Vector2) {
    if (typeof target.copy === "function") target.copy(value);
    else target.set(value.x, value.y);
    return;
  }

  if (Array.isArray(value)) {
    target.set(value[0] ?? 0, value[1] ?? 0);
    return;
  }

  target.set(value.x ?? 0, value.y ?? 0);
}

export const vector2Adapter: Adapter<Vector2Prop, THREE.Vector2> = {
  compare: isVector2Like,
  adapt: setVector2Like,
};
