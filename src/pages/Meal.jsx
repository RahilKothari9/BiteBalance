import { useRef, useState } from "react";

import Upload from '../components/Upload';

export default function Meal() {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [files, setFiles] = useState([]);
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const [isCapturing, setIsCapturing] = useState(false);
  const [image, setImage] = useState(null);

  function handleChange(e) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      for (let i = 0; i < e.target.files.length; i++) {
        setFiles((prevState) => [...prevState, e.target.files[i]]);
      }
    }
  }

  function handleSubmitFile(e) {
    if (files.length === 0) {
      // no file has been submitted
    } else {
      // write submit logic here
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        setFiles((prevState) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName, idx) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  const handleCaptureClick = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleUploadClick = async () => {
    console.log("HI1");
    if (!image) {
      alert('Please select an image first.');
      return;
    }

    const base64Image = image.toString("base64");
    //console.log(base64Image)
    try {
      const response = await fetch('http://localhost:3000/generate-ingredients', {
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
      console.log(ings);
      if (ings === " ERROR") {
        alert('Failed to generate ingredients. Please upload another image.');
      }
      props.setIng(ings);
      props.handleNext();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate ingredients. Please upload another image.');
    }
  };

  return (
    <div className="flex h-screen">
        <div><Upload/></div>
        
        <div className="hidden">
        <div className="flex-1 bg-gray-300 p-8 hidden">
        {/* Your left screen content */}
        {image && <img src={image} alt="Uploaded" className="max-w-full max-h-48 rounded shadow-md" />}
        </div>
      <div className="flex-1 flex items-center justify-center">
        {/* Your right screen content */}
        <form
          className={`${
            dragActive ? "bg-blue-400" : "bg-blue-100"
          } bg-primary-100 p-7 w-3/5 rounded-lg uploadImg text-center flex flex-col items-center justify-center`}
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          {/* ... rest of your form code */}
          <button
            id="capture"
            className="text-white px-4 py-2 rounded mt-4 text-xs"
            onClick={() => { handleUploadClick() }}
          >
            Upload
          </button>
        </form>
        </div>
      </div>
      
    </div>
  );
}
