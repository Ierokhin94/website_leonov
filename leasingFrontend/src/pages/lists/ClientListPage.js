import React from 'react'
import NavBar from '../../components/NavBar'
import {Container, Row} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import ClientList from '../../components/lists/ClientList';
import "../../css/navbar.css"


function ClientListPage() {

    return (

        <div className="list-form">
            <Container fluid style={{height: "100vh"}}>
                <Row style={{height: "100%", overflowY: "scroll"}}>
                    <Col md="auto" className='navbar-container' style={{position: "sticky", top: 0, zIndex: 100}}>
                        <NavBar/>
                    </Col>
                    <Col style={{height: "100%"}}>

                        <ClientList/>
                    </Col>
                </Row>
            </Container>
        </div>


    )
}

export default ClientListPage