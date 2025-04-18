import Robot from './Robot.js' // roept base class Robot aan dus daarom exporteren.

export default class FlyingRobot extends Robot {
    constructor(name, legs) {
        super(name, legs)

        super.sayHi()
    }

    sayHi() {
        console.log(`Hello my name is ${this.name} and I am a flying robot.`)
    }

    takeOff() {
        console.log(`Have a good flight ${this.name}`)
    }
    land() {
        console.log(`Welcome back ${this.name}`)
    }
}