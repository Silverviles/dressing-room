import React, { useRef, useState } from "react";
import PoseDetection from "../components/Video.tsx"; // Using your PoseDetection component
import "./../styles/Compare.css";

export default function DressRoomtemp() {
  const photoRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  // Function to take a photo from the video feed
  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    if (!video || !photo) return;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      setHasPhoto(true);
    }
  };

  // Function to close and clear the photo
  const closePhoto = () => {
    let photo = photoRef.current;
    if (!photo) return;

    let ctx = photo.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, photo.width, photo.height);
      setHasPhoto(false);
    }
  };

  return (
    <div className="compare">
      <div className={"camera " + (hasPhoto ? "hasPhoto" : "")}>
        {/* Use PoseDetection and reference video for taking photo */}
        <PoseDetection />
        <button className="comparePagebutton" onClick={takePhoto}>
          COMPARE!
        </button>
      </div>
      <div className={"result " + (hasPhoto ? "hasPhoto" : "")}>
        <canvas className="photoCanvas" ref={photoRef}></canvas>
        <button className="comparePagebutton" onClick={closePhoto}>
          CLOSE!
        </button>
      </div>
    </div>
  );
}
