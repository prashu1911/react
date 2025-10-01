import React, { useEffect, useState } from "react";
import { Button, Col, Form, Nav, Tab } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import SurveyStstus from "./Chart/SurveyStstus";
import CompanyDetails from "./Chart/CompanyDetails";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import All from './All';
import Open from './Open';
import Scheduled from './Scheduled';
import Pause from './Pause';
import Closed from './Closed';
import { InputField, SelectField } from "components";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import ExportExcel from "components/Excel";
import { decodeHtmlEntities } from "utils/common.util";

const SurveysOverview = React.memo(({ }) => {
    const { getloginUserData } = useAuth();
    const userData = getloginUserData();


    const [SurveyOverviewData, setSurveyOverviewData] = useState()
    const [selectedRange, setSelectedRange] = useState([]);
    const [formattedRange, setFormattedRange] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // state for active tab
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [pageSize, setPageSize] = useState(10);         // Entries per page
    const [currentPage, setCurrentPage] = useState(1);    // Current page number
    const [totalEntries, setTotalEntries] = useState(0);  // Total entries from API
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [flatpickrKey, setFlatpickrKey] = useState(0);

    const companyOptions = [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '30', label: '30' }
    ]

    const handleDateChange = (dates) => {
        setSelectedRange(dates);
        const formatted = dates.map(date =>
            date ? date.toISOString().split("T")[0] : null
        );
        setFormattedRange(formatted)
    };

    const resetFilters = () => {
        setSearchQuery("");
        handleDateChange([]);
        setFlatpickrKey(prev => prev + 1); // force Flatpickr to remount
    };



    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // 500ms debounce

        return () => clearTimeout(handler);
    }, [searchQuery]);


    useEffect(() => {
        fetchSurveyOverview();
    }, [debouncedQuery, formattedRange, activeTab, pageSize, currentPage]);

    const sortTable = async (column, dir) => {
        setCurrentPage(1)
        fetchSurveyOverview(column, dir);

    }


    const fetchSurveyOverview = async (column = 0, dir = "asc") => {
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.getSurveyOverview,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                bodyData: {
                    roleID: userData?.roleID,
                    companyID: userData?.companyID,
                    companyMasterID: userData?.companyMasterID,
                    searchStartDate: formattedRange[0] || "",
                    searchEndDate: formattedRange[1] || "",
                    status: activeTab,
                    draw: currentPage,
                    start: (currentPage - 1) * pageSize,
                    length: pageSize,
                    search: { value: debouncedQuery, regex: false },
                    order: [{ column: Number(column), dir: dir }],
                },
            });

            if (response?.status) {
                setSurveyOverviewData(response.data.data);
                setTotalEntries(response.data.data.recordsFiltered || 0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchAllSurveyOverview = async (column = 0, dir = "asc") => {
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.getSurveyOverview,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                bodyData: {
                    roleID: userData?.roleID,
                    companyID: userData?.companyID,
                    companyMasterID: userData?.companyMasterID,
                    searchStartDate: formattedRange[0] || "",
                    searchEndDate: formattedRange[1] || "",
                    status: activeTab,
                    draw: 1,
                    start: 0,
                    length: totalEntries,
                    search: { value: debouncedQuery, regex: false },
                    order: [{ column: Number(column), dir: dir }],
                },
            });

            if (response?.status) {
                return(response.data.data?.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    
    const columns = [
        {
            title: '#', dataKey: 'id',
            render: (value, index, rowIndex) => {
                return <p style={{ width: "1.8rem", padding: 0, margin: 0 }}>{((currentPage - 1) * pageSize)+rowIndex+1}</p>;
            }
        },
        { title: 'Surveys', dataKey: 'assessment_name', displayName: 'Surveys', id: 'assessment_name', sortable: true },
        { title: 'Participants', dataKey: 'participants', displayName: 'Participants', id: 'participants', sortable: true },
        { title: 'Start', dataKey: 'start_date', displayName: 'Start', id: 'start_date', sortable: true },
        { title: 'Stop', dataKey: 'end_date', displayName: 'Stop', id: 'end_date', sortable: true },
        {
            title: 'Completed', dataKey: 'completed', sortable: true,
            render: (value) => {
                return (
                    <div dangerouslySetInnerHTML={{ __html: `<p><span class="me-3 pe-3">${value?.completed}</span> ${value?.completed_percentage}</p>` }} />
                )
            }
        },
        {
            title: 'Not Started', dataKey: 'not_started', sortable: true,
            render: (value) => {
                return (
                    <div dangerouslySetInnerHTML={{ __html: `<p><span class="me-3 pe-3">${value?.not_started}</span> ${value?.not_started_percentage}</p>` }} />
                )
            }
        },
        {
            title: 'In Progress', dataKey: 'in_progress', sortable: true,
            render: (value) => {
                return (
                    <div dangerouslySetInnerHTML={{ __html: `<p><span class="me-3 pe-3">${value?.in_progress}</span> ${value?.in_progress_percentage}</p>` }} />
                )
            }
        },
    ];
    const excelColumns = [
        {displayName:"S.No", id:"s_no"},
        { title: 'Surveys', dataKey: 'assessment_name', displayName: 'Surveys', id: 'assessment_name', sortable: true },
        { title: 'Participants', dataKey: 'participants', displayName: 'Participants', id: 'participants', sortable: true },
        { title: 'Start', dataKey: 'start_date', displayName: 'Start', id: 'start_date', sortable: true },
        { title: 'Stop', dataKey: 'end_date', displayName: 'Stop', id: 'end_date', sortable: true },
        {
            title: 'Completed', dataKey: 'completed', sortable: true, displayName: 'Completed', id: 'completed',
        },
        {
            title: 'Completed Percentage', dataKey: 'completed', sortable: true, displayName: 'Completed Percentage', id: 'completed_percentage',
        },
        {
            title: 'Not Started', dataKey: 'not_started', sortable: true, displayName: 'Not Started', id: 'not_started',
        },
        {
            title: 'Not Started', dataKey: 'not_started', sortable: true, displayName: 'Not Started Percentage', id: 'not_started_percentage',
        },
        {
            title: 'In Progress', dataKey: 'in_progress', sortable: true, displayName: 'In Progress', id: 'in_progress',
        },
        {
            title: 'In Progress', dataKey: 'in_progress', sortable: true, displayName: 'In Progress Percentage', id: 'in_progress_percentage',
        },
    ];

    

    return (
        <div className="cardBox bg-white mt-3">
            <div className="d-flex align-item-center justify-content-between pageTitle mb-4">
                <h2 className="mb-0">Surveys Overview</h2>
            </div>
            <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={(k) => { setCurrentPage(1); setActiveTab(k); }}>
                <div className="filter mb-3 d-flex justify-content-between align-items-center flex-wrap">
                    <Nav variant="pills" className="commonTab">
                        <Nav.Item>
                            <Nav.Link eventKey="all">All</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="open">Open</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="scheduled">Scheduled</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="pause">Pause</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="closed">Closed</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <ul className="list-inline filter_action mb-0 d-flex align-items-center gap-2">
                        <li className="list-inline-item m-0">
                            <div className="searchBar m-0">
                                <InputField
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </li>
                        <li className="list-inline-item m-0">
                            <div className="flatpickr form-group mb-0">
                                <div className="flatpickr_wrap">
                                    <Flatpickr
                                        key={flatpickrKey}
                                        className="form-control date-range bg-gray"
                                        placeholder="Pick Date Range"
                                        options={{
                                            mode: "range",
                                            dateFormat: "m.d.Y",
                                            disableMobile: "true",
                                        }}
                                        value={selectedRange}
                                        onChange={handleDateChange}
                                    />
                                    <em className="icon-calendar rightIcon" />
                                </div>
                            </div>
                        </li>
                        <li className="list-inline-item m-0">
                            <ExportExcel
                                filename={`Survey_overview_List_${activeTab}`}
                                columns={excelColumns}
                                data={async () => {
                                    const allData = await fetchAllSurveyOverview();
                                    const dataWithSerialNo = await allData.map((item, index) => ({
                                        s_no: index + 1,
                                        ...item
                                      }));
                                    return dataWithSerialNo;
                                }}
                                text={<em className="icon-download" />}
                            />
                            {/* <Link href="#!" className=" btn-icon ripple-effect">
                                <em className="icon-arrows-move" />
                            </Link> */}
                        </li>
                        <li className="list-inline-item m-0"><Link onClick={resetFilters} href="#!" className=" btn-icon ripple-effect"><em className="bi-arrow-counterclockwise bold-icon" /> </Link></li>
                    </ul>
                </div>
                <Tab.Content>
                    <Tab.Pane eventKey="all"><All columns={columns} offset={(currentPage - 1) * pageSize} sortConfig={sortConfig} setSortConfig={setSortConfig} sortTable={sortTable} data={SurveyOverviewData?.data} /></Tab.Pane>
                    <Tab.Pane eventKey="open"><All columns={columns} offset={(currentPage - 1) * pageSize} sortConfig={sortConfig} setSortConfig={setSortConfig} sortTable={sortTable} data={SurveyOverviewData?.data} /></Tab.Pane>
                    <Tab.Pane eventKey="scheduled"><All columns={columns} offset={(currentPage - 1) * pageSize} sortConfig={sortConfig} setSortConfig={setSortConfig} sortTable={sortTable} data={SurveyOverviewData?.data} /></Tab.Pane>
                    <Tab.Pane eventKey="pause"><All columns={columns} offset={(currentPage - 1) * pageSize} sortConfig={sortConfig} setSortConfig={setSortConfig} sortTable={sortTable} data={SurveyOverviewData?.data} /></Tab.Pane>
                    <Tab.Pane eventKey="closed"><All columns={columns} offset={(currentPage - 1) * pageSize} sortConfig={sortConfig} setSortConfig={setSortConfig} sortTable={sortTable} data={SurveyOverviewData?.data} /></Tab.Pane>
                </Tab.Content>
            </Tab.Container>
            {SurveyOverviewData?.data?.length > 0 && (
                <div className="commonFilter_sort d-flex align-items-center justify-content-sm-between justify-content-center mt-4">
                    <div className="commonFilter_sort_search d-flex align-items-center">
                        <p style={{ margin: 0, display: "flex", alignItems: "center" }}>Entries Per Page</p>
                        <SelectField
                            className="mx-2"
                            value={companyOptions.find((opt) => opt.value === String(pageSize))}
                            onChange={(e) => {
                                setPageSize(Number(e.value));
                                setCurrentPage(1);
                            }}
                            options={companyOptions}
                        />
                        <p style={{ margin: 0, display: "flex", alignItems: "center" }}>
                            Showing {(currentPage - 1) * pageSize + 1} to{" "}
                            {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} Entries
                        </p>
                    </div>
                    <div className="commonFilter_sort_pagination d-flex align-items-center">
                        <div className="btn-group">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {(() => {
                                const totalPages = Math.ceil(totalEntries / pageSize);
                                const buttons = [];
                                if (totalPages <= 3) {
                                    for (let i = 1; i <= totalPages; i++) buttons.push(i);
                                } else {
                                    if (currentPage <= 2) {
                                        buttons.push(1, 2, "...", totalPages);
                                    } else if (currentPage >= totalPages - 1) {
                                        buttons.push(1, "...", totalPages - 1, totalPages);
                                    } else {
                                        buttons.push(1, "...", currentPage, "...", totalPages);
                                    }
                                }
                                return buttons.map((page, idx) =>
                                    typeof page === "number" ? (
                                        <button
                                            key={idx}
                                            className={`btn btn-outline-secondary ${currentPage === page ? "active" : ""}`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ) : (
                                        <button key={idx} className="btn btn-outline-secondary disabled">
                                            …
                                        </button>
                                    )
                                );
                            })()}
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalEntries / pageSize)))
                                }
                                disabled={currentPage >= Math.ceil(totalEntries / pageSize)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}




        </div>
    );
});

export default SurveysOverview;
