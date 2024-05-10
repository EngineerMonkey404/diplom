import * as BABYLON from "babylonjs"
import {Engine} from "babylonjs";
import 'babylonjs-loaders';
import { httpClient } from "../axiosInstance";

const createScene = async (canvas: HTMLCanvasElement, fileName:string) => {
    const engine = new Engine(canvas, true, { stencil: true })
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    // Creates and positions a free camera
    // var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 3, BABYLON.Vector3.Zero(), scene);
    // camera.lowerRadiusLimit = 1
    // camera.upperRadiusLimit = 1000
    // // camera.inputs.add(new BABYLON.FreeCameraGamepadInput());
    // // camera.inputs.attached.gamepad.gamepadAngularSensibility = 250;
    // // scene.activeCamera = camera
    // // const inputManager = camera.inputs;
    // // Targets the camera to scene origin
    // camera.setTarget(BABYLON.Vector3.Zero());
    // // Attaches the camera to the canvas
    // camera.attachControl(canvas, true);
    // Creates a light, aiming 0,1,0
    const light = new BABYLON.HemisphericLight("light",
        new BABYLON.Vector3(1, 1, 1),
        scene);
    // Dim the light a small amount 0 - 1
    light.intensity = 0.8;
    // let file = (await httpClient.get(`models/file/${id}`)).data
    // console.log('file', file)
    // file = btoa(file)
    const model = await BABYLON.SceneLoader.ImportMeshAsync("", "http://localhost:3001/public/", fileName, scene)
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.alpha += Math.PI/3;

    const hl = new BABYLON.HighlightLayer("hl1", scene);
    //console.log(model)
    // model.meshes[0].position.x += 1
    // model.meshes[1].position.x += 1
    // model.meshes[2].position.x += 1
    // model.meshes[3].position.x += 1
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
    return { engine, scene, hl}
};

export { createScene };