import * as THREE from 'three';
import Experience from "../Experience";
import particleVertex from './Shaders/ParticleVertex.glsl';
import particleFragment from './Shaders/ParticleFragment.glsl';

export default class Particles {
    constructor () {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources.items;
        this.debug = this.experience.debug;

        this.geometry = null;
        this.material = null;
        this.particles = null;

        this.parameters = {
            count: 25000,
            size: 10,
            radius: 9.8,
            branches: 3,
            // spin: -1.2,
            randomnessPower: 12,
            speed: .001,
            innerColor: 0x00ffff,
            outterColor: 0x0000ff,
        };

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Particles');
            this.setDebug();
        }

        this.generateGalaxy();

    }
    generateGalaxy() {

        if (this.particles !== null) {
            this.geometry.dispose();
            this.material.dispose();
            this.scene.remove(this.particles);
        }

        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.parameters.count * 3);
        this.colors = new Float32Array(this.parameters.count * 3);
        this.scale = new Float32Array(this.parameters.count);
        this.randomness = new Float32Array(this.parameters.count * 3);

        this.innerColor = new THREE.Color(this.parameters.innerColor);
        this.outterColor = new THREE.Color(this.parameters.outterColor);

        for (let i = 0; i < this.parameters.count; i++) {

            const i3 = i * 3;

            const radius = Math.random() * this.parameters.radius;
            // const spinAngle = radius * this.parameters.spin;
            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2;

            this.positions[i3] = Math.cos(branchAngle) * radius;
            this.positions[i3 + 1] = 0;
            this.positions[i3 + 2] = Math.sin(branchAngle) * radius;

            //randomness
            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * radius;
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * radius;
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * radius;

            this.randomness[i3] = randomX;
            this.randomness[i3 + 1] = randomY;
            this.randomness[i3 + 2] = randomZ;

            //color
            const mixedColor = this.innerColor.clone();
            mixedColor.lerp(this.outterColor, radius / (this.parameters.radius / 1.2));

            this.colors[i3] = mixedColor.r;
            this.colors[i3 + 1] = mixedColor.g;
            this.colors[i3 + 2] = mixedColor.b;

            //scale
            this.scale[i] = Math.random();
        }

        this.positionAttribute = new THREE.BufferAttribute(this.positions, 3);
        this.colorAttribute = new THREE.BufferAttribute(this.colors, 3);
        this.scaleAttribute = new THREE.BufferAttribute(this.scale, 1);
        this.randomnessAttribute = new THREE.BufferAttribute(this.randomness, 3);

        this.geometry.setAttribute('position', this.positionAttribute);
        this.geometry.setAttribute('color', this.colorAttribute);
        this.geometry.setAttribute('aScale', this.scaleAttribute);
        this.geometry.setAttribute('aRandomness', this.randomnessAttribute);

        this.material = new THREE.RawShaderMaterial({
            // size: this.parameters.size,
            // sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            // map: this.resources.particleTexture,
            vertexColors: true,
            vertexShader: particleVertex,
            fragmentShader: particleFragment,
            uniforms: {
                uSize: { value: this.parameters.size },
                uTime: { value: 0 }
            }
        });

        this.particles = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particles);
    }
    update() {
        // this.particles.rotation.y = -this.time.elapsed * this.parameters.speed;
        this.material.uniforms.uTime.value = -this.time.elapsed * this.parameters.speed;
    }
    setDebug() {
        this.debugFolder.add(this.parameters, "count").min(1000).max(100000).step(100).name('Count').onFinishChange(() => {
            this.generateGalaxy();
        });
        this.debugFolder.add(this.parameters, "size").min(1).max(50).step(.001).name('Size').onFinishChange(() => {
            this.generateGalaxy();
        });
        this.debugFolder.add(this.parameters, "radius").min(.01).max(20).step(.01).name('Radius').onFinishChange(() => {
            this.generateGalaxy();
        });
        this.debugFolder.add(this.parameters, "branches").min(1).max(20).step(1).name('Branches').onFinishChange(() => {
            this.generateGalaxy();
        });
        // this.debugFolder.add(this.parameters, "spin").min(-10).max(10).step(.001).name('Spin').onFinishChange(() => {
        //     this.generateGalaxy();
        // });
        this.debugFolder.add(this.parameters, "randomnessPower").min(1).max(20).step(.01).name('Randomness Power').onFinishChange(() => {
            this.generateGalaxy();
        });
        this.debugFolder.add(this.parameters, "speed").min(-.01).max(.01).step(.0001).name('Speed');

        this.debugFolder.addColor(this.parameters, "innerColor").name('Inner Color').onFinishChange(() => {
            this.generateGalaxy();
        });

        this.debugFolder.addColor(this.parameters, "outterColor").name('Outter Color').onFinishChange(() => {
            this.generateGalaxy();
        });
    }
}