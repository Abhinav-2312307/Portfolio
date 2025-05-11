// This file contains the Three.js background effect
// Import this in your HTML if you want to separate the Three.js code

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js"

// Create a class for the particle background
class ParticleBackground {
  constructor() {
    this.container = document.createElement("div")
    this.container.style.position = "fixed"
    this.container.style.top = "0"
    this.container.style.left = "0"
    this.container.style.width = "100%"
    this.container.style.height = "100%"
    this.container.style.zIndex = "-3"
    this.container.style.pointerEvents = "none"
    document.body.appendChild(this.container)

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 0)
    this.container.appendChild(this.renderer.domElement)

    this.clock = new THREE.Clock()

    this.init()
    this.animate()

    window.addEventListener("resize", this.onWindowResize.bind(this))
  }

  init() {
    // Create particles
    const particleCount = 200
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const color = new THREE.Color()

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      // Color - green to cyan gradient
      const mixRatio = Math.random()
      color.setHSL(0.3 + mixRatio * 0.1, 1.0, 0.5)

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Size
      sizes[i] = Math.random() * 0.1 + 0.05
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    // Shader material for particles
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Animate particles
          vec3 pos = position;
          pos.y += sin(time * 0.2 + position.x) * 0.1;
          pos.x += cos(time * 0.2 + position.y) * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular particles
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
          
          if (alpha < 0.1) discard;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })

    this.particles = new THREE.Points(particles, particleMaterial)
    this.scene.add(this.particles)
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    const time = this.clock.getElapsedTime()
    this.particles.material.uniforms.time.value = time

    // Rotate particles slowly
    this.particles.rotation.y = time * 0.05
    this.particles.rotation.x = time * 0.03

    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.particles.material.uniforms.pixelRatio.value = window.devicePixelRatio
  }
}

// Initialize the particle background
const particleBackground = new ParticleBackground()

// Export for use in other files
export { particleBackground }
