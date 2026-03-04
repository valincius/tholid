import type { AdapterType } from "./adapter";
import type { Adapters, AdaptedValue } from "./adapters";
import { adapters } from "./adapters";

export type DashedProps<
  Root extends object,
  _Child extends object,
  Prefix extends Extract<keyof Root, string>,
  A extends Adapters = Adapters,
> = Root[Prefix] extends object
  ? {
      [Key in `${Prefix}-${Extract<keyof Root[Prefix], string>}`]?: AdaptedValue<
        Root[Prefix][Extract<
          Key extends `${Prefix}-${infer P}`
            ? P
            : Key extends `${Prefix}-${infer P}-${string}`
              ? P
              : never,
          keyof Root[Prefix]
        >],
        A
      >;
    }
  : object;

export function resolveDashed(
  root: unknown,
  propKey: string,
): { obj: unknown; key: string } | null {
  const parts = propKey.split("-");
  if (parts.length === 1) return { obj: root, key: propKey };

  let obj = root;
  for (let i = 0; i < parts.length - 1; i++) {
    obj = (obj as Record<string, unknown>)?.[parts[i]!];
    if (obj == null) return null;
  }
  return { obj, key: parts[parts.length - 1]! };
}

export function adaptValue(target: unknown, key: string, value: unknown) {
  const existing = (target as Record<string, unknown>)?.[key];

  for (const adapter of adapters as readonly AdapterType<unknown, unknown>[]) {
    if (adapter.compare(existing)) {
      adapter.adapt(existing, value);
      return;
    }
  }

  (target as Record<string, unknown>)[key] = value;
}
