import { Link } from "react-router-dom";
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Breadcrumb, Button, InputField, SelectField } from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";

export default function ConfigureReport() {
     // breadcrumb
     const breadcrumb = [
        {
            path: "#!",
            name: "Intelligent Report",
        },
        
        {
            path: `${adminRouteMap.REPORTGENERATOR.path}`,
            name: "Report Generator",
        },
        {
            path: "#",
            name: "Configure Report"
        },
    ];
    const favourOptions = [
        { value: 'Na', label: 'NA' },
        { value: 'Unfavorable', label: 'Unfavorable' },
        { value: 'Neutral', label: 'Neutral' },
        { value: 'Favorable', label: 'Favorable' }  
    ]
    return (
        <>
            {/* head title start */}
            <section className="commonHead">
                <h1 className='commonHead_title'>Welcome Back!</h1>
                <Breadcrumb breadcrumb={breadcrumb} />
            </section>
            {/* head title end */}
            <div className="pageContent configureReport">
                <div className="pageTitle d-flex align-items-center">
                    <Link aria-label='Back icon' to={adminRouteMap.REPORTGENERATOR.path} className='backLink'><em className='icon-back'></em></Link>
                    <h2 className='mb-0'>Configure Report</h2>
                </div>
                <div className="configureReport_card">
                    <h3 className="configureReport_card_title">LIKERT</h3>
                    <div className="configureReport_card_inner">
                        <div className="table-responsive">
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th className="min-w-220">Response</th>
                                    <th className="min-w-150">Value</th>
                                    <th className="min-w-220">Favour</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>NA</td>
                                    <td>0</td>
                                    <td>
                                        <Form.Group className="form-group mb-0">
                                            <SelectField placeholder="Select Favour" defaultValue={favourOptions[0]} options={favourOptions} dropdownOutside={true}/>
                                        </Form.Group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Strongly Disagree</td>
                                    <td>1</td>
                                    <td>
                                        <Form.Group className="form-group mb-0">
                                            <SelectField placeholder="Select Favour" defaultValue={favourOptions[1]} options={favourOptions} dropdownOutside={true}/>
                                        </Form.Group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Disagree</td>
                                    <td>2</td>
                                    <td>
                                        <Form.Group className="form-group mb-0">
                                            <SelectField placeholder="Select Favour" defaultValue={favourOptions[1]} options={favourOptions} dropdownOutside={true}/>
                                        </Form.Group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Neither Agree Nor Disagree</td>
                                    <td>3</td>
                                    <td>
                                        <Form.Group className="form-group mb-0">
                                            <SelectField placeholder="Select Favour" defaultValue={favourOptions[2]} options={favourOptions} dropdownOutside={true}/>
                                        </Form.Group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Agree</td>
                                    <td>4</td>
                                    <td>
                                        <Form.Group className="form-group mb-0">
                                            <SelectField placeholder="Select Favour" defaultValue={favourOptions[3]} options={favourOptions} dropdownOutside={true}/>
                                        </Form.Group>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Strongly Agree</td>
                                    <td>5</td>
                                    <td>
                                        <Form.Group className="form-group mb-0">
                                            <SelectField placeholder="Select Favour" defaultValue={favourOptions[3]} options={favourOptions} dropdownOutside={true}/>
                                        </Form.Group>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <div className="configureReport_card_color mt-xl-3 mt-2">
                            <p className='fw-medium'>Color Configuration</p>
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Label className='form-color-label mb-0 fw-medium'>Unfavorable: </Form.Label>
                                    <Form.Control
                                        type="color"
                                        id="exampleColorInput"
                                        defaultValue="#FF4141"
                                        title="Choose a color"
                                    />
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Label className='form-color-label mb-0 fw-medium'>Neutral: </Form.Label>
                                    <Form.Control
                                        type="color"
                                        id="exampleColorInput"
                                        defaultValue="#FFD041"
                                        title="Choose a color"
                                    />
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Label className='form-color-label mb-0 fw-medium'>Favorable: </Form.Label>
                                    <Form.Control
                                        type="color"
                                        id="exampleColorInput"
                                        defaultValue="#00B050"
                                        title="Choose a color"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="configureReport_card_btn mt-xl-3 mt-2 d-flex justify-content-end">
                            <Button variant="primary" className="ripple-effect">Save</Button>
                        </div>
                    </div>
                </div>
                <div className="configureReport_card">
                    <h3 className="configureReport_card_title">TERMS</h3>
                    <div className="configureReport_card_inner">
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <tbody>
                                    <tr>
                                        <td className="min-w-220">
                                            <Form.Group className="form-group mb-0">
                                                <Form.Label htmlFor="for-vector">Prefered Text for Vector</Form.Label>
                                                <InputField type="text" id="for-vector" placeholder="Prefered Text for Vector" defaultValue="Outcome"/>
                                            </Form.Group>
                                        </td>
                                        <td className="min-w-220">
                                            <Form.Group className="form-group mb-0">
                                                <Form.Label htmlFor="for-element">Prefered Text for Element</Form.Label>
                                                <InputField type="text" id="for-element" placeholder="Prefered Text for Element" defaultValue="Outcome"/>
                                            </Form.Group>
                                        </td>
                                        <td className="min-w-220">
                                            <Form.Group className="form-group mb-0">
                                                <Form.Label htmlFor="for-question">Prefered Text for Question</Form.Label>
                                                <InputField type="text" id="for-question" placeholder="Prefered Text for Question" defaultValue="Outcome"/>
                                            </Form.Group>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="configureReport_card_btn mt-xl-3 mt-2 d-flex justify-content-end">
                            <Button variant="primary" className="ripple-effect">Save</Button>
                        </div>
                    </div>
                </div>
                <div className="configureReport_card">
                    <h3 className="configureReport_card_title">HEATMAP</h3>
                    <div className="configureReport_card_inner">
                        <Row className="justify-content-between g-3 px-2">
                            <Col xxl={6} xl={7} lg={8}>
                                <p>HEAT MAP COLOR SELECTOR</p>
                                <div className="d-flex flex-md-nowrap flex-wrap gap-2">
                                    <div className="colorPlus">
                                        <div className="colorPalettes">
                                            <h3 className="colorPalettes_title">+</h3>
                                            {['radio'].map((type) => (
                                            <div key={`inline-${type}`}>
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-11`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#8250C4"}}></td>
                                                        <td style={{backgroundColor:"#5ECBC8"}}></td>
                                                        <td style={{backgroundColor:"#438FFF"}}></td>
                                                        <td style={{backgroundColor:"#FF977E"}}></td>
                                                        <td style={{backgroundColor:"#EB5757"}}></td>
                                                        <td style={{backgroundColor:"#5B2071"}}></td>
                                                        <td style={{backgroundColor:"#EC5A96"}}></td>
                                                        <td style={{backgroundColor:"#A43B76"}}></td>
                                                        <td style={{backgroundColor:"#E13102"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-12`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#73B761"}}></td>
                                                        <td style={{backgroundColor:"#4A588A"}}></td>
                                                        <td style={{backgroundColor:"#ECC846"}}></td>
                                                        <td style={{backgroundColor:"#CD4C46"}}></td>
                                                        <td style={{backgroundColor:"#71AFE2"}}></td>
                                                        <td style={{backgroundColor:"#8D6FD1"}}></td>
                                                        <td style={{backgroundColor:"#EE9E64"}}></td>
                                                        <td style={{backgroundColor:"#95DABB"}}></td>
                                                        <td style={{backgroundColor:"#5C0001"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-13`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#4A8DDC"}}></td>
                                                        <td style={{backgroundColor:"#4C5D8A"}}></td>
                                                        <td style={{backgroundColor:"#F3C911"}}></td>
                                                        <td style={{backgroundColor:"#DC5B57"}}></td>
                                                        <td style={{backgroundColor:"#33AE81"}}></td>
                                                        <td style={{backgroundColor:"#95C8F0"}}></td>
                                                        <td style={{backgroundColor:"#DD915F"}}></td>
                                                        <td style={{backgroundColor:"#9A64A0"}}></td>
                                                        <td style={{backgroundColor:"#5C0001"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-14`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#B73A3A"}}></td>
                                                        <td style={{backgroundColor:"#EC5656"}}></td>
                                                        <td style={{backgroundColor:"#F28A90"}}></td>
                                                        <td style={{backgroundColor:"#F8BCBD"}}></td>
                                                        <td style={{backgroundColor:"#99E472"}}></td>
                                                        <td style={{backgroundColor:"#23C26F"}}></td>
                                                        <td style={{backgroundColor:"#0AAC00"}}></td>
                                                        <td style={{backgroundColor:"#026645"}}></td>
                                                        <td style={{backgroundColor:"#012116"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-15`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#3257A8"}}></td>
                                                        <td style={{backgroundColor:"#37A794"}}></td>
                                                        <td style={{backgroundColor:"#8B3D88"}}></td>
                                                        <td style={{backgroundColor:"#DD6B7F"}}></td>
                                                        <td style={{backgroundColor:"#6B9109"}}></td>
                                                        <td style={{backgroundColor:"#F5C869"}}></td>
                                                        <td style={{backgroundColor:"#77C4A8"}}></td>
                                                        <td style={{backgroundColor:"#DEA6CF"}}></td>
                                                        <td style={{backgroundColor:"#8E1F20"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-16`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#107C10"}}></td>
                                                        <td style={{backgroundColor:"#002050"}}></td>
                                                        <td style={{backgroundColor:"#A80000"}}></td>
                                                        <td style={{backgroundColor:"#5C2D91"}}></td>
                                                        <td style={{backgroundColor:"#004B50"}}></td>
                                                        <td style={{backgroundColor:"#0078D7"}}></td>
                                                        <td style={{backgroundColor:"#D83B01"}}></td>
                                                        <td style={{backgroundColor:"#B4009E"}}></td>
                                                        <td style={{backgroundColor:"#8E1F20"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-17`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#499195"}}></td>
                                                        <td style={{backgroundColor:"#00ACFC"}}></td>
                                                        <td style={{backgroundColor:"#C4B07B"}}></td>
                                                        <td style={{backgroundColor:"#F18F49"}}></td>
                                                        <td style={{backgroundColor:"#326633"}}></td>
                                                        <td style={{backgroundColor:"#F1C716"}}></td>
                                                        <td style={{backgroundColor:"#D8D7BF"}}></td>
                                                        <td style={{backgroundColor:"#224624"}}></td>
                                                        <td style={{backgroundColor:"#F15628"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-18`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#70B0E0"}}></td>
                                                        <td style={{backgroundColor:"#FCB714"}}></td>
                                                        <td style={{backgroundColor:"#2878BD"}}></td>
                                                        <td style={{backgroundColor:"#0EB194"}}></td>
                                                        <td style={{backgroundColor:"#108372"}}></td>
                                                        <td style={{backgroundColor:"#AF916D"}}></td>
                                                        <td style={{backgroundColor:"#C4B07B"}}></td>
                                                        <td style={{backgroundColor:"#F15628"}}></td>
                                                        <td style={{backgroundColor:"#224624"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-19`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#B6B0FF"}}></td>
                                                        <td style={{backgroundColor:"#3049AD"}}></td>
                                                        <td style={{backgroundColor:"#FF994E"}}></td>
                                                        <td style={{backgroundColor:"#C83D95"}}></td>
                                                        <td style={{backgroundColor:"#FFBBED"}}></td>
                                                        <td style={{backgroundColor:"#42F9F9"}}></td>
                                                        <td style={{backgroundColor:"#00B2D9"}}></td>
                                                        <td style={{backgroundColor:"#FFD86C"}}></td>
                                                        <td style={{backgroundColor:"#5C0001"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-20`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#F17925"}}></td>
                                                        <td style={{backgroundColor:"#004753"}}></td>
                                                        <td style={{backgroundColor:"#CCAA14"}}></td>
                                                        <td style={{backgroundColor:"#4B4C4E"}}></td>
                                                        <td style={{backgroundColor:"#D82C20"}}></td>
                                                        <td style={{backgroundColor:"#A3D0D4"}}></td>
                                                        <td style={{backgroundColor:"#536F18"}}></td>
                                                        <td style={{backgroundColor:"#46ABB0"}}></td>
                                                        <td style={{backgroundColor:"#8E1F20"}}></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            ))}  
                                        </div>
                                    </div>
                                    <div className="colorMinus">
                                        <div className="colorPalettes">
                                            <h3 className="colorPalettes_title">-</h3>
                                            {['radio'].map((type) => (
                                            <div key={`inline-${type}`}>
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-11`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#8250C4"}}></td>
                                                        <td style={{backgroundColor:"#5ECBC8"}}></td>
                                                        <td style={{backgroundColor:"#438FFF"}}></td>
                                                        <td style={{backgroundColor:"#FF977E"}}></td>
                                                        <td style={{backgroundColor:"#EB5757"}}></td>
                                                        <td style={{backgroundColor:"#5B2071"}}></td>
                                                        <td style={{backgroundColor:"#EC5A96"}}></td>
                                                        <td style={{backgroundColor:"#A43B76"}}></td>
                                                        <td style={{backgroundColor:"#E13102"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-12`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#73B761"}}></td>
                                                        <td style={{backgroundColor:"#4A588A"}}></td>
                                                        <td style={{backgroundColor:"#ECC846"}}></td>
                                                        <td style={{backgroundColor:"#CD4C46"}}></td>
                                                        <td style={{backgroundColor:"#71AFE2"}}></td>
                                                        <td style={{backgroundColor:"#8D6FD1"}}></td>
                                                        <td style={{backgroundColor:"#EE9E64"}}></td>
                                                        <td style={{backgroundColor:"#95DABB"}}></td>
                                                        <td style={{backgroundColor:"#5C0001"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-13`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#4A8DDC"}}></td>
                                                        <td style={{backgroundColor:"#4C5D8A"}}></td>
                                                        <td style={{backgroundColor:"#F3C911"}}></td>
                                                        <td style={{backgroundColor:"#DC5B57"}}></td>
                                                        <td style={{backgroundColor:"#33AE81"}}></td>
                                                        <td style={{backgroundColor:"#95C8F0"}}></td>
                                                        <td style={{backgroundColor:"#DD915F"}}></td>
                                                        <td style={{backgroundColor:"#9A64A0"}}></td>
                                                        <td style={{backgroundColor:"#5C0001"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-14`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#B73A3A"}}></td>
                                                        <td style={{backgroundColor:"#EC5656"}}></td>
                                                        <td style={{backgroundColor:"#F28A90"}}></td>
                                                        <td style={{backgroundColor:"#F8BCBD"}}></td>
                                                        <td style={{backgroundColor:"#99E472"}}></td>
                                                        <td style={{backgroundColor:"#23C26F"}}></td>
                                                        <td style={{backgroundColor:"#0AAC00"}}></td>
                                                        <td style={{backgroundColor:"#026645"}}></td>
                                                        <td style={{backgroundColor:"#012116"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-15`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#3257A8"}}></td>
                                                        <td style={{backgroundColor:"#37A794"}}></td>
                                                        <td style={{backgroundColor:"#8B3D88"}}></td>
                                                        <td style={{backgroundColor:"#DD6B7F"}}></td>
                                                        <td style={{backgroundColor:"#6B9109"}}></td>
                                                        <td style={{backgroundColor:"#F5C869"}}></td>
                                                        <td style={{backgroundColor:"#77C4A8"}}></td>
                                                        <td style={{backgroundColor:"#DEA6CF"}}></td>
                                                        <td style={{backgroundColor:"#8E1F20"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-16`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#107C10"}}></td>
                                                        <td style={{backgroundColor:"#002050"}}></td>
                                                        <td style={{backgroundColor:"#A80000"}}></td>
                                                        <td style={{backgroundColor:"#5C2D91"}}></td>
                                                        <td style={{backgroundColor:"#004B50"}}></td>
                                                        <td style={{backgroundColor:"#0078D7"}}></td>
                                                        <td style={{backgroundColor:"#D83B01"}}></td>
                                                        <td style={{backgroundColor:"#B4009E"}}></td>
                                                        <td style={{backgroundColor:"#8E1F20"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-17`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#499195"}}></td>
                                                        <td style={{backgroundColor:"#00ACFC"}}></td>
                                                        <td style={{backgroundColor:"#C4B07B"}}></td>
                                                        <td style={{backgroundColor:"#F18F49"}}></td>
                                                        <td style={{backgroundColor:"#326633"}}></td>
                                                        <td style={{backgroundColor:"#F1C716"}}></td>
                                                        <td style={{backgroundColor:"#D8D7BF"}}></td>
                                                        <td style={{backgroundColor:"#224624"}}></td>
                                                        <td style={{backgroundColor:"#F15628"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-18`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#70B0E0"}}></td>
                                                        <td style={{backgroundColor:"#FCB714"}}></td>
                                                        <td style={{backgroundColor:"#2878BD"}}></td>
                                                        <td style={{backgroundColor:"#0EB194"}}></td>
                                                        <td style={{backgroundColor:"#108372"}}></td>
                                                        <td style={{backgroundColor:"#AF916D"}}></td>
                                                        <td style={{backgroundColor:"#C4B07B"}}></td>
                                                        <td style={{backgroundColor:"#F15628"}}></td>
                                                        <td style={{backgroundColor:"#224624"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-19`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#B6B0FF"}}></td>
                                                        <td style={{backgroundColor:"#3049AD"}}></td>
                                                        <td style={{backgroundColor:"#FF994E"}}></td>
                                                        <td style={{backgroundColor:"#C83D95"}}></td>
                                                        <td style={{backgroundColor:"#FFBBED"}}></td>
                                                        <td style={{backgroundColor:"#42F9F9"}}></td>
                                                        <td style={{backgroundColor:"#00B2D9"}}></td>
                                                        <td style={{backgroundColor:"#FFD86C"}}></td>
                                                        <td style={{backgroundColor:"#5C0001"}}></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Form.Check className='m-0'
                                                                inline
                                                                label=""
                                                                name="default"
                                                                type={type}
                                                                id={`visualization-${type}-20`}
                                                            />
                                                        </td>
                                                        <td style={{backgroundColor:"#F17925"}}></td>
                                                        <td style={{backgroundColor:"#004753"}}></td>
                                                        <td style={{backgroundColor:"#CCAA14"}}></td>
                                                        <td style={{backgroundColor:"#4B4C4E"}}></td>
                                                        <td style={{backgroundColor:"#D82C20"}}></td>
                                                        <td style={{backgroundColor:"#A3D0D4"}}></td>
                                                        <td style={{backgroundColor:"#536F18"}}></td>
                                                        <td style={{backgroundColor:"#46ABB0"}}></td>
                                                        <td style={{backgroundColor:"#8E1F20"}}></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xxl={6} xl={5} lg={4}>
                                <p className="mb-lg-5 mb-3">DATA CORRELATION COEFFICIENTS</p>
                                <Form>
                                    <div className="d-flex gap-2">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text >+/-</InputGroup.Text>
                                            <InputField type={"number"} placeholder=""  value="5"/>
                                        </InputGroup>
                                        <Form.Group className="form-group mb-0" >
                                            <InputField type="color" className=" form-control-color p-1" id="myColor1" defaultValue="#0968AC" title="Choose a color"/>
                                        </Form.Group>
                                        <Form.Group className="form-group mb-0" >
                                            <InputField type="color" className=" form-control-color p-1" id="myColor1" defaultValue="#0968AC" title="Choose a color"/>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text >+/-</InputGroup.Text>
                                            <InputField type={"number"} placeholder=""  value="10"/>
                                        </InputGroup>
                                        <Form.Group className="form-group mb-0" >
                                            <InputField type="color" className=" form-control-color p-1" id="myColor1" defaultValue="#0968AC" title="Choose a color"/>
                                        </Form.Group>
                                        <Form.Group className="form-group mb-0" >
                                            <InputField type="color" className=" form-control-color p-1" id="myColor1" defaultValue="#0968AC" title="Choose a color"/>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text >+/-</InputGroup.Text>
                                            <InputField type={"number"} placeholder=""  value="15"/>
                                        </InputGroup>
                                        <Form.Group className="form-group mb-0" >
                                            <InputField type="color" className=" form-control-color p-1" id="myColor1" defaultValue="#0968AC" title="Choose a color"/>
                                        </Form.Group>
                                        <Form.Group className="form-group mb-0" >
                                            <InputField type="color" className=" form-control-color p-1" id="myColor1" defaultValue="#0968AC" title="Choose a color"/>
                                        </Form.Group>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                        <div className="configureReport_card_btn mt-xl-3 mt-2 d-flex justify-content-end">
                            <Button variant="primary" className="ripple-effect">Save</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}