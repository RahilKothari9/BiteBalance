import { useRef, useState } from "react";
import '../css/upload.css';


export default function NewUpload(props) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [files, setFiles] = useState([]);
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
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
       const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
      //alert(videoInputDevices.length)
       if (videoInputDevices.length > 0) {
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
      props.setImage(imageDataURL);
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
  }
//   const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        props.setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = async () => {
    props.setOpen(true)
    if (!props.image) {
       alert('Please select an image first.');
       props.setOpen(false);
       return;
    }
    props.setImage(props.image)
    
    const base64Image = props.image.toString("base64");
    //console.log(base64Image)
    try {
       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}generate-info`, {
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
       if(ings === " ERROR")
       {
        alert('Not a meal. Please upload another image.');
       }
        else{
            props.setIng(ings)
            props.setOpen(false)
            props.handleNext()
        }
      //  {
      //   setIngredients(ings)
      //  }
       // Move to next screen bro
      //  alert(`Ingredients: ${ings}`);
      
    } catch (error) {
       console.error('Error:', error);
       alert('Failed to generate ingredients. Please upload another image.');
    }
   };
   
  return (
    <div className="flex flex-col items-center justify-space  h-screen ">
      <div className="flex flex-col items-center justify-space h-screen/2 ">
      
      </div>
      <h1 class="text-center pt-8 md:p-8 text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
          How Healthy is your food?
      </h1>
      <h2 className="text-center text-xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-4xl">
        Check it out!
      </h2>
      <div className="text-center mt-5 flex flex-col items-center h-screen  w-screen p">
      <form 
        className={`${
          dragActive ? "bg-blue-400" : "bg-blue-100" 
        } bg-primary-100 p-7 h-100 w-3/5 rounded-lg uploadImg form-upload text-center flex flex-col items-center justify-center`}
        onDragEnter={handleDragEnter}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <input
          placeholder="fileInput"
          className="hidden"
          ref={inputRef}
          type="file"
          multiple={true}
          onChange={handleImageChange}
          accept=".jpg"
        />

        <p>
          Drag & Drop files or{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={openFileExplorer}
          >
            <u>Select files</u>
          </span>{" "}
          to upload
        </p>

        <div className="flex flex-col items-center p-3">
          {files.map((file, idx) => (
            <div key={idx} className="flex flex-row space-x-5">
              <span>{file.name}</span>
              <span
                className="text-red-500 cursor-pointer"
                onClick={() => removeFile(file.name, idx)}
              >
                remove
              </span>
            </div>
          ))}
        </div>
        {!isCapturing && <button
        onClick={handleCaptureClick}
        disabled={isCapturing}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Capture Image 
      </button>}
      <br />
      {isCapturing && (
        <>
          <video ref={videoRef} autoPlay playsInline className="mt-4 max-w-full max-h-48 rounded shadow-md" />
          <br />
          <div className="flex ">
          <button
            onClick={handleCaptureImage}
            className="bg-green-500 text-white  text-xs px-2 py-1 rounded mt-2"
          >
            Capture Image
          </button>
          <button
            onClick={handleStopCapture}
            className="bg-red-500 text-white text-xs px-4 py-2 rounded mt-2 ml-2"
          >
            Stop Capture
          </button>
          </div>
        </>
      )}
      {isCapturing && (
        <canvas ref={canvasRef} className="hidden"></canvas>
      )}
      {(props.image || files) && (
        <div className="lg:flex flex-col lg:justify-center items-center">
          <div className="lg:w-1/2">
            {props.image &&<img
              src={props.image}
              alt="Uploaded"
              className="mt-4 max-w-full max-h-48 rounded shadow-md"
            />}
          </div>
          <div >
            
            <button
              id="capture"
              className="text-white px-4 py-2 rounded mt-4 text-xs"
              onClick={() => {handleUploadClick()}}
            >
              Upload
            </button>
          </div>
        </div>
      )}
      </form>
      </div>
    </div>
  );
}
