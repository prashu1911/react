import React, {useState } from 'react';
import { Collapse} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Filter from '../Filter/index.page';
import PieChart from '../PieChart';
import { ColorPellates } from '../../../../../components';
 


export default function CollapseWorkType({colorCollpaseShow, toggleCollapse}) {

const [workTypeCollapseShow, setworkTypeCollapseShow] = useState(false);

return (
    <>
        <Link className="commonCollapse ripple-effect" onClick={() => setworkTypeCollapseShow(!workTypeCollapseShow)} aria-controls="industry-collapse" aria-expanded={workTypeCollapseShow}><span className='me-2'>Chart Options </span> <em className='icon-drop-down' />  </Link>
        <Collapse in={workTypeCollapseShow}>
            <div id="Industry-collapse">
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
                <h4 className='responseBox_txt mb-0'>Work type</h4>
            </div>
            <div className="responseBox_right">
                <div className="responseBox_chart">
                    <PieChart
                        pieId="#adminPie4"
                        pieLabels={['Part Time', 'Full Time', 'Auxiliary/On Call', 'Other']}
                        pieColors={['#F37F73','#F7C758','#FF9F51','#001F8F']}
                        pieSeries={[50, 25, 25]}
                        pieClass="d-flex justify-content-center"
                    />
                </div>
            </div>
        </div>
    </>
)
}