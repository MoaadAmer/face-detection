import "./FaceRecognition.css";

export default function FaceRecognition({ imageSrc, faceLocation }) {
  return (
    <div id="faceRecognitionContainer">
      <div>
        <img id="imageInput" src={imageSrc} alt="image with people faces" />
        <div
          style={{
            position: "absolute",
            border: "2px solid green",
            left: faceLocation.left,
            top: faceLocation.top,
            width: faceLocation.width,
            height: faceLocation.height,
          }}
        ></div>
      </div>
    </div>
  );
}
