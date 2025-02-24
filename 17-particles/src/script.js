import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/9.png')

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()

const count = 20000 // 500 particles

const position = new Float32Array(count * 3) // keer 3 omdat x,y,z
const color = new Float32Array(count * 3) // is het zelfde als position maar dan met rgb

for(let i = 0; i < count * 3; i++){
    position[i] = (Math.random() - 0.5) * 10, // -0.5 zodat keer tien het -5 naar 5 gaat
    color[i] = Math.random()
}

particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(position, 3)
)

particlesGeometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(color, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.Color('#ffd372')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true


// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
camera.position.z = 3
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
    
    // Update particles
    for(let i = 0; i < count; i++){
        const i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) // is voor de y
    }

    particlesGeometry.attributes.position.needsUpdate = true
    // particles.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()