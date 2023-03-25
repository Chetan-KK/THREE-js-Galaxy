import Experience from "../Experience";
import * as THREE from 'three';
import environment from "./Environment";
import Particles from "./Particles";

export default class World {
    constructor () {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on('loaded', () => {
            this.loaded();
            this.isLoaded = true;
        });

    }
    loaded() {
        this.particles = new Particles();

        this.environment = new environment();

    }
    update() {
        if (this.isLoaded) {
            this.particles.update();
        }

    }
}