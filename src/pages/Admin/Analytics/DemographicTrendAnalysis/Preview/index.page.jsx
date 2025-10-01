/* eslint-disable react/no-danger */
import React, { useEffect, useState } from "react";
import {
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
} from "utils/common.util";
import CommonBarChartAnnotation from "../../CommonBarChartAnnotation";
import { ImageElement } from "components";
import { useAuth } from "customHooks";
import ChartRenderer from "../CollapseAge/ChartRenderer";
import Comments from "pages/Admin/Reports/Previews/Comments";
import Previewboxheader from "pages/Admin/Reports/Previews/Previewboxheader";

export default function Preview() {
  const [chartData, setChartData] = useState([]);
  const [scalarConfiguration, setScalarConfiguration] = useState([]);
  const [reportName, setReportName] = useState("");
  const [openingComment, setOpeningComment] = useState("");
  const [closingComment, setClosingComment] = useState("");
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [chartTypeOptions, setChartTypeOptions] = useState([]);
  const [legendOptions, setLegendOptions] = useState([]);
  const [dataLabelOptions, setDataLabelOptions] = useState([]);
  const [fontSizeOptions, setFontSizeOptions] = useState([]);
  const [filtersData, setFiltersData] = useState()
  const [reportTime, setReportTime] = useState("");

  console.log(chartData?.[0],"chart")
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


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sharedData"));
    setChartData(data);
    const filters = JSON.parse(localStorage.getItem("filtersData"));
    setFiltersData(filters);
    const sclarData = JSON.parse(localStorage.getItem("sclarData"));
    setScalarConfiguration(sclarData);
    const reportNameData = JSON.parse(localStorage.getItem("reportName"));
    setReportName(reportNameData);
    const openingCommentData = JSON.parse(
      localStorage.getItem("openingComment")
    );
    setOpeningComment(openingCommentData);
    const closingCommentData = JSON.parse(
      localStorage.getItem("closingComment")
    );
    setClosingComment(closingCommentData);

    const chartTypeOptionsData = JSON.parse(
      localStorage.getItem("chartTypeOptions")
    );
    setChartTypeOptions(chartTypeOptionsData);

    const legendOptionsData = JSON.parse(localStorage.getItem("legendOptions"));
    setLegendOptions(legendOptionsData);

    const dataLabelOptionsData = JSON.parse(
      localStorage.getItem("dataLabelOptions")
    );
    setDataLabelOptions(dataLabelOptionsData);

    const fontSizeOptionsData = JSON.parse(
      localStorage.getItem("fontSizeOptions")
    );
    setFontSizeOptions(fontSizeOptionsData);
  }, []);


  return (
    <>
      <>
     {/* full-width white bar */}
     <div className="pageContent">
     {/* your .pageTitle content will now be centered */}
  <div className="pageTitle d-flex justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Preview Dynamic Filter Report</h2>
              </div>
              
              {/* <div className="filter_action list-unstyled mb-0">
                <li>
                  <button
                    onClick={toPDF}
                    type="button"
                    aria-label="Download icon"
                    className="btn-icon ripple-effect"
                  >
                    <em className="icon-download" />
                  </button>
                </li>
              </div> */}
            </div>
            {/* <div className="container py-xl-4 py-3"> */}
          <div className="demographicAnalysis bg-white">
            <div className="demographicAnalysis_Body">
            <Comments comment={openingComment} userData={userData} image ={true} reportName={reportName}/>

            <div className="reportCard">
            <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

            <div className="responseBox d-flex">
                <div className="responseBox_left">
                  <h3 className="responseBox_title mb-0">Question</h3>
                </div>
                <div className="responseBox_right">
                  <h3 className="responseBox_title mb-0">Response</h3>
                </div>
              </div>
            {chartData?.map((question, index) => (
                <div key={index}>
                  <div key={index} className="responseBox d-flex border-top-0">
                    <div className="responseBox_left">
                      <h4 className="responseBox_txt mb-0">
                        {question.questionName}
                      </h4>
                    </div>
                    <div className="responseBox_right">
                      <div className="responseBox_chart">
                        {/* <CommonBarChartAnnotation
                          scalarConfigurationPropData={scalarConfiguration}
                          colorsChart={question?.colorsArray}
                          renderChart={false}
                          chartType={question?.chartOptions?.chartType}
                          legendPosition={question?.chartOptions?.legend}
                          labelPosition={question?.chartOptions?.dataLabel}
                          fontSize={question?.chartOptions?.fontSize}
                          switchAxis={
                            question?.chartOptions?.switchAxis === "xAxis"
                          }
                          labelColorState={question?.chartOptions?.lableColor}
                          annotationOpacity={Number(
                            (
                              question?.chartOptions?.scalarOpacity / 100
                            ).toFixed(2)
                          )}
                          showNegative={false}
                          values={question.responses?.map((r) =>
                            parseFloat(r.percentage)
                          )}
                          categories={
                            question.responses?.map((r) => r.responseName) || []
                          }
                        /> */}

                <ChartRenderer
                  question={question}
                  scalarConfiguration={scalarConfiguration}
                  renderChart={true}
                  // sortOrder={sortOrder}
                  chartTypeOptions={chartTypeOptions}
                  legendOptions={legendOptions}
                  dataLabelOptions={dataLabelOptions}
                  fontSizeOptions={fontSizeOptions}
                />
                       
                      </div>
                    </div>
                  </div>
                </div>
              ))}
      </div>


            
<div
  style={{
    width: "100%",
    height: 0,       
    borderRadius:3,                    // no extra fill
    // borderBottom: "3px solid #0B67AC",   // border always renders crisply
    marginBottom: 10,                           // or adjust spacing with mt-3, etc.
  }}
/>
<Comments comment={closingComment} userData={userData} image ={true} reportName={reportName}/>

            </div>
          </div>
        {/* </div> */}
</div>

       
      </>
    </>
  );
}
