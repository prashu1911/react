import { Nav, Tab } from "react-bootstrap";

export default function SequentialTab({
  palette,
  redBlindPallete,
  greenBlindPallete,
  blueBlindPallete,
}) {
  return (
    <div className="repeatBox">
      <Tab.Container defaultActiveKey="normal">
        <div className="d-flex justify-content-between flex-wrap">
          <div className="subHeading">
            <span>3</span> Check and configure the resulting palette
          </div>
          <div className="d-flex flex-column align-items-lg-end overflow-auto">
            <span className="resultPalette">
              <em className="icon-check" />
              Check and configure the resulting palette
            </span>
            <div className="d-flex align-items-center">
              <span className="resultPalette mb-0 me-2">Simulate:</span>
              <Nav variant="pills" className="commonTab">
                <Nav.Item>
                  <Nav.Link eventKey="normal">Normal</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="greenblind">Green-blind</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="redblind">Red-blind</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="blueblind">Blue-blind</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </div>
        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="normal">
            <div className="colorPalette">
              {palette?.length > 0 &&
                palette.map((val) => {
                  return <div style={{ background: val }} />;
                })}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="greenblind">
            <div className="colorPalette">
              {greenBlindPallete?.length > 0 &&
                greenBlindPallete.map((val) => {
                  return <div style={{ background: val }} />;
                })}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="redblind">
            <div className="colorPalette">
              {redBlindPallete?.length > 0 &&
                redBlindPallete.map((val) => {
                  return <div style={{ background: val }} />;
                })}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="blueblind">
            <div className="colorPalette">
              {blueBlindPallete?.length > 0 &&
                blueBlindPallete.map((val) => {
                  return <div style={{ background: val }} />;
                })}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
