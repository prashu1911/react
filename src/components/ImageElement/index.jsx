import React from "react";
import { ADMIN_IMAGE_URL, PARTICIPANT_IMAGE_URL } from "../../config/app.config";

function ImageElement({ previewSource = "", imageFor = "admin", source, alt = "image", styling = {}, ...rest }) {
  const imagePath = {
    admin: ADMIN_IMAGE_URL,
    participant: PARTICIPANT_IMAGE_URL,
  };

  return (
    <>
      {previewSource ? (
        <img
          src={previewSource}
          alt={alt}
          {...rest}
          style={{ pointerEvents: "none", userSelect: "none", ...styling }}
        />
      ) : (
        <img
          src={`${imagePath[imageFor]}/${source}`}
          alt={alt}
          {...rest}
          style={{ pointerEvents: "none", userSelect: "none", ...styling }}
        />
      )}
    </>
  );
}

export default ImageElement;
