import React, { useEffect, useState } from 'react';
import { commonService } from 'services/common.service';
import { useAuth } from 'customHooks';
import { Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  DataTableComponent,
  InputField,
  ModalComponent,
  SelectField,
  SweetAlert
} from '../../../../components';
import adminRouteMap from 'routes/Admin/adminRouteMap';
import { ADMIN_MANAGEMENT } from 'apiEndpoints/AdminManagement/adminManagement';
import { setIRNavigationState } from '../../../../redux/IRReportData/index.slice';
import { useDispatch } from 'react-redux';

function CreateTemplate() {
  let navigate = useNavigate();
  const dispatch = useDispatch()

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [ListTamplates, setListTamplates] = useState([]);
  const [CompaniesList, setCompaniesList] = useState([]);
  const [SelectedCompany, setSelectedCompany] = useState(null);
  const [SelectedTemplate, setSelectedTemplate] = useState();
  const [AssessmentList, setAssessmentList] = useState([]);
  const [SelectedAssessment, setSelectedAssessment] = useState(null);

  const createTemplate = () => {
    dispatch(setIRNavigationState({
      type: 'createTemplate',
    }))
    navigate(`${adminRouteMap.REPORTGENERATOR.path}`)
  };


  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return deleteTemplate(SelectedTemplate);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setOffset(0);
  };

  const handlePageChange = (direction) => {
    const totalPages = Math.ceil(filteredTemplates.length / limit);
    const currentPage = offset / limit + 1;
    if (direction === "next" && currentPage < totalPages) setOffset(offset + limit);
    if (direction === "prev" && offset > 0) setOffset(offset - limit);
    if (direction === "first") setOffset(0);
    if (direction === "last") setOffset((totalPages - 1) * limit);
  };

  const getPaginationButtons = () => {
    const totalPages = Math.ceil(filteredTemplates.length / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const buttons = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      if (currentPage <= 2) {
        buttons.push(1, 2, '...', totalPages);
      } else if (currentPage >= totalPages - 1) {
        buttons.push(1, '...', totalPages - 1, totalPages);
      } else {
        buttons.push(1, '...', currentPage, '...', totalPages);
      }
    }

    return buttons;
  };

  useEffect(() => {
    if (SelectedCompany) {
      setAssessmentList([]);
      setSelectedAssessment(null);
      setListTamplates([]);
      fetchAssessment(SelectedCompany);
    }
  }, [SelectedCompany]);



  const fetchElements = async (assessmentId, compnayID) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getTemplateList(assessmentId?.value, compnayID?.value),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setListTamplates(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getCompanyList(userData.companyMasterID),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setCompaniesList(response.data.data.map(company => ({
          value: company.companyID,
          label: company.comapnyName
        })));
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchAssessment = async (companyID) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getAssessmentList(companyID.value),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setAssessmentList(response.data.data.map(item => ({
          value: item.assessment_id,
          label: item.assessment_name
        })));
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.deleteTemplate(templateId),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Template Deleted Successfully",
          error: "Failed to Delete Template",
        },
      });

      if (response?.status) {
        fetchElements(SelectedAssessment, SelectedCompany);
        return true;
      }
      
    } catch (error) {
      console.log("Error deleting template:", error);
      return ;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (SelectedAssessment) {
      fetchElements(SelectedAssessment, SelectedCompany);
    }
  }, [SelectedAssessment]);

  const deleteModal = (templateId) => {
    setSelectedTemplate(templateId);
    setAlertType('delete');
    setIsAlertVisible(true);
  };



  const filteredTemplates = ListTamplates.filter(t =>
    t.templateName.toLowerCase().includes(searchValue.toLowerCase())
  );
  const paginatedTemplates = filteredTemplates.slice(offset, offset + limit);

  const columns = [
    {
      title: '#',
      dataKey: 'templateID',
      columnHeaderClassName: "no-sorting w-1 text-center",
      render: (value, row, index) => {
        return (
          <p style={{ width: '1.2rem', padding: 0, margin: 0 }}>{offset + index + 1}</p>
        )
      },
    },
    {
      title: 'Template Name',
      dataKey: 'templateName',
    },
    {
      title: 'Created date',
      dataKey: 'created_date',
    },
    {
      title: 'Action',
      dataKey: 'action',
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (value) => (
        <ul className="list-inline action mb-0">
          <li className="list-inline-item">
            <Link
              className="icon-primary"
              onClick={() =>
                dispatch(setIRNavigationState({
                  type: 'editTemplate',
                  reportID: value?.templateID,
                  reportName: value?.templateName,
                  companyName: SelectedCompany?.label,
                  companyId: SelectedCompany?.value,
                  assessmentName: SelectedAssessment?.label,
                  assessmentId: SelectedAssessment?.value,
                }))}
              to={{
                pathname: adminRouteMap.REPORTGENERATOR.path,
              }}
            >
              <em className="icon-table-edit" />
            </Link>
          </li>
          <li className="list-inline-item">
            <Link to="#!" className="icon-danger" onClick={() => deleteModal(value?.templateID)}>
              <em className="icon-delete" />
            </Link>
          </li>
        </ul>
      )
    },
  ];

  const paginationLimitOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' }
  ];



  return (
    <>
      <section className="commonHead">
        <h1 className='commonHead_title'>Welcome Back!</h1>
        <Breadcrumb breadcrumb={[
          { path: "#!", name: "Intelligent Report" },
          { path: "#", name: "Create Template" }
        ]} />
      </section>

      <div className="pageContent">
        <div className="pageTitle d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h2 className="mb-0">Templates</h2>
          <Button variant="primary ripple-effect" onClick={createTemplate}>Create Template</Button>
        </div>

        <Form>
          <Row>
            <Col lg={4} sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Company</Form.Label>
                <SelectField value={SelectedCompany} onChange={setSelectedCompany} placeholder="Select Company Name" options={CompaniesList} />
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Survey</Form.Label>
                <SelectField value={SelectedAssessment} onChange={setSelectedAssessment} placeholder="Select Survey Name" options={AssessmentList} />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div></div>
          <ul className="list-inline filter_action mb-0">
            <li className="list-inline-item">
              <div className="searchBar">
                <InputField type="text" placeholder="Search" value={searchValue} onChange={handleSearch} />
              </div>
            </li>
          </ul>
        </div>

        <DataTableComponent data={paginatedTemplates} columns={columns} />

        {ListTamplates?.length > 0 &&

          <div className="commonFilter_sort d-flex align-items-center justify-content-sm-between justify-content-center mt-4">
            <div className="commonFilter_sort_search d-flex align-items-center">
              <p style={{ margin: 0, display: "flex", alignItems: "center" }}>Entries Per Page</p>
              <SelectField
                className="mx-2"
                value={{ value: String(limit), label: String(limit) }}
                onChange={(e) => { setLimit(Number(e.value)); setOffset(0); }}
                options={paginationLimitOptions}
                style={{ marginTop: -8 }}
              />
              <p style={{ margin: 0, display: "flex", alignItems: "center" }}>Showing {offset + 1} to {Math.min(offset + limit, filteredTemplates.length)} of {filteredTemplates.length} Entries</p>
            </div>
            <div className="commonFilter_sort_pagination d-flex align-items-center">
              <div className="btn-group">
                <button className="btn btn-outline-secondary" onClick={() => handlePageChange("prev")}>Previous</button>
                {getPaginationButtons().map((page, idx) => (
                  typeof page === 'number' ? (
                    <button
                      key={idx}
                      className={`btn btn-outline-secondary ${Math.floor(offset / limit) + 1 === page ? 'active' : ''}`}
                      onClick={() => setOffset((page - 1) * limit)}
                    >
                      {page}
                    </button>
                  ) : (
                    <button key={idx} className="btn btn-outline-secondary disabled">…</button>
                  )
                ))}

                <button className="btn btn-outline-secondary" onClick={() => handlePageChange("next")}>Next</button>
              </div>
            </div>
          </div>
        }
      </div>



      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible && alertType === 'delete'}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Your file has been deleted."
        otherErrDisplayMode={true}
      />
      <SweetAlert
        icon="success"
        title="<h4>Template Created Successfully</h4>"
        iconColor="#7DEB79"
        showCloseButton
        closeButtonHtml='<em class="icon-close-circle"></em>'
        cancelButtonColor="#0968AC"
        showCancelButton
        showConfirmButton={false}
        cancelButtonText="Okay"
        show={isAlertVisible && alertType === 'success'}
        onConfirmAlert={onConfirmAlertModal}
        setIsAlertVisible={setIsAlertVisible}
      />
    </>
  );
}

export default CreateTemplate;
