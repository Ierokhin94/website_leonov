import React from 'react'
import {Container, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import "../../css/clientlist.css"
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import "../../css/listpunkt.css"
import {InputGroup} from 'react-bootstrap';

import SearchForm from './SearchForm';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import {Modal} from 'react-bootstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {baseApiUrl, sendDeleteRequest, sendGetRequest} from '../../utils/requests';

function ClientSubjectList() {

    const [items, setItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Состояние для отображения модального окна
    const [itemIdToDelete, setItemIdToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showItems, setShowItems] = useState(false);
    const [foundItems, setFoundItems] = useState([]);
    const [formData, setFormData] = useState({

        leasing_item: '',

    });
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setShowItems(false);
    };


    useEffect(() => {
        // Здесь вы выполните HTTP-запрос к вашей базе данных для получения списка клиентов

        sendGetRequest("leasing-item/", {page: currentPage}) // Замените '/api/clients' на реальный URL вашего API
            .then((data) => {
                setItems(data.result); // Устанавливаем список клиентов в состояние
                setTotalPages(Math.ceil(data.total_amount / 10));

            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [currentPage]);

    const deleteItem = (itemId) => {
        setItemIdToDelete(itemId);
        setShowDeleteModal(true);
    };


    const handleButtonClickItem = () => {

        if (formData.leasing_item !== '') {
            // Формируем URL для запроса

            sendGetRequest("leasing-item/", {
                title: formData.leasing_item,
                vin: formData.leasing_item,
                pts: formData.leasing_item,
            })
                .then((data) => {
                    if (data) {
                        setFoundItems(data);
                        setShowItems(true)
                        console.log(data)
                    }
                })
                .catch((error) => {
                    console.error('Произошла ошибка при выполнении запроса:', error);
                });
        } else {
            setFoundItems([]);
        }
    };


    const confirmDelete = () => {
        sendDeleteRequest("leasing-item/", {id: itemIdToDelete})
            .then(() => {
                // Удаление прошло успешно, обновляем список клиентов
                setItems(items.filter(item => item.id !== itemIdToDelete));
                setShowDeleteModal(false); // Закрываем модальное окно
            })
            .catch((error) => {
                console.error('Ошибка при удалении клиента', error);
                setShowDeleteModal(false); // Закрываем модальное окно в случае ошибки
            });
    };


    return (
        <>
            <div className='breadcrumb'>

                <Container fluid>
                    <Col md="auto">
                        <a
                            className='breadcrumb-link'
                            href='/leasing-subject-list'
                            style={{
                                margin: '0px',
                                width: '70px'
                            }}
                        >ПРЕДМЕТЫ ЛИЗИНГА</a>
                    </Col>
                </Container>
            </div>
            <div className='container-client-list-nav'>
                <Container fluid>
                    <Row>
                        <Col>
                            <Button href='/new-leasing-subject' variant="success">Добавить</Button>
                        </Col>
                        <Col className="d-flex justify-content-end">

                            <InputGroup className="mb-3" controlId="exampleForm.ControlInput1">


                                <Form.Control
                                    type="text"
                                    name="leasing_item"
                                    value={formData.leasing_item}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={60}
                                    onBlur={(e) => {
                                        if (e.relatedTarget && e.relatedTarget.id === 'searchButton') {
                                            return;
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="leasing_item"]').classList.remove('error');
                                    }}


                                />

                                <Button
                                    variant="primary"
                                    style={{textAlign: 'right'}}
                                    id="searchButton"
                                    onClick={(e) => {
                                        handleButtonClickItem();
                                    }}
                                >
                                    Поиск...
                                </Button>

                            </InputGroup>

                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='container-client-list-header'>
                <Container fluid>
                    <Row>

                        <Col className='text-id' md="auto" style={{width: '100px'}}>
                            <p>
                                ID
                            </p>
                        </Col>
                        <Col className='text-inform'>
                            <div>
                                Название
                            </div>
                        </Col>

                        <Col className='text-inform'>
                            <div>
                                VIN
                            </div>
                        </Col>


                        <Col md="auto" className="d-flex justify-content-end">
                            <div style={{width: '107px'}}/>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='container-client-list'>

                <TransitionGroup>

                    {showItems & formData.leasing_item !== '' ? (
                        foundItems.map((item) => (
                            <CSSTransition key={item.id} timeout={250} classNames="fade">
                                <div key={item.id}>

                                    <Container fluid className='container-client-list-punkt'>
                                        <Row>
                                            <Col className='text-id' md="auto" style={{width: '100px'}}>
                                                <p>{item.id}</p>
                                            </Col>
                                            <Col className='text-inform'>

                                                <p
                                                >{item.title}</p>
                                            </Col>
                                            <Col className='text-inform'>

                                                <p
                                                >{item.vin}</p>
                                            </Col>


                                            <Col md="auto" className="d-flex justify-content-end">
                                                <div className='buttons'>

                                                    <Button
                                                        title='Удалить'
                                                        variant="outline-danger"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: '2px',
                                                            marginBottom: '2px',
                                                            marginRight: '4px'
                                                        }}
                                                        onClick={() => deleteItem(item.id)}
                                                    >

                                                        <span className='gg-trash'></span>
                                                    </Button>


                                                    <Button
                                                        title='Редактировать'
                                                        variant="outline-warning"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: '2px',
                                                            marginBottom: '2px',
                                                            marginRight: '5px'
                                                        }}
                                                        onClick={() => {
                                                            window.location.href = `/new-leasing-subject/${item.id}`;
                                                        }}
                                                    >
                                                        <span className='gg-pen'></span>
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>

                                </div>
                            </CSSTransition>
                        ))
                    ) : (
                        items.map((item) => (
                            <CSSTransition key={item.id} timeout={250} classNames="fade">
                                <div key={item.id}>

                                    <Container fluid className='container-client-list-punkt'>
                                        <Row>
                                            <Col className='text-id' md="auto" style={{width: '100px'}}>
                                                <p>{item.id}</p>
                                            </Col>
                                            <Col className='text-inform'>

                                                <p
                                                >{item.title}</p>
                                            </Col>
                                            <Col className='text-inform'>

                                                <p
                                                >{item.vin}</p>
                                            </Col>


                                            <Col md="auto" className="d-flex justify-content-end">
                                                <div className='buttons'>

                                                    <Button
                                                        title='Удалить'
                                                        variant="outline-danger"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: '2px',
                                                            marginBottom: '2px',
                                                            marginRight: '4px'
                                                        }}
                                                        onClick={() => deleteItem(item.id)}
                                                    >

                                                        <span className='gg-trash'></span>
                                                    </Button>


                                                    <Button
                                                        title='Редактировать'
                                                        variant="outline-warning"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: '2px',
                                                            marginBottom: '2px',
                                                            marginRight: '5px'
                                                        }}
                                                        onClick={() => {
                                                            window.location.href = `/new-leasing-subject/${item.id}`;
                                                        }}
                                                    >
                                                        <span className='gg-pen'></span>
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>

                                </div>
                            </CSSTransition>
                        )))}
                </TransitionGroup>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Удаление предмета лизинга</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Вы уверены, что хотите удалить этот предмет лизинга?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Удалить
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Container fluid>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <a onClick={() => setCurrentPage(currentPage - 1)}
                               className={currentPage === 1 ? 'disabled' : ''}
                               variant="outline-dark"
                               style={{borderWidth: '2px', marginBottom: '2px', marginRight: '5px'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                     className="bi bi-caret-left" viewBox="0 0 16 16">
                                    <path
                                        d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
                                </svg>
                            </a>
                            <span>Страница {currentPage}</span>
                            <a onClick={() => setCurrentPage(currentPage + 1)}
                               className={currentPage === totalPages ? 'disabled' : ''}
                               variant="dark"
                               style={{borderWidth: '2px', marginBottom: '2px', marginRight: '5px', color: "dark"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                     className="bi bi-caret-right" viewBox="0 0 16 16">
                                    <path
                                        d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                                </svg>
                            </a>
                        </Col>
                    </Row>
                </Container>


            </div>

        </>


    )
}

export default ClientSubjectList