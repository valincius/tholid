import * as THREE from "three";
import { Adapter } from "./adapter";

export type Matrix4Prop = THREE.Matrix4 | readonly number[] | ArrayLike<number>;

export function isMatrix4Like(v: any): v is THREE.Matrix4 {
  return (
    !!v &&
    typeof v === "object" &&
    v.isMatrix4 === true &&
    typeof v.fromArray === "function"
  );
}

export function setMatrix4Like(target: THREE.Matrix4, value: Matrix4Prop) {
  if (!isMatrix4Like(target)) return;

  if (value instanceof THREE.Matrix4) {
    target.copy(value);
    return;
  }

  target.fromArray(value);
}

export const matrix4Adapter: Adapter<Matrix4Prop, THREE.Matrix4> = {
  compare: isMatrix4Like,
  adapt: setMatrix4Like,
};
