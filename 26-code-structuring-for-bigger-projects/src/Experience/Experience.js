import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'

let instance = null

export default class Experience {
    constructor(canvas) {
        // Singleton
        if(instance){ // is de instance er al
            return instance
        }
        instance = this

        // Global access
        window.experience = this

        // Option
        this.canvas = canvas
        console.log(this.canvas)

        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()

        // Sizes resize event
        this.sizes.on('resize', () => { // moet fat arrow gebruiken om de context niet te verliezen
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
    }

    update() {
        this.camera.update()
    }
}