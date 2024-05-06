import * as BABYLON from "babylonjs"
import {Engine} from "babylonjs";
import 'babylonjs-loaders';

const createScene = async (canvas: HTMLCanvasElement) => {
    const engine = new Engine(canvas)
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    // Creates and positions a free camera
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 1
    camera.upperRadiusLimit = 1000
    // camera.inputs.add(new BABYLON.FreeCameraGamepadInput());
    // camera.inputs.attached.gamepad.gamepadAngularSensibility = 250;
    // scene.activeCamera = camera
    // const inputManager = camera.inputs;
    // Targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // Attaches the camera to the canvas
    camera.attachControl(canvas, true);
    // Creates a light, aiming 0,1,0
    const light = new BABYLON.HemisphericLight("light",
        new BABYLON.Vector3(0, 1, 0),
        scene);
    // Dim the light a small amount 0 - 1
    light.intensity = 0.7;

    const model = await BABYLON.SceneLoader.ImportMeshAsync("", "http://localhost:5173/", "model.glb", scene)
    
    // Built-in 'sphere' shape.
    // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere",
    //     {diameter: 2, segments: 32},
    //     scene);
    // Move sphere upward 1/2 its height
    // sphere.position.y = 1;
    // Built-in 'ground' shape.

    engine.runRenderLoop(() => {
        scene.render()
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
};

export { createScene };