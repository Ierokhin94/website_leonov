import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../css/navbar.css"
import { Col } from 'react-bootstrap';

function NavBar() {

    return (
        <div>
        <Container >
         
            <Navbar expand="lg" variant='dark' >
            <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav variant="underline" className="flex-column" >
                    <a />
                    <Nav.Link href="/client-list" className='navbar-link'>
                            <span className='gg-user' style={{ display: 'inline-block', marginRight: '21px' }}></span>
                        Клиенты
                    </Nav.Link>

                    <Nav.Link href="/leasing-subject-list" className='navbar-link'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" fill="currentColor" style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', strokeWidth: '10px'}} className="bi bi-truck" viewBox="0 0 16 18">
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                        Предметы лизинга
                    </Nav.Link>

                    <Nav.Link href="/leasing-contract-list" className='navbar-link'>
                            <span className='gg-user-list' style={{ display: 'inline-block', marginRight: '15px' }}></span>
                        Договоры лизинга
                    </Nav.Link>
                   
                    

                </Nav>
            </Navbar.Collapse>
            </Container>
            </Navbar>
  
        </Container>
        </div>
            

    )
}

export default NavBar