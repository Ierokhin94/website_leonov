import React from 'react'
import NavBar from '../../components/NavBar'
import { Container, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import LizingContractForm from '../../components/forms/LizingContractForm';
import "../../css/navbar.css"


function LizingContractFormPage() {

  return (
    <div className="list-form">
      <Container fluid style={{ height: "100%"}}>
        <Row style={{ height: "100%", overflowY: "scroll" }}>
          <Col md="auto" className='navbar-container' style={{ position: "sticky", top: 0,  zIndex: 100}}>
            <NavBar />
          </Col>
          <Col style={{ height: "100%"}}>
                <LizingContractForm/>
            </Col>
        </Row>
      </Container>
        
    </div>
  )
}

export default LizingContractFormPage