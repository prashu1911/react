import React from 'react';
import { Card } from 'react-bootstrap';
import { Button } from "../../../../components";

export default function Timeline() {
    return <>
        <Card className='pb-0'>
            <ul className="list-unstyled mb-0 timeLine">
                <li className="d-flex">
                    <div className="timeLine_time">
                        <p className="mb-0">Now</p>
                    </div>
                    <div className="timeLine_icon">
                        <div className="timeLine_icon_bg" />
                    </div>
                    <div className="timeLine_cnt">
                        <p>No Activity</p>
                    </div>
                </li>
                <li className="d-flex">
                    <div className="timeLine_time">
                        <span>03:45 AM</span>
                        <p className="mb-0">Today</p>
                    </div>
                    <div className="timeLine_icon">
                        <div className="timeLine_icon_bg">
                            <span className="timeLine_icon_box green">
                                <em className="icon-msg-in" />
                            </span>
                        </div>
                    </div>
                    <div className="timeLine_cnt">
                        <div className="timeLine_cnt_box">
                            <p className="mb-4"><span>Back Bryan</span> Last Login details</p>
                            <ul className="list-unstyled mb-4">
                                <li> Your Last Login: <span>07/01/2024</span> From <span>103.231.46.102</span> </li>
                                <li> You are currently using : <span>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0</span> </li>
                            </ul>
                            <Button variant="primary" className="ripple-effect">Logout click here</Button>
                        </div>
                    </div>
                </li>
                <li className="d-flex">
                    <div className="timeLine_time">
                        <span>03:45 AM</span>
                        <p className="mb-0">Yesterday</p>
                    </div>
                    <div className="timeLine_icon">
                        <div className="timeLine_icon_bg">
                            <span className="timeLine_icon_box red">
                                <em className="icon-msg-out" />
                            </span>
                        </div>
                    </div>
                    <div className="timeLine_cnt">
                        <div className="timeLine_cnt_box">
                            <p><span>Back Bryan</span> Created on : <span>03/02/2024 03:31:15 AM </span> By <span> Amberly_Enterprise_MA</span> </p>
                        </div>
                    </div>
                </li>
                <li className="d-flex">
                    <div className="timeLine_time">
                        <span>03:45 AM</span>
                        <p className="mb-0">Yesterday</p>
                    </div>
                    <div className="timeLine_icon">
                        <div className="timeLine_icon_bg">
                            <span className="timeLine_icon_box green">
                                <em className="icon-msg-in" />
                            </span>
                        </div>
                    </div>
                    <div className="timeLine_cnt">
                        <div className="timeLine_cnt_box">
                            <p className="mb-3"><span>Back Bryan</span> Created on : <span>03/02/2024 03:31:15 AM </span> By <span> Amberly_Enterprise_MA</span> </p>
                            <ul className="list-unstyled mb-0">
                                <li> You are logged in using <span>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0</span> </li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li className="d-flex">
                    <div className="timeLine_time">
                        <span>03:45 AM</span>
                        <p className="mb-0">Yesterday</p>
                    </div>
                    <div className="timeLine_icon">
                        <div className="timeLine_icon_bg">
                            <span className="timeLine_icon_box red">
                                <em className="icon-user" />
                            </span>
                        </div>
                    </div>
                    <div className="timeLine_cnt">
                        <div className="timeLine_cnt_box">
                            <p><span>Back Bryan</span> Created on : <span>03/02/2024 03:31:15 AM </span> By <span> Amberly_Enterprise_MA</span> </p>
                        </div>
                    </div>
                </li>
            </ul>
        </Card>
    </>;
}