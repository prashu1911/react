import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  Base64UploadAdapter,
  CloudServices,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Indent,
  IndentBlock,
  // Link,
  List,
  MediaEmbed,
  Mention,
  Paragraph,
  PasteFromOffice,
  Table,
  TableColumnResize,
  TableToolbar,
  TextTransformation,
  Font,
Alignment
} from "ckeditor5";

// eslint-disable-next-line import/no-unresolved
import "ckeditor5/ckeditor5.css";

function TextEditor({ value, onChange, isEditable = true, extraToolbar, compRemovePlugins }) {
  const toolbarOptions = [
    "undo",
    "redo",
    "|",
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "|",
    // "link",
    "uploadImage",
    "ckbox",
    "insertTable",
    "blockQuote",
    // "mediaEmbed",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",

  ];

  const getToolbarOptions = () => {
    if (Array.isArray(extraToolbar)) {
      return [...toolbarOptions, ...extraToolbar];
    } else {
      return toolbarOptions;
    }
  };
  return (
    <>
      <CKEditor
        className="editor_ck-powered-by"
        editor={ClassicEditor}
        data={value || "<p></p>"}
        onChange={(event, editor) => {
          const data = editor.getData(); // Get the updated value
          onChange(data); // Call the Formik onChange handler
        }}
        disabled={!isEditable}
        onReady={(editor) => {
          // Apply inline height style to the editable area          
          editor.editing.view.change((writer) => {
            writer.setStyle(
              "min-height",
              "60vh", // or any height you want
              editor.editing.view.document.getRoot()
            );
          });
        }}
        config={{
          toolbar: getToolbarOptions(),
          placeholder: "Start typing here...",
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
              {
                model: "heading5",
                view: "h5",
                title: "Heading 5",
                class: "ck-heading_heading5",
              },
              {
                model: "heading6",
                view: "h6",
                title: "Heading 6",
                class: "ck-heading_heading6",
              },
            ],
          },
          image: {
            resizeOptions: [
              {
                name: "resizeImage:original",
                label: "Default image width",
                value: null,
              },
              {
                name: "resizeImage:50",
                label: "50% page width",
                value: "50",
              },
              {
                name: "resizeImage:75",
                label: "75% page width",
                value: "75",
              },
            ],
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:wrapText",
              "imageStyle:breakText",
              "|",
              "resizeImage",
            ],
          },
          // link: {
          //   addTargetToExternalLinks: true,
          //   defaultProtocol: "https://",
          // },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          fontSize: {
            options: [9, 11, 13, 'default', 17, 19, 21],
            supportAllValues: true
          },
          fontColor: {
            columns: 5,
            documentColors: 10,
          },
          fontBackgroundColor: {
            columns: 5,
            documentColors: 10,
          },
          alignment: {
            options: ['left', 'center', 'right', 'justify'],
          },
          lineHeight: {
            options: ['1', '1.15', '1.5', '2', '2.5', '3']
          },
          plugins: [
            Autoformat,
            BlockQuote,
            Bold,
            CloudServices,
            Essentials,
            Heading,
            Image,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Base64UploadAdapter,
            Indent,
            IndentBlock,
            Italic,
            // Link,
            List,
            MediaEmbed,
            Mention,
            Paragraph,
            PasteFromOffice,
            PictureEditing,
            Table,
            TableColumnResize,
            TableToolbar,
            TextTransformation,
            Underline,
            Font,
            Alignment,

          ],
          removePlugins: compRemovePlugins ? compRemovePlugins : [],
          height: "1400px",
        }}
      />
    </>
  );
}
export default TextEditor;
