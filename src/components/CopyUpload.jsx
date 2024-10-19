import React, { useState, useRef } from 'react';
import fs from "fs/promises";

export default function CopyUpload() {
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [ingredients, setIngredients] = useState(" ERROR");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && allowedFileTypes.includes(file.type)) {
      readAndSetImage(file);
    } else {
      alert('Invalid file type. Please select a .jpeg, .jpg, or .png file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && allowedFileTypes.includes(file.type)) {
      readAndSetImage(file);
    } else {
      alert('Invalid file type. Please drop a .jpeg, .jpg, or .png file.');
    }
  };

  const readAndSetImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCaptureClick = async () => {
    try {
       setIsCapturing(true);
       let constraints = { video: true };
   
       // Check if there are multiple video input devices
       const devices = await navigator.mediaDevices.enumerateDevices();
       const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
   
       if (videoInputDevices.length > 1) {
         // If there are multiple video input devices, prefer the rear camera
         constraints.video = { facingMode: 'environment' };
       } else {
         // If there's only one video input device, assume it's a laptop and use the front camera
         constraints.video = { facingMode: 'user' };
       }
   
       const stream = await navigator.mediaDevices.getUserMedia(constraints);
       if (videoRef.current) {
         videoRef.current.srcObject = stream;
       }
    } catch (error) {
       console.error('Error accessing camera:', error);
    }
   };

  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataURL = canvasRef.current.toDataURL('image/png');
      setImage(imageDataURL);
      setIsCapturing(false);
    }
  };

  const handleStopCapture = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setIsCapturing(false);
      }
    }
  };

  const handleUploadClick = async () => {
    console.log("HI1")
    if (!image) {
       alert('Please select an image first.');
       props.setOpen(false);
       return;
    }
    
    const base64Image = image.toString("base64");
    //console.log(base64Image)
    try {
       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}generate-ingredients`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ b64: base64Image }),
       });
   
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
   
       const ings = await response.text();
       console.log(ings)
       if(ings == " ERROR")
       {
        alert('Failed to generate ingredients. Please upload another image.');
       }
       else
       {
        setIngredients(ings)
       }
       // Move to next screen bro
       alert(`Ingredients: ${ings}`);
    } catch (error) {
       console.error('Error:', error);
       alert('Failed to generate ingredients. Please upload another image.');
    }
   };

  return (
    <div>
    <div
      className={`text-center mt-8 border-4 border-blue-500 rounded p-8 bg-cover bg-center relative h-screen w-screen ${
        image ? 'lg:flex-row' : 'lg:flex-col'
      }`}
      style={{ backgroundImage: "url('client/src/assets/backgorund.jpeg')" }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2 className="text-2xl font-bold mb-4">Image Uploader</h2>
      <label
        htmlFor="imageInput"
        className="cursor-pointer inline-block px-4 py-2 border-2 border-blue-500 rounded"
      >
        Select Image
      </label>
      <input
        type="file"
        id="imageInput"
        accept=".jpeg, .jpg, .png"
        onChange={handleImageChange}
        className="hidden"
      />
      <br />
      <button
        onClick={handleCaptureClick}
        disabled={isCapturing}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Capture Image from Camera
      </button>
      <br />
      {isCapturing && (
        <>
          <video ref={videoRef} autoPlay playsInline className="mt-4 max-w-full max-h-48 rounded shadow-md" />
          <br />
          <button
            onClick={handleCaptureImage}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Capture Image
          </button>
          <button
            onClick={handleStopCapture}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2"
          >
            Stop Capture
          </button>
        </>
      )}
      <br />
      {image && (
        <div className="lg:flex lg:justify-between">
          <div className="lg:w-1/2">
            <img
              src={image}
              alt="Uploaded"
              className="mt-4 max-w-full max-h-48 rounded shadow-md"
            />
          </div>
          <div className="lg:w-1/2">
            <p className="mt-4">or</p>
            <p>Drag and drop your image here</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => {handleUploadClick()}}
            >
              Upload
            </button>
          </div>
        </div>
      )}
      {isCapturing && (
        <canvas ref={canvasRef} className="hidden"></canvas>
      )}
    </div>
    </div>
  );
}
