import React from "react";
import { ModalComponent } from "../../../../../../components";
import SummaryReport from "./SummaryReport";

const PreviewModal = ({ showPreview, setshowPreview, previewData, reportType ,isEditPage,detailChart,summaryChart}) => {
  const faqFilterClose = () => {
    setshowPreview(false);
  };

  return (
    <ModalComponent
      modalHeader={`${reportType} Report`}
      modalExtraClass="noFooter"
      extraClassName="summaryReport"
      size="xl"
      show={showPreview}
      onHandleCancel={faqFilterClose}
    >
      <SummaryReport previewData={previewData} isEditPage={isEditPage} detailChart={detailChart} summaryChart={summaryChart} reportType={reportType}/>
    </ModalComponent>
  );
};

export default PreviewModal;
