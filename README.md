# Tholid - A SolidJS renderer for Three.js
### Inspired by [react-three-fiber](https://github.com/pmndrs/react-three-fiber)

## Example
### Dynamic props with type safety, dashed-prop drilling, and reactivity with SolidJS

```tsx
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
```
### Video
[Video](https://github.com/user-attachments/assets/8707593c-b42d-40e8-b4cb-06ad6c50036a)


Full example: [src/index.tsx](src/index.tsx)
```tsx
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
```
