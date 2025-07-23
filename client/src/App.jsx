import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import { useState, useRef } from "react";
import SignIn from "./components/SignIn/signin";
import Register from "./components/Register/Register";
import { serverUrl } from "./config";

const App = () => {
  const [imageUrl, setImageUrl] = useState(
    "https://www.usmagazine.com/wp-content/uploads/2021/11/Jake-Ryan-Chris-Hot-Hunks-Walking-Their-Dogs-0003.jpg?quality=40&strip=all"
  );
  const imageRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  const [router, setRouter] = useState("signin");
  const [user, setUser] = useState(null);

  const calculateFacesLocation = (boundingBoxes) => {
    const img = imageRef.current;
    const imgWidth = Number(img.width);
    const imgHeight = Number(img.height);
    return boundingBoxes.map((box) => {
      return {
        left: box.leftCol * imgWidth,
        top: box.topRow * img.height,
        width: imgWidth * (box.rightCol - box.leftCol),
        height: imgHeight * (box.bottomRow - box.topRow),
      };
    });
  };

  const handleDetect = async () => {
    try {
      const response = await fetch(`${serverUrl}/users/${user.id}/image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: imageUrl }),
      });
      if (response.ok) {
        const resContent = await response.json();
        const faces = calculateFacesLocation(resContent.boundingBoxes);
        setBoxes(faces);
        user.entries = resContent.entries;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange = (event) => {
    setImageUrl(event.target.value);
    setBoxes([]);
  };
  const handleRoute = (route) => setRouter(route);
  const loadUser = (user) => setUser(user);

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
          <Register onRouteChange={handleRoute}  loadUser={loadUser} />
        </>
      );
    default:
      break;
  }
};

export default App;
