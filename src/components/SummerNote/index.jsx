import React from "react";
import $ from "jquery";

import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css";
// Uncomment if you need to support Russian language
// import 'react-summernote/lang/summernote-ru-RU';
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/tooltip";
import "bootstrap/dist/css/bootstrap.css";

window.jQuery = $;

export default function SummerNote() {
  // const onChange = (content) => {
  // };

  return (
    <ReactSummernote
      options={{
        disableDragAndDrop: true,
        height: 200,

        toolbar: [
          ["style", ["style"]],
          ["font", ["bold", "underline", "clear"]],
          ["fontname", ["fontname"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "video"]],
          ["view", ["fullscreen", "codeview"]],
        ],
      }}
      // onChange={onChange}
    />
  );
}
