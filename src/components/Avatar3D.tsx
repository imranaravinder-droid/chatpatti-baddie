"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type AvatarExpression = "neutral" | "happy" | "thinking" | "sad" | "surprised" | "speaking" | "angry";

interface Avatar3DProps {
  expression: AvatarExpression;
  size?: number;
}

function makeIrisTexture(base: string) {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, "#120c08");
  g.addColorStop(0.25, "#2a1c12");
  g.addColorStop(0.55, base);
  g.addColorStop(0.9, base);
  g.addColorStop(1, "#6a4a33");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * Math.PI * 2;
    const r1 = 10 + Math.random() * 15;
    ctx.strokeStyle = "rgba(40,26,16,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(32 + Math.cos(a) * r1, 32 + Math.sin(a) * r1);
    ctx.lineTo(32 + Math.cos(a) * (r1 + 6 + Math.random() * 5), 32 + Math.sin(a) * (r1 + 6 + Math.random() * 5));
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

export default function Avatar3D({ expression, size = 280 }: Avatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.25, 6.6);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Soft studio lighting — flattering, human look
    const hemi = new THREE.HemisphereLight(0xffffff, 0x8a6a55, 0.85);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff1df, 2.0);
    key.position.set(4, 6, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd8e8ff, 0.65);
    fill.position.set(-5, 2, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(0, 3, -6);
    scene.add(rim);
    // Soft under-light to make skin glow (K-pop glossy look)
    const bounce = new THREE.DirectionalLight(0xffc9a3, 0.35);
    bounce.position.set(0, -4, 3);
    scene.add(bounce);

    const group = new THREE.Group();
    scene.add(group);

    // ================= MATERIALS =================
    // Pale porcelain K-pop skin — cool undertone with natural warmth, flawless glow
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xf3dcc9,
      roughness: 0.38,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      sheen: 0.7,
      sheenColor: new THREE.Color(0xffa88f),
      sheenRoughness: 0.32,
    });
    // Deep charcoal-black hair with blue-black sheen (two-block cut)
    const hairMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0e, roughness: 0.45, clearcoat: 0.15, clearcoatRoughness: 0.4 });
    const browMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.7 });
    // Soft pink-nude gradient lip (reference ~#D8AFA6)
    const lipMat = new THREE.MeshPhysicalMaterial({ color: 0xc9928a, roughness: 0.3, metalness: 0.02, clearcoat: 0.25 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfefefe, roughness: 0.05 });
    const corneaMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.02,
      metalness: 0,
      transparent: true,
      opacity: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
    });
    // Black matte button-down shirt (reference)
    const jacketMat = new THREE.MeshPhysicalMaterial({ color: 0x101014, roughness: 0.65, clearcoat: 0.3, clearcoatRoughness: 0.25 });
    const shirtMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1f, roughness: 0.6, clearcoat: 0.15 });

    // ================= HEAD (narrow V-line, sharp K-pop jaw) =================
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.05, 64, 64), skinMat);
    head.scale.set(0.8, 1.16, 0.92);
    head.position.y = 0.25;
    head.castShadow = true;
    group.add(head);

    // Jaw — sharply tapered V-line (cheeks pinch in toward a pointed chin)
    const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.88, 48, 48), skinMat);
    jaw.scale.set(0.72, 0.8, 0.72);
    jaw.position.set(0, -0.36, 0.02);
    group.add(jaw);
    // Two cheek planes angled inward to carve the V silhouette
    const cheekGeo = new THREE.SphereGeometry(0.55, 32, 32);
    for (const side of [-1, 1]) {
      const cheek = new THREE.Mesh(cheekGeo, skinMat);
      cheek.scale.set(0.52, 0.95, 0.6);
      cheek.position.set(0.6 * side, -0.2, 0.18);
      cheek.rotation.z = -0.6 * side;
      group.add(cheek);
    }
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 24), skinMat);
    chin.scale.set(1, 0.9, 0.8);
    chin.position.set(0, -0.9, 0.34);
    group.add(chin);

    // ================= EARS =================
    const earGeo = new THREE.SphereGeometry(0.17, 24, 24);
    const earMat = new THREE.MeshStandardMaterial({ color: 0xeeb98d, roughness: 0.5 });
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(earGeo, earMat);
      ear.scale.set(0.55, 1, 0.7);
      ear.position.set(0.97 * side, 0.05, 0);
      group.add(ear);
    }

    // ================= EYES — big bright almond, dark brown iris =================
    const irisTex = makeIrisTexture("#3a2414");
    const eyes: THREE.Group[] = [];
    const pupils: THREE.Mesh[] = [];
    const eyelidGroup = new THREE.Group();
    group.add(eyelidGroup);

    for (const side of [-1, 1]) {
      const eye = new THREE.Group();
      // Eyes sit deeper in the face so the white ball does NOT bulge out
      eye.position.set(0.43 * side, 0.5, 0.9);
      eye.scale.set(1.05, 0.85, 1); // almond but open

      // Sclera (white ball) — iris/pupil sit ON its front surface, NOT inside
      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), whiteMat);
      eye.add(sclera);

      // Iris circle sits just PAST the sclera surface (z>0.16) so the
      // opaque white ball never hides it.
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.098, 32), new THREE.MeshStandardMaterial({ map: irisTex, roughness: 0.25 }));
      iris.position.set(0, 0, 0.161);
      eye.add(iris);

      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), new THREE.MeshBasicMaterial({ color: 0x0a0603 }));
      pupil.position.set(0, 0, 0.164);
      eye.add(pupil);

      const cornea = new THREE.Mesh(new THREE.SphereGeometry(0.168, 32, 32), corneaMat);
      eye.add(cornea);

      // Catch-light sparkle (bright, top-left of each eye)
      const sparkle = new THREE.Mesh(
        new THREE.CircleGeometry(0.03, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      sparkle.position.set(-0.032, 0.048, 0.169);
      eye.add(sparkle);

      group.add(eye);
      eyes.push(eye);
      pupils.push(pupil);

      // Eyelid (blink) — sharp straight lid line, matching eye depth
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5), skinMat);
      lid.position.set(0.43 * side, 0.5, 0.9);
      eyelidGroup.add(lid);

      // Tapered double-lid crease (closer to lash line)
      const crease = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.007, 0.02), new THREE.MeshStandardMaterial({ color: 0xb58a68, roughness: 0.6 }));
      crease.position.set(0.43 * side, 0.63, 0.88);
      eyelidGroup.add(crease);

      // Aegyosal (under-eye puff line) — K-pop eye feature
      const aegyosal = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.014, 0.02), new THREE.MeshStandardMaterial({ color: 0xd9b094, roughness: 0.7 }));
      aegyosal.position.set(0.43 * side, 0.36, 0.87);
      eyelidGroup.add(aegyosal);

      // Eyelashes
      const lashMat = new THREE.MeshStandardMaterial({ color: 0x0d0906, roughness: 0.6 });
      const lashGeo = new THREE.BoxGeometry(0.01, 0.05, 0.01);
      for (let k = 0; k < 9; k++) {
        const t = (k / 8) * 0.44 - 0.22;
        const lash = new THREE.Mesh(lashGeo, lashMat);
        lash.position.set(0.43 * side + t * 1.7, 0.655, 0.91 + Math.abs(t) * 0.07);
        lash.rotation.z = t * 4;
        lash.rotation.x = -0.45;
        eyelidGroup.add(lash);
      }
    }
    eyelidGroup.position.y = 0;

    // ================= EYEBROWS — straight K-pop brows, clearly visible =================
    const browMat2 = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.55 });
    const browGeo = new THREE.BoxGeometry(0.42, 0.06, 0.035);
    const leftBrow = new THREE.Mesh(browGeo, browMat2);
    leftBrow.position.set(-0.43, 0.8, 0.9);
    leftBrow.rotation.z = 0.05;
    const rightBrow = new THREE.Mesh(browGeo, browMat2);
    rightBrow.position.set(0.43, 0.8, 0.9);
    rightBrow.rotation.z = -0.05;
    group.add(leftBrow, rightBrow);

    // ================= NOSE — slender straight bridge, refined upturned tip =================
    const noseBridge = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.42, 0.06), skinMat);
    noseBridge.position.set(0, 0.28, 0.99);
    group.add(noseBridge);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 24), skinMat);
    nose.scale.set(0.66, 1.0, 0.85);
    nose.position.set(0, 0.04, 1.06);
    group.add(nose);
    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), skinMat);
    noseTip.position.set(0, -0.03, 1.18);
    group.add(noseTip);

    // ================= LIPS — M-shaped upper, fuller lower, pink-nude =================
    // Upper lip: two lobes meeting at a cupid's bow
    const upperLipLeft = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 24, 0, Math.PI, 0, Math.PI), lipMat);
    upperLipLeft.scale.set(1.5, 0.4, 0.8);
    upperLipLeft.position.set(-0.065, -0.17, 1.05);
    upperLipLeft.rotation.z = Math.PI;
    group.add(upperLipLeft);
    const upperLipRight = upperLipLeft.clone();
    upperLipRight.position.x = 0.065;
    group.add(upperLipRight);
    const cupidBow = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), lipMat);
    cupidBow.position.set(0, -0.145, 1.075);
    group.add(cupidBow);

    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.17, 1.06);
    // Fuller lower lip
    const lowerLip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24, 0, Math.PI, 0, Math.PI), lipMat);
    lowerLip.scale.set(1.5, 0.42, 0.85);
    lowerLip.position.y = -0.12;
    mouthGroup.add(lowerLip);
    // Inner mouth (visible when open / talking)
    const innerMouth = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20, 0, Math.PI, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0x4a1c1c, roughness: 0.8 }));
    innerMouth.position.y = -0.1;
    innerMouth.rotation.z = Math.PI;
    mouthGroup.add(innerMouth);
    group.add(mouthGroup);

    // ================= HAIR — two-block cut, side part, messy curtain bangs =================
    // Slim base cap (thin, hugs the skull so it doesn't read as a helmet)
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1.12, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat);
    hairCap.scale.set(0.83, 1.12, 0.94);
    hairCap.position.set(0, 0.58, -0.02);
    group.add(hairCap);

    // High crown volume (two-block top)
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(1.05, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.42), hairMat);
    hairTop.scale.set(0.86, 0.6, 0.9);
    hairTop.position.set(0.0, 0.98, 0.1);
    hairTop.rotation.x = -0.14;
    group.add(hairTop);

    // Short neat sides (two-block: sides cropped)
    const sideVol = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), hairMat);
    sideVol.scale.set(0.3, 0.95, 0.9);
    sideVol.position.set(0.84, 0.45, -0.05);
    group.add(sideVol);
    const sideVolL = sideVol.clone();
    sideVolL.position.x = -0.84;
    group.add(sideVolL);

    // Curtain bangs sweeping from a side part (part on viewer-left) — long, covering brow
    const bangs = [
      { x: -0.66, y: 0.84, z: 0.82, len: 0.72, tilt: 0.42 },
      { x: -0.5, y: 0.95, z: 0.99, len: 0.68, tilt: 0.28 },
      { x: -0.32, y: 1.0, z: 1.05, len: 0.66, tilt: 0.14 },
      { x: -0.1, y: 1.0, z: 1.06, len: 0.66, tilt: 0.0 },
      { x: 0.12, y: 0.98, z: 1.04, len: 0.66, tilt: -0.14 },
      { x: 0.34, y: 0.92, z: 0.98, len: 0.68, tilt: -0.28 },
      { x: 0.54, y: 0.84, z: 0.86, len: 0.72, tilt: -0.42 },
      { x: 0.66, y: 0.74, z: 0.7, len: 0.74, tilt: -0.54 },
      { x: -0.62, y: 0.74, z: 0.62, len: 0.62, tilt: 0.54 },
      { x: 0.62, y: 0.74, z: 0.62, len: 0.62, tilt: -0.56 },
    ];
    const strand = (x: number, y: number, z: number, len: number, tilt = 0) => {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, len, 8), hairMat);
      s.position.set(x, y, z);
      s.rotation.z = tilt;
      s.rotation.x = 0.22;
      group.add(s);
    };
    bangs.forEach(b => strand(b.x, b.y, b.z, b.len, b.tilt));

    // Extra fine front strands for a textured, messy look
    for (let i = 0; i < 18; i++) {
      const t = (i / 17) * 1.3 - 0.65;
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.008, 0.5 + Math.random() * 0.25, 6), hairMat);
      s.position.set(t * 0.9, 0.82 + Math.abs(t) * 0.12, 0.84 + Math.abs(t) * 0.2);
      s.rotation.z = t * 1.8;
      s.rotation.x = 0.18 + Math.random() * 0.14;
      group.add(s);
    }

    // Back hair — neat Korean crop
    const backHair = new THREE.Mesh(new THREE.SphereGeometry(1.08, 32, 32, 0, Math.PI * 2, 0, Math.PI), hairMat);
    backHair.scale.set(0.84, 1.16, 0.5);
    backHair.position.set(0, 0.32, -0.5);
    group.add(backHair);

    // ================= EARRING — small silver hoop, left ear =================
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 12, 24), new THREE.MeshStandardMaterial({ color: 0xd8dde2, metalness: 1, roughness: 0.2 }));
    hoop.position.set(-1.02, -0.06, 0.02);
    group.add(hoop);

    // ================= NECK + TORSO — lean, broad shoulders, black shirt =================
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.72, 24), skinMat);
    neck.position.set(0, -1.0, 0);
    group.add(neck);

    // Capsule torso — reads as a human chest/shoulders, not a ball
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.52, 0.8, 8, 20), jacketMat);
    torso.scale.set(1.15, 1.0, 0.8);
    torso.position.set(0, -1.85, 0);
    torso.rotation.z = 0.1;
    torso.castShadow = true;
    group.add(torso);

    // Broad shoulders (deltoids)
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), jacketMat);
    shoulderL.scale.set(1, 0.9, 0.7);
    shoulderL.position.set(-0.92, -1.35, 0);
    group.add(shoulderL);
    const shoulderR = shoulderL.clone();
    shoulderR.position.x = 0.92;
    group.add(shoulderR);

    // Black shirt collar — structured, slightly open V
    const collar = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.4, 20, 1, true), shirtMat);
    collar.rotation.x = Math.PI;
    collar.position.set(0, -1.22, 0);
    group.add(collar);

    // Collarbone hint
    const clavicle = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), skinMat);
    clavicle.scale.set(1.1, 0.32, 0.45);
    clavicle.position.set(0, -1.28, 0.15);
    group.add(clavicle);

    let rafId = 0;
    let targetRotation = 0;
    let blinkFrame = 0;
    let blinkState = 0;
    let mouthOpen = 0;
    let idleTimer = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      idleTimer += 0.01;
      group.rotation.y = Math.sin(idleTimer * 2) * 0.08 + targetRotation;
      group.rotation.x = Math.sin(idleTimer * 1.4) * 0.035;
      group.position.y = Math.sin(idleTimer * 1.1) * 0.05;

      // Gaze
      const gaze = Math.sin(idleTimer * 0.8) * 0.02;
      pupils.forEach(p => p.position.set(gaze, gaze * 0.5, 0.16));
      eyes.forEach(e => e.rotation.y = gaze * 1.2);

      // Blink
      blinkFrame++;
      if (blinkFrame > 120 + Math.random() * 70) {
        blinkFrame = 0;
        blinkState = 1;
      }
      if (blinkState > 0) {
        blinkState += 0.09;
        const p = blinkState < 0.5 ? blinkState * 2 : (1 - blinkState) * 2;
        eyelidGroup.position.y = 0.3 * p;
        eyelidGroup.rotation.x = 0.5 * p;
        if (blinkState >= 1) blinkState = 0;
      } else {
        eyelidGroup.position.y = 0;
        eyelidGroup.rotation.x = 0;
      }

      // Expressions
      switch (expression) {
        case "happy":
          targetRotation = 0.12;
          mouthGroup.position.y = -0.11;
          mouthGroup.position.z = 1.11;
          upperLipLeft.scale.set(1.85, 0.5, 0.9);
          upperLipRight.scale.set(1.85, 0.5, 0.9);
          leftBrow.rotation.z = -0.12;
          rightBrow.rotation.z = 0.12;
          break;
        case "sad":
          targetRotation = 0;
          mouthGroup.position.y = -0.25;
          mouthGroup.position.z = 1.0;
          leftBrow.rotation.z = 0.28;
          rightBrow.rotation.z = -0.28;
          break;
        case "surprised":
          targetRotation = 0;
          mouthGroup.position.y = -0.3;
          mouthGroup.position.z = 1.13;
          mouthGroup.scale.set(1.3, 1.35, 1);
          eyelidGroup.position.y = -0.05;
          pupils.forEach(p => p.scale.setScalar(0.8));
          break;
        case "thinking":
          targetRotation = 0.2;
          mouthGroup.position.y = -0.2;
          leftBrow.rotation.z = 0.2;
          rightBrow.rotation.z = -0.2;
          break;
        case "angry":
          targetRotation = -0.08;
          mouthGroup.position.y = -0.2;
          leftBrow.rotation.z = 0.4;
          rightBrow.rotation.z = -0.4;
          break;
        case "speaking":
          targetRotation = 0;
          mouthOpen = Math.abs(Math.sin(idleTimer * 22)) * 0.15;
          mouthGroup.position.y = -0.17 - mouthOpen * 1.7;
          mouthGroup.position.z = 1.07;
          mouthGroup.scale.set(1, 1.35, 1.1);
          break;
        default:
          targetRotation = 0;
          mouthGroup.position.y = -0.17;
          mouthGroup.position.z = 1.06;
          mouthGroup.scale.set(1, 1, 1);
          leftBrow.rotation.z = 0;
          rightBrow.rotation.z = 0;
          pupils.forEach(p => p.scale.setScalar(1));
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const m = obj.material as THREE.Material;
          if (Array.isArray(m)) m.forEach(x => x.dispose());
          else m.dispose();
        }
      });
    };
  }, [expression, size]);

  return <div ref={mountRef} style={{ width: size, height: size }} />;
}
