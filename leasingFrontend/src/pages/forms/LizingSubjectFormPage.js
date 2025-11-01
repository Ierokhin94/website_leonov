import React from 'react'
import NavBar from '../../components/NavBar'
import { Container, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import LizingSubjectForm from '../../components/forms/LizingSubjectForm';
import "../../css/navbar.css"


function LizingSubjectFormPage() {

  return (
    <div className="list-form">
      <Container fluid style={{ height: "100%"}}>
        <Row style={{ height: "100%", overflowY: "scroll" }}>
          <Col md="auto" className='navbar-container' style={{ position: "sticky", top: 0,  zIndex: 100}}>
            <NavBar />
          </Col>
            <Col style={{ height: "100%"}}>
                <LizingSubjectForm/>
            </Col>
        </Row>
      </Container>
        
    </div>
  )
}

export default LizingSubjectFormPage