import React, { useEffect, useState } from 'react';
import { Button, DataTableComponent, SweetAlert, InputField, ModalComponent, SelectField } from '../../../../../components';
import { Collapse, Form, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { useAuth } from 'customHooks';
import { commonService } from 'services/common.service';
import { showErrorToast, showSuccessToast } from 'helpers/toastHelper';
import FavorabilityIndexModalScalerList from './FavorabilityIndexModalScalerList';
import { Link } from 'react-router-dom';
import { ADMIN_MANAGEMENT } from 'apiEndpoints/AdminManagement/adminManagement';
import Loader from '../../../../../components/Loader';

export default function ConfigureFavorability({ TemplateFlag, assessmentID, companyID, reportID, ConfigurationModalClose }) {

    const { getloginUserData } = useAuth();
    const userData = getloginUserData();

    const [ThemeList, setThemeList] = useState([])
    const [SelectedTheme, setSelected_Theme] = useState(null)
    const [ResponseType, setResponseType] = useState([])
    const [FavorList, setFavorList] = useState([])
    const [EditThemeFavourList, setEditThemeFavourList] = useState([])
    const [NewTheme, setNewTheme] = useState([])
    const [EditTheme, setEditTheme] = useState([])
    const [EditThemeName, setEditThemeName] = useState([])
    const [NewThemeName, setNewThemeName] = useState("")
    const [deleteThemeid, setdeleteThemeid] = useState()
    const [openRow, setOpenRow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);




    useEffect(() => {
        fetchThemes()
        fetchResponseType()

    }, [])


    useEffect(() => {
        if (SelectedTheme?.value) {
            getTheme(SelectedTheme.value, setFavorList, false)
            setEditThemeName(SelectedTheme?.label)
            setEditTheme(SelectedTheme)
        }
    }, [SelectedTheme])
    useEffect(() => {
        if (EditTheme?.value) {
            getTheme(EditTheme.value, setEditThemeFavourList, true)
            setEditThemeName(EditTheme?.label)
        }
    }, [EditTheme])
    useEffect(() => {
        if (ResponseType?.length>0 && ThemeList?.length>0) {
            console.log("ResponseType[0]?.responses[ 0]?.themeId", ResponseType[0]?.responses[0]?.themeId, ThemeList);
            if (ThemeList?.some(theme => theme.value == ResponseType[0]?.responses[0]?.themeId)) {
                setSelected_Theme({
                    label: ThemeList.find(theme => theme.value == ResponseType[0]?.responses[0]?.themeId).label,
                    value: ResponseType[0]?.responses[0]?.themeId
                });                
                
            }
        }
    }, [ResponseType, ThemeList])





    const fetchThemes = async () => {
        setIsLoading(true);
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.getFavorableTheme(userData?.companyMasterID, companyID, assessmentID),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                const themeData = response.data?.data || [];
                let defaultThemeItem = themeData.find(item => item.defaultTheme === true);

                // If no default theme is found, fallback to the first item
                if (!defaultThemeItem && themeData.length > 0) {
                    defaultThemeItem = themeData[0];
                }

                // if (defaultThemeItem) {
                //     setSelected_Theme({
                //         label: defaultThemeItem.themeName,
                //         value: defaultThemeItem.themeID
                //     });
                // }

                setThemeList(response.data.data.map(theme => ({
                    value: theme.themeID,
                    label: theme.themeName,  // Fix typo: comapnyName → companyName
                    defaultTheme: theme?.defaultTheme
                })));
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const fetchResponseType = async () => {
        setIsLoading(true);
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.getResponseType,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                bodyData: {
                    "assessmentID": assessmentID,
                    "companyMasterID": userData.companyMasterID,
                    "companyID": companyID, // userData.companyID,
                    // "reportID": reportID,
                    // "sectionID": SectionId,
                    // "level": "report_section_level"

                    ...(!TemplateFlag ? { reportID: reportID } : { "templateID": reportID, }),
                    "level": TemplateFlag ? "template_level" : "report_level"
                }
            });
            if (response?.status) {
                setResponseType(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const addTheme = async (data) => {
        setIsLoading(true);
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.addTheme,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                bodyData: data
            });
            if (response?.status) {
                fetchThemes()
                favorabilityIndexNewClose()
                showSuccessToast('Theme Added successfully')
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const editTheme = async () => {

        if (!EditThemeName.trim()) {
            showErrorToast("Theme name cannot be empty.");
            return;
        }

        const hasEmptyFavorName = EditThemeFavourList.some(item => !item.favorName.trim());
        if (hasEmptyFavorName) {
            showErrorToast("Each Favor Name must be filled.");
            return;
        }



        const hasAtLeastOneFavorable = EditThemeFavourList.some(item => item.isFavorable === true || item.isFavorable === 1);
        if (!hasAtLeastOneFavorable) {
            showErrorToast("At least one favor must be marked as favorable.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.editTheme,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                bodyData: {
                    "themeID": EditTheme.value,
                    "assessmentID": assessmentID,
                    "companyMasterID": userData.companyMasterID,
                    "companyID": companyID,
                    "themeName": EditThemeName,
                    "favorData": EditThemeFavourList
                }
            });
            if (response?.status) {
                favorabilityIndexEditClose()
                fetchThemes()
                showSuccessToast("Theme Edited Successfully")
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTheme = async (themeId) => {

        if (hasDefaultTheme(themeId)) {
            showErrorToast("Default Theme cannot be deleted")
            return false
        }
        setIsLoading(true);
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.deleteTheme(themeId),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                favorabilityIndexEditClose()
                fetchThemes()
                return true
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isValidFavorIds = (responseType, favorList) => {
        const validFavorIds = favorList.map(item => String(item.value));
        console.log(validFavorIds);

        return responseType.every(rt =>
            rt.responses.every(response => validFavorIds.includes(String(response.favorId)))
        );
    };

    const failedResponseTypes = ResponseType.filter(rt =>
        rt.responses.some(response => !FavorList.map(f => String(f.value)).includes(response.favorId))
    );

    const updateResponseType = async () => {

        if (!isValidFavorIds(ResponseType, FavorList)) {

            showErrorToast("Favour need to select for all Response type")
            console.log(failedResponseTypes);
            return;
        }

        setIsLoading(true);
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.updateResponseType,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                bodyData: {
                    responseTypes: ResponseType,
                    "level": TemplateFlag ? "template_level" : "report_level",
                    primaryID: reportID
                }
            });
            if (response?.status) {
                showSuccessToast("Response Type updated successfully")
                fetchResponseType()
                ConfigurationModalClose()
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const getTheme = async (themeId, setFunction, isEdit) => {
        setIsLoading(true);
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.getTheme(themeId),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                if (isEdit) {
                    setFunction(response.data.data?.favorData);

                } else {
                    setFunction(response.data.data?.favorData.map(theme => ({
                        value: theme.favorID,
                        label: theme.favorName,  // Fix typo: comapnyName → companyName
                        color: theme?.color
                    })));

                }

            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    function hasDefaultTheme(targetValue) {
        
        return ThemeList.some(option => option.value == targetValue && option.defaultTheme === true);
    }

    const handleAddNewTheme = () => {
        if (!NewThemeName.trim()) {
            showErrorToast("Theme name cannot be empty.");
            return;
        }

        const hasEmptyFavorName = NewTheme.some(item => !item.favorName.trim());
        if (hasEmptyFavorName) {
            showErrorToast("Each Favor Name must be filled.");
            return;
        }

        const hasAtLeastOneFavorable = NewTheme.some(item => item.isFavorable === true || item.isFavorable === 1);
        if (!hasAtLeastOneFavorable) {
            showErrorToast("At least one favor must be marked as favorable.");
            return;
        }

        // ✅ All checks passed
        addTheme({
            "assessmentID": assessmentID,
            "companyMasterID": userData.companyMasterID,
            "companyID": companyID,
            "themeName": NewThemeName,
            "favorData": NewTheme
        });
    };


    const handleFavorChange = (responseTypeIndex, index, selectedOption) => {
        const updated = [...ResponseType];
        updated[responseTypeIndex].responses[index].favorId = selectedOption;
        setResponseType(updated);
    };

    const handleIncludeChange = (responseTypeIndex, index, checked) => {
        const updated = [...ResponseType];
        updated[responseTypeIndex].responses[index].includeStatus = checked;
        setResponseType(updated);
    };
    const handleThemeInput = (data) => {
        updateAllThemeIds(data?.value)
        setSelected_Theme(data)
    };

    const updateAllThemeIds = (newThemeId) => {
        const updatedList = ResponseType.map(responseType => ({
            ...responseType,
            responses: responseType.responses.map(response => ({
                ...response,
                themeId: newThemeId.toString(),  // Ensure it's a string if your data uses strings
                includeStatus:true
            }))
        }));

        setResponseType(updatedList)
    };




    //favorability index settings modal
    //favorability index New modal
    const [showFavorabilityIndexNew, setShowFavorabilityIndexNew] = useState(false);
    const favorabilityIndexNewClose = () => {
        setShowFavorabilityIndexNew(false);
    }
    const favorabilityIndexNewShow = () => {
        setShowFavorabilityIndexNew(true);
    }
    //favorability index Edit modal
    const [showFavorabilityIndexEdit, setShowFavorabilityIndexEdit] = useState(false);
    const favorabilityIndexEditClose = () => {
        setShowFavorabilityIndexEdit(false);
    }
    const favorabilityIndexEditShow = () => {
        setShowFavorabilityIndexEdit(true);
    }
    //delete alert modal
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const onConfirmAlertModal = () => {
        setIsAlertVisible(false);
        return deleteTheme(deleteThemeid);
    };
    const deleteModal = (id) => {
        setdeleteThemeid(id)
        setIsAlertVisible(true);
    }
    const toggleRow = (id) => {
        setOpenRow(openRow === id ? null : id);
    };



    return (
        <>
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(255,255,255,0.6)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Loader />
                </div>
            )}

            {/* favorability Index modal */}
            <div>
                {/* Top Section */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <p className="mb-0 fw-bold">Configure Theme</p>
                        <SelectField
                            value={SelectedTheme}
                            onChange={handleThemeInput}
                            placeholder="Select Theme"
                            options={ThemeList}
                            styles={{ container: (base) => ({ ...base, width: '250px' }) }} // fixed width
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <Button variant="primary" className="btn-sm ripple-effect" onClick={favorabilityIndexNewShow}>New</Button>
                        {!hasDefaultTheme(SelectedTheme?.value) &&
                            <Button variant="primary" className="btn-sm ripple-effect" onClick={favorabilityIndexEditShow}>Edit</Button>
                        }
                    </div>
                </div>

                {/* Color Configurations */}
                <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
                    <div className="fw-bold text-secondary">Color Configuration</div>
                    {FavorList.map((item, index) => (
                        <div key={index} className="d-flex align-items-center">
                            <strong>{item.label}:</strong>
                            <div
                                style={{
                                    width: '40px',
                                    height: '20px',
                                    backgroundColor: item.color,
                                    border: item.border ? '1px solid #000' : 'none',
                                    marginLeft: '8px',
                                }}
                            ></div>
                        </div>
                    ))}
                </div>

                {hasDefaultTheme(SelectedTheme?.value) &&
                    <span style={{ fontSize: '12px' }} className="noteText fw-medium"> * Default theme cannot be edit</span>
                }

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>

                    {/* Table */}
                    <table className="table table-hover shadow-sm rounded">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ResponseType?.map((row, responseTypeIndex) => (
                                <React.Fragment key={row.responseTypeId}>
                                    <tr
                                        onClick={() => toggleRow(row.responseTypeId)}
                                        style={{ cursor: "pointer", backgroundColor: openRow === row.responseTypeId ? "#f8f9fa" : "" }}
                                        className="align-middle"
                                    >
                                        {/* <td className="text-center">
                                            {openRow === row.responseTypeId ? <FaChevronDown /> : <FaChevronRight />}
                                        </td> */}
                                        <td className='w-1 pe-0'>
                                            <div
                                                className="clickIcon"
                                                style={{
                                                    display: 'inline-block',
                                                    transition: 'transform 0.3s ease',
                                                    transform: openRow === row.responseTypeId ? 'rotate(0deg)' : 'rotate(270deg)'
                                                }}
                                            >
                                                <em className="icon-drop-down" />
                                            </div>
                                        </td>
                                        <td className="fw-semibold">{row?.responseType}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" style={{ padding: 0, border: "none" }}>
                                            <Collapse in={openRow === row.responseTypeId}>
                                                <div className="p-3">
                                                    <Table bordered responsive className="align-middle mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th style={{ width: '25rem' }}>Response</th>
                                                                <th>Favor</th>
                                                                <th style={{ width: '4rem' }}>Exclude</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {row?.responses?.map((item, index) => (
                                                                <tr key={item.id}>
                                                                    <td>{item.responseName}</td>
                                                                    <td>
                                                                        <div style={{ position: 'relative', zIndex: 2000, overflow: 'visible' }}>

                                                                            <SelectField
                                                                                value={{
                                                                                    label: FavorList?.find(favor => favor.value === parseInt(item?.favorId, 10))?.label,
                                                                                    value: item?.favorId
                                                                                }}
                                                                                onChange={(data) => handleFavorChange(responseTypeIndex, index, data.value)}
                                                                                placeholder="Select Favor"
                                                                                options={FavorList}
                                                                                menuPortalTarget={document.body} // ⬅️ Moves dropdown outside modal
                                                                                menuPosition="fixed"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Form.Check
                                                                            className='me-0 form-check-sm'
                                                                            type="checkbox"
                                                                            id={`check-${item.id}`}
                                                                            checked={!item?.includeStatus}
                                                                            label={<div htmlFor="check11" className="primary-color"></div>}
                                                                            onChange={() => handleIncludeChange(responseTypeIndex, index, !item?.includeStatus)}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Collapse>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* Save & Close Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="primary" className="ripple-effect" onClick={updateResponseType}>Save</Button>
                    <Button variant="secondary" className="ripple-effect" onClick={ConfigurationModalClose}>Close</Button>
                </div>
            </div>


            {/* favorability Index New modal */}
            <ModalComponent modalHeader="Favorability Index Control Panel" size={'lg'} show={showFavorabilityIndexNew} onHandleCancel={favorabilityIndexNewClose}>
                <Form>
                    <Form.Group className="form-group" >
                        <Form.Label>Add New Theme</Form.Label>
                        <InputField value={NewThemeName} onChange={(e) => { setNewThemeName(e.target.value) }} type={"text"} placeholder={"New Theme Name"} />
                    </Form.Group>
                    <FavorabilityIndexModalScalerList NewTheme={NewTheme} setNewTheme={setNewTheme} />
                </Form>
                <div className="d-flex justify-content-end gap-2">
                    <Button onClick={handleAddNewTheme} variant='primary' className='ripple-effect' disabled={isLoading}>Save</Button>
                    <Button variant='secondary' className='ripple-effect' onClick={favorabilityIndexNewClose} disabled={isLoading}>cancel</Button>
                </div>
            </ModalComponent>
            {/* favorability Index New modal */}
            <ModalComponent modalHeader="Favorability Index Control Panel" size={'lg'} show={showFavorabilityIndexEdit} onHandleCancel={favorabilityIndexEditClose}>
                <Form>
                    <Form.Group className="form-group" >
                        <Form.Label>Select Theme</Form.Label>
                        <SelectField placeholder="Select Favor" options={ThemeList} value={EditTheme} onChange={setEditTheme} />
                    </Form.Group>
                    <div className="positiveNegative">
                        <Form.Group className="form-group border-bottom">
                            <Form.Label>Edit Theme</Form.Label>
                            <div className="scalarSec d-flex justify-content-between gap-2">
                                <InputField value={EditThemeName} onChange={(e) => { setEditThemeName(e.target.value) }} type={"text"} placeholder="" defaultValue={"Postive/Neutral/Negative"} />
                                <div className="addeletebtn w-auto">
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();  // 🛑 Stop navigation
                                            deleteModal(EditTheme.value);
                                        }} className="deletebtn" ><em className="icon-delete"></em></Link>
                                </div>
                            </div>
                        </Form.Group>
                        <FavorabilityIndexModalScalerList NewTheme={EditThemeFavourList} setNewTheme={setEditThemeFavourList} />
                    </div>
                </Form>
                <div className="d-flex justify-content-end gap-2">
                    <Button onClick={editTheme} variant='primary' className='ripple-effect' disabled={isLoading}>Save</Button>
                    <Button variant='secondary' className='ripple-effect' onClick={favorabilityIndexEditClose} disabled={isLoading}>cancel</Button>
                </div>
            </ModalComponent>

            <SweetAlert
                title="Are you sure?"
                text="You won't be able to revert this"
                show={isAlertVisible}
                icon="warning"
                onConfirmAlert={onConfirmAlertModal}
                showCancelButton
                cancelButtonText="Cancel"
                confirmButtonText="Yes"
                setIsAlertVisible={setIsAlertVisible}
                isConfirmedTitle="Deleted!"
                isConfirmedText="Deleted successfully!"
            />
        </>
    )
}
