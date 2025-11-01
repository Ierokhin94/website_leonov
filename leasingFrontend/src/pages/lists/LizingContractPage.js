import React from 'react'
import ClientContractList from '../../components/lists/LizingContract'
import "../../css/navbar.css"
import NavBar from '../../components/NavBar'
import { Container, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';

function LizingContractPage() {
  return (
    <div className="list-form">
      <Container fluid style={{ height: "100%" }}>
        <Row style={{ height: "100%", overflowY: "scroll" }}>
          <Col md="auto" className='navbar-container' style={{ position: "sticky", top: 0,  zIndex: 100}}>
            <NavBar />
          </Col>
          <Col style={{ height: "100%"}}>
                <ClientContractList/>
            </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LizingContractPage