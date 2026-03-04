import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import { BoxMesh, Group } from "./lib/mesh";
import Scene from "./lib/scene";

const Test: Component = () => {
  const [color, setColor] = createSignal({ r: 1, g: 0, b: 0 });

  setInterval(() => {
    setColor({ r: Math.random(), g: Math.random(), b: Math.random() });
  }, 1000);

  const [rotation, setRotation] = createSignal({
    x: 0,
    y: 0,
    z: 0,
  });

  setInterval(() => {
    setRotation((prev) => ({
      x: prev.x + 0.01,
      y: prev.y + 0.01,
      z: prev.z + 0.01,
    }));
  }, 16);

  const [toggle, setToggle] = createSignal(false);

  setInterval(() => {
    setToggle((prev) => !prev);
  }, 2000);

  return (
    <Scene>
      <Group rotation={rotation()} position={[0, 0, -100]}>
        <BoxMesh size={100} position={[-100, 0, -100]} material-color="blue" />

        <Show when={toggle()}>
          <BoxMesh
            size={[100, 50, 25]}
            position={[100, 0, -100]}
            material-color="green"
          />
        </Show>
        <BoxMesh
          size={{ width: 100, height: 75, depth: 50 }}
          position={[0, 100, -100]}
          rotation={rotation()}
          material-color={color()}
        />
      </Group>
    </Scene>
  );
};

export default Test;
