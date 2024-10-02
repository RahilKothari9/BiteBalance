import { useState } from "react";
import Upload from "../components/Upload";

const Tracker = () => {
    const [image, setImage] =        useState(null);

    const handleImageUpload = (uploadedImage) => {
        setImage(uploadedImage);
    };

    const handleImageProcessing = async () => {
        if (!image) {
            alert('No image detected');
            return;
        }

        try {
            const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + 'AIzaSyDwFpFuzIOP94lBQy99OczN0uJkUubTqas', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                requests: [
                  {
                    image: {
                      content: image.split(',')[1],
                    },
                    features: [
                      {
                       type: 'LABEL_DETECTION',
                       maxResults: 10,
                      },
                    ],
                  },
                ],
              }),
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const data = await response.json();
            console.log(data);
          } catch (error) {
            console.error('Error:', error);
          }
       }; 
    return (
        <div>
            <Upload />
            <button onClick={handleImageProcessing}>Process Image</button>
        </div>
    )     
}

export default Tracker;