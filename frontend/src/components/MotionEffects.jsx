import { motion } from "framer-motion";

/**
 * Word-by-word blur-in text animation.
 * Each word transitions from blurred and translated to sharp and settled.
 */
export function BlurText({
  text = "",
  className = "",
  delay = 0,
  stagger = 0.05,
  as: Component = "span",
}) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        className="inline-block"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block mr-[0.28em] will-change-transform"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}

/**
 * Ambient floating container for badges, icons, or 3D graphics.
 */
export function FloatingElement({
  children,
  className = "",
  duration = 4,
  yOffset = 10,
  xOffset = 0,
  rotate = 0,
  delay = 0,
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -yOffset, 0],
        x: xOffset !== 0 ? [0, xOffset, 0] : 0,
        rotate: rotate !== 0 ? [0, rotate, -rotate, 0] : 0,
      }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Directional page / stage transition wrapper with blur and slide.
 */
export function PageTransition({
  children,
  direction = "right", // "right" | "left" | "up" | "fade"
  className = "",
  stageKey,
}) {
  const getInitialOffset = () => {
    switch (direction) {
      case "right":
        return { x: 40, y: 0 };
      case "left":
        return { x: -40, y: 0 };
      case "up":
        return { x: 0, y: 24 };
      default:
        return { x: 0, y: 16 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      key={stageKey}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        x: -offset.x * 0.7,
        y: -offset.y * 0.7,
        filter: "blur(10px)",
      }}
      transition={{
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`w-full min-w-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Interactive card with subtle lift and tap micro-interactions.
 */
export function CardMotion({
  children,
  className = "",
  onClick,
  hoverY = -3,
  scaleOnHover = 1.01,
}) {
  return (
    <motion.div
      whileHover={{ y: hoverY, scale: scaleOnHover }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
