import type { AdapterType } from "./adapter";
import { colorAdapter } from "./color-adapter";
import { eulerAdapter } from "./euler-adapter";
import { matrix3Adapter } from "./matrix3-adapter";
import { matrix4Adapter } from "./matrix4-adapter";
import { quaternionAdapter } from "./quaternion-adapter";
import { vector2Adapter } from "./vector2-adapter";
import { vector3Adapter } from "./vector3-adapter";
import { vector4Adapter } from "./vector4-adapter";

export const adapters = [
  colorAdapter,
  vector2Adapter,
  vector3Adapter,
  vector4Adapter,
  eulerAdapter,
  quaternionAdapter,
  matrix3Adapter,
  matrix4Adapter,
] as const;

export type Adapters = (typeof adapters)[number];

/** If V matches an adapter's Output, allow that adapter's Input */
type AdaptFromAdapters<V, A extends Adapters> =
  A extends AdapterType<infer Input, infer Output>
    ? V extends Output
      ? Input
      : never
    : never;

/** If no adapter matches, keep V */
export type AdaptedValue<V, A extends Adapters> =
  AdaptFromAdapters<V, A> extends never ? V : AdaptFromAdapters<V, A>;

/** Regular (non-dashed) props for a target object */
export type ThreeProps<T extends object, A extends Adapters = Adapters> = {
  [K in Extract<keyof T, string>]?: AdaptedValue<T[K], A>;
};
