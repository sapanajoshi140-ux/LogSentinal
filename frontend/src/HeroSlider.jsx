import { motion } from "framer-motion";

const AnimatedTitle = ({ text }) => {
  const words = text.replace(/<<br>/, " ").split(" ");
  const accentWords = ["Logs,", "Understood", "Instantly"];

  return (
    <motion.h1
      className="font-['Cormorant_Garamond'] text-[clamp(2rem,7vw,4.5rem)] font-semibold tracking-[0.02em] leading-[1.15] mb-4 sm:mb-6 max-w-[900px] flex flex-wrap justify-center gap-x-[0.35em]"
      style={{ color: "#F5F0E8" }}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.45 } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, x: -25 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
          }}
        >
          {accentWords.includes(word) ? (
            <span className="italic" style={{ color: "#C9A84C" }}>
              {word}
            </span>
          ) : (
            word
          )}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const StatsBar = () => {
  const stats = [
    { icon: "10×", label: "Faster Reading" },
    { icon: "AI",  label: "Smart Summaries" },
    { icon: "?",   label: "Query AI" },
  ];

  return (
    <motion.div
      className="relative z-10 flex justify-center px-4 sm:px-8 pb-8 sm:pb-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.8 }}
    >
      <div
        className="flex items-center justify-center rounded-2xl px-4 sm:px-12 py-4 sm:py-6 gap-0 w-full max-w-[480px] sm:w-auto"
        style={{
          background: "rgba(13,13,13,0.55)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          border: "0.5px solid rgba(201,168,76,0.25)",
          boxShadow:
            "0 1px 32px rgba(0,0,0,0.45), inset 0 0.5px 0 rgba(201,168,76,0.15)",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 sm:flex-none sm:px-10 px-3 relative"
          >
            {/* Divider */}
            {index !== stats.length - 1 && (
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-6 sm:h-8"
                style={{ background: "rgba(201,168,76,0.25)" }}
              />
            )}
            <span
              className="font-['Inter'] text-[clamp(1.2rem,4vw,2rem)] font-semibold leading-none mb-1 sm:mb-1.5"
              style={{ color: "#C9A84C" }}
            >
              {stat.icon}
            </span>
            <span
              className="font-['Inter'] text-[8px] sm:text-[9px] tracking-[0.14em] sm:tracking-[0.18em] uppercase leading-relaxed text-center whitespace-nowrap"
              style={{ color: "rgba(245,240,232,0.55)" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Picture = ({ title, desc, img }) => {
  return (
    <div
      className="relative"
      style={{
        border: "0.5px solid rgba(201,168,76,0.25)",
        boxShadow:
          "0 1px 32px rgba(0,0,0,0.45), inset 0 0.5px 0 rgba(201,168,76,0.15)",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.60] saturate-[1.2] z-0"
        style={{ backgroundImage: `url(${img})` }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.6) 50%, rgba(13,13,13,0.85) 100%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-[2] flex flex-col items-center justify-center text-center min-h-[85vh] sm:min-h-[75vh] px-4 sm:px-8 pt-12 sm:pt-16 pb-4 sm:pb-6">
        <AnimatedTitle text={title} />

        <motion.p
          className="font-['Cormorant_Garamond'] text-[clamp(1rem,3.5vw,1.5rem)] font-normal italic tracking-[0.04em] mb-8 sm:mb-10 max-w-[520px] leading-relaxed px-2 sm:px-0"
          style={{ color: "rgba(245,240,232,0.55)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
        >
          {desc}
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8 sm:mb-10 w-full px-6 sm:px-0 sm:w-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <motion.button
            className="font-['Inter'] text-s tracking-[0.14em] font-semibold rounded-full px-8 py-3 cursor-pointer whitespace-nowrap transition-all duration-200 w-full sm:w-auto"
            style={{
              color: "#F5F0E8",
              background: "transparent",
              border: "0.5px solid rgba(201,168,76,0.25)",
            }}
            onClick={() =>
              document
                .getElementById("footer-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            whileHover={{
              scale: 1.05,
              color: "#E8C96A",
              borderColor: "#C9A84C",
              backgroundColor: "rgba(201,168,76,0.06)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>

      <StatsBar />
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="px-3 sm:px-6 py-1">
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden">
        <Picture
          title="Logs, Understood Instantly"
          desc="Your AI-powered log intelligence platform."
          img="first.png"
        />
      </div>
    </div>
  );
};

export default HeroSection;