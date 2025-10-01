import React, { useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import {  Button, ModalComponent, TextEditor } from '../../../../../components';

export default function InformationGraphicBlock({updateSection, SectionId, SectionData, }) {

    const [showInfoGraphic, setShowInfoGraphic] = useState(true);
    const infoGraphicClose = () => setShowInfoGraphic(false);
    const infoGraphicShow = () => setShowInfoGraphic(true);
    const [htmlData, sethtmlData] = useState()

    // Decode only once
    const decodedHtml = (data) => {
      const firstPass = decodeHtmlEntities(data);
      return firstPass.replace(/\\"/g, '"').replace(/\\\//g, '/'); // fix extra escaping
    };


    useEffect(() => {
        if (SectionData?.attributeData?.widgetData?.htmlData) {
            sethtmlData(decodedHtml(SectionData?.attributeData?.widgetData?.htmlData))
        }
    }, [SectionData]); // ✅ Runs only when `SectionData` changes

    
    
    // Function to clean up escaped characters
function decodeHtmlEntities(str) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  }
  
      
    


    const handleSubmit = async () => {
        try {
          await updateSection({
            htmlData,
            sectionID: SectionId
          }) // ✅ Send all updated values
        } catch (error) {
            console.error("Error updating data:", error);s
            alert("Update failed!");
        }
        infoGraphicClose()
      };
    return (
        <>
        <div className="mt-xl-4 mt-3">
            <Button variant="primary ripple-effect w-100" onClick={infoGraphicShow}>Information & Graphic Block</Button>
        </div>
        <ModalComponent  modalHeader="Information & Graphic Block" size='xl'  show={showInfoGraphic} onHandleCancel={infoGraphicClose}>
            <Form style={{ height: '65vh' }}>
                <TextEditor extraToolbar={["fontSize", "fontColor", "fontBackgroundColor", "alignment", "lineHeight"]}  value={htmlData} onChange={sethtmlData}/>
            </Form>
            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button onClick={handleSubmit} variant='primary' className='ripple-effect'>Save</Button>
            </div>
        </ModalComponent>
        </>
    )
}
