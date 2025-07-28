import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function DaveAvatar({ talking }) {
  const group = useRef();
  const { scene, nodes } = useGLTF('/models/dave.glb');
  
  // Target the specific meshes we know exist
  const headMesh = nodes.Wolf3D_Head;
  const teethMesh = nodes.Wolf3D_Teeth;
  
  useEffect(() => {
    // Debug the head mesh morph targets
    if (headMesh && headMesh.morphTargetDictionary) {
      console.log('Wolf3D_Head morph targets:', Object.keys(headMesh.morphTargetDictionary));
    } else {
      console.log('Wolf3D_Head has no morph targets');
    }
    
    // Debug the teeth mesh morph targets
    if (teethMesh && teethMesh.morphTargetDictionary) {
      console.log('Wolf3D_Teeth morph targets:', Object.keys(teethMesh.morphTargetDictionary));
    } else {
      console.log('Wolf3D_Teeth has no morph targets');
    }
  }, [headMesh, teethMesh]);
  
  // Hide hands and arms
  useEffect(() => {
    // Hide all hand-related nodes
    const handsToHide = [
      'RightHand', 'LeftHand', 'Wolf3D_Hands',
      'RightHandIndex1', 'RightHandIndex2', 'RightHandIndex3',
      'RightHandMiddle1', 'RightHandMiddle2', 'RightHandMiddle3',
      'RightHandRing1', 'RightHandRing2', 'RightHandRing3',
      'RightHandPinky1', 'RightHandPinky2', 'RightHandPinky3',
      'RightHandThumb1', 'RightHandThumb2', 'RightHandThumb3',
      'LeftHandIndex1', 'LeftHandIndex2', 'LeftHandIndex3',
      'LeftHandMiddle1', 'LeftHandMiddle2', 'LeftHandMiddle3',
      'LeftHandRing1', 'LeftHandRing2', 'LeftHandRing3',
      'LeftHandPinky1', 'LeftHandPinky2', 'LeftHandPinky3',
      'LeftHandThumb1', 'LeftHandThumb2', 'LeftHandThumb3'
    ];
    
    handsToHide.forEach(partName => {
      if (nodes[partName]) {
        nodes[partName].visible = false;
      }
    });
  }, [nodes]);

  useFrame((state, delta) => {
    if (talking && headMesh) {
      const time = state.clock.getElapsedTime();
      const talkingIntensity = (Math.sin(time * 8) + 1) * 0.5; // 0 to 1
      
      // Try to animate mouth-related morph targets
      if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
        const morphDict = headMesh.morphTargetDictionary;
        
        // Common ReadyPlayerMe/Wolf3D morph target names for mouth
        const mouthMorphs = [
          'mouthOpen', 'jawOpen', 'jawDrop', 'mouthDrop',
          'viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U',
          'mouthSmile', 'mouthFrown', 'jawForward', 'jawLeft', 'jawRight'
        ];
        
        mouthMorphs.forEach(morphName => {
          if (morphDict[morphName] !== undefined) {
            const index = morphDict[morphName];
            if (headMesh.morphTargetInfluences[index] !== undefined) {
              // Animate jaw/mouth opening
              if (morphName.includes('Open') || morphName.includes('Drop') || morphName.includes('aa')) {
                headMesh.morphTargetInfluences[index] = talkingIntensity * 0.8;
                console.log(`Animating ${morphName}: ${talkingIntensity * 0.8}`);
              }
            }
          }
        });
      }
      
      // Also try animating teeth if they have morph targets
      if (teethMesh && teethMesh.morphTargetDictionary && teethMesh.morphTargetInfluences) {
        const teethMorphDict = teethMesh.morphTargetDictionary;
        Object.keys(teethMorphDict).forEach(morphName => {
          const index = teethMorphDict[morphName];
          if (morphName.toLowerCase().includes('open') || morphName.toLowerCase().includes('jaw')) {
            teethMesh.morphTargetInfluences[index] = talkingIntensity * 0.6;
          }
        });
      }
      
      // Fallback: slight jaw bone rotation if morph targets don't work
      const jawBone = nodes.Head;
      if (jawBone && (!headMesh.morphTargetDictionary || Object.keys(headMesh.morphTargetDictionary).length === 0)) {
        // Very subtle jaw movement on the head bone
        jawBone.rotation.x = Math.sin(time * 8) * 0.05;
        console.log('Using fallback jaw rotation');
      }
      
    } else {
      // Reset morph targets when not talking
      if (headMesh && headMesh.morphTargetInfluences) {
        headMesh.morphTargetInfluences.forEach((influence, index) => {
          headMesh.morphTargetInfluences[index] *= 0.9; // Gradually fade out
        });
      }
      
      if (teethMesh && teethMesh.morphTargetInfluences) {
        teethMesh.morphTargetInfluences.forEach((influence, index) => {
          teethMesh.morphTargetInfluences[index] *= 0.9;
        });
      }
      
      // Reset jaw rotation
      if (nodes.Head) {
        nodes.Head.rotation.x *= 0.9;
      }
    }
  });

  return <primitive ref={group} object={scene} scale={2.2} position={[0, -1.2, 0]} />;
}

export default function TalkingAvatar({ text, talking }) {
  return (
    <div style={{ width: 400, height: 400, borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 20 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} />
        <DaveAvatar talking={talking} text={text}/>
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}

// Preload the model for performance
useGLTF.preload('/models/dave.glb');
