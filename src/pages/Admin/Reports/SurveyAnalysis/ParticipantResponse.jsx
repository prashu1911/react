import React, { useEffect, useState } from "react";
import { Col, Dropdown, Form, Row } from "react-bootstrap";
import { useAuth } from "customHooks";
import { commonService } from "services/common.service";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { decodeHtmlEntities } from "utils/common.util";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useNavigate } from "react-router-dom";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import { Button, ReactDataTable, SelectField } from "components";
import { useTable } from "customHooks/useTable";



export default function ParticipantResponse() {
  const [searchValue, setSearchValue] = useState("");
  const [tableFilters] = useState({});

  const [companyOptions, setCompanyOptions] = useState([]);
  const [surveyOptions, setSurveyOptions] = useState([]);

  const [selectedSurveyId, setSelectedSurveyId] = useState("");

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [responseId, setResponseId] = useState("");

  const [isTableDataShow, setIsTableDataShow] = useState(false);
  const [isTableLoader, setIsTableLoader] = useState(false);

  const fetchOptionDetails = async (path, type) => {
    const response = await commonService({
      apiEndPoint: COMMANAPI.getComman(path),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      if (type === "company") {
        setCompanyOptions(
          Object?.values(response?.data?.data)?.map((company) => ({
            value: company?.companyID,
            label: decodeHtmlEntities(company?.companyName),
          }))
        );
      }
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Fetch company options first
      if (userData?.companyMasterID) {
        await fetchOptionDetails(
          `company?companyMasterID=${userData?.companyMasterID}`,
          "company"
        );
      }
    };

    initializeData();
  }, [userData]);

  const fetchSurvey = async (companyID) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.surveyList,
      queryParams: { companyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setSurveyOptions(
        response?.data?.data?.map((item) => ({
          value: item?.surveyID,
          label: item?.surveyName,
        }))
      );
    }
  };

  const downloadFromBuffer = (buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downoadResponseReport = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.downloadAssessmentResponse,
      queryParams: {
        companyID: selectedCompanyId,
        surveyID: selectedSurveyId,
        status: 1,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
      responseType: "blob",
    });
    if (response?.status) {
      downloadFromBuffer(response.data);
    }
  };

  const downoadRBOEQReport = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.downloadRBOEQResponse,
      queryParams: {
        companyID: selectedCompanyId,
        surveyID: selectedSurveyId,
        status: 1,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
      responseType: "blob",
    });
    if (response?.status) {
      downloadFromBuffer(response.data);
    }
  };

  const downoadQuestionList = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.downloadQuestionList,
      queryParams: {
        companyID: selectedCompanyId,
        surveyID: selectedSurveyId,
        status: 1,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
      responseType: "blob",
    });
    if (response?.status) {
      downloadFromBuffer(response.data);
    }
  };

  const handleCompanyChange = (selectedData) => {
    setSelectedCompanyId(selectedData?.value);
    setSelectedSurveyId("");
    fetchSurvey(selectedData?.value);
  };

  const responseOptions = [
    { value: "0", label: "All responses" },
    { value: "1", label: "Participant response complete" },
    { value: "2", label: "Participant response not complete" },
  ];

  const TABLE_DATA = [
    {
      id: "01",
      ReportName: "List of Questions",
    },
    {
      id: "02",
      ReportName: "Assessment Responses",
    },
  ];
  const [tableData] = useState(TABLE_DATA);

  // This hook is not usefull when we handle search,filter,pagination from api.
  const {
    totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    handleSort,
    currentData,
  } = useTable({
    searchValue,
    searchKeys: ["ReportName"],
    tableFilters,
    initialLimit: 10,
    data: tableData,
  });

  // data table

  useEffect(() => {
    setSearchValue("");
  }, []);

  const columns = [
    {
      title: "#",
      dataKey: "id",
      data: "id",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Name of the reports",
      dataKey: "ReportName",
      data: "ReportName",
    },
    {
      title: "Action",
      dataKey: "action",
      data: "action",
      columnHeaderClassName: "w-1 no-sorting",

      render: (data, row) => (
        <>
          {row.id === "01" && (
            <DropdownForQuestionList
              downoadQuestionList={downoadQuestionList}
              state={{
                surveyID: selectedSurveyId,
                companyID: selectedCompanyId,
              }}
            />
          )}
          {row.id === "02" && (
            <DropdownForAllSurveyList
              downoadResponseReport={downoadResponseReport}
              downoadRBOEQReport={downoadRBOEQReport}
              state={{
                surveyID: selectedSurveyId,
                companyID: selectedCompanyId,
              }}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Form>
        <Row className="mb-2 align-items-end gx-2">
          <Col md={3} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Company Name</Form.Label>
              <SelectField
                placeholder="Company Name"
                options={companyOptions}
                onChange={(selectedData) => {
                  handleCompanyChange(selectedData);
                }}
                value={companyOptions.find(
                  (option) => option?.value === selectedCompanyId
                )}
              />
            </Form.Group>
          </Col>
          <Col md={3} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Survey Name</Form.Label>
              <SelectField
                placeholder="Survey Name"
                options={surveyOptions}
                onChange={(selectedData) => {
                  setSelectedSurveyId(selectedData?.value);
                }}
                value={
                  surveyOptions.find(
                    (option) => option?.value === selectedSurveyId
                  ) || null
                }
                isDisabled={surveyOptions?.length === 0}
              />
            </Form.Group>
          </Col>
          <Col md={3} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Response</Form.Label>
              <SelectField
                placeholder="Response"
                options={responseOptions}
                onChange={(select) => {
                  setResponseId(select?.value);
                }}
                value={
                  responseOptions.find(
                    (option) => option?.value === responseId
                  ) || null
                }
              />
            </Form.Group>
          </Col>
          <Col md={3} sm={6}>
            <div className="form-group">
              <Button
                disabled={
                  selectedCompanyId === "" ||
                  selectedSurveyId === "" ||
                  responseId === ""
                }
                variant="primary ripple-effect"
                onClick={() => {
                  setIsTableLoader(true);
                  setIsTableDataShow(true);
                  setTimeout(() => setIsTableLoader(false), 1000);
                }}
              >
                Get Report
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
      <ReactDataTable
        isPaginate={false}
        data={isTableDataShow ? currentData : []}
        columns={columns}
        page={offset}
        totalLength={totalRecords}
        totalPages={totalPages}
        sizePerPage={limit}
        handleSort={handleSort}
        sortState={sortState}
        isLoading={isTableLoader}
      />
    </>
  );
}

const DropdownForQuestionList = ({ downoadQuestionList, state }) => {
  const navigate = useNavigate();
  return (
    <>
      <ul className="list-inline action mb-0">
        <li className="list-inline-item">
          <Dropdown>
            <Dropdown.Toggle as="a" className="icon-secondary">
              <em className="icon-settings-outline" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(adminRouteMap.LISTOFQUESTIONS.path, {
                    state,
                  });
                }}
              >
                <em className="icon-eye" />
                View Question List
              </Dropdown.Item>
              <Dropdown.Item
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  downoadQuestionList();
                }}
              >
                <em className="icon-download-outline" />
                Download Question List
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </>
  );
};

const DropdownForAllSurveyList = ({
  downoadResponseReport,
  downoadRBOEQReport,
  state,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <ul className="list-inline action mb-0">
        <li className="list-inline-item">
          <Dropdown>
            <Dropdown.Toggle as="a" className="icon-secondary">
              <em className="icon-settings-outline" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(adminRouteMap.PARTICIPANTRBOEQVIEWPAGE.path, {
                    state,
                  });
                }}
              >
                <em className="icon-eye" />
                View RBOEQ Response
              </Dropdown.Item>
              <Dropdown.Item
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(adminRouteMap.PARTICIPANTASSEMENTPAGE.path, {
                    state,
                  });
                }}
              >
                <em className="icon-eye" />
                View Assessment Response
              </Dropdown.Item>

              <Dropdown.Item
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  downoadRBOEQReport();
                }}
              >
                <em className="icon-download-outline" />
                Download RBOEQ Response{" "}
              </Dropdown.Item>
              <Dropdown.Item
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  downoadResponseReport();
                }}
              >
                <em className="icon-download-outline" />
                Download Assessment Response
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </>
  );
};
