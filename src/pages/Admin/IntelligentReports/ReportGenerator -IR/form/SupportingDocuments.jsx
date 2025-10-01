import React, { useState } from 'react';
import {Button, InputField } from '../../../../../components';
import { Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export default function SupportingDocuments() {
    //after cosing file created file card for each
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Handle file input change
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files); // Get all selected files
        setSelectedFiles([...selectedFiles, ...newFiles]); // Add new files to the list
    };

    // Remove a file from the list
    const handleRemoveFile = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };
    return (
        <div className="mt-xl-4 mt-3">
            <Form.Group className="form-group" >
                <InputField type={"file"} className="uploadBtn" placeholder={"Enter Subtitle"} 
                onChange={handleFileChange} 
                multiple 
                accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
            </Form.Group>
            {selectedFiles.length > 0 && (
                <div className="selected-files mt-3">
                    {selectedFiles.map((file, index) => (
                        <Card key={index} className="mb-2">
                            <Card.Body className="d-flex justify-content-between gap-2">
                                <div className='oveflowText'>
                                    <p className='text-truncate mb-0'>{file.name}</p>
                                    <small>{(file.size / 1024).toFixed(2)} KB</small>
                                </div>
                                <Link  onClick={() => handleRemoveFile(index)} className='removeFile'>
                                    <em className="icon-close-circle"></em>
                                </Link>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
