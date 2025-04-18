export default class Robot { //het is 1 ding dus daarom default
    constructor(name, legs) {
        this.name = name
        this.legs = legs

        console.log(`I am ${this.name}. Thank you creator`)

        this.sayHi()
    }

    sayHi() {
        console.log(`Hello! My name is ${this.name}`)
    }
}