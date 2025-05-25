import "./FaceRecognition.css";

export default function FaceRecognition({ imageSrc, boxes }) {
  return (
    <div id="faceRecognitionContainer">
      <div>
        <img id="imageInput" src={imageSrc} alt="image with people faces" />
        {boxes.map((box, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              border: "2px solid green",
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
