import { TipWidget } from './components/TipWidget';
import { Sidebar } from './components/Sidebar';
import { NetworkStatus } from './components/NetworkStatus';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[10%] left-[10%] w-[300px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] lg:h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute bottom-[5%] right-[5%] w-[400px] sm:w-[600px] lg:w-[700px] h-[400px] sm:h-[600px] lg:h-[700px] bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)] rounded-full pointer-events-none" />

      {/* Main Grid Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_280px] gap-8 lg:gap-12 items-start mt-8 sm:mt-12 lg:mt-0">
        
        {/* Left Column: Sidebar (Hidden on small, visible on lg) */}
        <div className="hidden lg:block w-full">
          <Sidebar />
        </div>

        {/* Center Column: Header + Tip Widget */}
        <div className="flex flex-col items-center w-full">
          <div className="text-center mb-8 sm:mb-10 w-full px-2 sm:px-0">
            <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] lg:text-[clamp(3rem,5vw,5rem)] font-extrabold text-white leading-[1.1] mb-4 tracking-tight">
              Micro-Tipping<br className="hidden sm:block" />
              <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-transparent bg-clip-text sm:ml-3 lg:ml-0">
                with Arc.
              </span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-[480px] mx-auto">
              A live tipping experience powered by Arc Network. Sub-second finality and gasless interactions for your community.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <TipWidget />
          </div>
        </div>

        {/* Right Column: Network Status (Hidden on small, visible on lg) */}
        <div className="hidden lg:block w-full">
          <NetworkStatus />
        </div>
      </div>
    </div>
  );
}

export default App;
