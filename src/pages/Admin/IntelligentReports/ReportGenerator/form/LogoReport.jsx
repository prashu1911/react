import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useAuth } from 'customHooks';
import { API_ENDPOINT_V1 } from 'config';
import { Button, InputField } from '../../../../../components';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { showErrorToast } from 'helpers/toastHelper';


export default function LogoReport({updateSingleSection,  SectionId, SectionData, TemplateFlag, loading, setloading }) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const fileInputRef = useRef(null);


  const [formData, setFormData] = useState({
    title: SectionData?.attributeData?.controlData?.title,
    subTitle: SectionData?.attributeData?.controlData?.subTitle,
    logoFile: null,
  });

  const dispatch= useDispatch()

  const [isChanged, setisChanged] = useState(false)

  const ChangesTrue=()=>{
      if (!isChanged) {
          setisChanged(true)            
          dispatch(updateIRReportData({
              unsavedChanges:true,
              widgetTitle: SectionData?.attributeData?.controlData?.title
            }))
      }
  }

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      title: SectionData?.attributeData?.controlData?.title,
      subTitle: SectionData?.attributeData?.controlData?.subTitle,
      sectionID: SectionId,
    }));
  }, [SectionData]);

  const handleInputChange = (e) => {
    ChangesTrue()
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    ChangesTrue();
    const file = e.target.files[0];
    if (!file) return;
  
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
      if (!allowedTypes.includes(file.type)) {
        showErrorToast('Invalid file type. Please upload a JPG, JPEG, or PNG image.');
        
        
        // ❌ Clear the input field manually
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      
      setFormData({
        ...formData,
        logoFile: file,
      });
    };
    
    
    const handleSubmit = async () => {



      if (!formData?.title) {
        showErrorToast("Enter Title to save")
        return;        
      }


      const uploadData = new FormData();
      uploadData.append("title", formData.title || "");
      uploadData.append("subTitle", formData.subTitle || "");
      uploadData.append("sectionID", formData.sectionID);
      if (formData?.logoFile) {
        uploadData.append("logoFile", formData.logoFile || "");        
      }
      uploadData.append("templateFlag", TemplateFlag.toString()); // MUST be string
      
      
      try {
        setloading(true)
        const response = await fetch(`${API_ENDPOINT_V1}IRReport/widgets`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData?.apiToken}`,
          },
          body: uploadData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          dispatch(updateIRReportData({
            unsavedChanges: false,
            widgetTitle: null
          }))
          updateSingleSection(SectionId)
          setloading(false)
        } else {
          console.error("Upload failed:", data);
          setloading(false)
        }
      } catch (error) {
      setloading(false)
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="mt-xl-4 mt-3">
      <Form.Group className="form-group">
        <Form.Label>Title</Form.Label>
        <InputField
          type="text"
          name="title"
          placeholder="Enter Title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>Subtitle</Form.Label>
        <InputField
          type="text"
          name="subTitle"
          placeholder="Enter subTitle"
          value={formData.subTitle}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>Logo</Form.Label>
        <InputField
          type="file"
          className="uploadBtn"
          placeholder="Select Logo"
          innerRef={fileInputRef}
          onChange={handleFileChange}
        />
      </Form.Group>

      <Button variant="primary ripple-effect w-100" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}
