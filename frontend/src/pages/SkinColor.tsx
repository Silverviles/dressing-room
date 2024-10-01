import React, { useState, useEffect, useRef } from 'react';

// Helper function to determine if the pixel is likely to be a skin tone based on RGB values
const isSkinPixel = (r: number, g: number, b: number) => {
  const r_g_ratio = r / g;
  const r_b_ratio = r / b;
  const g_b_ratio = g / b;

  // General range for skin tone detection in RGB
  return (
    r > 50 && g > 40 && b > 20 &&
    r_g_ratio > 1.2 && r_b_ratio > 1.3 && g_b_ratio > 0.9 &&
    r < 255 && g < 200 && b < 200
  );
};

const SkinColorDetectionApp: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [skinColor, setSkinColor] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Get user media stream
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

  // Process video stream and detect skin color
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
    const sampleRadius = Math.floor(Math.min(centerX, centerY) / 4); // Sample a smaller central area

    // Sample a small area in the center of the frame
    for (let y = centerY - sampleRadius; y < centerY + sampleRadius; y++) {
      for (let x = centerX - sampleRadius; x < centerX + sampleRadius; x++) {
        const index = (y * canvas.width + x) * 4;
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];

        if (alpha > 0 && isSkinPixel(red, green, blue)) { // Only consider skin-tone pixels
          r += red;
          g += green;
          b += blue;
          count++;
        }
      }
    }

    // Calculate the average skin color
    if (count > 0) {
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const detectedSkinColor = `rgb(${r}, ${g}, ${b})`;
      setSkinColor(detectedSkinColor);
    }
  };

  // Detect skin color every second
  useEffect(() => {
    if (isCameraActive) {
      const intervalId = setInterval(handleVideoStream, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isCameraActive, stream]);

  // Stop camera function
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Stop camera button click
  const handleStopCamera = () => {
    stopCamera();
    setIsCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden p-6 w-full max-w-2xl">
        {isCameraActive && stream && (
          <>
            <div className="relative w-full mb-4"> 
              <video
                autoPlay
                playsInline
                ref={videoRef}
                className="w-full h-auto object-cover border-4 border-indigo-300 rounded-lg shadow-lg"
              />
            </div>
            <button
              onClick={handleStopCamera}
              className="mt-4 w-full py-3 bg-red-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
            >
              Stop Camera
            </button>
          </>
        )}
        {skinColor && (
          <div
            className="mt-6 p-6 bg-indigo-100 border-l-4 border-indigo-500 rounded-lg shadow-lg text-center"
            style={{ backgroundColor: skinColor }}
          >
           <p className="text-lg font-bold text-white">Detected Skin Color:</p>
            <p className="text-lg text-white">{skinColor}</p>

          </div>
        )}
      </div>
    </div>
  );
};

export default SkinColorDetectionApp;
