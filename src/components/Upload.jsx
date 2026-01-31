import { useRef, useState } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function Upload(props) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [files, setFiles] = useState([]);
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  const [isCapturing, setIsCapturing] = useState(false);

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
      let constraints = { video: true };

      // Check if there are multiple video input devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoInputDevices.length > 0) {
        // If there are multiple video input devices, prefer the rear camera
        constraints.video = { facingMode: "environment" };
      } else {
        // If there's only one video input device, assume it's a laptop and use the front camera
        constraints.video = { facingMode: "user" };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const imageDataURL = canvasRef.current.toDataURL("image/png");
      setImage(imageDataURL);
      setIsCapturing(false);
    }
  };

  const handleStopCapture = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCapturing(false);
      }
    }
  };
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = async () => {
    props.setOpen(true);
    if (!image) {
      alert("Please select an image first.");

      props.setOpen(false);
      return;
    }
    setImage(image);

    const base64Image = image.toString("base64");
    //console.log(base64Image)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}generate-ingredients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ b64: base64Image }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
        return;
      }

      const ings = await response.json();
      console.log(ings);
      if (ings === " ERROR" || ings.ingredients.length == 0) {
        alert("Failed to generate ingredients. Please upload another image.");
        props.setOpen(false);
        return;
      }
      //  else
      //  {
      //   setIngredients(ings)
      //  }
      // Move to next screen bro
      alert(`Ingredients: ${JSON.stringify(ings)}`);
      props.setIng(ings);
      props.setOpen(false);
      props.handleNext();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate ingredients. Please upload another image.");
    }
  };

  return (
    <div className="h-90 flex mt-5 justify-center">
      <div className="w-full max-w-7xl p-10 bg-white rounded-xl shadow-xl flex">
        <div className="w-1/2 pr-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Don't know what to eat?
          </h1>
          <h2 className="text-2   xl text-green-600 mb-6">Ask Us!</h2>
          <div className="bg-gray-100 rounded-lg p-6">
            <p className="text-gray-600">
              SNAP A PHOTO OF YOUR INGREDIENTS & GET AN INSTANT RECIPE!
            </p>
          </div>
          {image && (
            <div className="bg-gray-100 rounded-lg p-6 mt-6 flex flex-col items-center justify-center gap-5">
              <img
                src={image}
                alt="Uploaded"
                className="mt-4 max-w-full max-h-48 rounded shadow-md"
              />
              <Button
                variant="contained"
                className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 text-base"
                onClick={handleUploadClick}
              >
                Upload
              </Button>
            </div>
          )}
        </div>

        <div
          className="w-1/2 bg-blue-50 rounded-xl p-8 flex flex-col items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center mb-6">
            <CloudUploadIcon style={{ fontSize: 48, color: "#3B82F6" }} />
            <p className="mt-2 text-blue-600">
              Drag & Drop files or Select files to upload
            </p>
          </div>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            ref={inputRef}
            multiple={true}
            onChange={handleImageChange}
            accept=".jpg, .jpeg, .png"
          />
          <div className="flex flex-col align-center justify-center gap-4">
            <Button
              variant="contained"
              component="label"
              htmlFor="fileInput"
              startIcon={<CloudUploadIcon />}
              className="bg-blue-500 hover:bg-blue-600"
              sx={{ width: "100%" }}
            >
              Select Files
            </Button>
            <Button
              variant="outlined"
              startIcon={<CameraAltIcon />}
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
              onClick={handleCaptureClick}
              disabled={isCapturing}
              sx={{ width: "100%" }}
            >
              Capture Image
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-4 text-center">
              {files.map((file, idx) => (
                <div key={idx} className="text-green-600">
                  <p>File selected: {file.name}</p>
                  <span
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFile(file.name, idx)}
                  >
                    remove
                  </span>
                </div>
              ))}
              <Button
                variant="contained"
                className="mt-2 bg-green-500 hover:bg-green-600"
                onClick={handleUploadClick}
              >
                Upload
              </Button>
            </div>
          )}

          {isCapturing && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="mt-4 max-w-full max-h-48 rounded shadow-md"
              />
              <div className="flex mt-2 gap-2">
                <Button
                  onClick={handleCaptureImage}
                  className="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2"
                >
                  Capture Image
                </Button>
                <Button
                  onClick={handleStopCapture}
                  className="bg-red-500 text-white text-xs px-4 py-2 rounded mt-2 ml-2"
                >
                  Stop Capture
                </Button>
              </div>
              <canvas ref={canvasRef} className="hidden"></canvas>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
