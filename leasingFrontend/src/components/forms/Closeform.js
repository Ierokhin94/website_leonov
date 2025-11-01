import React from "react";
import {Container, Col, Form, Button} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
import Modal from "react-bootstrap/Modal";
import {registerLocale, setDefaultLocale} from "react-datepicker";
import ru from "date-fns/locale/ru";
import {baseApiUrl, sendGetRequest, sendPutRequest} from "../../utils/requests";
import axios from "axios";

import Overlay1 from "../overlays/CloseForm/Overlay1";
import Overlay2 from "../overlays/CloseForm/Overlay2";

function Closeform() {
    registerLocale("ru", ru);
    setDefaultLocale("ru");
    const {id} = useParams();
    const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        date_of_closing: "",
        total_closing_price: "",
    });

    const fetchClosingData = async (id) => {
        try {
            const data = await sendGetRequest("closing-agreement/", {id: id})

            setFormData(data);
        } catch (error) {
            console.error("Ошибка при получении данных клиента:", error);
            throw error;
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const validateForm = () => {
        const emptyFields = Object.keys(formData).filter((fieldName) => {
            const value = formData[fieldName];
            return !value || (typeof value === "string" && value.trim() === "");
        });
        return emptyFields;
    };

    const handleDate = (date) => {
        let formattedDate = null;

        if (date) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = `0${month}`;
            }

            if (day < 10) {
                day = `0${day}`;
            }
            formattedDate = `${year}-${month}-${day}`;
        }

        console.log(formattedDate);
        setFormData({
            ...formData,
            date_of_closing: formattedDate,
        });
    };

    const parseDateFromString = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day); // Вычитаем 1 из месяца, так как месяцы в JavaScript начинаются с 0
    };

    function downloadDocx(docxId, date_of_closing, total_closing_price) {
        sendGetRequest("leasing-closing/docx/", {
            agreement_id: docxId,
            leasing_closing_date: date_of_closing,
            total_price: total_closing_price,
        })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `Закрытие_Договора_${docxId}.docx`;

                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }

    function downloadPdf(docxId, date_of_closing, total_closing_price) {
        sendGetRequest("leasing-closing/pdf/", {
            agreement_id: docxId,
            leasing_closing_date: date_of_closing,
            total_price: total_closing_price,
        })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `Закрытие_Договора_${docxId}.pdf`;

                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }

    const handleFormSubmit = async () => {
        if (!hasTriedToSubmit) {
            setHasTriedToSubmit(true);
        }

        const emptyFields = validateForm();

        if (emptyFields.length > 0) {
            // Подсветить пустые поля красным
            emptyFields.forEach((fieldName) => {
                // Пример: установить класс "error" для поля с именем "fieldName"
                const inputElement = document.querySelector(`[name="${fieldName}"]`);
                if (inputElement) {
                    inputElement.classList.add("error");
                }
            });
            return; // Не отправлять форму, если есть пустые поля
        }

        try {
            const data = sendPutRequest("closing-agreement/", formData,{ id: id})

            console.log(data);
            setShowModal(true);

        } catch (error) {
            console.error("Ошибка при сохранении данных:", error);
        }
    };

    const isDateEmpty = formData.date === "";
    const shouldApplyRedStyle1 = hasTriedToSubmit && isDateEmpty;

    useEffect(() => {
        if (id) {
            fetchClosingData(id);
        }
    }, [id]);
    return (
        <>
            <div className="breadcrumb">
                <Container fluid>
                    <Col md="auto">
                        <a
                            className="breadcrumb-link"
                            href="/leasing-contract-list"
                            style={{margin: "0px", width: "70px"}}
                        >
                            ДОГОВОРЫ ЛИЗИНГА
                        </a>

                        <a className="breadcrumb-d">/</a>

                        <a
                            className="breadcrumb-link"
                            onClick={() => {
                                window.location.href = `/close-form/${id}`;
                            }}
                            style={{margin: "0px", width: "70px"}}
                        >
                            ЗАКРЫТИЕ
                        </a>
                    </Col>
                </Container>
            </div>
            <div className="container-client-form">
                <Container fluid>
                    <div>
                        <Form>
                            <Form.Group controlId="dob" className="mb-3">
                                <Col>
                                    <Form.Label>
                                        Дата договора <Overlay1/>
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <div className="customDatePickerWidth">
                                        <DatePicker
                                            style={{width: "100% !important"}}
                                            selected={
                                                formData.date_of_closing
                                                    ? parseDateFromString(formData.date_of_closing)
                                                    : null
                                            }
                                            onChange={handleDate}
                                            dateFormat="dd-MM-yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <Form.Control
                                                    name="date_of_closing"
                                                    className={`custom-datepicker-input ${
                                                        shouldApplyRedStyle1 ? "red-form" : "" // Опциональный стиль для поля ввода
                                                    }`}
                                                    as={InputMask}
                                                    mask="99-99-9999"
                                                    style={{width: "100%", borderWidth: "2px"}}
                                                />
                                            }
                                        />
                                    </div>
                                </Col>
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label>
                                    Сумма договора <Overlay2/>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="total_closing_price"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                    value={formData.total_closing_price}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (
                                            !formData.total_closing_price ||
                                            formData.total_closing_price.trim() === ""
                                        ) {
                                            if (hasTriedToSubmit) {
                                                document
                                                    .querySelector('[name="total_closing_price"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="total_closing_price"]')
                                            .classList.remove("error");
                                    }}
                                />
                            </Form.Group>

                            <Col style={{textAlign: "right"}}>
                                <Button
                                    variant="primary"
                                    type="button"
                                    onClick={handleFormSubmit}
                                >
                                    Закрыть
                                </Button>
                            </Col>

                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header>
                                    <Modal.Title className="text-center">
                                        Договор закрыт
                                    </Modal.Title>
                                </Modal.Header>

                                <Modal.Footer>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() =>
                                            downloadPdf(
                                                id,
                                                formData.date_of_closing,
                                                formData.total_closing_price
                                            )
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
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
                                        onClick={() =>
                                            downloadDocx(
                                                id,
                                                formData.date_of_closing,
                                                formData.total_closing_price
                                            )
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-filetype-docx"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"
                                            />
                                        </svg>
                                    </Button>
                                    <Button
                                        href="/leasing-contract-list"
                                        variant="secondary"
                                        onClick={() => setShowModal(false)}
                                        style={{borderWidth: "2px"}}
                                    >
                                        ОК
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Form>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default Closeform;
