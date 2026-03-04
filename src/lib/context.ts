import { createContext, useContext } from "solid-js";
import { Store } from "solid-js/store";
import type {
  BufferGeometry,
  Euler,
  Material,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

type Transform = {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
};

type Entity = {
  id: string;

  parentId?: string;

  mesh: Mesh;
};

type ThreeContext = {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  entities: Store<Entity[]>;
  addEntity: (config: { geometry: BufferGeometry; material: Material }) => {
    entity: Entity;
    cleanUp: () => void;
  };
  addToScene: (obj: Object3D) => () => void;
};

const ThreeContext = createContext<ThreeContext>();

const UseThreeContext = () => {
  const context = useContext(ThreeContext);
  if (!context) {
    throw new Error(
      "useThreeContext must be used within a ThreeContext.Provider",
    );
  }
  return context;
};

export { Entity, Transform, ThreeContext, UseThreeContext };
