import React from "react";
import { Spinner } from "react-bootstrap";

function Loader() {

  return (
    <div className="commonLoader d-flex align-items-center justify-content-center flex-column ">
      <Spinner animation="border" size="md" />
    </div>
  );
}
export default Loader;
