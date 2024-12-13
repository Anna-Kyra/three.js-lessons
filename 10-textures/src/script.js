import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// import imageSource from '../static/textures/door/color.jpg';

// console.log(imageSource)

/**
 * Textures
 */
// const image = new Image()
// const texture = new THREE.Texture(image) // creating texture
// texture.colorSpace = THREE.SRGBColorSpace

// image.onload = () => {
//     // console.log('image loaded')
    
//     texture.needsUpdate = true // moet texture updaten, niet nieuwe const maken
//     console.log(texture)
    
// }

// image.src = '/textures/door/color.jpg'
const loadingManager = new THREE.LoadingManager()

// loadingManager.onStart = () => {
//     console.log('onStart')
// }
// loadingManager.onLoad = () => {
//     console.log('onLoad')
// }
// loadingManager.onPogress = () => {
//     console.log('onProgress')
// }
// loadingManager.onError = () => {
//     console.log('onError')
// }

const textureLoader = new THREE.TextureLoader(loadingManager) // hoeft alleen 1 texture loader

const colorTexture = textureLoader.load('/textures/door/color.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace // Voor map en matcap, anders krijg je doffere kleuren
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// colorTexture.repeat.x = 2 // repeat is gewoon een vector 2, dus je kan x en y properties gebruiken
// colorTexture.repeat.y = 3
// // colorTexture.wrapS = THREE.RepeatWrapping // repeat de texture/uv wrap wanneer het kleiner is dan de geometry, dus met repeat doe je dat en met dezelfde maak je de andere aan
// // colorTexture.wrapT = THREE.RepeatWrapping
// colorTexture.wrapS = THREE.MirroredRepeatWrapping // zelfde als repeat wrapping maar dan gespiegeld
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI / 4 // is een radiant, dus je kan math.PI gebruiken
// colorTexture.center.x = 0.5 // origin point aangeven, deze gaat naar het midden
// colorTexture.center.y = 0.5


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
console.log(geometry.attributes.uv)
const material = new THREE.MeshBasicMaterial({ map: colorTexture }) // map/matcap zijn nu sRGB
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()