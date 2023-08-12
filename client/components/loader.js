function Loader({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center ht-75">
      <span className="h4 mb-3">{text}</span>
      <div className="spinner-border" role="status"></div>
    </div>
  );
}

export default Loader;
