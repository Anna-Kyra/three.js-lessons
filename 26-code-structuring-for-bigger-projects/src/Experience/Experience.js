export default class Experience {
    constructor(canvas) {
        // Global access
        window.experience = this

        // Option
        this.canvas = canvas
        console.log(this.canvas)
    }
}