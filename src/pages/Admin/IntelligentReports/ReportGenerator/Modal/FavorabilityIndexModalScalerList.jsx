import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { InputField } from "../../../../../components";
import { Link } from "react-router-dom";

export default function FavorabilityIndexModalScalerList({ NewTheme, setNewTheme }) {

    // Initialize with 1 default row if empty
    useEffect(() => {
        if (!NewTheme || NewTheme?.length === 0) {
            setNewTheme([
                { favorName: "", color: "#0968AC", isFavorable: true },
            ]);
        }
    }, []);

    

    

    // Handle value change for a particular field
    const handleFieldChange = (index, field, value) => {
        const updated = [...NewTheme];
        updated[index][field] = value;
        setNewTheme(updated);
    };

    // Add new row
    const addNewScalarList = () => {
        setNewTheme([
            ...NewTheme,
            { favorName: "", color: "#0968AC", isFavorable: false },
        ]);
    };

    // Delete row
    const deleteNewScalarList = (index) => {
        const updated = [...NewTheme];
        updated.splice(index, 1);
        setNewTheme(updated);
    };

    return (
        <div className="scalarSec scalarappend favorabilityModal mb-2">
            <div className="d-flex  gap-2 mb-0  ">
                <div className="maximum title" style={{ width:'5rem'}}>S.No.</div>
                <div className="scalar title " style={{width:'59%'}}>Name</div>
                <div className=" title " style={{marginRight:'0.5rem'}}>Color</div>
                <div className="title " style={{marginRight:'0.8rem'}}>Favorable</div>
                <div className="title ">Action</div>
            </div>

            {NewTheme?.map((item, index) => (
                <div key={index} className="scalarappend_list d-flex  gap-2 align-items-center">
                    <Form.Group style={{width:'4rem', }} className="form-group maximum">
                        <InputField type="text" className="text-center" value={index + 1} readOnly />
                    </Form.Group>

                    <Form.Group className="form-group " style={{width:'60%'}}>
                        <InputField
                            type="text"
                            value={item.favorName}
                            onChange={(e) => handleFieldChange(index, "favorName", e.target.value)}
                            placeholder="Enter Name"
                        />
                    </Form.Group>

                    <div className="color" style={{marginRight:'1.2rem'}}>
                        <InputField
                            type="color"
                            className="form-control-color"
                            value={item.color}
                            onChange={(e) => handleFieldChange(index, "color", e.target.value)}
                            title="Choose a color"
                        />
                    </div>
                    <div style={{display:'flex', marginRight:'1.2rem'  }}>
                        <Form.Check className='mb-2' id='check003' type="checkbox" checked={item?.isFavorable}
                        onChange={(e) => handleFieldChange(index, "isFavorable", !item?.isFavorable)}
                            label={<div htmlFor="check003" className="primary-color"></div>} />
                    </div>

                    <div className="addeletebtn d-flex gap-2">
                        {index === 0 ? (
                            <Link href="#" className="addbtn addscaler" onClick={(e) => {
                                e.preventDefault();  // 🛑 Stop navigation
                                addNewScalarList();
                              }}>
                                <span>+</span>
                            </Link>
                        ) : (
                            <Link href="#" className="deletebtn deletebtnscaler" 
                            onClick={(e) => {
                                e.preventDefault();  // 🛑 Stop navigation
                                deleteNewScalarList(index);
                              }}>
                                <em className="icon-delete"></em>
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
