import * as React from "react";
import { useEffect, useRef, useState } from "react";
import * as poseNet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import { Button, CardFooter } from "@material-tailwind/react";
import jsPDF from "jspdf";
// import tshirt from "../images/orange.png";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const PoseDetection = ({ image }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // New states for countdown
  const [countdown, setCountdown] = useState<number>(0);
  const [isTakingImage, setIsTakingImage] = useState<boolean>(false);

  // Buffer to store previous key points for smoothing
  const leftShoulderBuffer = useRef<[number, number][]>([]);
  const rightShoulderBuffer = useRef<[number, number][]>([]);
  const smoothingFrames = 5; // Number of frames for smoothing

  useEffect(() => {
    const tshirtImg = new Image();
    tshirtImg.src = image;
    // tshirtImg.crossOrigin = "Anonymous";

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

  // useEffect(() => {
  //   // Load T-shirt image using fetch
  //   const fetchTshirtImage = async (imageUrl: string) => {
  //     try {
  //       const response = await fetch(imageUrl);
  //       if (!response.ok) throw new Error("Network response was not ok");
  //       const blob = await response.blob();
  //       const tshirtImg = new Image();
  //       tshirtImg.src = URL.createObjectURL(blob);
  //       tshirtImg.crossOrigin = "Anonymous"; // Needed for CORS

  //       tshirtImg.onload = () => {
  //         setupCameraAndPoseNet(tshirtImg); // Start camera and pose detection after the image loads
  //       };
  //     } catch (error) {
  //       console.error("Error fetching T-shirt image:", error);
  //     }
  //   };

  //   // Use the proxy URL for image fetching
  //   const imageUrl = `/api/v0/b/dressing-room-5351a.appspot.com/o/${image}?alt=media&token=3f096bae-db24-4fc1-b535-b0fb44d9fff1`;
  //   fetchTshirtImage(imageUrl);
  // }, [image]); // Re-run only when the image prop changes

  // const setupCameraAndPoseNet = async (tshirtImg: HTMLImageElement) => {
  //   const setupCamera = async (): Promise<void> => {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //       return new Promise((resolve) => {
  //         videoRef.current.onloadedmetadata = () => {
  //           resolve();
  //         };
  //       });
  //     }
  //   };

  //   const setupPoseNet = async (): Promise<poseNet.PoseNet> => {
  //     return await poseNet.load();
  //   };

  //   const smoothKeypoints = (
  //     buffer: [number, number][],
  //     point: [number, number]
  //   ): [number, number] => {
  //     buffer.push(point);
  //     if (buffer.length > smoothingFrames) {
  //       buffer.shift(); // Remove oldest point if buffer exceeds size
  //     }
  //     const avgX = buffer.reduce((sum, [x]) => sum + x, 0) / buffer.length;
  //     const avgY = buffer.reduce((sum, [, y]) => sum + y, 0) / buffer.length;
  //     return [avgX, avgY];
  //   };

  //   const drawTShirt = (
  //     leftShoulder: [number, number],
  //     rightShoulder: [number, number],
  //     videoWidth: number,
  //     videoHeight: number,
  //     containerWidth: number,
  //     containerHeight: number
  //   ): void => {
  //     const ctx = ctxRef.current;
  //     const canvas = canvasRef.current;
  //     if (!ctx || !canvas) return;

  //     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame

  //     const scaleX = containerWidth / videoWidth;
  //     const scaleY = containerHeight / videoHeight;

  //     const shoulderX1 = leftShoulder[0] * scaleX;
  //     const shoulderY1 = leftShoulder[1] * scaleY;
  //     const shoulderX2 = rightShoulder[0] * scaleX;
  //     const shoulderY2 = rightShoulder[1] * scaleY;

  //     const shoulderWidth = Math.abs(shoulderX2 - shoulderX1);
  //     const centerX = (shoulderX1 + shoulderX2) / 2;
  //     const neckY = Math.min(shoulderY1, shoulderY2) + 0.23 * shoulderWidth;

  //     const shirtAspectRatio = tshirtImg.width / tshirtImg.height;
  //     const shirtWidth = shoulderWidth * 1.8; // Adjust scaling as needed
  //     const shirtHeight = shirtWidth / shirtAspectRatio;

  //     const topLeftX = centerX - shirtWidth / 2;
  //     const topLeftY = neckY - shirtHeight / 3;

  //     if (
  //       topLeftY >= 0 &&
  //       topLeftY + shirtHeight <= containerHeight &&
  //       topLeftX >= 0 &&
  //       topLeftX + shirtWidth <= containerWidth
  //     ) {
  //       ctx.drawImage(tshirtImg, topLeftX, topLeftY, shirtWidth, shirtHeight);
  //     }
  //   };

  //   const detectPose = (net: poseNet.PoseNet): void => {
  //     const video = videoRef.current;
  //     const canvas = canvasRef.current;
  //     const ctx = ctxRef.current;
  //     const container = containerRef.current;
  //     if (!video || !canvas || !ctx || !container) return;

  //     const containerWidth = container.clientWidth;
  //     const containerHeight = container.clientHeight;

  //     video.width = video.videoWidth;
  //     video.height = video.videoHeight;
  //     canvas.width = containerWidth;
  //     canvas.height = containerHeight;

  //     const detect = async () => {
  //       const pose = await net.estimateSinglePose(video, {
  //         flipHorizontal: false,
  //       });

  //       ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before every draw

  //       if (pose.keypoints) {
  //         const leftShoulder = pose.keypoints.find(
  //           (point) => point.part === "leftShoulder"
  //         )?.position;
  //         const rightShoulder = pose.keypoints.find(
  //           (point) => point.part === "rightShoulder"
  //         )?.position;

  //         if (leftShoulder && rightShoulder) {
  //           // Smooth shoulder keypoints over time
  //           const smoothedLeftShoulder = smoothKeypoints(
  //             leftShoulderBuffer.current,
  //             [leftShoulder.x, leftShoulder.y]
  //           );
  //           const smoothedRightShoulder = smoothKeypoints(
  //             rightShoulderBuffer.current,
  //             [rightShoulder.x, rightShoulder.y]
  //           );

  //           drawTShirt(
  //             smoothedLeftShoulder,
  //             smoothedRightShoulder,
  //             video.videoWidth,
  //             video.videoHeight,
  //             containerWidth,
  //             containerHeight
  //           );
  //         }
  //       }

  //       requestAnimationFrame(detect);
  //     };
  //     detect();
  //   };

  //   const init = async () => {
  //     await setupCamera();
  //     const net = await setupPoseNet();

  //     if (canvasRef.current) {
  //       ctxRef.current = canvasRef.current.getContext("2d");
  //     }
  //     detectPose(net);
  //   };

  //   init();
  // };
  
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


    // //Now mergedCanvas contains both video frame and T-shirt
    // const screenshotDataURL = mergedCanvas.toDataURL("image/png");
    
    // //Create an image element or append it to the desired container
    // const img = document.createElement("img");
    // img.src = screenshotDataURL;
    // document.getElementById("scnShotDiv")!.appendChild(img);

    document.getElementById("scnShotDiv")!.appendChild(mergedCanvas);
  }

  // const takePhoto = () => {
  //   if (isTakingImage) return; // Prevent taking photo if already in countdown

  //   setIsTakingImage(true);
  //   setCountdown(3); // Set countdown duration (in seconds)

  //   const countdownInterval = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev === 1) {
  //         clearInterval(countdownInterval);
  //         captureImage(); // Capture image once countdown ends
  //         setIsTakingImage(false);
  //         return 0; // Reset countdown
  //       }
  //       return prev - 1; // Decrease countdown
  //     });
  //   }, 1000); // Update countdown every second
  // };

  // const captureImage = () => {
  //   const video = videoRef.current;
  //   const canvas = canvasRef.current;

  //   if (!video || !canvas) return;

  //   // Create a new canvas to merge video and existing canvas
  //   const mergedCanvas = document.createElement("canvas");
  //   mergedCanvas.width = canvas.width;
  //   mergedCanvas.height = canvas.height;

  //   const mergedCtx = mergedCanvas.getContext("2d");

  //   // Draw video frame onto merged canvas
  //   mergedCtx?.drawImage(video, 0, 0, mergedCanvas.width, mergedCanvas.height);

  //   // Draw the canvas contents (T-shirt image) on top of the video frame
  //   mergedCtx?.drawImage(canvas, 0, 0, mergedCanvas.width, mergedCanvas.height);

  //   document.getElementById("scnShotDiv")!.appendChild(mergedCanvas);
  // };


  const clearPhotos = () => {
    const screenshotDiv = document.getElementById("scnShotDiv");
    if (screenshotDiv) {
      while (screenshotDiv.firstChild) {
        screenshotDiv.removeChild(screenshotDiv.firstChild); // Remove all children (canvas elements)
      }
    }
  };

  const downloadPhotosAsPDF = () => {
    const screenshotDiv = document.getElementById("scnShotDiv");
    if (!screenshotDiv) return;

    const doc = new jsPDF();

    // Get all the child images from the div
    const images = Array.from(screenshotDiv.children);

    images.forEach((img, index) => {
      if (img instanceof HTMLCanvasElement) {
        const imgData = img.toDataURL("image/png");

        // Add image to PDF
        if (index > 0) {
          doc.addPage(); // Add a new page for each image after the first
        }
        doc.addImage(imgData, 'PNG', 10, 10, 190, 0); // x, y, width, height (auto height)
      }
    });

    // Save the PDF
    doc.save("photos.pdf");
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
        {/* <Button
          onClick={downloadPhotosAsPDF} // New download button
          fullWidth

        >
          Download PDF
        </Button> */}
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
