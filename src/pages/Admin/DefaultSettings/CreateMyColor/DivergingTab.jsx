import { Nav, Tab } from "react-bootstrap";

export default function DivergingTab({
  diversionPalette,
  diversionRedBlindPallete,
  diversionGreenBlindPallete,
  diversionBlueBlindPallete,
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
              {diversionPalette?.one?.length > 0 &&
                diversionPalette.one.map((val, i) => {
                  return <div style={{ background: val }} key={i} />;
                })}
              {diversionPalette?.two?.length > 0 &&
                diversionPalette.two.map((val, i) => {
                  return <div style={{ background: val }} key={i} />;
                })}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="greenblind">
            <div className="colorPalette">
              {diversionGreenBlindPallete?.one?.length > 0 &&
                diversionGreenBlindPallete.one.map((val, i) => {
                  return <div style={{ background: val }} key={i} />;
                })}
              {diversionGreenBlindPallete?.two?.length > 0 &&
                diversionGreenBlindPallete.two.map((val, i) => {
                  return <div style={{ background: val }} key={i} />;
                })}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="redblind">
            <div className="colorPalette">
              {diversionRedBlindPallete?.one?.length > 0 &&
                diversionRedBlindPallete.one.map((val, i) => {
                  return <div style={{ background: val }} key={i} />;
                })}
              {diversionRedBlindPallete?.two?.length > 0 &&
                diversionRedBlindPallete.two.map((val, i) => {
                  return <div style={{ background: val }} key={i} />;
                })}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="blueblind">
            <div className="colorPalette">
              {diversionBlueBlindPallete?.one?.length > 0 &&
                diversionBlueBlindPallete.one.map((val, i) => {
                  return <div style={{ background: val }} key={i} />;
                })}
              {diversionBlueBlindPallete?.two?.length > 0 &&
                diversionBlueBlindPallete.two.map((val, i) => {
                  return <div style={{ background: val }} key={i} />;
                })}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
