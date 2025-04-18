import * as THREE from 'three'
import Experience from "../Experience.js"
import Environment from './Environment.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources 

        // Test mesh
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial()
        )
        this.scene.add(testMesh)

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.environment = new Environment() // inside want als je de environment map gebruikt gebruik je de resources
        })

        
    }
}