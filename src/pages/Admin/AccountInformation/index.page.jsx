import React, { useState } from 'react';
import { Badge, Col, Form, Nav, OverlayTrigger, Row, Tab, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Breadcrumb, Button, ImageElement, InputField, ModalComponent, SelectField } from '../../../components';
import Billing from './Billing/index.page';
import Payments from './Payments/index.page';
import AddonServices from './AddonServices/index.page';

export default function AccountInformation() {
    // breadcrumb
    const breadcrumb = [
        {
          path: "#",
          name: "Account Information",
        },
    ];
     // country options
     const countryOptions = [
        { value: 'Albania', label: 'Albania' },
        { value: 'Algeria', label: 'Algeria' },
        { value: 'Andorra', label: 'Andorra' }  
    ]
    // edit company modal
    const [showEditCompany, setShowEditCompany] = useState(false);
    const editCompanyClose = () => setShowEditCompany(false);
    const editCompanyShow = () => setShowEditCompany(true);

    // add address modal
    const [showAddAddress, setShowAddAddress] = useState(false);
    const addAddressClose = () => setShowAddAddress(false);
    const addAddressShow = () => setShowAddAddress(true);

    // add card modal
    const [showAddCard, setShowAddCard] = useState(false);
    const addCardClose = () => setShowAddCard(false);
    const addCardShow = () => setShowAddCard(true);


    const [isChecked, setIsChecked] = useState(false);

    const handleSwitchChange = (event) => {
        setIsChecked(event.target.checked);
        Swal.fire({
            text: 'You are enabling auto renewal for your subscription.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText:  "Cancel",
            confirmButtonColor: "#0968AC",
            cancelButtonColor: "#F37F73",
          }).then((result) => {
            if (result.isConfirmed) {
              setIsChecked(true); 
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              setIsChecked(false); 
            }
          });
    }

    return (
        <>
            {/* head title start */}
            <section className="commonHead">
                <h1 className='commonHead_title'>Welcome Back!</h1>
                <Breadcrumb breadcrumb={breadcrumb} />
            </section>
            {/* head title end */}

            <div className='accountInformation'>
                <section className='basicInfo'>
                    <Row className='g-md-3 g-2'>
                        <Col xxl={3} md={6}>
                            <div className="basicInfo_card basicInfo_profile d-flex align-items-center">
                                <div className="basicInfo_profileImg">
                                    <ImageElement source="profile.png" alt='profile' />
                                </div>
                                <div className="basicInfo_profileCaption">
                                    <h1 className="mb-0 fw-bold">Codiant <Link onClick={editCompanyShow}><em className="icon-edit" /></Link></h1>
                                    <div className="form-group d-flex align-items-center ">
                                        <div className="switchBtn">
                                            <InputField type="checkbox" checked={isChecked} onChange={handleSwitchChange}   id="setAutomatic"  />
                                            <label htmlFor="setAutomatic" />
                                        </div>
                                        <label className="mb-0 w-auto ms-2">Auto Pay is Enable</label>
                                    </div>
                                    <p className="mb-0">The next bill of <span>$580</span> will be paid automatically on <span>31/12/2025</span></p>
                                </div>
                            </div>
                        </Col>
                        <Col xxl={3} md={6}>
                            <div className="basicInfo_card basicInfo_list">
                                <h2 className="title">Billing</h2>
                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <label>Last Billing Date :</label>
                                        <span>20/06/2024</span>
                                    </li>
                                    <li>
                                        <label>Next Billing Date :</label>
                                        <span>31/12/2025</span>
                                    </li>
                                    <li>
                                        <label>Additional Usage Amount :</label>
                                        <span>$2,550</span>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                        <Col xxl={3} md={6}>
                            <div className="basicInfo_card basicInfo_list">
                                <h2 className="title">Payments</h2>
                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <label>Last Billing Date :</label>
                                        <span>20/06/2024</span>
                                    </li>
                                    <li>
                                        <label>Next Payment Due Date :</label>
                                        <span>31/12/2025</span>
                                    </li>
                                    <li>
                                        <label>Amount Due :</label>
                                        <span className="text-danger">$00</span>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                        <Col xxl={3} md={6}>
                            <div className="basicInfo_card basicInfo_list servicesCard">
                                <h2 className="title text-white">Add-On Services</h2>
                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <label className="text-white">Last Billing Date :</label>
                                        <span className="text-white">20/06/2024</span>
                                    </li>
                                    <li>
                                        <label className="text-white">Next Payment Due Date :</label>
                                        <span className="text-white">31/12/2025</span>
                                    </li>
                                    <li>
                                        <label className="text-white">Amount Due :</label>
                                        <span className="text-white">$00</span>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="basicInfo_card">
                                <h2 className="title">Billing Address</h2>
                                <Row className='g-md-3 g-2 row-cols-md-2'>
                                    <Col >
                                        <div className="basicInfo_billing basicInfo-edit d-flex align-items-center justify-content-between">
                                            <div className="flex-grow-1">
                                                <h6 className="fw-semibold mb-0">Address 1</h6>
                                                <Badge pill bg="success" >Default</Badge>
                                            </div>
                                            <ul className="list-inline action mb-0 flex-shrink-0">
                                                <li className="list-inline-item">
                                                    <Link><em className="icon-table-edit" /></Link>
                                                </li>
                                                <li className="list-inline-item">
                                                    <Link><em className="icon-delete" /></Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col >
                                        <div className="basicInfo_billing d-flex align-items-center justify-content-between">
                                            <h6 className="fw-semibold mb-0">Billing Address</h6>
                                            <Button variant="primary" className="ripple-effect" onClick={addAddressShow}>Add New</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="basicInfo_card">
                                <h2 className="title">Billing Card</h2>
                                <Row className='g-md-3 g-2 row-cols-md-2'>
                                    <Col>
                                        <div className="basicInfo_billing basicInfo-edit d-flex align-items-center justify-content-between">
                                            <div className='cardDetail d-flex align-items-center flex-grow-1'>
                                                <ImageElement source="visa.png" className="flex-shrink-0" alt="visa" />
                                                <div className="cardDetail_caption flex-grow-1">
                                                    <h6 className='fw-semibold text-break mb-0'>Dianne Wllimson</h6>
                                                    <p className='mb-0'>Visa  **** 1565</p>
                                                    <Badge pill bg="success" >Default</Badge>
                                                </div>
                                            </div>
                                            <ul className="list-inline action mb-0 flex-shrink-0">
                                                <li className="list-inline-item">
                                                    <Link><em className="icon-table-edit" /></Link>
                                                </li>
                                                <li className="list-inline-item">
                                                    <Link><em className="icon-delete" /></Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="basicInfo_billing d-flex align-items-center justify-content-between">
                                            <h6 className="fw-semibold mb-0">Card Details</h6>
                                            <Button variant="primary" className="ripple-effect" onClick={addCardShow}>Add New</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    
                </section>
                <div className="pageContent">
                    <Tab.Container defaultActiveKey="billing">
                        <Nav variant="pills" className="commonTab">
                            <Nav.Item>
                                <Nav.Link eventKey="billing">Billing</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="payments">Payments</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="addonservices">Add-On Services</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className='mt-3'>
                            <Tab.Pane eventKey="billing"><Billing /></Tab.Pane>
                            <Tab.Pane eventKey="payments"><Payments /></Tab.Pane>
                            <Tab.Pane eventKey="addonservices"><AddonServices /></Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>

            {/* ediţ company modal */}
            <ModalComponent modalHeader="Edit Company Name" show={showEditCompany} onHandleCancel={editCompanyClose}>
                <Form>
                    <Form.Group className="form-group" >
                        <Form.Label>Company Name</Form.Label>
                        <InputField type="text" placeholder="Company Name" defaultValue="Codiant"  />
                    </Form.Group>
                    <div className="form-btn d-flex gap-2 justify-content-end">
                        <Button variant='secondary' className='ripple-effect' onClick={editCompanyClose}>Cancel</Button>
                        <Button variant='primary' className='ripple-effect'>Update Company</Button>
                    </div>
                </Form>
            </ModalComponent>

            {/* add new address  */}
            <ModalComponent modalHeader="Add New Address" modalExtraClass="addAddressModal" show={showAddAddress} onHandleCancel={addAddressClose}>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>First Name</Form.Label>
                                <InputField type="text"  placeholder="First Name"  />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Last Name</Form.Label>
                                <InputField type="text" placeholder="Last Name"  />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Street Address 1</Form.Label>
                                <InputField type="text" placeholder="Street Address 1"  />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Street Address 2</Form.Label>
                                <InputField type="text" placeholder="Street Address 2"  />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>City</Form.Label>
                                <InputField type="text" placeholder="City"  />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>State</Form.Label>
                                <InputField type="text" placeholder="State"  />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Zip Code</Form.Label>
                                <InputField type="text" placeholder="Zip Code"  />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Country</Form.Label>
                                <SelectField  placeholder="Country" options={countryOptions}  />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-sm-flex align-item-center justify-content-between">
                        <Form.Check 
                            className='form-check-sm'
                            type="checkbox"
                            id="makeDefault"
                            label="Make The Address Default"
                        />
                        <div className="form-btn pt-0 d-flex gap-2 justify-content-end">
                            <Button variant='secondary' className='ripple-effect' onClick={addAddressClose}>Cancel</Button>
                            <Button variant='primary' className='ripple-effect'>Add Address</Button>
                        </div>
                    </div>
                    
                </Form>
            </ModalComponent>

            {/* add card modal */}
            <ModalComponent modalHeader="Add Card" modalExtraClass="resetPassword" show={showAddCard} onHandleCancel={addCardClose}>
                <Form>
                    <Form.Group className="form-group" >
                        <Form.Label>Full Name (on the card)</Form.Label>
                        <InputField type="text" placeholder="Name on Card"  />
                    </Form.Group>
                    <Form.Group className="form-group" >
                        <Form.Label>Card Number</Form.Label>
                        <InputField type="text" placeholder="**** **** **** ****"  />
                    </Form.Group>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Expiration</Form.Label>
                                <Row className='gx-2'>
                                    <Col>
                                        <InputField placeholder="MM" maxLength="2"  />
                                    </Col>
                                    <Col>
                                        <InputField placeholder="YY" maxLength="2" />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="form-group" >
                                <div className="d-flex">
                                    <Form.Label>CVV</Form.Label>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>3 digits code on back side of the card</Tooltip>}
                                        >
                                            <Link to="#!" data-bs-toggle="tooltip">
                                                <em className="icon-info-circle" />
                                            </Link>
                                        </OverlayTrigger>
                                </div>
                                <InputField type="text" placeholder="***"  maxLength="3" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="form-btn d-flex justify-content-end">
                        <Button variant='primary' className='ripple-effect'>Save Card</Button>
                    </div>
                </Form>
            </ModalComponent>
        </>
    );
}