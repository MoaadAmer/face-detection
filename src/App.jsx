import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import { useState, useRef } from "react";
import SignIn from "./components/SignIn/signin";

function App() {
  const [imageUrl, setImageUrl] = useState(
    "https://www.usmagazine.com/wp-content/uploads/2021/11/Jake-Ryan-Chris-Hot-Hunks-Walking-Their-Dogs-0003.jpg?quality=40&strip=all"
  );
  const imageRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  const [router, setRouter] = useState("signin");

  async function getFacesBoundingBox(imageUrl) {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, user and app ID, model details, and the URL
    // of the image we want as an input. Change these strings to run your own example.
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = "e64060f8f90b41af919c6ff60fef54c7";
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = "z58166sfn3rxs";
    const APP_ID = "test";
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
    const IMAGE_URL = imageUrl;
    // To use image bytes, assign its variable
    // const IMAGE_BYTES_STRING = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAoACgDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAYDBQcE/8QAMBAAAQMDAwMDAgQHAAAAAAAAAQIDBAAFEQYSIQcTMTJBURRhCBYikSNScXKhsdH/xAAZAQACAwEAAAAAAAAAAAAAAAAFBgIDBAf/xAAtEQABAwMBBgQHAQAAAAAAAAABAgMRAAQhMQUSE0FRYQaBocEUFiJCcrHR8P/aAAwDAQACEQMRAD8A3+RYY1unSYzCS0ttZUkAgktn0q5yT7jPyDUC4wdGwycH5U2Kt9ZQ7VI1qw5PkvQy3CSVPpf7aQjuKyFH25xzn3pHn3TVNy01Hl2hyy6YdkSpKsS9sl/6RlI3rRu3dxWd6spwnAGPIJTfl925fcLaoSDHXvyo6i9SlCQrU9wKln3OyWiaDN1RAbW3kKbSd7gPtwMkH/tTWy9afuy1iPfnXMAblITwkE4yf08cn3pSbYt1uts24XH6fUbiLAuY1MWyGkLEmUW0rcCRvUpQ5CtwKQCPgi4S1ZbDe4sd9NntDEe79m3uOBLTr0IR9jzodSMqUpTu9JJ8owD7UTT4ZCfv9PbP7860m+s+HBSrejWRuz2kAxoesGYxTW/Zlpkwo1vkuSly3UgKWQUhHJUvIHsAaKTemF8XE6sWmxyZkiaZrMh1jv8ArQNpUVqB8FW0njHqx4zRVVhsph1KlKk5xQ+7uHmikaSJrQerMByet2IwvtuTLa4xv2k7Rk84H9x/esHv92d01boenLXGcuiWrFIhLlpbcaQ2/JdK3VJCkAq2pAR7Zz7YxWudY9fxNIdQbNGkR5TyX4aisNNpUMFZAzkj4NK0jq9ZpbLr0PSlzkhrlZDaQlP3P8Q4/ap3F87bPucJEkx/hHv60b2TYXLrKN5sramYECSQRk9M6c6zmJ+eb5Hi22M7cnWGIQgFLbX0zSo4PDa1YBcTgDyMjJ/qbGPabH08SJt1Uzc9QqRliGg5QySPKvgc+TyfYDmmTUWpNYz7ctxoQdPQshCktupckDJUPUcJT6DwMq8YyaQ9VL0pCS8zapcq4SVOBZmPDO8/cnknlWcDBwn4NYnPjLkQ+qE9OtOVlYpeVHDCEkkkJyT+SuQzy5Y0ru6Ez511/Efa5s1fdkOtyVurIxgdlQAA9gOKKPwolU7remU5hCGYEgo38KUv9I/0TRTDYJCWQBSF4rIN/CRgAR0iTpVD1j1g/qDqJcJqlKcjB9bcda142MpOEJAzgeMnjyTSyze5KEuNRpDoDvC0oe4X9iAeaKKFK+oya6fbOqYbDTeEiAPKpHdS3gBLYc7RQkp3ApQog+cq8nwPJrljzxnPZbUfnugn/NFFRgEVch9xKsH0H8pg6e3x3T3UC1ajaZITGkJLoS4MKbOUrzz/ACKVRRRVzVwtoQmhG1NkWu0HuI+JI8u/Kv/Z';

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
      user_app_id: {
        user_id: "z58166sfn3rxs",
        app_id: "test",
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    try {
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/https://api.clarifai.com/v2/models/" +
          MODEL_ID +
          "/versions/" +
          MODEL_VERSION_ID +
          "/outputs",
        requestOptions
      );
      const result = await response.json();
      const regions = result.outputs[0].data.regions;

      return regions.map((region) => {
        // Accessing and rounding the bounding box values
        const boundingBox = region.region_info.bounding_box;
        const fixedBoundingBox = {
          topRow: boundingBox.top_row.toFixed(3),
          leftCol: boundingBox.left_col.toFixed(3),
          bottomRow: boundingBox.bottom_row.toFixed(3),
          rightCol: boundingBox.right_col.toFixed(3),
        };
        return fixedBoundingBox;
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  function calculateFacesLocation(boundingBoxes) {
    const img = imageRef.current;
    const imgWidth = Number(img.width);
    const imgHeight = Number(img.height);
    return boundingBoxes.map((boundingBox) => {
      return {
        left: boundingBox.leftCol * imgWidth,
        top: boundingBox.topRow * img.height,
        width: imgWidth * (boundingBox.rightCol - boundingBox.leftCol),
        height: imgHeight * (boundingBox.bottomRow - boundingBox.topRow),
      };
    });
  }

  async function handleDetect() {
    const boundingBoxes = await getFacesBoundingBox(imageUrl);
    const faces = calculateFacesLocation(boundingBoxes);
    console.log(faces);
    setBoxes(faces);
  }

  function handleOnChange(event) {
    setImageUrl(event.target.value);
    setBoxes([]);
  }
  function handleRoute(route) {
    setRouter(route);
  }

  return (
    <div className="app">
      {router === "signin" ? (
        <SignIn signInClickHandler={handleRoute} />
      ) : (
        <>
          <Navigation signOutHandler={handleRoute} />
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={handleOnChange}
            onButtonSubmit={handleDetect}
            initialValue={imageUrl}
          />
          <FaceRecognition
            imageRef={imageRef}
            imageSrc={imageUrl}
            boxes={boxes}
          />
        </>
      )}
    </div>
  );
}

export default App;
