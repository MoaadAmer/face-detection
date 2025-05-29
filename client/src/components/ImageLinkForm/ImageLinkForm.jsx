import "./ImageLinkForm.css";

function ImageLinkForm({ onInputChange, onButtonSubmit, initialValue }) {
  return (
    <div className="container">
      <p>This magic brain will detect faces in your picture. Try it out</p>
      <div className="form">
        <input
          type="text"
          value={initialValue}
          onChange={onInputChange}
        ></input>
        <button type="submit" onClick={onButtonSubmit}>
          Detect
        </button>
      </div>
    </div>
  );
}

export default ImageLinkForm;
