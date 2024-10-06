import React, { useState, useEffect, useRef } from 'react';

// Helper function to determine if the pixel is likely to be a skin tone based on RGB values
const isSkinPixel = (r: number, g: number, b: number) => {
  const r_g_ratio = r / g;
  const r_b_ratio = r / b;
  const g_b_ratio = g / b;

  return (
    r > 50 && g > 40 && b > 20 &&
    r_g_ratio > 1.2 && r_b_ratio > 1.3 && g_b_ratio > 0.9 &&
    r < 255 && g < 200 && b < 200
  );
};

// Helper function to suggest dress colors based on skin tone
const getDressColorsForSkinTone = (r: number, g: number, b: number): string[] => {
  if (r > 200 && g > 180 && b > 170) {
    return ['#000080', '#FFB6C1', '#E6E6FA']; // Navy Blue, Light Pink, Lavender (Light skin tone)
  } else if (r > 150 && g > 100 && b > 80) {
    return ['#8B0000', '#808000', '#A52A2A']; // Dark Red, Olive Green, Brown (Medium skin tone)
  } else if (r > 100 && g > 70 && b > 50) {
    return ['#228B22', '#800000', '#F0E68C']; // Forest Green, Maroon, Khaki (Olive skin tone)
  } else {
    return ['#FFFF00', '#800080', '#FFA500']; // Bright Yellow, Purple, Orange (Dark skin tone)
  }
};

const SkinColorDetectionApp: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [skinColor, setSkinColor] = useState<string | null>(null);
  const [dressColors, setDressColors] = useState<string[] | null>(null); // New state for dress colors
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Error accessing camera:", error));
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive]);

  const handleVideoStream = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const pixels = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;

    if (!pixels) return;

    let r = 0, g = 0, b = 0;
    let count = 0;

    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const sampleRadius = Math.floor(Math.min(centerX, centerY) / 4);

    for (let y = centerY - sampleRadius; y < centerY + sampleRadius; y++) {
      for (let x = centerX - sampleRadius; x < centerX + sampleRadius; x++) {
        const index = (y * canvas.width + x) * 4;
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];

        if (alpha > 0 && isSkinPixel(red, green, blue)) {
          r += red;
          g += green;
          b += blue;
          count++;
        }
      }
    }

    if (count > 0) {
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const detectedSkinColor = `rgb(${r}, ${g}, ${b})`;
      setSkinColor(detectedSkinColor);

      // Set dress colors based on the detected skin tone
      const suggestedDressColors = getDressColorsForSkinTone(r, g, b);
      setDressColors(suggestedDressColors);
    }
  };

  useEffect(() => {
    if (isCameraActive) {
      const intervalId = setInterval(handleVideoStream, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isCameraActive, stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleStopCamera = () => {
    stopCamera();
    setIsCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden p-6 w-full" style={{ maxWidth: '800px' }}> {/* Full width container */}
        {isCameraActive && stream ? (
          <div className="relative w-full lg:w-full mb-4 lg:mb-0">
            <video
              autoPlay
              playsInline
              ref={videoRef}
              className="w-full h-auto object-cover border-4 border-indigo-300 rounded-lg shadow-lg"
            />
            {skinColor && (
              <div 
                className="mt-4 p-4 rounded-lg shadow-lg text-center"
                style={{ backgroundColor: skinColor }}  // Set the background color to detected skin color
              >
                <p className="text-lg font-semibold text-white">Detected Skin Color:</p>
                <p className="text-md font-mono text-white bg-gray-800 p-2 rounded-md">{skinColor}</p> {/* Text label for RGB */}
              </div>
            )}
            <button
              onClick={handleStopCamera}
              className="mt-4 w-full py-3 bg-red-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
            >
              Stop Camera & See results
            </button>
          </div>
        ) : (
          skinColor && dressColors && (
            <div
              className="w-full flex flex-col justify-center items-center lg:p-6 bg-indigo-100 p-6 rounded-lg shadow-lg"
              style={{ backgroundColor: skinColor, height: '500px' }}
            >
              <p className="text-2xl font-semibold text-white mb-2 tracking-wide uppercase">Detected Skin Color:</p>
              <p className="text-lg text-white mb-4 font-mono bg-gray-800 p-2 rounded-md shadow-inner">{skinColor}</p>
  
              <h2 className="text-3xl font-bold text-blue-400 mb-8 tracking-wider">Suggested Dress Colors</h2>
  
              <div className="grid grid-cols-3 gap-4">
                {dressColors.map((color, index) => (
                  <div
                    key={index}
                    className="p-12 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    style={{ backgroundColor: color }}
                  >
                  
                  </div> 
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SkinColorDetectionApp;
