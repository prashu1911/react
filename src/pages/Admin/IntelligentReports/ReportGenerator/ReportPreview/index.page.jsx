import React, { useEffect, useRef, useState } from "react";
import { Breadcrumb, FallBackLoader } from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";
import GenerateCardCenter from "../GenerateCardCenter";
import { Link, useLocation } from "react-router-dom";
import { commonService } from "services/common.service";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import { useAuth } from "customHooks";
import { Button, Spinner } from "react-bootstrap";
import PdfGenerator from "../downloadpdf";

function ReportPreview() {
  const location = useLocation();
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const centerRef = useRef(null);
  const pdfComponentRef = useRef();

  const [generatedCharts, setGeneratedCharts] = useState([]);
  const [generateInitialPdf, setGenerateInitialPdf] = useState(false);
  const [downloadExistPdf, setDownloadExistPdf] = useState(null);

  const getAllWidgetsDetails = (data) => {
    setGeneratedCharts(data);
    setGenerateInitialPdf(false);
  };
  const handleGeneratePdf = () => {
    // if (generatedCharts?.length > 0) {
    //   setDownloadExistPdf(true);
    // } else {
    //   setGenerateInitialPdf(true);
    // }
    setGenerateInitialPdf(true);

    setloading(true);
  };

  const queryParams = new URLSearchParams(location.search);
  const reportId = queryParams.get("reportid");
  const TemplateFlag = false;

  useEffect(() => {
    fetchReportWidgets(reportId, 0);
  }, []);

  const [ReportWidgetList, setReportWidgetList] = useState([]);
  const [SectionData, setSectionData] = useState(null);
  const [loading, setloading] = useState(true);

  const fetchReportWidgets = async (reportId, flag) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getReportWidgetList(reportId, flag),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setReportWidgetList(response.data.data);
        const sectionIDs = response.data.data.map((item) => item.sectionID);
        updateAllSectionsData(sectionIDs, flag !== 0);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const fetchSectionData = async (sectionId, flag) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getIRSectionData(sectionId, TemplateFlag, flag),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const updateAllSectionsData = async (sectionIDs, flag) => {
    try {
      // ✅ Fetch all section data concurrently using Promise.all
      const sectionDataArray = await Promise.all(
        sectionIDs.map(async (sectionId) => {
          const data = await fetchSectionData(sectionId, flag);
          return { sectionId, data };
        })
      );

      // ✅ Transform fetched data into an object where keys are sectionIDs
      const updatedSectionData = sectionDataArray.reduce((acc, item) => {
        acc[item.sectionId] = item.data;
        return acc;
      }, {});

      // ✅ Set all data at once
      setSectionData(updatedSectionData);
      setTimeout(() => {
        setloading(false);
      }, [1000]);
    } catch (error) {
      console.error("Error fetching section data:", error);
    }
  };

  return (
    <>
      {/* head title start */}
      {/* <section className="commonHead">
                <h1 className='commonHead_title'>Welcome Back!</h1>
                <Breadcrumb breadcrumb={breadcrumb} />
            </section> */}
      {/* head title end */}
      <div className="pageContent reportGenerator reportPreview">
        <div className="pageTitle d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center">
            {/* <Link to={adminRouteMap.REPORTGENERATOR.path} className='backLink'><em className='icon-back'></em></Link> */}
            <h2 className="mb-0">Report Preview</h2>
          </div>
          <ul className="list-inline mb-0 filter_action ">
            <li>
              <Button
                title={"Download Pdf"}
                disabled={generateInitialPdf || loading}
                onClick={handleGeneratePdf}
                className="btn-icon "
              >
                <em className="icon-download"></em>
              </Button>
            </li>
          </ul>
        </div>

        {/* {(generatedCharts?.length > 0 && downloadExistPdf === null) || downloadExistPdf ? ( */}
        <PdfGenerator
          ReportWidgetList={ReportWidgetList}
          SectionData={SectionData}
          generatedImages={generatedCharts || []}
          downloadExistPdf={downloadExistPdf}
          revertBack={(data) => {
            setloading(false);
            setDownloadExistPdf(null);
          }}
        />
        {/* ) : null} */}

        {loading && (
            <div className="loading-spinner-overlay-custom">
              <Spinner color="blue" animation="border" size="lg" />
              <div>Loading...</div>
              {/* <FallBackLoader customStyles={{ height: "100%", padding: "1rem", borderRadius: "50px" }} /> */}
          </div>
        )} 

        <div style={{ opacity: loading ? 0.4 : 1 }}>
          {SectionData && (
            <GenerateCardCenter
              SectionData={SectionData}
              ReportWidgetList={ReportWidgetList}
              hasActionPlan={false}
              handleWidgetsDetails={getAllWidgetsDetails}
              generatePdf={generateInitialPdf}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ReportPreview;
