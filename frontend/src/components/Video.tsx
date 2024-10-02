import * as React from "react";
import {useEffect, useRef} from "react";
import * as poseNet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import tshirt from "../images/orange.png"

const PoseDetection = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const tshirtImg = new Image();
        tshirtImg.src = tshirt;

        const setupCamera = async (): Promise<void> => {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                return new Promise((resolve) => {
                    videoRef.current!.onloadedmetadata = () => {
                        resolve();
                    };
                });
            }
        }


        const setupPoseNet = async (): Promise<poseNet.PoseNet> => {
            return await poseNet.load();
        }

        const drawTShirt = (leftShoulder: [number, number], rightShoulder: [number, number]): void => {
            const ctx = ctxRef.current;
            const canvas = canvasRef.current;
            if (!ctx || !canvas) return;

            const shoulderX1 = leftShoulder[0];
            const shoulderY1 = leftShoulder[1];
            const shoulderX2 = rightShoulder[0];
            const shoulderY2 = rightShoulder[1];

            const shoulderWidth = Math.abs(shoulderX2 - shoulderX1);
            const centerX = (shoulderX1 + shoulderX2) / 2;
            const neckY = Math.min(shoulderY1, shoulderY2) + 0.23 * shoulderWidth;

            const shirtAspectRatio = tshirtImg.width / tshirtImg.height;
            const shirtWidth = shoulderWidth * 2.6;
            const shirtHeight = shirtWidth / shirtAspectRatio;

            const topLeftX = centerX - shirtWidth / 2;
            const topLeftY = neckY - shirtHeight / 3;

            if (
                topLeftY >= 0 &&
                topLeftY + shirtHeight <= canvas.height &&
                topLeftX >= 0 &&
                topLeftX + shirtWidth <= canvas.width
            ) {
                ctx.drawImage(tshirtImg, topLeftX, topLeftY, shirtWidth, shirtHeight);
            }
        }

        const detectPose = (net: poseNet.PoseNet): void => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            if (!video || !canvas || !ctx) return;

            video.width = video.videoWidth;
            video.height = video.videoHeight;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const detect = async () => {
                const pose = await net.estimateSinglePose(video, {
                    flipHorizontal: false
                });

                ctx.clearRect(0, 0, video.width, video.height);

                if (pose.keypoints) {
                    const leftShoulder = pose.keypoints.find(
                        (point) => point.part === 'leftShoulder'
                    )?.position;
                    const rightShoulder = pose.keypoints.find(
                        (point) => point.part === 'rightShoulder'
                    )?.position;

                    if (leftShoulder && rightShoulder) {
                        drawTShirt([leftShoulder.x, leftShoulder.y], [rightShoulder.x, rightShoulder.y]);
                    }
                }

                requestAnimationFrame(detect);
            }
            detect();
        }


        const init = async () => {
            await setupCamera();
            const net = await setupPoseNet();

            if (canvasRef.current) {
                ctxRef.current = canvasRef.current.getContext('2d');
            }
            detectPose(net);
        }

        init();
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline style={videoStyles}/>
            <canvas ref={canvasRef} style={canvasStyles}/>
        </div>
    );
}

const videoStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover'
}

const canvasStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none'
}

export default PoseDetection;