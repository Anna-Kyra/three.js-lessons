import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
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

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/brown_mud_leaves_01_1k/brown_mud_leaves_01_diff_1k.jpg')
const floorARMTexture = textureLoader.load('./floor/brown_mud_leaves_01_1k/brown_mud_leaves_01_arm_1k.jpg') // AO/Roughness/Metalness
const floorNormalTexture = textureLoader.load('./floor/brown_mud_leaves_01_1k/brown_mud_leaves_01_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/brown_mud_leaves_01_1k/brown_mud_leaves_01_disp_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8, 8) 
floorARMTexture.repeat.set(8, 8) 
floorDisplacementTexture.repeat.set(8, 8) 
floorNormalTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

// Wall
const wallColorTexture = textureLoader.load('./wall/red_brick_plaster_patch_02_1k/red_brick_plaster_patch_02_diff_1k.jpg')
const wallARMTexture = textureLoader.load('./wall/red_brick_plaster_patch_02_1k/red_brick_plaster_patch_02_arm_1k.jpg') // AO/Roughness/Metalness
const wallNormalTexture = textureLoader.load('./wall/red_brick_plaster_patch_02_1k/red_brick_plaster_patch_02_nor_gl_1k.jpg')
const wallBumpTexture = textureLoader.load('./wall/red_brick_plaster_patch_02_1k/red_brick_plaster_patch_02_bump_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg')
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg') // AO/Roughness/Metalness
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1) 
roofARMTexture.repeat.set(3, 1) 
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bush
const bushColorTexture = textureLoader.load('./bush/forest_leaves_03_1k/forest_leaves_03_diff_1k.jpg')
const bushARMTexture = textureLoader.load('./bush/forest_leaves_03_1k/forest_leaves_03_arm_1k.jpg') // AO/Roughness/Metalness
const bushNormalTexture = textureLoader.load('./bush/forest_leaves_03_1k/forest_leaves_03_nor_gl_1k.jpg')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1) 
bushARMTexture.repeat.set(2, 1) 
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

/**
 * House
 */
const houseMeasurements = {
    width: 4,
    height: 2.5,
    depth: 4
}
// Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
scene.add(sphere)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100), // 20 bij 20 meter
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: floorAlphaTexture,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.1
    })
)

floor.rotation.x = -Math.PI * 0.5 // Als je hem niet kan zien dan is het de onderkant van de plane
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

// House
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseMeasurements.width, houseMeasurements.height, houseMeasurements.depth),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
        bumpMap: wallBumpTexture
    })
)
walls.position.y += houseMeasurements.height / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4), // Om peramide te maken moet de vertices 4 zijn
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
)
roof.position.y += houseMeasurements.height + 0.75
roof.rotation.y = Math.PI / 4
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({
        color: 'red'
    })
)
door.position.y = 1.1
door.position.z = houseMeasurements.width / 2 + 0.01

house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75


house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const gravematerial = new THREE.MeshStandardMaterial()

const graves = new THREE.Group()
scene.add(graves)

for(let i= 0; i < 30; i++){ // zijn dan 30 graves
    const angle = Math.random() * Math.PI * 2 // angle van de circle van het huis
    const radius = 3 + Math.random() * 4 // hoever de graves kunnen zitten van het midden
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // Mesh
    const grave = new THREE.Mesh(graveGeometry, gravematerial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z

    grave.rotation.x = (Math.random() - 0.5) * 0.4 // betekent dat het dan between -0.5 en 0.5 is het random getal
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    // Add to graves group
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()