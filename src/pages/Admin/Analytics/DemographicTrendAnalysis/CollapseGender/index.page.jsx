import React, {useState } from 'react';
import { Collapse} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Filter from '../Filter/index.page';
import PieChart from '../PieChart';
import { ColorPellates } from '../../../../../components';
 


export default function CollapseGender({colorCollpaseShow, toggleCollapse}) {

const [genderCollapseShow, setgenderCollapseShow] = useState(false);

return (
    <>
        <Link className="commonCollapse ripple-effect" onClick={() => setgenderCollapseShow(!genderCollapseShow)} aria-controls="gender-collapse" aria-expanded={genderCollapseShow}><span className='me-2'>Chart Options </span> <em className='icon-drop-down' />  </Link>
        <Collapse in={genderCollapseShow}>
            <div id="gender-collapse">
                <div className="optionCollapse">
                    <div className="optionCollapse_inner">
                        <Filter colorCollpaseShow={colorCollpaseShow} toggleCollapse={toggleCollapse} />
                    </div>
                    <Collapse in={colorCollpaseShow}>
                        <div><ColorPellates showCurrentDefault/></div>
                    </Collapse>
                </div>
            </div>
        </Collapse>
        <div className="responseBox d-flex">
            <div className="responseBox_left">
                <h4 className='responseBox_txt mb-0'>Gender</h4>
            </div>
            <div className="responseBox_right">
                <div className="responseBox_chart">
                    <PieChart
                        pieId="#adminPie2"
                        pieLabels={['Under 18', 'Woman', 'Non-Binary', 'Genderfluid', 'Prefer Not To Say']}
                        pieColors={['#F37F73','#F7C758','#FF9F51','#001F8F','#0968AC']}
                        pieSeries={[50, 25, 25]}
                        pieClass="d-flex justify-content-center"
                    />
                </div>
            </div>
        </div>
    </>
)
}