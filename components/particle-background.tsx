"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Create clock
    const clock = new THREE.Clock()

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

    const particleSystem = new THREE.Points(particles, particleMaterial)
    scene.add(particleSystem)

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      particleMaterial.uniforms.pixelRatio.value = window.devicePixelRatio
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      const time = clock.getElapsedTime()
      particleMaterial.uniforms.time.value = time

      // Rotate particles slowly
      particleSystem.rotation.y = time * 0.05
      particleSystem.rotation.x = time * 0.03

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full z-[-3] pointer-events-none"></div>
}
