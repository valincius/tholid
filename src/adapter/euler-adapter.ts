import * as THREE from "three";
import { Adapter } from "./adapter";

type EulerTuple = [number, number, number];
type EulerTupleWithOrder = [number, number, number, THREE.EulerOrder];

export type EulerProp =
  | THREE.Euler
  | { x: number; y: number; z: number; order?: THREE.EulerOrder }
  | EulerTuple
  | EulerTupleWithOrder;

export type EulerLike = {
  set: (x: number, y: number, z: number, order?: THREE.EulerOrder) => any;
  copy?: (e: any) => any;
  order?: THREE.EulerOrder;
};

export function isEulerLike(v: any): v is THREE.Euler {
  return (
    !!v &&
    typeof v === "object" &&
    typeof v.set === "function" &&
    v.isEuler === true
  );
}

export function setEulerLike(target: THREE.Euler, value: EulerProp) {
  if (!isEulerLike(target)) return;

  if (value instanceof THREE.Euler) {
    if (typeof target.copy === "function") target.copy(value);
    else target.set(value.x, value.y, value.z, value.order);
    return;
  }

  if (Array.isArray(value)) {
    target.set(
      value[0] ?? 0,
      value[1] ?? 0,
      value[2] ?? 0,
      value[3] as THREE.EulerOrder | undefined,
    );
    return;
  }

  target.set(
    value.x ?? 0,
    value.y ?? 0,
    value.z ?? 0,
    value.order ?? target.order,
  );
}

export const eulerAdapter: Adapter<EulerProp, THREE.Euler> = {
  compare: isEulerLike,
  adapt: setEulerLike,
};
