/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function getHeightMultiplier(viewportWidth) {
  if (!viewportWidth || viewportWidth >= 1536) return 1.76;
  if (viewportWidth >= 1024) return 1.42;
  if (viewportWidth >= 640) return 3.8;
  return 5.7;
}

export default function Bg3D({ isMobile, viewportHeight = 0, viewportWidth = 0 }) {
  const multiplier = getHeightMultiplier(viewportWidth);
  const heightPx = viewportHeight > 0 ? Math.round(viewportHeight * multiplier) : null;
  const style = heightPx != null
    ? { height: `${heightPx}px`, width: viewportWidth > 0 ? `${viewportWidth}px` : "100%" }
    : { minHeight: "100vh", width: "100%" };

  return (
    <div className="absolute top-0 left-0" style={style}>
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
        size={isMobile ? 0.003 : 0.005}
        sizeAttenuation={true}
        opacity={0.2}
      />
    </points>
  );
}