import * as THREE from "three";
import type { AdapterType } from "./adapter";

export type ColorProp =
  | THREE.Color
  | { r: number; g: number; b: number }
  | [number, number, number]
  | number
  | string;

export type ColorLike = {
  set: (...args: unknown[]) => unknown;
  setRGB: (r: number, g: number, b: number) => unknown;
  copy?: (c: unknown) => unknown;
};

export function isColorLike(v: unknown): v is THREE.Color {
  return (
    !!v &&
    typeof v === "object" &&
    (v as { isColor?: boolean }).isColor === true
  );
}

export function setColorLike(targetColor: THREE.Color, value: ColorProp) {
  if (!isColorLike(targetColor)) return;

  if (value instanceof THREE.Color) {
    targetColor.copy(value);
    return;
  }
  if (Array.isArray(value)) {
    targetColor.setRGB(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0);
    return;
  }
  if (value && typeof value === "object") {
    targetColor.setRGB(
      (value as { r?: number; g?: number; b?: number }).r ?? 0,
      (value as { r?: number; g?: number; b?: number }).g ?? 0,
      (value as { r?: number; g?: number; b?: number }).b ?? 0,
    );
    return;
  }

  targetColor.set(value);
}

export const colorAdapter: AdapterType<ColorProp, THREE.Color> = {
  compare: isColorLike,
  adapt: setColorLike,
};
