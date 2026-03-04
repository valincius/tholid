import * as THREE from "three";
import { Adapter } from "./adapter";

export type Matrix3Prop = THREE.Matrix3 | readonly number[] | ArrayLike<number>;

export function isMatrix3Like(v: any): v is THREE.Matrix3 {
  return (
    !!v &&
    typeof v === "object" &&
    v.isMatrix3 === true &&
    typeof v.fromArray === "function"
  );
}

export function setMatrix3Like(target: THREE.Matrix3, value: Matrix3Prop) {
  if (!isMatrix3Like(target)) return;

  if (value instanceof THREE.Matrix3) {
    target.copy(value);
    return;
  }

  target.fromArray(value);
}

export const matrix3Adapter: Adapter<Matrix3Prop, THREE.Matrix3> = {
  compare: isMatrix3Like,
  adapt: setMatrix3Like,
};
