import * as BABYLON from 'babylonjs'
import { Engine } from 'babylonjs'
import 'babylonjs-loaders'
import { httpClient } from '../axiosInstance'

const createScene = async (canvas: HTMLCanvasElement, file: File) => {
  const engine = new Engine(canvas, true, { stencil: true })

  const scene = new BABYLON.Scene(engine)

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 1),
    scene,
  )
  light.intensity = 0.8
  // let file = (await httpClient.get(`models/file/${id}`)).data
  // console.log('file', file)
  // const file = btoa(file)
  const assetURL = URL.createObjectURL(file)
  // const model = await BABYLON.SceneLoader.ImportMeshAsync(
  //   '',
  //   'http://localhost:3000/',
  //   'dbtWithoutBound.glb',
  //   scene,
  // )
  const model = await BABYLON.SceneLoader.AppendAsync(assetURL, undefined, scene, undefined, ".glb");
  scene.createDefaultCameraOrLight(true, true, true)
  scene.activeCamera.alpha += Math.PI / 3

  const hl = new BABYLON.HighlightLayer('hl1', scene)
 

  engine.runRenderLoop(() => {
    scene.render()
  })

  return { engine, scene, hl }
}

export { createScene,  }
