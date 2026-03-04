import * as THREE from "three";

import type { FlowComponent, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import type { Entity } from "./context";
import { ThreeContext } from "./context";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const ThreeScene: FlowComponent<{ children: JSX.Element }> = (props) => {
  const [entities, setEntities] = createStore<Entity[]>([]);
  const meshes = new Map<string, THREE.Mesh>();

  const context: ThreeContext = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    ),
    renderer: new THREE.WebGLRenderer({
      alpha: true,
    }),
    entities,
    addEntity: ({ geometry, material }) => {
      const mesh = new THREE.Mesh(geometry, material);

      const entity: Entity = {
        id: `entity-${entities.length + 1}`,
        mesh: mesh,
      };

      meshes.set(entity.id, mesh);
      context.scene.add(mesh);

      setEntities((prev) => [...prev, entity]);

      return {
        entity,
        cleanUp: () => {
          context.scene.remove(mesh);
          meshes.delete(entity.id);
          setEntities((prev) => prev.filter((e) => e.id !== entity.id));
        },
      };
    },
    addToScene: (obj) => {
      context.scene.add(obj);
      return () => context.scene.remove(obj);
    },
  };

  context.camera.position.z = 300;

  context.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 1);
  directionalLight.castShadow = true;
  context.scene.add(directionalLight);

  const controls = new OrbitControls(
    context.camera,
    context.renderer.domElement,
  );
  controls.update();

  context.renderer.setSize(window.innerWidth, window.innerHeight);

  const animate = () => {
    requestAnimationFrame(animate);

    context.renderer.render(context.scene, context.camera);
  };

  animate();

  return (
    <ThreeContext.Provider value={context}>
      {context.renderer.domElement}

      {props.children}
    </ThreeContext.Provider>
  );
};

export default ThreeScene;
