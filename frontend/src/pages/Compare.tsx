import React,{useRef, useEffect, useState} from "react";
import "./../styles/Compare.css"
import Chatbot from "../components/Chatbot";
export default function Compare(){

    const videoRef = useRef(null);
    const photoRef = useRef(null);

    const [hasPhoto, setHasPhoto] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const getVideo =()=>{
        navigator.mediaDevices.getUserMedia({video: {width:1920, height:1080}})
        .then(stream=>{
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error(err);
        })
    }

    const takePhoto =()=>{
        const width = 414;
        const height = width/(16/9);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);
    }

    const closePhoto= () =>{
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');

        ctx.clearRect(0, 0, photo.width, photo.height);

        setHasPhoto(false);
    }

    useEffect(()=>{
        getVideo();
    }, [videoRef])

    return(
        <div className="compare">
            <div className={'camera '+(hasPhoto? 'hasPhoto': '')}>
                <video className="camVideo" ref={videoRef}></video>
                <button className="comparePagebutton" onClick={takePhoto}>COMPARE!</button>
            </div>
            <div className={'result '+ (hasPhoto? 'hasPhoto' : '')}>
                <canvas className="photoCanvas" ref={photoRef}></canvas>
                <button className="comparePagebutton" onClick={closePhoto}>CLOSE!</button>
            </div>
            <div className="chatbot-section">
                <button className="chatbot-button" onClick={() => setIsChatbotOpen(true)}>Assistant</button>
                <div className={`chatbot-container ${isChatbotOpen ? 'open' : ''}`}>
                    <Chatbot/>
                    <button className="chatbot-close-button" onClick={() => setIsChatbotOpen(false)}>Close</button>
                </div>
            </div>
        </div>
    );
}