import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "../../components/UI/aurora-background";
import { SocialAuroraBackground } from "../../components/UI/SocialAuroraBackground";
import {
  FiActivity,
  FiVideo,
  FiEdit,
  FiMessageSquare,
  FiLayers,
} from "react-icons/fi";

// Floating card component with always-on animation - improved design
const FloatingCard = ({
  title,
  delay = 0,
  translateX = 0,
  translateY = 0,
  rotateZ = 0,
  scale = 1,
  icon,
}: {
  title: string;
  delay?: number;
  translateX?: number;
  translateY?: number;
  rotateZ?: number;
  scale?: number;
  icon: JSX.Element;
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
      <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500/80"></div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-100/50 text-blue-600">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
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
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
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
      // Test AuroraBackground without assigning to unused variable
      <AuroraBackground>
        <div></div>
      </AuroraBackground>;
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
        className="text-center z-20 mb-10 relative -top-36"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl font-bold mb-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 drop-shadow-sm">
            RobinA
          </span>
        </h1>
        <p className="text-xl font-medium tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] bg-gradient-to-r from-blue-600/10 to-purple-700/10 px-6 py-2 rounded-full backdrop-blur-sm border border-white/20">
          STEM Tutor AI Assistant
        </p>
      </motion.div>

      {/* All visual elements container */}
      <div className="relative z-20 -top-20">
        {/* Central orb - replaced with the animation from Home component */}
        <motion.div
          className="relative w-48 h-48 mx-auto"
          animate={{
            rotateY: [0, 5, 0, -5, 0],
            rotateX: [0, 3, 0, -3, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
        >
          {/* Orbiting elements with multiple rings */}
          <div className="absolute inset-0">
            {/* First orbit ring */}
            <motion.div
              className="absolute w-full h-full rounded-full border border-blue-500/10"
              animate={{ rotate: [0, 360] }}
              transition={{
                repeat: Infinity,
                duration: 40,
                ease: "linear",
              }}
            >
              <motion.div
                className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </motion.div>

            {/* Second orbit ring */}
            <motion.div
              className="absolute w-[110%] h-[110%] -inset-[5%] rounded-full border border-purple-500/10"
              animate={{ rotate: [360, 0] }}
              transition={{
                repeat: Infinity,
                duration: 30,
                ease: "linear",
              }}
            >
              <motion.div
                className="absolute left-0 top-1/3 w-5 h-5 bg-purple-500 rounded-full"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
              />
            </motion.div>

            {/* Third orbit ring */}
            <motion.div
              className="absolute w-[120%] h-[120%] -inset-[10%] rounded-full border border-indigo-500/10"
              animate={{ rotate: [180, 540] }}
              transition={{
                repeat: Infinity,
                duration: 35,
                ease: "linear",
              }}
            >
              <motion.div
                className="absolute right-1/4 bottom-0 w-4 h-4 bg-indigo-400 rounded-full"
                animate={{
                  scale: [0.7, 1.1, 0.7],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  delay: 0.5,
                }}
              />
            </motion.div>
          </div>

          {/* Main orb layers */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-800/20 backdrop-blur-3xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-600/20 backdrop-blur-3xl"
            animate={{
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 backdrop-blur-3xl"
            animate={{
              scale: [0.92, 1.08, 0.92],
            }}
            transition={{
              repeat: Infinity,
              duration: 9,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Core with mask icon - lightened the background color */}
          <div className="absolute inset-12 rounded-full bg-gradient-to-br from-indigo-800/80 to-blue-800/80 shadow-[0_0_30px_15px_rgba(110,120,255,0.2)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.img
                src="/mask-icon.png"
                alt="AI Tutor Assistant"
                className="w-20 h-auto opacity-90 filter brightness-150"
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Orbiting cards - improved with relevant icons */}
        <FloatingCard
          title="Student Performance Tracking"
          translateX={-320}
          translateY={-190}
          rotateZ={-2}
          delay={0.2}
          icon={<FiActivity className="w-5 h-5" />}
        />
        <FloatingCard
          title="Tailored Education Videos"
          translateX={250}
          translateY={-210}
          rotateZ={2}
          delay={0.6}
          icon={<FiVideo className="w-5 h-5" />}
        />
        <FloatingCard
          title="Custom Exercises based on Needs"
          translateX={-250}
          translateY={30}
          rotateZ={-2}
          delay={1.0}
          icon={<FiEdit className="w-5 h-5" />}
        />
        <FloatingCard
          title="Instant Grading and Feedback"
          translateX={0}
          translateY={150}
          rotateZ={0}
          delay={1.4}
          icon={<FiMessageSquare className="w-5 h-5" />}
        />
        <FloatingCard
          title="AI Brainstorming about Students"
          translateX={250}
          translateY={30}
          rotateZ={2}
          delay={1.8}
          icon={<FiLayers className="w-5 h-5" />}
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
