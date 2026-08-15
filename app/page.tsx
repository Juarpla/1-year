"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  GlowLayer,
  HemisphericLight,
  MeshBuilder,
  PointLight,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";

const chapters = [
  "El comienzo",
  "Nuestra primera Navidad",
  "Un nuevo año",
  "Los días que se volvieron hogar",
  "Más cerca, más nosotros",
  "Pequeñas aventuras",
  "Risas sin explicación",
  "La calma de coincidir",
  "Noches que no queríamos terminar",
  "El mundo se ve mejor contigo",
  "Nuestra forma de querernos",
  "La complicidad",
  "Planes improvisados",
  "Los lugares que hicimos nuestros",
  "Tu mano, mi lugar favorito",
  "Días de sol",
  "Siempre en el mismo equipo",
  "Más historias para contar",
  "Una vida en cada abrazo",
  "Nosotros, sin filtros",
  "Todo lo que somos",
  "Casi 365",
  "Y esto apenas comienza",
];

const monthLabels = [
  "NOV · 2025",
  "NOV · 2025",
  "DIC · 2025",
  "DIC · 2025",
  "DIC · 2025",
  "ENE · 2026",
  "FEB · 2026",
  "MAR · 2026",
  "MAR · 2026",
  "MAR · 2026",
  "MAR · 2026",
  "ABR · 2026",
  "JUN · 2026",
  "JUN · 2026",
  "JUN · 2026",
  "JUL · 2026",
  "JUL · 2026",
  "JUL · 2026",
  "JUL · 2026",
  "JUL · 2026",
  "JUL · 2026",
  "AGO · 2026",
  "AGO · 2026",
];

const lottieHeart = {
  v: "5.10.0",
  fr: 60,
  ip: 0,
  op: 120,
  w: 240,
  h: 240,
  nm: "corazon infinito",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "halo",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [12], e: [55] },
            { t: 60, s: [55], e: [12] },
            { t: 120, s: [12] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [120, 120, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [82, 82, 100], e: [112, 112, 100] },
            { t: 60, s: [112, 112, 100], e: [82, 82, 100] },
            { t: 120, s: [82, 82, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [132, 132] },
          nm: "halo",
        },
        {
          ty: "st",
          c: { a: 0, k: [1, 0.29, 0.57, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 },
          lc: 2,
          lj: 2,
          nm: "trazo",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "corazon",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [120, 122, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [86, 86, 100], e: [104, 104, 100] },
            { t: 18, s: [104, 104, 100], e: [92, 92, 100] },
            { t: 34, s: [92, 92, 100], e: [100, 100, 100] },
            { t: 48, s: [100, 100, 100], e: [86, 86, 100] },
            { t: 120, s: [86, 86, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "sh",
          ks: {
            a: 0,
            k: {
              i: [
                [0, 0],
                [-29, -24],
                [-48, 22],
                [0, 44],
                [48, 22],
                [29, -24],
              ],
              o: [
                [29, -24],
                [48, 22],
                [0, 44],
                [-48, 22],
                [-29, -24],
                [0, 0],
              ],
              v: [[0, 57], [68, -9], [42, -60], [0, -36], [-42, -60], [-68, -9]],
              c: true,
            },
          },
          nm: "forma",
        },
        {
          ty: "gf",
          o: { a: 0, k: 100 },
          r: 1,
          bm: 0,
          g: {
            p: 3,
            k: {
              a: 0,
              k: [0, 1, 0.2, 0.48, 0.5, 0.73, 0.16, 0.82, 1, 0.55, 0.38, 1],
            },
          },
          s: { a: 0, k: [-50, -50] },
          e: { a: 0, k: [56, 58] },
          t: 1,
          nm: "aurora",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
  ],
};

type HeartLottieProps = {
  animationData: typeof lottieHeart;
  loop: boolean;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

function HeartLottie({ className, ...props }: HeartLottieProps) {
  const [Player, setPlayer] = useState<ComponentType<HeartLottieProps> | null>(null);

  useEffect(() => {
    let active = true;
    void import("lottie-react").then((module) => {
      const imported = module.default as unknown;
      const component = typeof imported === "function"
        ? (imported as ComponentType<HeartLottieProps>)
        : (imported as { default?: ComponentType<HeartLottieProps> }).default;
      if (active && component) setPlayer(() => component);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!Player) return <div className={`${className ?? ""} lottie-placeholder`} aria-hidden="true"><i /></div>;
  return <Player className={className} {...props} />;
}

function ThreeUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stop = () => {};
    let active = true;

    void import("three").then((THREE) => {
      if (!active || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
      camera.position.set(0, 0, 7.4);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const universe = new THREE.Group();
      scene.add(universe);

      const positions = new Float32Array(1700 * 3);
      const colors = new Float32Array(1700 * 3);
      const pink = new THREE.Color("#ff6aa9");
      const blue = new THREE.Color("#7dd8ff");
      const white = new THREE.Color("#fff8f2");

      for (let i = 0; i < 1700; i += 1) {
        const radius = 5 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi) - 3;
        const color = Math.random() > 0.78 ? pink : Math.random() > 0.5 ? blue : white;
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const starMaterial = new THREE.PointsMaterial({
        size: 0.035,
        transparent: true,
        opacity: 0.78,
        vertexColors: true,
        sizeAttenuation: true,
      });
      const stars = new THREE.Points(starGeometry, starMaterial);
      universe.add(stars);

      const heartPoints: InstanceType<typeof THREE.Vector3>[] = [];
      for (let i = 0; i <= 180; i += 1) {
        const t = (i / 180) * Math.PI * 2;
        heartPoints.push(
          new THREE.Vector3(
            (16 * Math.sin(t) ** 3) / 9,
            (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 9,
            0.12 * Math.sin(t * 3),
          ),
        );
      }
      const heartCurve = new THREE.CatmullRomCurve3(heartPoints, true);
      const heartGeometry = new THREE.TubeGeometry(heartCurve, 220, 0.018, 8, true);
      const heartMaterial = new THREE.MeshBasicMaterial({
        color: "#ff4f98",
        transparent: true,
        opacity: 0.34,
      });
      const heart = new THREE.Mesh(heartGeometry, heartMaterial);
      heart.scale.setScalar(1.45);
      heart.rotation.z = Math.PI;
      heart.position.set(0.25, -0.4, -2.2);
      universe.add(heart);

      const orbitGroup = new THREE.Group();
      for (let i = 0; i < 4; i += 1) {
        const geometry = new THREE.TorusGeometry(2.7 + i * 0.55, 0.008, 6, 180);
        const material = new THREE.MeshBasicMaterial({
          color: i % 2 ? "#ff8cbc" : "#8cddff",
          transparent: true,
          opacity: 0.16 - i * 0.022,
        });
        const orbit = new THREE.Mesh(geometry, material);
        orbit.rotation.x = 1.05 + i * 0.17;
        orbit.rotation.y = 0.25 + i * 0.41;
        orbitGroup.add(orbit);
      }
      orbitGroup.position.z = -1.3;
      universe.add(orbitGroup);

      const photoGroup = new THREE.Group();
      const loader = new THREE.TextureLoader();
      [2, 7, 11, 16, 20, 23].forEach((number, index) => {
        const texture = loader.load(`/photos/memory-${String(number).padStart(2, "0")}.jpg`);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88,
        });
        const geometry = new THREE.PlaneGeometry(index % 2 ? 1.22 : 1.5, index % 2 ? 1.58 : 0.95);
        const card = new THREE.Mesh(geometry, material);
        const angle = (index / 6) * Math.PI * 2;
        card.position.set(Math.cos(angle) * 4.25, Math.sin(angle) * 2.15, -0.5 - (index % 3) * 0.65);
        card.lookAt(0, 0, 5.8);
        photoGroup.add(card);
      });
      universe.add(photoGroup);

      let pointerX = 0;
      let pointerY = 0;
      const onPointer = (event: PointerEvent) => {
        pointerX = (event.clientX / window.innerWidth - 0.5) * 0.46;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 0.3;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      const clock = new THREE.Clock();
      let frame = 0;
      const animate = () => {
        const elapsed = clock.getElapsedTime();
        universe.rotation.y += (pointerX - universe.rotation.y) * 0.012;
        universe.rotation.x += (-pointerY - universe.rotation.x) * 0.012;
        stars.rotation.y = elapsed * 0.006;
        heart.rotation.y = elapsed * 0.12;
        orbitGroup.rotation.z = elapsed * 0.025;
        photoGroup.rotation.z = Math.sin(elapsed * 0.18) * 0.035;
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(animate);
      };
      animate();

      stop = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", resize);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
              if ("map" in material && material.map instanceof THREE.Texture) material.map.dispose();
              material.dispose();
            });
          }
        });
        starGeometry.dispose();
        starMaterial.dispose();
        renderer.dispose();
      };
    });

    return () => {
      active = false;
      stop();
    };
  }, []);

  return <canvas ref={canvasRef} className="universe-canvas" aria-hidden="true" />;
}

function BabylonHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, { alpha: true, antialias: true });
    engine.setHardwareScalingLevel(Math.max(1, window.devicePixelRatio / 1.6));
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.12, 6.6, Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 5.4;
    camera.upperRadiusLimit = 8;
    camera.wheelPrecision = 100;
    camera.panningSensibility = 0;
    camera.attachControl(canvas, true);

    const ambient = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
    ambient.intensity = 0.55;
    const roseLight = new PointLight("rose", new Vector3(-3, 2, 3), scene);
    roseLight.diffuse = new Color3(1, 0.16, 0.48);
    roseLight.intensity = 18;
    const blueLight = new PointLight("blue", new Vector3(3, -1, 2), scene);
    blueLight.diffuse = new Color3(0.18, 0.68, 1);
    blueLight.intensity = 14;

    const path: Vector3[] = [];
    for (let i = 0; i <= 220; i += 1) {
      const t = (i / 220) * Math.PI * 2;
      path.push(
        new Vector3(
          (16 * Math.sin(t) ** 3) / 7.6,
          (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 7.6,
          Math.sin(t * 3) * 0.22,
        ),
      );
    }

    const heart = MeshBuilder.CreateTube("heart", { path, radius: 0.075, tessellation: 12, cap: 3 }, scene);
    heart.rotation.z = Math.PI;
    const heartMaterial = new StandardMaterial("heart-material", scene);
    heartMaterial.diffuseColor = new Color3(0.94, 0.04, 0.35);
    heartMaterial.emissiveColor = new Color3(0.82, 0.02, 0.3);
    heartMaterial.specularColor = new Color3(1, 0.64, 0.78);
    heart.material = heartMaterial;

    const core = MeshBuilder.CreateSphere("core", { diameter: 1.55, segments: 48 }, scene);
    const coreMaterial = new StandardMaterial("core-material", scene);
    coreMaterial.diffuseColor = new Color3(0.08, 0.01, 0.08);
    coreMaterial.emissiveColor = new Color3(0.19, 0.01, 0.13);
    coreMaterial.alpha = 0.52;
    core.material = coreMaterial;

    [3.9, 4.65, 5.35].forEach((diameter, index) => {
      const ring = MeshBuilder.CreateTorus(
        `orbit-${index}`,
        { diameter, thickness: 0.018, tessellation: 160 },
        scene,
      );
      ring.rotation.x = 0.9 + index * 0.3;
      ring.rotation.y = 0.2 + index * 0.5;
      const ringMaterial = new StandardMaterial(`orbit-material-${index}`, scene);
      ringMaterial.emissiveColor = index % 2 ? new Color3(0.16, 0.6, 1) : new Color3(1, 0.2, 0.52);
      ringMaterial.alpha = 0.38;
      ring.material = ringMaterial;
    });

    const seed = MeshBuilder.CreateSphere("stardust", { diameter: 0.035, segments: 5 }, scene);
    const dustMaterial = new StandardMaterial("dust-material", scene);
    dustMaterial.emissiveColor = new Color3(1, 0.68, 0.84);
    seed.material = dustMaterial;
    seed.isVisible = false;
    for (let i = 0; i < 95; i += 1) {
      const particle = seed.createInstance(`dust-${i}`);
      const radius = 2.2 + Math.random() * 2.9;
      const angle = Math.random() * Math.PI * 2;
      particle.position = new Vector3(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 5.8,
        Math.sin(angle) * radius * 0.45,
      );
      particle.scaling.setAll(0.45 + Math.random() * 1.8);
    }

    const glow = new GlowLayer("glow", scene, { blurKernelSize: 48 });
    glow.intensity = 1.15;

    const observer = new ResizeObserver(() => engine.resize());
    observer.observe(canvas);
    let elapsed = 0;
    engine.runRenderLoop(() => {
      elapsed += engine.getDeltaTime() * 0.001;
      heart.rotation.y = elapsed * 0.32;
      heart.scaling.setAll(0.97 + Math.sin(elapsed * 2.1) * 0.035);
      core.scaling.setAll(0.92 + Math.sin(elapsed * 2.1) * 0.055);
      scene.meshes.forEach((mesh) => {
        if (mesh.name.startsWith("orbit-")) mesh.rotation.z += 0.0015;
      });
      scene.render();
    });

    return () => {
      observer.disconnect();
      camera.detachControl();
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="babylon-canvas" aria-label="Corazón tridimensional interactivo" />;
}

function MusicPlayer({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
    };
  }, [audioRef]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }, [audioRef]);

  return (
    <div className="music-player" aria-label="Reproductor de la canción de Juan y Walewska">
      <button type="button" className="music-toggle" onClick={toggle} aria-label={playing ? "Pausar canción" : "Reproducir canción"}>
        {playing ? "Ⅱ" : "▶"}
      </button>
      <div className="music-copy">
        <span>NUESTRA CANCIÓN</span>
        <strong>Heaven Can Wait · Michael Jackson</strong>
        <div className="music-track" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
      <div className={`equalizer ${playing ? "is-playing" : ""}`} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [entered, setEntered] = useState(false);

  const memories = useMemo(
    () =>
      chapters.map((chapter, index) => ({
        src: `/photos/memory-${String(index + 1).padStart(2, "0")}.jpg`,
        chapter,
        month: monthLabels[index],
      })),
    [],
  );

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${value})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!entered || !rootRef.current) return;
    let cleanup = () => {};
    let alive = true;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (!alive || !rootRef.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-kicker", { opacity: 0, y: 24, duration: 0.7 })
          .from(".hero-title .line", { yPercent: 115, rotate: 3, duration: 1.15, stagger: 0.12 }, "-=0.35")
          .from(".hero-lede", { opacity: 0, y: 26, duration: 0.8 }, "-=0.55")
          .from(".hero-photo-shell", { opacity: 0, scale: 0.86, rotate: -3, duration: 1.25 }, "-=1.05")
          .from(".hero-meta", { opacity: 0, y: 18, duration: 0.65 }, "-=0.55");

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 70,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 84%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>(".memory-card").forEach((card, index) => {
          gsap.from(card, {
            opacity: 0,
            y: 80 + (index % 3) * 20,
            rotate: index % 2 ? 2.5 : -2.5,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 92%", once: true },
          });
        });

        gsap.to(".orbit-photo.is-left", {
          yPercent: -16,
          rotate: -8,
          scrollTrigger: { trigger: ".orbit-gallery", start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
        gsap.to(".orbit-photo.is-right", {
          yPercent: 18,
          rotate: 9,
          scrollTrigger: { trigger: ".orbit-gallery", start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
        gsap.to(".orbit-photo.is-center", {
          scale: 1.08,
          scrollTrigger: { trigger: ".orbit-gallery", start: "top 80%", end: "bottom 30%", scrub: 1.2 },
        });
        gsap.to(".manifesto-word", {
          backgroundPositionX: "0%",
          stagger: 0.18,
          scrollTrigger: { trigger: ".manifesto", start: "top 72%", end: "bottom 48%", scrub: 1 },
        });
      }, rootRef);

      cleanup = () => context.revert();
    });

    return () => {
      alive = false;
      cleanup();
    };
  }, [entered]);

  const enter = (withMusic: boolean) => {
    setEntered(true);
    if (withMusic) {
      window.setTimeout(() => {
        void audioRef.current?.play().catch(() => undefined);
      }, 200);
    }
  };

  return (
    <main ref={rootRef} className="experience">
      <audio ref={audioRef} src="/audio/heaven-can-wait.mp3" preload="metadata" loop />
      <ThreeUniverse />
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />

      {!entered && (
        <div className="entrance" role="dialog" aria-modal="true" aria-labelledby="entrance-title">
          <div className="entrance-photo" aria-hidden="true" />
          <div className="entrance-vignette" aria-hidden="true" />
          <div className="entrance-content">
            <HeartLottie animationData={lottieHeart} loop className="entrance-lottie" aria-hidden="true" />
            <p>UNA EXPERIENCIA PARA DOS</p>
            <h1 id="entrance-title">Juan <i>×</i> Walewska</h1>
            <span>Un año merece sentirse, no solo contarse.</span>
            <button type="button" onClick={() => enter(true)}>
              Entrar a nuestra historia <b>↗</b>
            </button>
            <button type="button" className="quiet-entry" onClick={() => enter(false)}>
              continuar sin música
            </button>
          </div>
        </div>
      )}

      <header className="topbar">
        <a href="#inicio" className="monogram" aria-label="Ir al inicio">J·W</a>
        <span>365 / ∞</span>
        <a href="#recuerdos">Recuerdos</a>
      </header>

      <section id="inicio" className="hero section-shell">
        <div className="hero-copy">
          <p className="hero-kicker">AÑO UNO · NUESTRA HISTORIA</p>
          <h1 className="hero-title" aria-label="365 días, una historia infinita">
            <span className="line-wrap"><span className="line">365 días.</span></span>
            <span className="line-wrap"><span className="line gradient-text">Una historia</span></span>
            <span className="line-wrap"><span className="line">infinita.</span></span>
          </h1>
          <p className="hero-lede">
            Hay personas que llegan. Y hay personas que convierten cada día en un lugar al que siempre quieres volver.
          </p>
          <div className="hero-meta">
            <span>JUAN</span>
            <i />
            <span>WALEWSKA</span>
          </div>
        </div>

        <div className="hero-photo-shell" aria-label="Juan y Walewska juntos">
          <div className="hero-photo" />
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="photo-badge">01<br /><span>AÑO</span></div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>DESLIZA</span>
          <i />
        </div>
      </section>

      <section className="manifesto section-shell">
        <p className="eyebrow" data-reveal>EN NÚMEROS</p>
        <div className="manifesto-copy">
          <span className="manifesto-word">8,760 horas.</span>
          <span className="manifesto-word">525,600 minutos.</span>
          <span className="manifesto-word">Millones de latidos.</span>
          <span className="manifesto-word accent">Una sola elección: nosotros.</span>
        </div>
      </section>

      <section className="orbit-gallery section-shell">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">NUESTRO UNIVERSO</p>
          <h2>Dos vidas.<br />La misma órbita.</h2>
          <p>Todo lo extraordinario empezó con algo muy simple: coincidir.</p>
        </div>
        <div className="orbit-stage" aria-label="Selección de recuerdos">
          <figure className="orbit-photo is-left">
            <img src="/photos/memory-08.jpg" alt="Juan y Walewska en uno de sus recuerdos" />
            <figcaption>La complicidad</figcaption>
          </figure>
          <figure className="orbit-photo is-center">
            <img src="/photos/memory-16.jpg" alt="Un momento especial de Juan y Walewska" />
            <figcaption>Siempre nosotros</figcaption>
          </figure>
          <figure className="orbit-photo is-right">
            <img src="/photos/memory-21.jpg" alt="Juan y Walewska celebrando juntos" />
            <figcaption>La vida contigo</figcaption>
          </figure>
          <div className="orbit-line line-a" aria-hidden="true" />
          <div className="orbit-line line-b" aria-hidden="true" />
        </div>
      </section>

      <section className="numbers section-shell">
        <div className="stat" data-reveal>
          <strong>365</strong>
          <span>días eligiéndonos</span>
        </div>
        <div className="stat" data-reveal>
          <strong>24</strong>
          <span>instantes guardados aquí</span>
        </div>
        <div className="stat" data-reveal>
          <strong>∞</strong>
          <span>todo lo que viene</span>
        </div>
      </section>

      <section className="heart-section section-shell">
        <div className="heart-copy" data-reveal>
          <p className="eyebrow">UN LATIDO COMPARTIDO</p>
          <h2>No fue suerte.<br />Fue encontrarnos.</h2>
          <p>
            Entre millones de personas, lugares y momentos posibles, el universo hizo su parte. Nosotros hicimos el resto.
          </p>
          <div className="touch-hint"><i /> Mueve el corazón</div>
        </div>
        <div className="heart-visual" data-reveal>
          <BabylonHeart />
          <div className="heart-caption"><span>J</span><i>+</i><span>W</span></div>
        </div>
      </section>

      <section id="recuerdos" className="memories section-shell">
        <div className="memories-heading" data-reveal>
          <p className="eyebrow">23 MOMENTOS · UNA HISTORIA</p>
          <h2>La prueba de que<br />fuimos felices aquí.</h2>
          <p>Un archivo vivo de miradas, aventuras y días normales que terminaron siendo inolvidables.</p>
        </div>
        <div className="memory-grid">
          {memories.map((memory, index) => (
            <figure key={memory.src} className={`memory-card shape-${index % 5}`}>
              <div className="memory-image">
                <img src={memory.src} alt={`${memory.chapter}, recuerdo de Juan y Walewska`} loading="lazy" />
              </div>
              <figcaption>
                <span>{memory.month}</span>
                <strong>{memory.chapter}</strong>
                <i>{String(index + 1).padStart(2, "0")}</i>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="promise section-shell">
        <div className="promise-glow" aria-hidden="true" />
        <div className="promise-content" data-reveal>
          <HeartLottie animationData={lottieHeart} loop className="promise-lottie" aria-hidden="true" />
          <p className="eyebrow">LO MEJOR TODAVÍA NO HA PASADO</p>
          <h2>Si este fue el año uno,<br /><span>imagina toda la vida.</span></h2>
          <p>
            Gracias por cada risa, cada abrazo, cada plan inesperado y por hacer que «nosotros» sea mi palabra favorita.
          </p>
          <div className="signature">
            <span>Con todo mi amor,</span>
            <strong>Juan</strong>
          </div>
        </div>
        <div className="final-photo" data-reveal>
          <img src="/photos/hero.jpg" alt="Juan y Walewska celebrando su primer año" />
          <div className="final-photo-shine" />
        </div>
      </section>

      <footer>
        <span>JUAN × WALEWSKA</span>
        <p>Hecho con amor para el primero de muchos.</p>
        <span>2025 — 2026</span>
      </footer>

      {entered && <MusicPlayer audioRef={audioRef} />}
    </main>
  );
}
