import React, { useEffect, useRef, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { commonService } from 'services/common.service';
import { useAuth } from 'customHooks';
import { ADMIN_MANAGEMENT } from 'apiEndpoints/AdminManagement/adminManagement';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, InputField, SweetAlert } from '../../../../../components';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { showErrorToast } from 'helpers/toastHelper';


export default function SupportingDocuments({ updateSingleSection, updateSection, SectionId, SectionData, TemplateFlag }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [Title, setTitle] = useState("");
    const [SubTitle, setSubTitle] = useState("");
    const [ShowDeleteAlert, setShowDeleteAlert] = useState(false)
    const [files, setFiles] = useState();
    const [newOrder, setnewOrder] = useState([])
    const [SelectDeleteFile, setSelectDeleteFile] = useState({
        fileName: null,
        index: null
    })
    const dispatch = useDispatch()
    const fileInputRef = useRef(null);


    const [isChanged, setisChanged] = useState(false)

    const ChangesTrue = () => {
        if (!isChanged) {
            setisChanged(true)
            dispatch(updateIRReportData({
                unsavedChanges: true,
                widgetTitle: SectionData?.attributeData?.controlData?.title
            }))
        }
    }

    useEffect(() => {
        setSubTitle(SectionData?.attributeData?.controlData?.subTitle)
        setTitle(SectionData?.attributeData?.controlData?.title)
    }, [SectionData])


    const { getloginUserData } = useAuth();
    const userData = getloginUserData();

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // only first file
        if (file) {
          setSelectedFiles([file]); // overwrite existing selection
        }
      };

    const handleRemoveFile = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };

    const handleSubmit = async () => {
        if (!Title.trim()) {
            showErrorToast("Please enter a title");
            return;
        }

        const formData = new FormData();
        formData.append("sectionID", SectionId);
        formData.append("templateFlag", TemplateFlag);
        formData.append("title", Title);
        formData.append("subTitle", SubTitle);

        // Append all selected documents
        selectedFiles.forEach(file => {
            formData.append("document", file); // Assuming backend expects "document" field
        });




        try {
            const response = await fetch(ADMIN_MANAGEMENT.updateSection.url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                updateSection({
                    sectionID: SectionId,
                    documentOrder: newOrder
                })
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                setSelectedFiles([])

            } else {
                console.error("Upload failed:", data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Something went wrong during upload");
        }

    };

    const deleteDocument = async () => {
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.deleteDocument(SectionId, SelectDeleteFile.index, TemplateFlag),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                toastType: {
                    success: "Report Created Successfully",
                    error: "Failed to Create Report",
                },
            });
            if (response?.status) {
                updateSingleSection(SectionId)
                return true
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        }
    };




    useEffect(() => {
        const updatedFiles = SectionData?.attributeData?.controlData?.files?.map((file, index) => ({
            ...file,
            id: index
        }));

        setFiles(updatedFiles)
        const newOrderOfIds = updatedFiles?.map(item => item.id);
        setnewOrder(newOrderOfIds)

    }, [SectionData])


    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reordered = Array.from(files);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        setFiles(reordered);

        // ✅ Output updated ID array instead of index
        const newOrderOfIds = reordered.map(item => item.id);
        setnewOrder(newOrderOfIds)
    };


    function formatFileSize(bytes) {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`; // less than 1MB
        } else {
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }
    }



    return (
        <div className="mt-xl-4 mt-3">

            <Form.Group className="form-group">
                <Form.Label>Title</Form.Label>
                <InputField
                    type="text"
                    placeholder="Enter Title"
                    value={Title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="form-group">
                <Form.Label>Subtitle</Form.Label>
                <InputField
                    type="text"
                    placeholder="Enter Subtitle"
                    value={SubTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="form-group">
                <Form.Label>Select Documents</Form.Label>
                <Form.Control
                    type="file"
                    className="uploadBtn"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
            </Form.Group>

            {selectedFiles.length > 0 && (
                <div className="selected-files mt-3">
                    {selectedFiles.map((file, index) => (
                        <Card key={index} className="mb-2">
                            <Card.Body className="d-flex justify-content-between gap-2">
                                <div className="oveflowText">
                                    <p className="text-truncate mb-0">{file.name}</p>
                                    <small>{(file.size / 1024).toFixed(2)} KB</small>
                                </div>
                                <Link onClick={(e) => { e.preventDefault(); handleRemoveFile(index) }} className="removeFile" to="#">
                                    <em className="icon-close-circle" />
                                </Link>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            <div>
                <Form.Label>Drag & drop to reorder files</Form.Label>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="fileList">
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ listStyle: "none", padding: 0 }}
                            >
                                {files?.map((file, index) => (
                                    <Draggable key={file.file_name} draggableId={file.file_name} index={index}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    padding: "8px 12px",
                                                    marginBottom: "8px",
                                                    background: "#f1f1f1",
                                                    borderRadius: "4px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexDirection: 'column',
                                                    paddingRight: "0.5rem"
                                                }}
                                            >
                                                <Link style={{ marginLeft: 'auto', marginBottom: '-0.5rem' }} onClick={(e) => {
                                                    e.preventDefault();

                                                    const indexValue = SectionData?.attributeData?.controlData?.files.findIndex(item => item.name === file.name);
                                                    setSelectDeleteFile({
                                                        index: indexValue,
                                                        fileName: file.name
                                                    })
                                                    setShowDeleteAlert(true)
                                                }} className="removeFile" to="#">
                                                    <em className="icon-close-circle" />
                                                </Link>
                                                <span>{file.name}</span>
                                                <span style={{ display: 'flex', marginLeft: 'auto' }}>{formatFileSize(file.size)}</span>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <Button variant="primary ripple-effect w-100" onClick={handleSubmit}>
                Save
            </Button>

            <SweetAlert
                title="Are you sure?"
                text={`You want to delete ${SelectDeleteFile.fileName}`}
                show={ShowDeleteAlert}
                icon="warning"
                onConfirmAlert={deleteDocument}
                showCancelButton
                cancelButtonText="Cancel"
                confirmButtonText="Yes"
                setIsAlertVisible={setShowDeleteAlert}
                isConfirmedTitle="Deleted!"
                isConfirmedText="Admin has been deleted."
            />
        </div>
    );
}
