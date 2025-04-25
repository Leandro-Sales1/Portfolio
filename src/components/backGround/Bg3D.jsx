/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Scene3D({isMobile}) {
  return (
    <div className="absolute top-0 w-full h-[573%] lg:h-[205%]">
      <Canvas>
        <ParticlesCircle isMobile={isMobile} />
      </Canvas>
    </div>
  );
}

function ParticlesCircle({isMobile}) {
  const myMesh = useRef({});

  useFrame((_, delta) => {
    if (myMesh.current) {
      myMesh.current.rotation.x += delta * 0.1;
      myMesh.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <points ref={myMesh} rotation={[1, 5, 0]} scale={3.3}>
      <sphereGeometry args={[1, 68, 68]} />
      <pointsMaterial
        color="white"
        size={isMobile ? 0.002 : 0.005}
        sizeAttenuation={true}
        opacity={0.2}
      />
    </points>
  );
}