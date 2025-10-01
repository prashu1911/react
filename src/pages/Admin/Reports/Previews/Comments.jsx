import { ImageElement } from 'components';
import React from 'react';
import Previewboxheader from './Previewboxheader';

function formatDateTime(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return (
    new Date(date).toLocaleString("en-US", options).replace(",", "") || ""
  );
}

function Comments({ userData, reportName, comment, image,opening ,footer,date}) {
  return (comment||opening)&& (
    <div className="reportCard">
      {/* Header row: logo on left, title centered */}
      <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

      {/* Commentary title */}
      <h3 className="reportCard_title mb-2 d-flex justify-content-center align-items-center">
        Commentary
      </h3>

      {/* Comment content */}
      {comment && (
       <div
       className="my-xl-3 my-2"
       dangerouslySetInnerHTML={{
         __html: `
           <style>
             .comment-html-wrapper img {
               max-width: 100%;
               height: auto;
               display: block;
               margin: 0 auto;
             }
           </style>
           <div class="comment-html-wrapper">
             ${comment}
           </div>
         `
       }}
     />
     
      )}

      {/* Footer - optional if needed later */}
     {footer&& <div className="reportCard_info d-flex justify-content-between flex-wrap gap-1">
        <span>Report Generated at {date}</span>
        <span>© {new Date().getFullYear()}, Metolius®</span>
      </div>}
    </div>
  );
}

export default Comments;
