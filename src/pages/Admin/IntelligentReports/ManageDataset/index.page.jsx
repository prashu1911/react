import React, { useEffect, useState } from 'react';
import { commonService } from 'services/common.service';
import { useAuth } from 'customHooks';
import { Link } from 'react-router-dom';
import { Form, Col, Row, } from 'react-bootstrap';
import { Button, Breadcrumb, DataTableComponent, InputField, ModalComponent, SelectField, SweetAlert } from '../../../../components';
import { ADMIN_MANAGEMENT } from 'apiEndpoints/AdminManagement/adminManagement';

function ManageDataset() {

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Intelligent Report",
    },

    {
      path: "#",
      name: "Manage Dataset",
    },
  ]
  // delete alert modal
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [DatasetList, setDatasetList] = useState([])
  const [CompaniesList, setCompaniesList] = useState([])
  const [SelectedCompany, setSelectedCompany] = useState(null);
  const [AssessmentList, setAssessmentList] = useState([])
  const [SelectedAssessment, setSelectedAssessment] = useState(null)
  const [DatasetFilterData, setDatasetFilterData] = useState([])
  const [offset, setOffset] = useState(0);
  const [deleteDatasetId, setdeleteDatasetId] = useState()
  
const [limit, setLimit] = useState(10);
const [searchValue, setSearchValue] = useState("");

const handleSearch = (e) => {
  setSearchValue(e.target.value);
  setOffset(0); // reset pagination
};

  const fetchDataset = async (surveyID) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getDatasetList(surveyID.value, false),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setDatasetList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const getDataset = async (datasetId) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getDataset(datasetId),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {

        const filterValue = response.data.data[0]?.filter_value

        const datasetFilterData = [];

        let count = 1;

        for (const key in filterValue) {
          if (key === "demographic_filter") {
            datasetFilterData.push({
              no: count++,
              dataPoint: "Demographic: ",
              filter: filterValue[key]
                .map(item => item.questionValue + ": " + item.responses.map(res => res.responseValue).join(", "))
                .map(line => <div key={line}>{line}</div>) // render each line in its own <div>
            });
          } else if (Array.isArray(filterValue[key])) {
            datasetFilterData.push({
              no: count++,
              dataPoint: key.charAt(0).toUpperCase() + key.slice(1),
              filter: filterValue[key].map((item) => item.name).join(", "),
            });
          } else {
            datasetFilterData.push({
              no: count++,
              dataPoint: key.charAt(0).toUpperCase() + key.slice(1),
              filter: filterValue[key],
            });
          }
        }

        setDatasetFilterData(datasetFilterData);

        setShowDatasetFilter(true)
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
        console.log('compines', response.data.data);
        setCompaniesList(response.data.data.map(company => ({
          value: company.companyID,
          label: company.comapnyName  // Fix typo: comapnyName → companyName
        })));
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
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
        console.log('fetchAssessment', response.data.data);
        setAssessmentList(response.data.data.map(company => ({
          value: company.assessment_id,
          label: company.assessment_name
        })));
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const deleteDataset = async (datasetId) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.deleteDataset(datasetId),
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
        fetchDataset(SelectedAssessment, SelectedCompany)
        return true;
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchCompanies()
  }, [])
  useEffect(() => {
    if (SelectedCompany) {
      setAssessmentList([])
      setSelectedAssessment(null)
      setDatasetList([])

      fetchAssessment(SelectedCompany)
    }
  }, [SelectedCompany])
  useEffect(() => {
    if (SelectedAssessment) {

      fetchDataset(SelectedAssessment, SelectedCompany)
    }
  }, [SelectedAssessment])




  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return deleteDataset(deleteDatasetId);
  };
  const deleteModal = (value) => {
    setdeleteDatasetId(value?.dataset_id)
    setIsAlertVisible(true);
  }
  // datasets filter modal
  const [showDatasetFilter, setShowDatasetFilter] = useState(false);
  const datasetFilterClose = () => setShowDatasetFilter(false);
  const datasetFilterShow = (value) => {
    console.log(value);
    getDataset(value?.dataset_id)

  };

  const filteredDatasets = DatasetList.filter(item =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  const paginatedDatasets = filteredDatasets.slice(offset, offset + limit);
  

  const datasetFilterColumns = [
    {
      title: 'S.No.',
      dataKey: 'no',
      columnHeaderClassName: "no-sorting w-1 text-center",

    },
    {
      title: 'Data Point',
      dataKey: 'dataPoint',
      columnHeaderClassName: "no-sorting",
      render: (value) => {
        let filter = value.dataPoint
        if (filter === "Manager_reportees") {
          filter = "Manager Reportees"
        }
        return filter;
      }
    },
    {
      title: 'Filter',
      dataKey: 'filter',
      columnHeaderClassName: "no-sorting",
      render: (value) => {
        
        let filter = value.filter
        if (filter === "D") {
          filter = "Direct"
        } else if (filter === "A") {
          filter = "All"
        }
        if (Array.isArray(value?.filter)) {
            filter=value?.filter[0]?.key
        }
        return (
          <div >{filter || "-"}</div>
        );
      }
    }
  ];
  const columns = [
    {
      title: 'S.No.',
      dataKey: 'datasetID',
      columnHeaderClassName: "no-sorting w-1 text-center",
      render: (value, row, index) => {
        return(offset + index + 1)
      },

    },
    {
      title: 'Dataset Name',
      dataKey: 'name',
    },
    {
      title: 'Description',
      dataKey: 'description',
    },
    {
      title: 'Action',
      dataKey: 'action',
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (value) => {
        return (
          <ul className="list-inline action mb-0">
            <li className="list-inline-item">
              <Link to="#!" className="icon-primary" onClick={() => { datasetFilterShow(value) }}>
                <em className="icon-eye" />
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="#!" className="icon-danger" onClick={() => { deleteModal(value)}}>
                <em className="icon-delete" />
              </Link>
            </li>
          </ul>
        );
      }
    },
  ];

  const getPaginationButtons = () => {
    const totalPages = Math.ceil(filteredDatasets.length / limit);
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

  const paginationLimitOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' }
  ];

  const handlePageChange = (direction) => {
    const totalPages = Math.ceil(filteredDatasets.length / limit);
    const currentPage = offset / limit + 1;
    if (direction === "next" && currentPage < totalPages) setOffset(offset + limit);
    if (direction === "prev" && offset > 0) setOffset(offset - limit);
    if (direction === "first") setOffset(0);
    if (direction === "last") setOffset((totalPages - 1) * limit);
  };
  
  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className='commonHead_title'>Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent">
        <div className="pageTitle">
          <h2 className="mb-0">Manage Datasets</h2>
        </div>
        <Form>
          <Row className='gx-2'>
            <Col lg={4} sm={6}>
              <Form.Group className="form-group" >
                <Form.Label>Company</Form.Label>
                <SelectField value={SelectedCompany} onChange={setSelectedCompany} placeholder="Select Company Name" options={CompaniesList} />
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className="form-group" >
                <Form.Label>Survey</Form.Label>
                <SelectField value={SelectedAssessment} onChange={setSelectedAssessment} placeholder="Select Survey Name" options={AssessmentList} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <div style={{justifyContent:'flex-end'}} className="filter d-flex align-items-center  flex-wrap gap-2">
          <div className="searchBar">
            <InputField type="text" placeholder="Search" value={searchValue} onChange={handleSearch} />
          </div>
          <ul className="list-inline filter_action mb-0">
            <li className="list-inline-item"><Link to="#!" className="btn-icon ripple-effect"><em className="icon-download" /></Link></li>
          </ul>
        </div>
        <DataTableComponent data={paginatedDatasets} columns={columns} />

        {DatasetList?.length>0 && <div className="commonFilter_sort d-flex align-items-center justify-content-sm-between justify-content-center mt-4">
          <div className="commonFilter_sort_search d-flex align-items-center">
            <p style={{ margin: 0, display: "flex", alignItems: "center" }}>Entries Per Page</p>
            <SelectField
              className="mx-2"
              value={paginationLimitOptions.find(opt => opt.value === String(limit))}
              onChange={(e) => { setLimit(Number(e.value)); setOffset(0); }}
              options={paginationLimitOptions}
            />
            <p style={{ margin: 0, display: "flex", alignItems: "center" }}>Showing {offset + 1} to {Math.min(offset + limit, paginatedDatasets.length)} of {paginatedDatasets.length} Entries</p>
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
                    <button key={idx} className="btn btn-outline-secondary">…</button>
                  )
                ))}
              <button className="btn btn-outline-secondary" onClick={() => handlePageChange("next")}>Next</button>
            </div>
          </div>
        </div>}
      </div>
      {/* datasets filter modal */}
      {showDatasetFilter &&
        <ModalComponent size={'lg'} modalHeader="Dataset Filters" show={showDatasetFilter} onHandleCancel={datasetFilterClose}>
          <DataTableComponent showFooter={false} data={DatasetFilterData} columns={datasetFilterColumns} />
          <div className="d-flex justify-content-end">
            <Button variant='secondary' className='ripple-effect' onClick={datasetFilterClose}>Cancel</Button>
          </div>
        </ModalComponent>
      }
      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Your file has been deleted."
      />
    </>
  );
}

export default ManageDataset