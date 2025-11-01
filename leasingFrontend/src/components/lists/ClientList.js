import React from "react";
import {Container, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "../../css/clientlist.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import "../../css/listpunkt.css";
import "../../css/pagination.css";
import "../../css/breadcrumb.css";
import {baseApiUrl, sendDeleteRequest, sendGetRequest} from "../../utils/requests";

import SearchForm from "./SearchForm";
import {Modal} from "react-bootstrap";
import axios from "axios";
import {useState, useEffect} from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {InputGroup} from "react-bootstrap";

function ClientList() {
    const [currentPage, setCurrentPage] = useState(1); // Начнем с первой страницы
    const [foundClients, setFoundClients] = useState([]);

    const [clients, setClients] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Состояние для отображения модального окна
    const [clientIdToDelete, setClientIdToDelete] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [showClients, setShowClients] = useState(false);
    const [formData, setFormData] = useState({
        client: "",
    });
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setShowClients(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage
        if (!token) { // Если токена нет - не делаем запрос
            return;
        }

        sendGetRequest("clients/", {page: currentPage})
            .then((response) => {
                setClients(response.result); // Устанавливаем список клиентов в состояние
                setTotalPages(Math.ceil(response.total_amount / 10));
            })
            .catch((error) => {
                console.error("Ошибка при получении данных", error);
            });
    }, [currentPage]);

    const deleteClient = (clientId) => {
        setClientIdToDelete(clientId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        console.log(clients)
        sendDeleteRequest("clients/", {id: clientIdToDelete})
            .then(() => {
                // Удаление прошло успешно, обновляем список клиентов
                setClients(clients.filter((client) => client.id !== clientIdToDelete));
                setShowDeleteModal(false); // Закрываем модальное окно
            })
            .catch((error) => {
                console.error("Ошибка при удалении клиента", error);
                setShowDeleteModal(false); // Закрываем модальное окно в случае ошибки
            });
    };

    const handleButtonClick = () => {
        if (formData.client !== "") {
            // Формируем URL для запроса
            // const apiUrl = `${baseApiUrl}clients/?q=${formData.client}`;
            sendGetRequest("clients/", {q: formData.client})
                .then((data) => {
                    if (data) {
                        setFoundClients(data);
                        console.log(data);
                        setShowClients(true);
                    }
                })
                .catch((error) => {
                    console.error("Произошла ошибка при выполнении запроса:", error);
                });
        } else {
            setFoundClients([]);
        }
    };


    function downloadPdf(clientId) {
        sendGetRequest("anketa/pdf", {client_id: clientId})
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `Согласие_Заявителя_${clientId}.pdf`;

                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }

    function downloadDocx(clientId) {
        sendGetRequest("anketa/docx", {client_id: clientId})
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `Согласие_Заявителя_${clientId}.docx`;

                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }

    return (
        <>
            <div className="breadcrumb">
                <Container fluid>
                    <Col md="auto">
                        <a
                            className="breadcrumb-link"
                            href="/client-list"
                            style={{margin: "0px", width: "70px"}}
                        >
                            КЛИЕНТЫ
                        </a>
                    </Col>
                </Container>
            </div>
            <div className="container-client-list-nav">
                <Container fluid>
                    <Row>
                        <Col>
                            <Button href="/new-client" variant="success">
                                Добавить
                            </Button>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <InputGroup
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Control
                                    type="text"
                                    name="client"
                                    value={formData.client}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    maxLength={60}
                                    onBlur={(e) => {
                                        if (
                                            e.relatedTarget &&
                                            e.relatedTarget.id === "searchButton"
                                        ) {
                                            return;
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="client"]')
                                            .classList.remove("error");
                                    }}
                                />

                                <Button
                                    variant="primary"
                                    style={{textAlign: "right"}}
                                    id="searchButton"
                                    onClick={(e) => {
                                        handleButtonClick();
                                    }}
                                >
                                    Поиск...
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="container-client-list-header">
                <Container fluid>
                    <Row>
                        <Col className="text-id" md="auto" style={{width: "100px"}}>
                            <p>ID</p>
                        </Col>
                        <Col className="text-inform">
                            <div>ФИO</div>
                        </Col>

                        <Col className="text-inform">
                            <div>Номер телефона</div>
                        </Col>

                        <Col md="auto" className="d-flex justify-content-end">
                            <div style={{width: "190px"}}/>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="container-client-list">
                <TransitionGroup>
                    {showClients & (formData.client !== "")
                        ? foundClients.map((client) => (
                            <CSSTransition key={client.id} timeout={250} classNames="fade">
                                <div key={client.id}>
                                    <Container fluid className="container-client-list-punkt">
                                        <Row>
                                            <Col
                                                className="text-id"
                                                md="auto"
                                                style={{width: "100px"}}
                                            >
                                                <p>{client.id}</p>
                                            </Col>

                                            <Col className="text-inform">
                                                <p>
                                                    {client.surname} {client.name} {client.patronymic}{" "}
                                                </p>
                                            </Col>

                                            <Col className="text-inform">
                                                <p>{client.phone_number}</p>
                                            </Col>

                                            <Col md="auto" className="d-flex justify-content-end">
                                                <div className="buttons">
                                                    <Button
                                                        variant="outline-danger"
                                                        title="Скачать pdf"
                                                        style={{
                                                            borderWidth: "2px",
                                                            marginRight: "4px",
                                                            paddingTop: "1px",
                                                            marginBottom: "2px",
                                                            paddingLeft: "7px",
                                                            paddingRight: "7px",
                                                        }}
                                                        onClick={() => downloadPdf(client.id)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="currentColor"
                                                            class="bi bi-filetype-pdf"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"
                                                            />
                                                        </svg>
                                                    </Button>
                                                    <Button
                                                        variant="outline-primary"
                                                        title="Скачать docx"
                                                        className="docx"
                                                        style={{
                                                            borderWidth: "2px",
                                                            marginRight: "4px",
                                                            marginBottom: "2px",
                                                            paddingTop: "1px",
                                                            paddingLeft: "7px",
                                                            paddingRight: "7px",
                                                        }}
                                                        onClick={() => downloadDocx(client.id)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="currentColor"
                                                            class="bi bi-filetype-docx"
                                                            viewBox="0 0 16 16"
                                                            style={{padding: "1px"}}
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"
                                                            />
                                                        </svg>
                                                    </Button>
                                                    <Button
                                                        title="Удалить"
                                                        variant="outline-danger"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: "2px",
                                                            marginBottom: "2px",
                                                            marginRight: "4px",
                                                        }}
                                                        onClick={() => deleteClient(client.id)}
                                                    >
                                                        <span className="gg-trash"></span>
                                                    </Button>

                                                    <Button
                                                        title="Редактировать"
                                                        variant="outline-warning"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: "2px",
                                                            marginBottom: "2px",
                                                            marginRight: "5px",
                                                        }}
                                                        onClick={() => {
                                                            window.location.href = `/new-client/${client.id}`;
                                                        }}
                                                    >
                                                        <span className="gg-pen"></span>
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </CSSTransition>
                        ))
                        : clients.map((client) => (
                            <CSSTransition key={client.id} timeout={250} classNames="fade">
                                <div key={client.id}>
                                    <Container fluid className="container-client-list-punkt">
                                        <Row>
                                            <Col
                                                className="text-id"
                                                md="auto"
                                                style={{width: "100px"}}
                                            >
                                                <p>{client.id}</p>
                                            </Col>

                                            <Col className="text-inform">
                                                <p>
                                                    {client.surname} {client.name} {client.patronymic}{" "}
                                                </p>
                                            </Col>

                                            <Col className="text-inform">
                                                <p>{client.phone_number}</p>
                                            </Col>

                                            <Col md="auto" className="d-flex justify-content-end">
                                                <div className="buttons">
                                                    <Button
                                                        variant="outline-danger"
                                                        title="Скачать pdf"
                                                        style={{
                                                            borderWidth: "2px",
                                                            marginRight: "4px",
                                                            paddingTop: "1px",
                                                            marginBottom: "2px",
                                                            paddingLeft: "7px",
                                                            paddingRight: "7px",
                                                        }}
                                                        onClick={() => downloadPdf(client.id)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="currentColor"
                                                            class="bi bi-filetype-pdf"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"
                                                            />
                                                        </svg>
                                                    </Button>
                                                    <Button
                                                        variant="outline-primary"
                                                        className="docx"
                                                        title="Скачть docx"
                                                        style={{
                                                            borderWidth: "2px",
                                                            marginRight: "4px",
                                                            marginBottom: "2px",
                                                            paddingTop: "1px",
                                                            paddingLeft: "7px",
                                                            paddingRight: "7px",
                                                        }}
                                                        onClick={() => downloadDocx(client.id)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="currentColor"
                                                            class="bi bi-filetype-docx"
                                                            viewBox="0 0 16 16"
                                                            style={{padding: "1px"}}
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"
                                                            />
                                                        </svg>
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: "2px",
                                                            marginBottom: "2px",
                                                            marginRight: "4px",
                                                        }}
                                                        onClick={() => deleteClient(client.id)}
                                                        title="Удалить"
                                                    >
                                                        <span className="gg-trash"></span>
                                                    </Button>

                                                    <Button
                                                        variant="outline-warning"
                                                        type="submit"
                                                        style={{
                                                            borderWidth: "2px",
                                                            marginBottom: "2px",
                                                            marginRight: "5px",
                                                        }}
                                                        title="Редактировать"
                                                        onClick={() => {
                                                            window.location.href = `/new-client/${client.id}`;
                                                        }}
                                                    >
                                                        <span className="gg-pen"></span>
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </CSSTransition>
                        ))}
                </TransitionGroup>

                <Modal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Удаление клиента</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Вы уверены, что хотите удалить этого клиента?</Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Удалить
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Row className="d-flex justify-content-center">
                    <Col md="auto" className="mx-auto"></Col>
                </Row>

                <Container fluid>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <a
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className={currentPage === 1 ? "disabled" : ""}
                                variant="outline-dark"
                                style={{
                                    borderWidth: "2px",
                                    marginBottom: "2px",
                                    marginRight: "5px",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    fill="currentColor"
                                    class="bi bi-caret-left"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
                                </svg>
                            </a>
                            <span>Страница {currentPage}</span>
                            <a
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className={currentPage === totalPages ? "disabled" : ""}
                                variant="dark"
                                style={{
                                    borderWidth: "2px",
                                    marginBottom: "2px",
                                    marginRight: "5px",
                                    color: "dark",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    fill="currentColor"
                                    class="bi bi-caret-right"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                                </svg>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default ClientList;
