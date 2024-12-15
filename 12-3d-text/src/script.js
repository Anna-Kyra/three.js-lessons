import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// // Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace




/**
 * Fonts
 */
const fontLoader = new FontLoader() // FontLoader heeft geen THREE. meer ervoor, omdat het nu is geimporteerd van de node_modules

let bevelThickness = 0.03
let bevelSize = 0.02

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // console.log('font loaded')
        const textGeometry = new TextGeometry(
            'Hello World', { // hier staat de text dan
                font: font, //Kan ook gewoon font zijn, want de object is hetzelfde las de variable
                size: 0.5,
                depth: 0.2, // Was vroeger height
                curveSegments: 5, // voor de letters met curves (kleiner is beter voor performance)
                bevelEnabled: true,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelOffset: 0,
                bevelSegments: 4 // kleiner is beter voor performance
            }
        )
        // textGeometry.computeBoundingBox() // Maak bounding box aan (bij default sphere)
        // // console.log(textGeometry.boundingBox)
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - bevelSize) * 0.5, // die 0.02 komt door de bevelSize
        //     - (textGeometry.boundingBox.max.y - bevelSize) * 0.5,
        //     - (textGeometry.boundingBox.max.z - bevelThickness) * 0.5 // Die 0.03 komt door de bevelThickness
        // )

        // textGeometry.computeBoundingBox() 
        // console.log(textGeometry.boundingBox) // na de translate moet min en max x hetzelfde zijn

        textGeometry.center() // veel snellere manier!!


        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        // textMaterial.wireframe = true // Om te kijken hoeveel triangels er zijn
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        for(let i = 0; i < 100; i++){
            const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
            const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random() // Je wilt ze uniform scalen en niet dat ze plat worden
            // donut.scale.x = scale
            // donut.scale.y = scale
            // donut.scale.z = scale

            donut.scale.set(scale, scale, scale) // kan ook met een set, is korter

            scene.add(donut)
        }
    }
)

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
camera.position.z = 2
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