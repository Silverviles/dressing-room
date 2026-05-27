// @ts-nocheck
import * as React from "react";
import { useEffect, useRef } from "react";
import { Button, CardFooter } from "@material-tailwind/react";
import { PoseService } from "../services/pose/poseLandmarker";

const PoseDetection = ({ image }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const poseServiceRef = useRef<PoseService | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Buffer to store previous key points for smoothing
  const leftShoulderBuffer = useRef<[number, number][]>([]);
  const rightShoulderBuffer = useRef<[number, number][]>([]);
  const smoothingFrames = 5;

  useEffect(() => {
    let isMounted = true;
    const tshirtImg = new Image();
    tshirtImg.src = image;

    const smoothKeypoints = (
      buffer: [number, number][],
      point: [number, number]
    ): [number, number] => {
      buffer.push(point);
      if (buffer.length > smoothingFrames) {
        buffer.shift();
      }
      const avgX = buffer.reduce((sum, [x]) => sum + x, 0) / buffer.length;
      const avgY = buffer.reduce((sum, [, y]) => sum + y, 0) / buffer.length;
      return [avgX, avgY];
    };

    const drawTShirt = (
      leftShoulder: [number, number],
      rightShoulder: [number, number],
      containerWidth: number,
      containerHeight: number
    ): void => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shoulderX1 = leftShoulder[0] * containerWidth;
      const shoulderY1 = leftShoulder[1] * containerHeight;
      const shoulderX2 = rightShoulder[0] * containerWidth;
      const shoulderY2 = rightShoulder[1] * containerHeight;

      const shoulderWidth = Math.abs(shoulderX2 - shoulderX1);
      const centerX = (shoulderX1 + shoulderX2) / 2;
      const neckY = Math.min(shoulderY1, shoulderY2) + 0.23 * shoulderWidth;

      const shirtAspectRatio = tshirtImg.width / tshirtImg.height;
      const shirtWidth = shoulderWidth * 1.8;
      const shirtHeight = shirtWidth / shirtAspectRatio;

      const topLeftX = centerX - shirtWidth / 2;
      const topLeftY = neckY - shirtHeight / 3;

      if (
        topLeftY >= 0 &&
        topLeftY + shirtHeight <= containerHeight &&
        topLeftX >= 0 &&
        topLeftX + shirtWidth <= containerWidth
      ) {
        ctx.drawImage(tshirtImg, topLeftX, topLeftY, shirtWidth, shirtHeight);
      }
    };

    const startTracking = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        if (!videoRef.current || !canvasRef.current) return;
        videoRef.current.srcObject = stream;

        await new Promise<void>((resolve) => {
          if (!videoRef.current) return resolve();
          videoRef.current.onloadedmetadata = () => resolve();
        });

        const service = new PoseService();
        await service.init();
        poseServiceRef.current = service;

        if (!isMounted) return;
        ctxRef.current = canvasRef.current.getContext("2d");

        const loop = () => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = ctxRef.current;
          const container = containerRef.current;
          const poseService = poseServiceRef.current;
          if (!video || !canvas || !ctx || !container || !poseService) return;

          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          canvas.width = containerWidth;
          canvas.height = containerHeight;

          const { leftShoulder, rightShoulder } = poseService.estimate(video);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (leftShoulder && rightShoulder) {
            const smoothedLeftShoulder = smoothKeypoints(
              leftShoulderBuffer.current,
              leftShoulder
            );
            const smoothedRightShoulder = smoothKeypoints(
              rightShoulderBuffer.current,
              rightShoulder
            );

            drawTShirt(
              smoothedLeftShoulder,
              smoothedRightShoulder,
              containerWidth,
              containerHeight
            );
          }

          animationRef.current = requestAnimationFrame(loop);
        };

        loop();
      } catch (error) {
        console.error("Failed to initialize pose tracking", error);
      }
    };

    tshirtImg.onload = startTracking;

    return () => {
      isMounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      poseServiceRef.current?.close();
      leftShoulderBuffer.current = [];
      rightShoulderBuffer.current = [];
    };
  }, [image]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    // Create a new canvas to merge video and existing canvas
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;

    const mergedCtx = mergedCanvas.getContext("2d");

    // Draw video frame onto merged canvas
    mergedCtx?.drawImage(video, 0, 0, mergedCanvas.width, mergedCanvas.height);

    // Draw the canvas contents (T-shirt image) on top of the video frame
    mergedCtx?.drawImage(canvas, 0, 0, mergedCanvas.width, mergedCanvas.height);

    mergedCanvas.style.marginBottom = '10px';

    document.getElementById("scnShotDiv")!.appendChild(mergedCanvas);
  };

  const clearPhotos = () => {
    const screenshotDiv = document.getElementById("scnShotDiv");
    if (screenshotDiv) {
      while (screenshotDiv.firstChild) {
        screenshotDiv.removeChild(screenshotDiv.firstChild); // Remove all children (canvas elements)
      }
    }
  };

  return (
    <>
      <div ref={containerRef} style={containerStyles}>
        <video ref={videoRef} autoPlay playsInline style={videoStyles}/>
        <canvas ref={canvasRef} style={canvasStyles}/>
      </div>
      <CardFooter className="p-0 pb-2 flex items-center gap-2 justify-between w-full" style={{ marginTop: '20px' }}>
        <Button
            onClick={() => takePhoto()}
            fullWidth

        >
          Take Image
        </Button>
        <Button
          onClick={clearPhotos}
          fullWidth
        >
         Clear Images
        </Button>
      </CardFooter>
    </>
);
};

const containerStyles: React.CSSProperties = {
  position: "relative",
  width: "640px", // Adjust as needed
  height: "480px", // Adjust as needed
  overflow: "hidden",
  border: "2px solid black",
};

const videoStyles: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const canvasStyles: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

export default PoseDetection;
