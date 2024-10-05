import * as React from "react";
import { useEffect, useRef } from "react";
import * as poseNet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
// import tshirt from "../images/orange.png";

const PoseDetection = ({ image }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Buffer to store previous key points for smoothing
  const leftShoulderBuffer = useRef<[number, number][]>([]);
  const rightShoulderBuffer = useRef<[number, number][]>([]);
  const smoothingFrames = 5; // Number of frames for smoothing

  useEffect(() => {
    const tshirtImg = new Image();
    tshirtImg.src = image;

    tshirtImg.onload = () => {
      const setupCamera = async (): Promise<void> => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          return new Promise((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
              resolve();
            };
          });
        }
      };

      const setupPoseNet = async (): Promise<poseNet.PoseNet> => {
        return await poseNet.load();
      };

      const smoothKeypoints = (
        buffer: [number, number][],
        point: [number, number]
      ): [number, number] => {
        buffer.push(point);
        if (buffer.length > smoothingFrames) {
          buffer.shift(); // Remove oldest point if buffer exceeds size
        }
        const avgX = buffer.reduce((sum, [x]) => sum + x, 0) / buffer.length;
        const avgY = buffer.reduce((sum, [, y]) => sum + y, 0) / buffer.length;
        return [avgX, avgY];
      };

      const drawTShirt = (
        leftShoulder: [number, number],
        rightShoulder: [number, number],
        videoWidth: number,
        videoHeight: number,
        containerWidth: number,
        containerHeight: number
      ): void => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame

        const scaleX = containerWidth / videoWidth;
        const scaleY = containerHeight / videoHeight;

        const shoulderX1 = leftShoulder[0] * scaleX;
        const shoulderY1 = leftShoulder[1] * scaleY;
        const shoulderX2 = rightShoulder[0] * scaleX;
        const shoulderY2 = rightShoulder[1] * scaleY;

        const shoulderWidth = Math.abs(shoulderX2 - shoulderX1);
        const centerX = (shoulderX1 + shoulderX2) / 2;
        const neckY = Math.min(shoulderY1, shoulderY2) + 0.23 * shoulderWidth;

        const shirtAspectRatio = tshirtImg.width / tshirtImg.height;
        const shirtWidth = shoulderWidth * 1.8; // Adjust scaling as needed
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

      const detectPose = (net: poseNet.PoseNet): void => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const container = containerRef.current;
        if (!video || !canvas || !ctx || !container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        video.width = video.videoWidth;
        video.height = video.videoHeight;
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        const detect = async () => {
          const pose = await net.estimateSinglePose(video, {
            flipHorizontal: false,
          });

          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before every draw

          if (pose.keypoints) {
            const leftShoulder = pose.keypoints.find(
              (point) => point.part === "leftShoulder"
            )?.position;
            const rightShoulder = pose.keypoints.find(
              (point) => point.part === "rightShoulder"
            )?.position;

            if (leftShoulder && rightShoulder) {
              // Smooth shoulder keypoints over time
              const smoothedLeftShoulder = smoothKeypoints(
                leftShoulderBuffer.current,
                [leftShoulder.x, leftShoulder.y]
              );
              const smoothedRightShoulder = smoothKeypoints(
                rightShoulderBuffer.current,
                [rightShoulder.x, rightShoulder.y]
              );

              drawTShirt(
                smoothedLeftShoulder,
                smoothedRightShoulder,
                video.videoWidth,
                video.videoHeight,
                containerWidth,
                containerHeight
              );
            }
          }

          requestAnimationFrame(detect);
        };
        detect();
      };

      const init = async () => {
        await setupCamera();
        const net = await setupPoseNet();

        if (canvasRef.current) {
          ctxRef.current = canvasRef.current.getContext("2d");
        }
        detectPose(net);
      };

      init();
    };
  }, [image]); // Re-run only when the image prop changes

  return (
    <div ref={containerRef} style={containerStyles}>
      <video ref={videoRef} autoPlay playsInline style={videoStyles} />
      <canvas ref={canvasRef} style={canvasStyles} />
    </div>
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
