import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

declare const gsap: any;
declare const ScrollTrigger: any;
declare const SplitText: any;
declare const dat: any;

@Component({
  selector: 'app-scrollthreed',
  standalone: false,
  templateUrl: './scrollthreed.component.html',
  styleUrl: './scrollthreed.component.scss'
})
export class ScrollthreedComponent {
private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private group!: THREE.Group;
  private torus!: THREE.Mesh;
  private torusLight!: THREE.PointLight;
  private spotLight!: THREE.SpotLight;
  private fillLight!: THREE.PointLight;
  private rimLight!: THREE.PointLight;
  private gui: any;
  private animationId: any;
  private time = 0;
  private isBrowser: boolean;

  private animationParams = {
    flickerSpeed: 0.02,
    flickerIntensity: 10,
    autoRotation: true,
    rotationSpeed: 1
  };

  images = [
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/man-one.jpg', alt: 'man' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/women-one.jpg', alt: 'women' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/women-two.jpg', alt: 'women' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/man-two.jpg', alt: 'man' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/women-four.jpg', alt: 'women' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/man-four.jpg', alt: 'man' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/man-five.jpg', alt: 'man' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/man-six.jpg', alt: 'man' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/women-six.jpg', alt: 'women' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/man-seven.jpg', alt: 'man' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/men-eight.jpg', alt: 'man' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/women-eight.jpg', alt: 'women' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/women-nine.jpg', alt: 'women' },
    { src: 'https://webprojects.cloud/r&d/roman-structure/images/men-nine.jpg', alt: 'man' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      this.initThreeJS();
      this.initGSAP();
    }, 0);
  }

  private initThreeJS(): void {
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
    if (!canvas) return;

    // Scene setup
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Torus with emissive material
    const geometry = new THREE.TorusGeometry(0.2, 0.04, 4, 20);
    const material = new THREE.MeshStandardMaterial({
      color: 0x2555FD,
      emissive: 0x2555FD,
      emissiveIntensity: 5,
      wireframe: true
    });
    this.torus = new THREE.Mesh(geometry, material);
    this.torus.position.set(0, 1.8, 0);
    this.group.add(this.torus);

    const BLOOM_LAYER = 1;
    this.torus.layers.enable(BLOOM_LAYER);

    // Lights
    this.torusLight = new THREE.PointLight(0xffffff, 0.01, 0.25, 0.0004);
    this.torusLight.position.set(0, 1.8, -2);
    this.scene.add(this.torusLight);

    this.spotLight = new THREE.SpotLight(0xffffff, 17, 100, 10, 10);
    this.spotLight.position.set(0, 3, 0.5);
    this.spotLight.castShadow = true;
    this.scene.add(this.spotLight);

    this.fillLight = new THREE.PointLight(0x5599FF, 30, 5, 2);
    this.fillLight.position.set(-2, 2, 2);

    this.rimLight = new THREE.PointLight(0xffffff, 20, 1, 1.5);
    this.rimLight.position.set(1, 1, 1);
    this.scene.add(this.rimLight);

    // Load GLTF model
    this.loadModel();

    // Camera
    const sizes = { width: window.innerWidth, height: window.innerHeight };
    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    this.camera.position.set(0, 2, 2);
    this.scene.add(this.camera);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Post-processing
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(sizes.width, sizes.height);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(sizes.width, sizes.height),
      1,
      1.0,
      0
    );
    this.composer.addPass(bloomPass);

    // GUI
    this.initGUI(bloomPass);

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Animation loop
    this.animate();
  }

  private loadModel(): void {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      'https://raw.githubusercontent.com/Sabur-Ahemad/roman-godess-3d/main/flora/scene.gltf',
      (gltf: GLTF) => {
        const mesh = gltf.scene;
        mesh.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        mesh.position.set(0, 10.8, -15);
        this.group.add(mesh);

        // Hide loader
        const loaderEl = document.getElementById('preloader');
        if (loaderEl && typeof gsap !== 'undefined') {
          gsap.to(loaderEl, {
            scale: 1.5,
            opacity: 0,
            duration: 0.5,
            ease: 'linear',
            onComplete: () => loaderEl.remove()
          });
        }
      },
      (xhr: ProgressEvent) => {
        const percent = (xhr.loaded / xhr.total) * 100;
        console.log(`Loading model: ${percent.toFixed(0)}%`);
      },
     
    );
  }

  private initGUI(bloomPass: UnrealBloomPass): void {
    if (typeof dat === 'undefined') return;

    this.gui = new dat.GUI({ width: 350 });

    // Torus Controls
    const torusFolder = this.gui.addFolder('Torus');
    torusFolder.add(this.torus.position, 'x', -5, 5, 0.1).name('Position X');
    torusFolder.add(this.torus.position, 'y', -5, 5, 0.1).name('Position Y');
    torusFolder.add(this.torus.position, 'z', -5, 5, 0.1).name('Position Z');
    torusFolder.add(this.torus.rotation, 'x', 0, Math.PI * 2, 0.1).name('Rotation X');
    torusFolder.add(this.torus.rotation, 'y', 0, Math.PI * 2, 0.1).name('Rotation Y');
    torusFolder.add(this.torus.rotation, 'z', 0, Math.PI * 2, 0.1).name('Rotation Z');
    torusFolder.add((this.torus.material as THREE.MeshStandardMaterial), 'emissiveIntensity', 0, 10, 0.1).name('Emissive Intensity');

    // Camera Controls
    const cameraFolder = this.gui.addFolder('Camera');
    cameraFolder.add(this.camera.position, 'x', -10, 10, 0.1).name('Position X');
    cameraFolder.add(this.camera.position, 'y', -10, 10, 0.1).name('Position Y');
    cameraFolder.add(this.camera.position, 'z', -10, 10, 0.1).name('Position Z');
    cameraFolder.add(this.camera, 'fov', 10, 150, 1).onChange(() => {
      this.camera.updateProjectionMatrix();
    }).name('Field of View');

    // Torus Light Controls
    const torusLightFolder = this.gui.addFolder('Torus Light');
    torusLightFolder.add(this.torusLight.position, 'x', -5, 5, 0.1).name('Position X');
    torusLightFolder.add(this.torusLight.position, 'y', -5, 5, 0.1).name('Position Y');
    torusLightFolder.add(this.torusLight.position, 'z', -5, 5, 0.1).name('Position Z');
    torusLightFolder.add(this.torusLight, 'intensity', 0, 200, 1).name('Base Intensity');
    torusLightFolder.add(this.torusLight, 'distance', 0, 10, 0.1).name('Distance');
    torusLightFolder.add(this.torusLight, 'decay', 0, 5, 0.1).name('Decay');

    // Spot Light Controls
    const spotLightFolder = this.gui.addFolder('Spot Light');
    spotLightFolder.add(this.spotLight.position, 'x', -10, 10, 0.1).name('Position X');
    spotLightFolder.add(this.spotLight.position, 'y', -10, 10, 0.1).name('Position Y');
    spotLightFolder.add(this.spotLight.position, 'z', -10, 10, 0.1).name('Position Z');
    spotLightFolder.add(this.spotLight, 'intensity', 0, 50, 1).name('Intensity');
    spotLightFolder.add(this.spotLight, 'distance', 0, 200, 1).name('Distance');
    spotLightFolder.add(this.spotLight, 'angle', 0, Math.PI / 2, 0.01).name('Angle');
    spotLightFolder.add(this.spotLight, 'penumbra', 0, 1, 0.01).name('Penumbra');

    // Rim Light Controls
    const rimLightFolder = this.gui.addFolder('Rim Light');
    rimLightFolder.add(this.rimLight.position, 'x', -10, 10, 0.1).name('Position X');
    rimLightFolder.add(this.rimLight.position, 'y', -10, 10, 0.1).name('Position Y');
    rimLightFolder.add(this.rimLight.position, 'z', -10, 10, 0.1).name('Position Z');
    rimLightFolder.add(this.rimLight, 'intensity', 0, 50, 1).name('Intensity');
    rimLightFolder.add(this.rimLight, 'distance', 0, 10, 0.1).name('Distance');
    rimLightFolder.add(this.rimLight, 'decay', 0, 5, 0.1).name('Decay');

    // Bloom Effect Controls
    const bloomFolder = this.gui.addFolder('Bloom Effect');
    bloomFolder.add(bloomPass, 'strength', 0, 3, 0.01).name('Strength');
    bloomFolder.add(bloomPass, 'radius', 0, 2, 0.01).name('Radius');
    bloomFolder.add(bloomPass, 'threshold', 0, 1, 0.01).name('Threshold');

    // Animation Controls
    const animationFolder = this.gui.addFolder('Animation');
    animationFolder.add(this.animationParams, 'flickerSpeed', 0, 0.1, 0.001).name('Flicker Speed');
    animationFolder.add(this.animationParams, 'flickerIntensity', 0, 50, 1).name('Flicker Intensity');
    animationFolder.add(this.animationParams, 'autoRotation').name('Auto Rotation');
    animationFolder.add(this.animationParams, 'rotationSpeed', 0, 5, 0.1).name('Rotation Speed');

    // Group Controls
    const groupFolder = this.gui.addFolder('Group Transform');
    groupFolder.add(this.group.position, 'x', -10, 10, 0.1).name('Position X');
    groupFolder.add(this.group.position, 'y', -10, 10, 0.1).name('Position Y');
    groupFolder.add(this.group.position, 'z', -10, 10, 0.1).name('Position Z');
    groupFolder.add(this.group.rotation, 'x', 0, Math.PI * 2, 0.1).name('Rotation X');
    groupFolder.add(this.group.rotation, 'y', 0, Math.PI * 2, 0.1).name('Rotation Y');
    groupFolder.add(this.group.rotation, 'z', 0, Math.PI * 2, 0.1).name('Rotation Z');

    this.gui.close();
  }

  private initGSAP(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Group rotation on scroll
    gsap.to(this.group.rotation, {
      y: '+=6.28',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    // Camera movement on scroll
    gsap.to(this.camera.position, {
      y: 1,
      z: 1.7,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    // Banner animation
    gsap.from('.banner-section', {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power2.out'
    });

    // Image animations
    const images = document.querySelectorAll('.images-container .img-main');
    images.forEach((img) => {
      gsap.to(img, {
        y: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    });
  }

  private animate = (): void => {
    this.time += this.animationParams.flickerSpeed;

    // Flickering light effect
    this.torusLight.intensity = this.torusLight.intensity + Math.sin(this.time) * this.animationParams.flickerIntensity;

    // Auto rotation
    if (this.animationParams.autoRotation) {
      this.torus.rotation.z += 0.01 * this.animationParams.rotationSpeed;
    }

    this.renderer.render(this.scene, this.camera);
    this.composer.render();
    this.animationId = requestAnimationFrame(this.animate);
  };

  private onWindowResize(): void {
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    this.camera.aspect = sizes.width / sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.composer.setSize(sizes.width, sizes.height);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', () => this.onWindowResize());

    if (this.gui) {
      this.gui.destroy();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.composer) {
      this.composer.dispose();
    }

    // Clean up geometries and materials
    if (this.torus) {
      this.torus.geometry.dispose();
      (this.torus.material as THREE.Material).dispose();
    }
  }
}