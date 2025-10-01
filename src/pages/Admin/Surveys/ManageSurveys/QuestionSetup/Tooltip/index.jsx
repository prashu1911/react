import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ImageElement } from "components";

// Import your local images
import sliderImage from "../../../../../../assets/admin/images/slider.png";
import verticalImage from "../../../../../../assets/admin/images/vertical.png";

const ResponseViewTooltip = () => {
    return (
        <Link to="#!" className="p-0">
            <OverlayTrigger
                placement="right"
                overlay={
                    <Tooltip id="response-view-tooltip" className="tooltip-image">
                        <div style={{ maxWidth: "300px", padding: "5px" }}>
                            <div className="mb-3">
                                <div style={{ fontWeight: 600, marginBottom: "4px" }}>Slider View</div>
                                <ImageElement
                                    previewSource={sliderImage}
                                    className="img-fluid"
                                    style={{
                                        maxWidth: "100%",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px",
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: "4px" }}>Vertical View</div>
                                <ImageElement
                                    previewSource={verticalImage}
                                    className="img-fluid"
                                    style={{
                                        maxWidth: "100%",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px",
                                    }}
                                />
                            </div>
                        </div>
                    </Tooltip>
                }
            >
                <span className="d-flex ms-1">
                    <em
                        className="icon-info-circle"
                        style={{ pointerEvents: "none" }}
                    />
                </span>
            </OverlayTrigger>
        </Link>
    );
};

export default ResponseViewTooltip;
