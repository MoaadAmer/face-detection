import "./ImageLinkForm.css"
const ImageLinkForm = () => {
  return (
    <div className="container">
      <p>This magic brain will detext faces in your picture. Try it out</p>
      <form>
        <input type="text" placeholder="Enter image url"></input>
        <button type="submit">Detect</button>
      </form>
    </div>
  );
};

export default ImageLinkForm;
