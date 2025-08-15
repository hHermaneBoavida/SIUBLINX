"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment } from "@react-three/drei"
import * as THREE from "three"

interface LogoMeshProps {
  isHovered: boolean
  onClick?: () => void
}

function LogoMesh({ isHovered, onClick }: LogoMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Continuous slow rotation
      groupRef.current.rotation.y += delta * 0.3

      // Hover effects
      if (isHovered) {
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.15
        groupRef.current.scale.setScalar(1.15 + Math.sin(state.clock.elapsedTime * 4) * 0.08)
      } else {
        groupRef.current.rotation.x = 0
        groupRef.current.scale.setScalar(1)
      }
    }
    setTime(state.clock.elapsedTime)
  })

  const createCatFace = () => {
    const shape = new THREE.Shape()

    // More angular, geometric face outline matching the reference image
    shape.moveTo(0, -1.8) // Bottom point
    shape.lineTo(-1.4, -1.2) // Bottom left
    shape.lineTo(-1.8, -0.2) // Left side
    shape.lineTo(-1.6, 0.8) // Upper left
    shape.lineTo(-1.0, 1.2) // Left cheek
    shape.lineTo(0, 1.4) // Top center
    shape.lineTo(1.0, 1.2) // Right cheek
    shape.lineTo(1.6, 0.8) // Upper right
    shape.lineTo(1.8, -0.2) // Right side
    shape.lineTo(1.4, -1.2) // Bottom right
    shape.lineTo(0, -1.8) // Back to bottom

    return shape
  }

  const createEars = () => {
    const leftEar = new THREE.Shape()
    leftEar.moveTo(-1.0, 1.2) // Start from face connection
    leftEar.lineTo(-2.2, 3.0) // Outer ear point
    leftEar.lineTo(-1.4, 3.4) // Ear tip
    leftEar.lineTo(-0.6, 2.2) // Inner ear point
    leftEar.lineTo(-1.0, 1.2) // Back to face

    const rightEar = new THREE.Shape()
    rightEar.moveTo(1.0, 1.2) // Start from face connection
    rightEar.lineTo(2.2, 3.0) // Outer ear point
    rightEar.lineTo(1.4, 3.4) // Ear tip
    rightEar.lineTo(0.6, 2.2) // Inner ear point
    rightEar.lineTo(1.0, 1.2) // Back to face

    return [leftEar, rightEar]
  }

  const catFace = createCatFace()
  const [leftEar, rightEar] = createEars()

  return (
    <group ref={groupRef} onClick={onClick}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        {/* Main face with enhanced glow */}
        <mesh position={[0, 0, 0]}>
          <extrudeGeometry
            args={[
              catFace,
              {
                depth: 0.25,
                bevelEnabled: true,
                bevelThickness: 0.08,
                bevelSize: 0.06,
                bevelSegments: 12,
              },
            ]}
          />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={isHovered ? 1.2 : 0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Left ear with enhanced styling */}
        <mesh position={[0, 0, 0.12]}>
          <extrudeGeometry
            args={[
              leftEar,
              {
                depth: 0.18,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.04,
                bevelSegments: 8,
              },
            ]}
          />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={isHovered ? 0.8 : 0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Right ear with enhanced styling */}
        <mesh position={[0, 0, 0.12]}>
          <extrudeGeometry
            args={[
              rightEar,
              {
                depth: 0.18,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.04,
                bevelSegments: 8,
              },
            ]}
          />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={isHovered ? 0.8 : 0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        <mesh position={[-0.5, 0.1, 0.3]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.0 + Math.sin(time * 6) * 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.5, 0.1, 0.3]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.0 + Math.sin(time * 6) * 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -0.3, 0.3]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.1, 0.2, 4]} />
          <meshStandardMaterial
            color="#ff0088"
            emissive="#ff0088"
            emissiveIntensity={0.7}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {[-1.0, -0.7, 0.7, 1.0].map((x, i) => (
          <mesh key={i} position={[x, -0.2, 0.35]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
            <cylinderGeometry args={[0.015, 0.015, 1.0]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.4}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </Float>

      <pointLight position={[0, 0, 3]} color="#00ff88" intensity={isHovered ? 3 : 1.5} distance={12} />
      <pointLight position={[-2, 2, 2]} color="#00ffff" intensity={isHovered ? 1.5 : 0.8} distance={8} />
      <pointLight position={[2, 2, 2]} color="#ff0088" intensity={isHovered ? 1.2 : 0.6} distance={8} />
    </group>
  )
}

interface SublinxLogo3DProps {
  size?: "small" | "medium" | "large"
  interactive?: boolean
  onClick?: () => void
  className?: string
}

export function SublinxLogo3D({ size = "medium", interactive = true, onClick, className = "" }: SublinxLogo3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeMap = {
    small: { width: 60, height: 60 },
    medium: { width: 120, height: 120 },
    large: { width: 200, height: 200 },
  }

  const dimensions = sizeMap[size]

  return (
    <div
      className={`${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{
          width: "100%",
          height: "100%",
          cursor: interactive ? "pointer" : "default",
        }}
      >
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />

        <LogoMesh isHovered={isHovered} onClick={onClick} />
      </Canvas>
    </div>
  )
}
