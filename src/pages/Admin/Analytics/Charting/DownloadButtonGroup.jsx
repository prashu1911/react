import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

const DownloadButtonGroup = ({
  onDownloadPNG,
  onDownloadSVG,
  onDownloadCSV,
}) => (
  <div className="d-flex justify-content-end downloadDropdown tooltip-container" data-title="Download">
    {/* <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="download-tooltip">Download</Tooltip>}
    > */}
      <Dropdown>
        <Dropdown.Toggle variant="light">
          <em className="icon-download me-0" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={onDownloadPNG}>
            <em className="icon-download me-1" /> PNG
          </Dropdown.Item>
          <Dropdown.Item onClick={onDownloadSVG}>
            <em className="icon-download me-1" /> SVG
          </Dropdown.Item>
          {onDownloadCSV && (
            <Dropdown.Item onClick={onDownloadCSV}>
              <em className="icon-download me-1" /> CSV
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    {/* </OverlayTrigger> */}
  </div>
);

export default DownloadButtonGroup;
