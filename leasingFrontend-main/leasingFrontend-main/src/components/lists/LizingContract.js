import React from 'react'
import {Container, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import "../../css/clientlist.css"
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import "../../css/listpunkt.css"
import {renderToStaticMarkup} from 'react-dom/server';

import {InputGroup} from 'react-bootstrap';
import SearchForm from './SearchForm';
import {Modal} from 'react-bootstrap';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import ClientInfo from './ClientInfo';
import ItemInfo from './ItemInfo'
import {baseApiUrl, sendDeleteRequest, sendGetRequest} from '../../utils/requests';

// Начнем с первой страницы

function LizingContractList() {

    const [agreements, setAgreements] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Состояние для отображения модального окна
    const [agreementIdToDelete, setAgreementIdToDelete] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAgreements, setShowAgreements] = useState(false);
    const [foundAgreements, setFoundAgreements] = useState([]);
    const [formData, setFormData] = useState({

        leasing_agreement: '',

    });
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setShowAgreements(false);
    };


    useEffect(() => {
        // Здесь вы выполните HTTP-запрос к вашей базе данных для получения списка клиентов
        sendGetRequest("leasing-agreement/", {page: currentPage})
            .then((data) => {
                setAgreements(data.result); // Устанавливаем список клиентов в состояние
                setTotalPages(Math.ceil(data.total_amount / 10));
                console.log(data.result)

            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [currentPage]);

    const deleteAgreement = (agreementId) => {
        setAgreementIdToDelete(agreementId);
        setShowDeleteModal(true);
    };


    const handleButtonClickAgreement = () => {

        if (formData.leasing_agreement !== '') {
            sendGetRequest("leasing-agreement/", {fio: formData.leasing_agreement})
                .then((data) => {
                    if (data) {
                        setFoundAgreements(data);
                        setShowAgreements(true)
                    }
                })
                .catch((error) => {
                    console.error('Произошла ошибка при выполнении запроса:', error);
                });
        } else {
            setFoundAgreements([]);
        }
    };


    function downloadDocx(agreementId) {
        sendGetRequest("dfa/docx", { agreement_id: agreementId })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `ДФА_${agreementId}.docx`;

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });

    };

    function downloadPdf(agreementId) {
        sendGetRequest("dfa/pdf", { agreement_id: agreementId })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `ДФА_${agreementId}.pdf`;

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });

    };


    function downloadDocx2(agreementId) {
        sendGetRequest("application-for-transfer/docx", { agreement_id: agreementId })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `ЗАЯВКА_${agreementId}.docx`;

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });

    };

    function downloadPdf2(agreementId) {
        sendGetRequest("application-for-transfer/pdf", { agreement_id: agreementId })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `ЗАЯВКА_${agreementId}.pdf`;

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });

    };

    const confirmDelete = () => {
        sendDeleteRequest("leasing-agreement/", { id: agreementIdToDelete})
            .then(() => {
                // Удаление прошло успешно, обновляем список клиентов
                setAgreements(agreements.filter(agreement => agreement.id !== agreementIdToDelete));
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
                            href='/leasing-contract-list'
                            style={{
                                margin: '0px',
                                width: '70px'
                            }}
                        >ДОГОВОРЫ ЛИЗИНГА</a>
                    </Col>
                </Container>
            </div>
            <div className='container-client-list-nav'>
                <Container fluid>
                    <Row>
                        <Col>
                            <Button href='/new-leasing-contract' variant="success">Добавить</Button>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <InputGroup className="mb-3" controlId="exampleForm.ControlInput1">


                                <Form.Control
                                    type="text"
                                    name="leasing_agreement"
                                    value={formData.leasing_agreement}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={60}
                                    onBlur={(e) => {
                                        if (e.relatedTarget && e.relatedTarget.id === 'searchButton') {
                                            return;
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="leasing_agreement"]').classList.remove('error');
                                    }}


                                />

                                <Button
                                    variant="primary"
                                    style={{textAlign: 'right'}}
                                    id="searchButton"
                                    onClick={(e) => {
                                        handleButtonClickAgreement();
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
                    <Row style={{display: 'flex'}}>

                        <Col className='text-id' md='auto' style={{width: '100px'}}>
                            <p>
                                ID
                            </p>
                        </Col>
                        <Col className='text-inform' style={{flex: 2}}>
                            <div>
                                Клиент
                            </div>
                        </Col>
                        <Col className='text-inform' style={{flex: 2}}>
                            <div>
                                Предмет
                            </div>
                        </Col>
                        <Col className='text-inform' style={{flex: 1}}>
                            <div>
                                Дата
                            </div>
                        </Col>
                        <Col className='text-inform' style={{flex: 1}}>
                            <div>
                                Сумма
                            </div>
                        </Col>
                        <Col className='text-inform' style={{flex: 1}}>
                            <div>
                                Платеж
                            </div>
                        </Col>


                        <Col md="auto" className="d-flex justify-content-end">
                            <div style={{minWidth: '313.4px'}}/>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='container-client-list'>

                <TransitionGroup>


                    {showAgreements & formData.leasing_agreement !== '' ? (
                        foundAgreements.map((agreement) => (
                            <CSSTransition key={agreement.id} timeout={250} classNames="fade">
                                <div key={agreement.id}>

                                    <Container fluid className='container-client-list-punkt'>
                                        <Row style={{display: 'flex'}}>
                                            <Col className='text-id' md="auto" style={{width: '100px'}}>
                                                <p>{agreement.id}</p>
                                            </Col>

                                            <Col className='text-inform' style={{flex: 2}}>
                                                <ClientInfo clientId={agreement.client}/>
                                            </Col>

                                            <Col className='text-inform' style={{flex: 2}}>
                                                <ItemInfo itemId={agreement.leasing_item}/>
                                            </Col>

                                            <Col className='text-inform' style={{flex: 1}}>

                                                <p>{agreement.agreement_date} </p>
                                            </Col>
                                            <Col className='text-inform' style={{flex: 1}}>

                                                <p>{agreement.price} </p>
                                            </Col>
                                            <Col className='text-inform' style={{flex: 1}}>

                                                <p>{agreement.payment}</p>
                                            </Col>

                                            <Col md="auto" className="d-flex justify-content-end">
                                                <div className='buttons'>
                                                    <Button variant="outline-secondary"
                                                            title='Закрытие договора'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                paddingTop: '1px',
                                                                marginBottom: '2px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                window.location.href = `/close-form/${agreement.id}`;
                                                            }}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-file-earmark-lock"
                                                             viewBox="0 0 16 16">
                                                            <path
                                                                d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z"/>
                                                            <path
                                                                d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                                                        </svg>
                                                    </Button>
                                                    <Button variant="outline-danger"
                                                            title='Заявка pdf'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                paddingTop: '1px',
                                                                marginBottom: '2px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                downloadPdf2(agreement.id);
                                                            }}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-filetype-pdf"
                                                             viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd"
                                                                  d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"/>
                                                        </svg>
                                                    </Button>
                                                    <Button variant="outline-danger"
                                                            title='ДФА pdf'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                paddingTop: '1px',
                                                                marginBottom: '2px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                downloadPdf(agreement.id);
                                                            }}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-filetype-pdf"
                                                             viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd"
                                                                  d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"/>
                                                        </svg>
                                                    </Button>

                                                    <Button variant="outline-primary"
                                                            title='Заявка docx'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                marginBottom: '2px',
                                                                paddingTop: '1px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                downloadDocx2(agreement.id);
                                                            }
                                                            }>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-filetype-docx"
                                                             viewBox="0 0 16 16" style={{padding: '1px'}}>
                                                            <path fill-rule="evenodd"
                                                                  d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"/>
                                                        </svg>
                                                    </Button>
                                                    <Button variant="outline-primary"
                                                            title='ДФА docx'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                marginBottom: '2px',
                                                                paddingTop: '1px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                downloadDocx(agreement.id);
                                                            }
                                                            }>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-filetype-docx"
                                                             viewBox="0 0 16 16" style={{padding: '1px'}}>
                                                            <path fill-rule="evenodd"
                                                                  d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"/>
                                                        </svg>
                                                    </Button>
                                                    <Button
                                                        title='Удалить'
                                                        variant="outline-danger"
                                                        type="submit"

                                                        style={{
                                                            borderWidth: '2px',
                                                            marginBottom: '2px',
                                                            marginRight: '4px'
                                                        }}
                                                        onClick={() => deleteAgreement(agreement.id)}
                                                    >

                                                        <span className='gg-trash'></span>
                                                    </Button>


                                                    <Button
                                                        variant="outline-warning"
                                                        title='Редактировать'
                                                        type="submit"
                                                        style={{
                                                            borderWidth: '2px',
                                                            marginBottom: '2px',
                                                            marginRight: '5px'
                                                        }}
                                                        onClick={() => {
                                                            window.location.href = `/new-leasing-contract/${agreement.id}`;
                                                        }}
                                                    >
                                                        <span className='gg-pen'></span>
                                                    </Button>


                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>

                                </div>
                            </CSSTransition>))

                    ) : (
                        agreements.map((agreement) => (
                            <CSSTransition key={agreement.id} timeout={250} classNames="fade">
                                <div key={agreement.id}>

                                    <Container fluid className='container-client-list-punkt'>
                                        <Row style={{display: 'flex'}}>
                                            <Col className='text-id' md="auto" style={{width: '100px'}}>
                                                <p>{agreement.id}</p>
                                            </Col>

                                            <Col className='text-inform' style={{flex: 2}}>
                                                <ClientInfo clientId={agreement.client}/>
                                            </Col>

                                            <Col className='text-inform' style={{flex: 2}}>
                                                <ItemInfo itemId={agreement.leasing_item}/>
                                            </Col>

                                            <Col className='text-inform' style={{flex: 1}}>

                                                <p>{agreement.agreement_date} </p>
                                            </Col>
                                            <Col className='text-inform' style={{flex: 1}}>

                                                <p>{agreement.price} </p>
                                            </Col>

                                            <Col className='text-inform' style={{flex: 1}}>

                                                <p>{agreement.payment}</p>
                                            </Col>

                                            <Col md="auto" className="d-flex justify-content-end">
                                                <div className='buttons'>
                                                    <Button variant="outline-secondary"
                                                            title='Закрытие договора'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                paddingTop: '1px',
                                                                marginBottom: '2px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                window.location.href = `/close-form/${agreement.id}`;
                                                            }}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-file-earmark-lock"
                                                             viewBox="0 0 16 16">
                                                            <path
                                                                d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z"/>
                                                            <path
                                                                d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                                                        </svg>
                                                    </Button>
                                                    <Button variant="outline-danger"
                                                            title='Заявка pdf'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                paddingTop: '1px',
                                                                marginBottom: '2px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                downloadPdf2(agreement.id);
                                                            }}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-filetype-pdf"
                                                             viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd"
                                                                  d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"/>
                                                        </svg>
                                                    </Button>
                                                    <Button variant="outline-danger"
                                                            title='ДФА pdf'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                paddingTop: '1px',
                                                                marginBottom: '2px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                downloadPdf(agreement.id);
                                                            }}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-filetype-pdf"
                                                             viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd"
                                                                  d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"/>
                                                        </svg>
                                                    </Button>

                                                    <Button variant="outline-primary"
                                                            title='Заявка docx'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                marginBottom: '2px',
                                                                paddingTop: '1px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                downloadDocx2(agreement.id);
                                                            }
                                                            }>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-filetype-docx"
                                                             viewBox="0 0 16 16" style={{padding: '1px'}}>
                                                            <path fill-rule="evenodd"
                                                                  d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"/>
                                                        </svg>
                                                    </Button>
                                                    <Button variant="outline-primary"
                                                            title='ДФА docx'
                                                            style={{
                                                                borderWidth: '2px',
                                                                marginRight: '4px',
                                                                marginBottom: '2px',
                                                                paddingTop: '1px',
                                                                paddingLeft: '7px',
                                                                paddingRight: '7px'
                                                            }}
                                                            onClick={() => {
                                                                downloadDocx(agreement.id);
                                                            }
                                                            }>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             fill="currentColor" class="bi bi-filetype-docx"
                                                             viewBox="0 0 16 16" style={{padding: '1px'}}>
                                                            <path fill-rule="evenodd"
                                                                  d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"/>
                                                        </svg>
                                                    </Button>

                                                    <Button
                                                        title='Удалить'
                                                        variant="outline-danger"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: '2px',
                                                            marginBottom: '2px',
                                                            marginRight: '4px'
                                                        }}
                                                        onClick={() => deleteAgreement(agreement.id)}
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
                                                            window.location.href = `/new-leasing-contract/${agreement.id}`;
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
                        <Modal.Title>Удаление договора</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Вы уверены, что хотите удалить договор?</Modal.Body>
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
                                     class="bi bi-caret-left" viewBox="0 0 16 16">
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
                                     class="bi bi-caret-right" viewBox="0 0 16 16">
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

export default LizingContractList