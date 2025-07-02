import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import { useState, useRef } from "react";
import SignIn from "./components/SignIn/signin";
import Register from "./components/Register/Register";

function App() {
  const [imageUrl, setImageUrl] = useState(
    "https://www.usmagazine.com/wp-content/uploads/2021/11/Jake-Ryan-Chris-Hot-Hunks-Walking-Their-Dogs-0003.jpg?quality=40&strip=all"
  );
  const imageRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  const [router, setRouter] = useState("signin");
  const [user, setUser] = useState(null);

  async function getFacesBoundingBox(imageUrl) {
    const PAT = "";
    const USER_ID = "z58166sfn3rxs";
    const APP_ID = "test";
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
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
    updateRank();
  }

  async function updateRank() {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${user.id}/image`,
        {
          method: "put",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (response.ok === true) {
        const newEntries = await response.json();
        user.entries = newEntries;
        loadUser(user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleOnChange(event) {
    setImageUrl(event.target.value);
    setBoxes([]);
  }
  function handleRoute(route) {
    setRouter(route);
  }
  function loadUser(user) {
    setUser(user);
  }

  switch (router) {
    case "home":
      return (
        <>
          <Navigation onRouteChange={handleRoute} />
          <Logo />
          <Rank username={user.name} rank={user.entries} />
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
      );
    case "signin":
      return (
        <>
          <Logo />
          <SignIn onRouteChange={handleRoute} loadUser={loadUser} />
        </>
      );
    case "register":
      return (
        <>
          <Logo />
          <Register onRouteChange={handleRoute} />
        </>
      );
    default:
      break;
  }
}

export default App;
