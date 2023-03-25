import Sizes from "./utils/Sizes";
import * as THREE from 'three';
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./world/World";
import Time from "./utils/Time";
import Resources from "./utils/Resources";
import sources from "./sources";
import Debug from "./utils/Debug";

let instance = null;

export default class Experience {
    constructor (canvas) {

        if (instance) {
            return instance;
        }
        instance = this;

        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.resources = new Resources(sources);
        this.world = new World();
        this.renderer = new Renderer();
        this.debug = new Debug();

        this.canvas.addEventListener('dblclick', () => {
            if (!document.fullscreenElement) {
                if (this.canvas.requestFullscreen) {
                    this.canvas.requestFullscreen();
                }
            }
            else {
                document.exitFullscreen();
            }
        });

        this.sizes.on('resized', () => {
            this.resized();
        });

        this.time.on('update', () => {
            this.update();
        });

    }
    resized() {
        this.camera.resized();
        this.renderer.resized();
    }
    update() {
        this.camera.update();
        this.world.update();
        this.renderer.update();
    }
}