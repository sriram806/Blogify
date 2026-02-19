import Navbar from "@/Components/Navbar";
import GradientText from "@/Components/GradientText";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen gap-6 px-6 text-center">

        <h1 className="text-5xl md:text-6xl font-extrabold">
          <GradientText
            colors={["#FF9933", "#E91E63", "#D4AF37"]}
            animationSpeed={5}
            showBorder={false}
            className="custom-class"
          >
            Welcome to Blogify
          </GradientText>
        </h1>


        <p className="max-w-xl text-lg text-white/70">
          A modern platform to write, share, and explore ideas.
          Experience blogging with a clean design and powerful tools.
        </p>

        <button className="mt-4 px-8 py-3 rounded-full 
          bg-white/10 backdrop-blur-md border border-white/20 
          hover:bg-white/20 transition-all duration-300">
          Get Started
        </button>

      </div>
    </div>
  );
}
