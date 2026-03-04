import type { Component, JSX } from "solid-js";
import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
} from "solid-js";
import { UseThreeContext } from "./context";
import * as THREE from "three";
import type { DashedProps } from "../adapter/utils";
import { adaptValue, resolveDashed } from "../adapter/utils";
import type { ThreeProps } from "../adapter/adapters";

export type MeshProps = {
  geometry?: THREE.BufferGeometry;
  material?: THREE.MeshStandardMaterial;
  ref?: (m: THREE.Mesh) => void;
  children?: JSX.Element;
};

type MeshInstance = Omit<THREE.Mesh, "geometry" | "material"> & {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshStandardMaterial;
};

export type MeshAllProps = Omit<
  ThreeProps<MeshInstance>,
  "children" | "geometry" | "material"
> &
  ThreeProps<THREE.MeshStandardMaterial> &
  DashedProps<MeshInstance, MeshInstance["material"], "material"> &
  MeshProps;

const RESERVED = new Set(["geometry", "material", "ref", "children"]);

export const Mesh: Component<MeshAllProps> = (allProps) => {
  const context = UseThreeContext();

  const [local, props] = splitProps(allProps, [
    "ref",
    "children",
    "geometry",
    "material",
  ]);

  const {
    entity: { mesh },
    cleanUp,
  } = context.addEntity({
    geometry: local.geometry ?? new THREE.BufferGeometry(),
    material: local.material ?? new THREE.MeshStandardMaterial({}),
  });

  onCleanup(() => cleanUp());

  local.ref?.(mesh);

  createEffect(() => {
    for (const key in props) {
      if (RESERVED.has(key)) continue;

      const value = (props as Record<string, unknown>)[key];
      if (value === undefined) continue;

      const { geometry, material } = mesh;

      if (key.includes("-")) {
        const resolved = resolveDashed(mesh, key);
        if (!resolved) continue;

        adaptValue(resolved.obj, resolved.key, value);

        continue;
      }

      if (geometry && key in geometry) {
        adaptValue(geometry, key, value);
      } else if (material && key in material) {
        adaptValue(material, key, value);
      } else {
        adaptValue(mesh, key, value);
      }
    }
  });

  return <>{local.children}</>;
};

type SizeProps =
  | {
      width?: number;
      height?: number;
      depth?: number;
    }
  | number
  | [number, number, number];

const extractSizeValues = (
  props: SizeProps | undefined,
): [number, number, number] => {
  if (props === undefined) return [1, 1, 1];

  if (typeof props === "number") return [props, props, props];

  if (Array.isArray(props))
    return [props[0] ?? 1, props[1] ?? 1, props[2] ?? 1];

  return [
    (props as { width?: number }).width ?? 1,
    (props as { height?: number }).height ?? 1,
    (props as { depth?: number }).depth ?? 1,
  ];
};

export const BoxMesh: Component<
  Omit<MeshAllProps, "geometry"> & {
    size?: SizeProps;
  }
> = (props) => {
  const group = useContext(GroupContext);
  const [mesh, setMesh] = createSignal<THREE.Mesh>();

  createEffect(() => {
    if (mesh()) {
      group?.add(mesh()!);
    }
  });

  onCleanup(() => {
    if (mesh()) {
      group?.remove(mesh()!);
    }
  });

  const [width, height, depth] = extractSizeValues(props.size);

  return (
    <Mesh
      ref={setMesh}
      geometry={new THREE.BoxGeometry(width, height, depth)}
      {...props}
    />
  );
};

const GroupContext = createContext<THREE.Group | null>(null);

export const Group: Component<
  Omit<ThreeProps<THREE.Group>, "children"> & {
    children?: JSX.Element;
  }
> = (props) => {
  const context = UseThreeContext();

  const g = new THREE.Group();

  const remove = context.addToScene(g);

  onCleanup(() => remove());

  createEffect(() => {
    for (const key in props) {
      if (RESERVED.has(key)) continue;

      const value = (props as Record<string, unknown>)[key]; // <-- tracked read
      if (value === undefined) continue;

      if (key.includes("-")) {
        const resolved = resolveDashed(g, key);
        if (!resolved) continue;

        adaptValue(resolved.obj, resolved.key, value);

        continue;
      }

      adaptValue(g, key, value);
    }
  });

  return (
    <GroupContext.Provider value={g}>{props.children}</GroupContext.Provider>
  );
};
