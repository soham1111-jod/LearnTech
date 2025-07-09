import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Ballpit from '../components/Ballpit';

// GradientText component for animated gradient heading
function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div
      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${className}`}
    >
      {showBorder && (
        <div
          className="absolute inset-0 bg-cover z-0 pointer-events-none gradient-animated"
          style={{
            ...gradientStyle,
            backgroundSize: "300% 100%",
          }}
        >
          <div
            className="absolute inset-0 bg-black rounded-[1.25rem] z-[-1]"
            style={{
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
      )}
      <div
        className="inline-block relative z-2 text-transparent bg-cover gradient-animated"
        style={{
          ...gradientStyle,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundSize: "300% 100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [ballCount, setBallCount] = useState(200);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setBallCount(60);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-black">
      {/* Ballpit animation as background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Ballpit
          count={ballCount}
          gravity={0.7}
          friction={0.8}
          wallBounce={0.95}
          followCursor={true}
        />
        {/* Enhanced overlay with gradient for better visual hierarchy */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80 backdrop-blur-sm" />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-16 max-w-4xl mx-auto w-full mt-10 md:mt-20 animate-fade-in">
        {/* Enhanced Hero Title */}
        <div className="text-center mb-8">
        <GradientText
  className="text-5xl sm:text-6xl md:text-8xl font-timeline tracking-tight mb-4 drop-shadow-2xl transition-all duration-500 leading-tight"
  colors={["#a5b4fc", "#c084fc", "#818cf8", "#f472b6"]}
  animationSpeed={8}
  showBorder={false}
>
  LearnTech
</GradientText>
          <div    className="text-5xl sm:text-6xl md:text-8xl font-montserrat font-black tracking-tight mb-4 drop-shadow-2xl transition-all duration-500 leading-tight"></div>
        </div>

        {/* Enhanced Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl mb-12 font-medium font-sans text-center max-w-3xl leading-relaxed">
          <span className="text-gray-200 drop-shadow-lg">Discover, learn, and innovate with curated</span>{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
            Generative AI
          </span>{' '}
          <span className="text-gray-200 drop-shadow-lg">resources, projects, and video summaries.</span>
        </p>

        {/* Educational CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
  to="/playlists"
  className="
    group inline-flex items-center justify-center 
    px-8 py-4 sm:px-10 sm:py-5
    rounded-full
    font-semibold text-lg sm:text-xl
    text-white
    bg-gradient-to-r from-purple-600 to-indigo-600
    shadow-[0_0_20px_rgba(168,85,247,0.6)]
    transition-all duration-300
    hover:shadow-[0_0_40px_rgba(168,85,247,0.8)]
    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black
    border border-transparent hover:border-white/50
  "
>
  <span className="flex items-center gap-3">
    Browse Playlists

    {/* Arrow circle on the right */}
    <span
      className="
        w-8 h-8 flex items-center justify-center
        rounded-full bg-white text-purple-700
        transition-transform duration-300 group-hover:translate-x-1
      "
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </span>
  </span>
</Link>



          <Link
            to="/videos"
            className="
              group inline-flex items-center justify-center
              px-8 py-4 sm:px-10 sm:py-5
              rounded-full
              font-semibold text-lg sm:text-xl
              text-white
              bg-transparent
              border border-white/30
              shadow-[0_0_20px_rgba(139,92,246,0.3)]
              transition-all duration-300
              hover:bg-white/10 hover:border-white/50
              hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black
            "
          >
            <span className="flex items-center gap-3">
              Watch Videos
              <span
                className="
                  w-8 h-8 flex items-center justify-center
                  rounded-full bg-white text-indigo-700
                  transition-transform duration-300 group-hover:translate-x-1
                "
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}