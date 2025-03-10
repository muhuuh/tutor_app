import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "../../components/UI/aurora-background";
import { SocialAuroraBackground } from "../../components/UI/SocialAuroraBackground";
import { FiCheck } from "react-icons/fi";

// Floating card component with always-on animation
const FloatingCard = ({
  title,
  delay = 0,
  translateX = 0,
  translateY = 0,
  rotateZ = 0,
  scale = 1,
}: {
  title: string;
  delay?: number;
  translateX?: number;
  translateY?: number;
  rotateZ?: number;
  scale?: number;
}) => {
  return (
    <motion.div
      className="absolute rounded-2xl border border-indigo-100/20 shadow-xl overflow-hidden"
      style={{
        width: "240px",
        background: "linear-gradient(to bottom right, #ffffff, #f0f4ff)",
      }}
      initial={{
        x: translateX,
        y: translateY,
        rotate: rotateZ,
        scale: scale,
      }}
      animate={{
        y: [translateY - 6, translateY + 6, translateY - 6],
        rotate: [rotateZ - 1, rotateZ + 1, rotateZ - 1],
      }}
      transition={{
        duration: 6,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800">{title}</h3>
        <div className="space-y-2">
          {/* Placeholders with check icons */}
          <div className="flex items-center gap-2">
            <FiCheck className="text-green-500 flex-shrink-0" />
            <div className="h-3 w-full bg-blue-100/50 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="text-green-500 flex-shrink-0" />
            <div className="h-3 w-4/5 bg-blue-100/50 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="text-green-500 flex-shrink-0" />
            <div className="h-3 w-5/6 bg-blue-100/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Particle effect component
const Particles = () => {
  // Create an array of particles with random positions
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -200],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export const SocialMediaVisual = () => {
  const [useCustomBackground, setUseCustomBackground] = useState(false);

  // Hide the header when this component is mounted
  useEffect(() => {
    // Hide header when component mounts
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    // Check if AuroraBackground is working properly
    try {
      const test = (
        <AuroraBackground>
          <div></div>
        </AuroraBackground>
      );
    } catch (error) {
      console.error(
        "Error with AuroraBackground, using custom background",
        error
      );
      setUseCustomBackground(true);
    }

    // Show header again when component unmounts
    return () => {
      if (header) {
        header.style.display = "";
      }
    };
  }, []);

  // The main component content
  const VisualContent = () => (
    <div className="relative h-screen w-full flex flex-col items-center justify-center">
      {/* Particle effects */}
      <Particles />

      {/* Hero headline */}
      <motion.div
        className="text-center z-10 mb-10 relative -top-36"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl font-bold mb-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-purple-300 drop-shadow-sm">
            RobinA
          </span>
        </h1>
        <p className="text-xl font-medium tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] bg-gradient-to-r from-blue-600/10 to-purple-700/10 px-6 py-2 rounded-full backdrop-blur-sm border border-white/20">
          STEM Tutor AI Assistant
        </p>
      </motion.div>

      {/* All visual elements container */}
      <div className="relative z-10 -top-20">
        {/* Central orb */}
        <motion.div
          className="relative w-48 h-48 flex items-center justify-center mx-auto"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Animated glowing orb */}
          <div className="absolute w-48 h-48">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 backdrop-blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-400/40 to-purple-500/40 backdrop-blur-3xl"
              animate={{
                scale: [0.95, 1.05, 0.95],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-300/50 to-purple-400/50 backdrop-blur-3xl"
              animate={{
                scale: [0.9, 1.1, 0.9],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            {/* Core glow */}
            <div className="absolute inset-12 rounded-full shadow-[0_0_30px_15px_rgba(110,120,255,0.4)] bg-blue-100"></div>
          </div>
        </motion.div>

        {/* Orbiting cards */}
        <FloatingCard
          title="Real-Time Performance Tracking"
          translateX={-320}
          translateY={-190}
          rotateZ={-2}
          delay={0.2}
        />
        <FloatingCard
          title="Tailored Education Videos"
          translateX={250}
          translateY={-210}
          rotateZ={2}
          delay={0.6}
        />
        <FloatingCard
          title="Crafted New Exercises"
          translateX={-250}
          translateY={30}
          rotateZ={-2}
          delay={1.0}
        />
        <FloatingCard
          title="Instant Grading and Feedback"
          translateX={0}
          translateY={150}
          rotateZ={0}
          delay={1.4}
        />
        <FloatingCard
          title="Brainstorm Personalized Study Plans"
          translateX={250}
          translateY={30}
          rotateZ={2}
          delay={1.8}
        />
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {useCustomBackground ? (
        <SocialAuroraBackground>
          <VisualContent />
        </SocialAuroraBackground>
      ) : (
        <AuroraBackground showRadialGradient={false}>
          <VisualContent />
        </AuroraBackground>
      )}
    </div>
  );
};

export default SocialMediaVisual;
