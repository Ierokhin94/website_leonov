import React from "react";
import Form from "react-bootstrap/Form";
import "../../css/clientform.css";
import {Container, FormControl} from "react-bootstrap";
import {useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
import {sendGetRequest, sendPostRequest, sendPutRequest} from "../../utils/requests";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import "../../css/dropdowns.css";
import {InputGroup} from "react-bootstrap";
import {registerLocale, setDefaultLocale} from "react-datepicker";
import ru from "date-fns/locale/ru";
import {baseApiUrl} from "../../utils/requests";

import Overlay1 from "../overlays/LizingContractForm/overlay1";
import Overlay2 from "../overlays/LizingContractForm/overlay2";
import Overlay3 from "../overlays/LizingContractForm/overlay3";
import Overlay4 from "../overlays/LizingContractForm/overlay4";
import Overlay5 from "../overlays/LizingContractForm/overlay5";
import Overlay6 from "../overlays/LizingContractForm/overlay6";
import Overlay7 from "../overlays/LizingContractForm/overlay7";
import Overlay8 from "../overlays/LizingContractForm/overlay8";
import Overlay9 from "../overlays/LizingContractForm/overlay9";
import Overlay10 from "../overlays/LizingContractForm/overlay10";
import Overlay11 from "../overlays/LizingContractForm/overlay11";
import {findRenderedDOMComponentWithTag} from "react-dom/test-utils";

function LizingContractForm() {
    registerLocale("ru", ru);
    setDefaultLocale("ru");
    const [datePickerError, setDatePickerError] = useState(false);
    const [hasEmptyFields, setHasEmptyFields] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {id} = useParams();
    const [firstAgreementId, setFirstAgreementId] = useState(null);
    const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownItem, setShowDropdownItem] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientFound, setClientFound] = useState(false);
    const [itemFound, setItemFound] = useState(false);
    const [foundClients, setFoundClients] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [selectedLeasingItem, setSelectedLeasingItem] = useState(null);
    const [formData, setFormData] = useState({
        agreement_date: "",
        price: "",
        agreement_term: "",
        payment_schedule: "",
        interest_rate: "",
        moratorium: "",
        payment_split_checkbox: false,
        transfer_amount_via_RS: null,
        cash_withdrawal_amount_DS: null,
        client: "",
        leasing_item: "",
    });
    const [searchData, setSearchData] = useState({
        client: "",
        leasing_item: "",
    });

    const [redData, setRedData] = useState({
        agreement_date: "",
        price: "",
        agreement_term: "",
        payment_schedule: "",
        interest_rate: "",
        moratorium: "",
        payment_split_checkbox: false,
        transfer_amount_via_RS: "",
        cash_withdrawal_amount_DS: "",
        client: "",
        leasing_item: "",
        client_fio: "",
    });

    const [clientData, setClientData] = useState({
        text: "",
    });
    const [itemData, setItemData] = useState({
        text: "",
    });

    const [isSentSuccessfully, setIsSentSuccessfully] = useState(false);
    const fetchAgreementData = async (id) => {
        try {
            const agreementData = await sendGetRequest("leasing-agreement/", {id: id})


            if (agreementData) {
                console.log(agreementData);
                setRedData(agreementData);

                const clientIDRed = agreementData.client;
                const itemIDRed = agreementData.leasing_item;
                setFormData({
                    ...formData,
                    agreement_date: agreementData.agreement_date,
                    price: agreementData.price,
                    agreement_term: agreementData.agreement_term,
                    payment_schedule: agreementData.payment_schedule,
                    interest_rate: agreementData.interest_rate,
                    moratorium: `${agreementData.moratorium}`,
                    payment_split_checkbox: agreementData.payment_split_checkbox,
                    transfer_amount_via_RS: agreementData.transfer_amount_via_RS,
                    cash_withdrawal_amount_DS: agreementData.cash_withdrawal_amount_DS,
                }); // Теперь это значение будет обновлено

                setSearchData({
                    ...searchData,
                    client: agreementData.client,
                    leasing_item: agreementData.leasing_item,
                });

                try {
                    const [clientRedData, itemRedData] = await Promise.all([
                        sendGetRequest("clients/", {id: clientIDRed}),
                        sendGetRequest("leasing-item/", {id: itemIDRed}),
                    ]);

                    if (clientData) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            client:
                                clientRedData.surname +
                                " " +
                                clientRedData.name +
                                " " +
                                clientRedData.patronymic,
                        }));
                        if (itemData) {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                leasing_item: itemRedData.title,
                            }));
                        }
                    }
                } catch (error) {
                    console.error("Error fetching client or item data:", error);
                    throw error;
                }
            }
        } catch (error) {
            console.error("Error fetching agreement data:", error);
            throw error;
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setShowDropdown(false);
        setShowDropdownItem(false);
    };

    function downloadDocx(agreementId) {
        sendGetRequest("dfa/docx",{ agreement_id: agreementId })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `ДФА_${agreementId}.docx`;

                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }

    function downloadPdf(agreementId) {
        sendGetRequest("dfa/pdf",{ agreement_id: agreementId })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `ДФА_${agreementId}.pdf`;

                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }

    function downloadDocx2(agreementId) {
        sendGetRequest("application-for-transfer/docx",{ agreement_id: agreementId })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `ЗАЯВКА_${agreementId}.docx`;

                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }

    function downloadPdf2(agreementId) {
        sendGetRequest("application-for-transfer/pdf",{ agreement_id: agreementId })
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `ЗАЯВКА_${agreementId}.pdf`;

                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            });
    }

    const validateForm = () => {
        const emptyFields = Object.keys(formData).filter((fieldName) => {
            const value = formData[fieldName];
            const inputElement = document.querySelector(`[name="${fieldName}"]`);

            // Проверка на пустое поле и на то, что поле не является неактивным
            const isEmpty =
                (!value || (typeof value === "string" && value === "")) &&
                !(inputElement && inputElement.disabled) &&
                inputElement &&
                inputElement.type !== "checkbox";

            // Проверка, если хотя бы одно из полей после галочки заполнено, исключаем другие поля из валидации

            return isEmpty;
        });
        return emptyFields;
    };

    const handleFormSubmit = async () => {
        if (!hasTriedToSubmit) {
            setHasTriedToSubmit(true);
        }

        const emptyFields = validateForm();
        console.log(formData.price);
        console.log(formData.transfer_amount_via_RS);
        console.log(formData.cash_withdrawal_amount_DS);
        if (
            formData.payment_split_checkbox === true &&
            parseInt(formData.price, 10) !==
            parseInt(formData.transfer_amount_via_RS, 10) +
            parseInt(formData.cash_withdrawal_amount_DS, 10)
        ) {
            document.querySelector('[name="price"]').classList.add("error");
            document
                .querySelector('[name="transfer_amount_via_RS"]')
                .classList.add("error");
            document
                .querySelector('[name="cash_withdrawal_amount_DS"]')
                .classList.add("error");
            return;
        }
        if (
            emptyFields.length > 0 ||
            formData.agreement_date === "" ||
            searchData.client === "" ||
            searchData.leasing_item === ""
        ) {
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
            const requestData = {
                agreement_date: formData.agreement_date,
                price: formData.price,
                agreement_term: formData.agreement_term,
                payment_schedule: formData.payment_schedule,
                interest_rate: formData.interest_rate,
                moratorium: formData.moratorium,
                payment_split_checkbox: formData.payment_split_checkbox,
                transfer_amount_via_RS: formData.transfer_amount_via_RS,
                cash_withdrawal_amount_DS: formData.cash_withdrawal_amount_DS,
                client_fio: formData.client,

                client: searchData.client,
                leasing_item: searchData.leasing_item,
            };

            console.log(requestData);
            let response = await sendPostRequest("leasing-agreement/", requestData);
            console.log(response);
            setShowModal(true);
            if (response.hasOwnProperty("id")) {
                setFirstAgreementId(response.id);
                // Теперь переменная "id" содержит значение ID из response
                console.log("ID:", firstAgreementId);

                // Вы можете использовать переменную "id" в дальнейшем коде по вашему усмотрению.
            } else {
                console.log("Ответ не содержит поля 'id'.");
            }

            // if (responseData.success) {
            //     setIsSentSuccessfully(true);
            // } else {
            //     console.error('Authentication failed');
            // }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSaveClick = async () => {
        if (!hasTriedToSubmit) {
            setHasTriedToSubmit(true);
        }

        const emptyFields = validateForm();
        console.log(formData);
        console.log(searchData);

        if (
            formData.payment_split_checkbox === true &&
            parseInt(formData.price, 10) !==
            parseInt(formData.transfer_amount_via_RS, 10) +
            parseInt(formData.cash_withdrawal_amount_DS, 10)
        ) {
            document.querySelector('[name="price"]').classList.add("error");
            document
                .querySelector('[name="transfer_amount_via_RS"]')
                .classList.add("error");
            document
                .querySelector('[name="cash_withdrawal_amount_DS"]')
                .classList.add("error");
            return;
        }

        if (emptyFields.length > 0 || datePickerError) {
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
            const requestData = {
                agreement_date: formData.agreement_date,
                price: formData.price,
                agreement_term: formData.agreement_term,
                payment_schedule: formData.payment_schedule,
                interest_rate: formData.interest_rate,
                moratorium: formData.moratorium,
                payment_split_checkbox: formData.payment_split_checkbox,
                transfer_amount_via_RS: formData.transfer_amount_via_RS,
                cash_withdrawal_amount_DS: formData.cash_withdrawal_amount_DS,
                client_fio: formData.client,

                client: searchData.client,
                leasing_item: searchData.leasing_item,
            };

            console.log(requestData);
            const data = sendPutRequest("leasing-agreement/", requestData, {id: id});

            console.log(data);
            setShowModalEdit(true);

        } catch (error) {
            // Обработка ошибок при выполнении PUT-запроса
            console.error("Ошибка при сохранении данных:", error);
        }
    };

    const handleButtonClick = () => {
        if (formData.client !== "") {
            // Формируем URL для запроса
            const apiUrl = `${baseApiUrl}clients/?q=${formData.client}`;

            sendGetRequest("clients/", {q: formData.client})
                .then((data) => {
                    if (data) {
                        setFoundClients(data);
                        setClientFound(true);
                        setShowDropdown(true);
                    }
                })
                .catch((error) => {
                    console.error("Произошла ошибка при выполнении запроса:", error);
                });
        } else {
            setFoundClients([]);
            setShowDropdown(false);
        }
    };

    const handleButtonClickItem = () => {
        if (formData.leasing_item !== "") {
            // Формируем URL для запроса
            const apiUrl = `${baseApiUrl}leasing-item/?title=${formData.leasing_item}&vin=${formData.leasing_item}&pts=${formData.leasing_item}`;

            sendGetRequest("leasing-item/", {
                title: formData.leasing_item,
                vin: formData.leasing_item,
                pts: formData.leasing_item,
            })
                .then((data) => {
                    if (data) {
                        setFoundItems(data);
                        setItemFound(true);
                        setShowDropdownItem(true);
                    }
                })
                .catch((error) => {
                    console.error("Произошла ошибка при выполнении запроса:", error);
                });
        } else {
            setFoundItems([]);
            setShowDropdownItem(false);
        }
    };

    const handleSelectClient = (client) => {
        setFormData({
            ...formData,
            client: client.surname + " " + client.name + " " + client.patronymic,
        });
        setSearchData({...searchData, client: client.id});
        setSelectedClient(client);
        setShowDropdown(false);
    };

    const handleSelectItem = (leasing_item) => {
        setFormData({...formData, leasing_item: leasing_item.title});
        setSearchData({...searchData, leasing_item: leasing_item.id});
        setSelectedLeasingItem(leasing_item);
        setShowDropdownItem(false);
    };

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked; // Проверяем, была ли установлена галочка
        const inputElements = document.querySelectorAll("input[name]");
        inputElements.forEach((input) => {
            if (
                input.name === "transfer_amount_via_RS" ||
                input.name === "cash_withdrawal_amount_DS"
            ) {
                input.classList.remove("error");
                input.value = "";
            }
        });

        if (!isChecked) {
            // Если галочка не установлена, очистить значения полей
            setFormData({
                ...formData,
                transfer_amount_via_RS: null, // Очищаем значение поля transfer_amount_via_RS
                cash_withdrawal_amount_DS: null, // Очищаем значение поля cash_withdrawal_amount_DS
                payment_split_checkbox: false,
            });
        } else {
            // Если галочка установлена, оставить значения полей неизменными
            setFormData({
                ...formData,
                payment_split_checkbox: true,
            });
        }
    };
    // Устанавливаем значение в true или false

    const handleAgreementDate = (date) => {
        // Преобразовываем дату в формат "YYYY-MM-DD"
        let formattedAgreementDate = null;

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
            formattedAgreementDate = `${year}-${month}-${day}`;
        }

        console.log(formattedAgreementDate);
        setFormData({
            ...formData,
            agreement_date: formattedAgreementDate, // Исправлено: обновляем date_of_birth
        });
    };

    const parseDateFromString = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day); // Вычитаем 1 из месяца, так как месяцы в JavaScript начинаются с 0
    };

    const isAgreementDateEmpty = formData.agreement_date === "";
    const shouldApplyRedStyle = hasTriedToSubmit && isAgreementDateEmpty;
    const [hasErrorClient, setHasErrorClient] = useState(false);
    const [errorMessageClient, setErrorMessageClient] = useState("");
    const [hasErrorItem, setHasErrorItem] = useState(false);
    const [errorMessageItem, setErrorMessageItem] = useState("");

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchAgreementData(id);
        }
    }, [id]);

    return (
        <>
            <div className="breadcrumb">
                {!isLoading && (
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
                                href="/new-leasing-contract"
                                style={{margin: "0px", width: "70px"}}
                            >
                                ДОБАВИТЬ
                            </a>
                        </Col>
                    </Container>
                )}

                {isLoading && (
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
                                    window.location.href = `/new-leasing-contract/${id}`;
                                }}
                                style={{margin: "0px", width: "70px"}}
                            >
                                РЕДАКТИРОВАТЬ
                            </a>
                        </Col>
                    </Container>
                )}
            </div>

            <div className="container-client-form">
                <Container>
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
                                                formData.agreement_date
                                                    ? parseDateFromString(formData.agreement_date)
                                                    : null
                                            }
                                            onChange={handleAgreementDate}
                                            dateFormat="dd-MM-yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <Form.Control
                                                    name="agreement_date"
                                                    className={`custom-datepicker-input ${
                                                        shouldApplyRedStyle ? "red-form" : "" // Опциональный стиль для поля ввода
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
                            <Form.Group>
                                <Form.Label>
                                    Клиент <Overlay2/>
                                </Form.Label>
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
                                            if (
                                                !formData.client ||
                                                formData.client === "" ||
                                                searchData.client === ""
                                            ) {
                                                setHasErrorClient(true);
                                                setErrorMessageClient("Клиент не выбран.");
                                                document
                                                    .querySelector('[name="client"]')
                                                    .classList.add("error");
                                                if (hasTriedToSubmit) {
                                                    document
                                                        .querySelector('[name="client"]')
                                                        .classList.add("error");
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            setHasErrorClient(false);
                                            setErrorMessageClient("");
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

                                    {showDropdown && clientFound && (
                                        <div className="client-dropdown">
                                            {foundClients.map((client) => (
                                                <div
                                                    key={client.id}
                                                    className="client-option"
                                                    onClick={() => {
                                                        handleSelectClient(client);
                                                        setShowDropdown(false);
                                                        setHasErrorClient(false);
                                                        setErrorMessageClient("");
                                                        document
                                                            .querySelector('[name="client"]')
                                                            .classList.remove("error");
                                                    }}
                                                >
                                                    {client.surname} {client.name} {client.patronymic}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </InputGroup>
                                {hasErrorClient && !showDropdown && (
                                    <div className="error-message" style={{textAlign: "right"}}>
                                        {errorMessageClient}
                                    </div>
                                )}
                            </Form.Group>

                            <Form.Label>
                                Предмет лизинга <Overlay3/>
                            </Form.Label>
                            <InputGroup
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Control
                                    type="text"
                                    name="leasing_item"
                                    value={formData.leasing_item}
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
                                        if (
                                            !formData.leasing_item ||
                                            formData.leasing_item === "" ||
                                            searchData.leasing_item === ""
                                        ) {
                                            setHasErrorItem(true);
                                            setErrorMessageItem("Предмет лизинга не выбран.");
                                            document
                                                .querySelector('[name="leasing_item"]')
                                                .classList.add("error");
                                            if (hasTriedToSubmit) {
                                                document
                                                    .querySelector('[name="leasing_item"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        setHasErrorItem(false);
                                        setErrorMessageItem("");
                                        document
                                            .querySelector('[name="leasing_item"]')
                                            .classList.remove("error");
                                    }}
                                />

                                <Button
                                    variant="primary"
                                    id="searchButton"
                                    style={{textAlign: "right"}}
                                    onClick={(e) => {
                                        handleButtonClickItem();
                                    }}
                                >
                                    Поиск...
                                </Button>

                                {showDropdownItem && (
                                    <div className="item-dropdown">
                                        {foundItems.map((leasing_item) => (
                                            <div
                                                key={leasing_item.id}
                                                className="item-option"
                                                onClick={() => {
                                                    handleSelectItem(leasing_item);
                                                    setShowDropdownItem(false);
                                                    setHasErrorItem(false);
                                                    setErrorMessageItem("");
                                                }}
                                            >
                                                {leasing_item.title} {leasing_item.vin}{" "}
                                                {leasing_item.pts}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </InputGroup>
                            {hasErrorItem && !showDropdownItem && (
                                <div className="error-message" style={{textAlign: "right"}}>
                                    {errorMessageItem}
                                </div>
                            )}

                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label>
                                    Сумма договора <Overlay4/>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (!formData.price || formData.price.trim() === "") {
                                            if (hasTriedToSubmit) {
                                                document
                                                    .querySelector('[name="price"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="price"]')
                                            .classList.remove("error");
                                    }}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState" className="mb-3">
                                <Form.Label>
                                    Срок договора <Overlay5/>
                                </Form.Label>
                                <Form.Select
                                    name="agreement_term"
                                    value={formData.agreement_term}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    onBlur={() => {
                                        if (
                                            !formData.agreement_term ||
                                            formData.agreement_term.trim() === ""
                                        ) {
                                            if (hasTriedToSubmit) {
                                                document
                                                    .querySelector('[name="agreement_term"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="agreement_term"]')
                                            .classList.remove("error");
                                    }}
                                >
                                    <option value="">Выбрать...</option>
                                    <option value="12">12 месяцев</option>
                                    <option value="24">24 месяцев</option>
                                    <option value="36">36 месяцев</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState" className="mb-3">
                                <Form.Label>
                                    График платежей <Overlay6/>
                                </Form.Label>
                                <Form.Select
                                    name="payment_schedule"
                                    value={formData.payment_schedule}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    onBlur={() => {
                                        if (
                                            !formData.payment_schedule ||
                                            formData.payment_schedule.trim() === ""
                                        ) {
                                            if (hasTriedToSubmit) {
                                                document
                                                    .querySelector('[name="payment_schedule"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="payment_schedule"]')
                                            .classList.remove("error");
                                    }}
                                >
                                    <option value="">Выбрать...</option>
                                    <option value="Аннуитет">Аннуитет</option>
                                    <option value="Гибрид">Гибрид</option>
                                    <option value="Градиент">Градиент</option>
                                    <option value="Стандарт">Стандарт</option>
                                    <option value="Проценты">Проценты</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label>
                                    Процентная ставка <Overlay7/>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="interest_rate"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                                    }}
                                    value={formData.interest_rate}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (
                                            !formData.interest_rate ||
                                            formData.interest_rate === ""
                                        ) {
                                            if (hasTriedToSubmit) {
                                                document
                                                    .querySelector('[name="interest_rate"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="interest_rate"]')
                                            .classList.remove("error");
                                    }}
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label>
                                    Мораторий <Overlay8/>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="moratorium"
                                    value={formData.moratorium}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (
                                            !formData.moratorium ||
                                            formData.moratorium.trim() === ""
                                        ) {
                                            if (hasTriedToSubmit) {
                                                document
                                                    .querySelector('[name="moratorium"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="moratorium"]')
                                            .classList.remove("error");
                                    }}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label={
                                        <>
                                            Разделение платежа <Overlay9/>
                                        </>
                                    }
                                    checked={formData.payment_split_checkbox}
                                    onChange={handleCheckboxChange}
                                    style={{marginRight: "5px"}}
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label>
                                    Сумма перевода через РС <Overlay10/>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="transfer_amount_via_RS"
                                    disabled={!formData.payment_split_checkbox}
                                    value={formData.transfer_amount_via_RS}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (hasTriedToSubmit && formData.payment_split_checkbox) {
                                            if (
                                                !formData.transfer_amount_via_RS ||
                                                formData.transfer_amount_via_RS.trim() === ""
                                            ) {
                                                document
                                                    .querySelector('[name="transfer_amount_via_RS"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="transfer_amount_via_RS"]')
                                            .classList.remove("error");
                                    }}
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                            >
                                <Form.Label>
                                    Сумма выдачи наличными ДС <Overlay11/>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cash_withdrawal_amount_DS"
                                    disabled={!formData.payment_split_checkbox}
                                    value={formData.cash_withdrawal_amount_DS}
                                    onChange={handleInputChange}
                                    style={{borderWidth: "2px"}}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (hasTriedToSubmit && formData.payment_split_checkbox) {
                                            if (
                                                !formData.cash_withdrawal_amount_DS ||
                                                formData.cash_withdrawal_amount_DS.trim() === ""
                                            ) {
                                                document
                                                    .querySelector('[name="cash_withdrawal_amount_DS"]')
                                                    .classList.add("error");
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document
                                            .querySelector('[name="cash_withdrawal_amount_DS"]')
                                            .classList.remove("error");
                                    }}
                                />
                            </Form.Group>

                            <Row>
                                {!isLoading && (
                                    <Col style={{textAlign: "right"}}>
                                        <Button
                                            variant="primary"
                                            type="button"
                                            onClick={handleFormSubmit}
                                        >
                                            Создать
                                        </Button>
                                    </Col>
                                )}

                                {isLoading && (
                                    <Col style={{textAlign: "right"}}>
                                        <Button
                                            variant="primary"
                                            type="button"
                                            onClick={handleSaveClick}
                                        >
                                            Сохранить
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </Form>

                        <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)}>
                            <Modal.Header>
                                <Modal.Title className="text-center">
                                    Договор изменен
                                </Modal.Title>
                            </Modal.Header>

                            <Modal.Footer>
                                <Button
                                    variant="outline-danger"
                                    title="Заявка pdf"
                                    onClick={() => {
                                        downloadPdf2(id);
                                    }}
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
                                    variant="outline-danger"
                                    title="ДФА pdf"
                                    onClick={() => {
                                        downloadPdf(id);
                                    }}
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
                                    title="Заявка docx"
                                    onClick={() => {
                                        downloadDocx2(id);
                                    }}
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
                                    variant="outline-primary"
                                    title="ДФА docx"
                                    onClick={() => {
                                        downloadDocx(id);
                                    }}
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
                                    onClick={() => setShowModalEdit(false)}
                                >
                                    ОК
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header>
                                <Modal.Title className="text-center">
                                    Договор создан
                                </Modal.Title>
                            </Modal.Header>

                            <Modal.Footer>
                                <Button
                                    variant="outline-danger"
                                    title="Заявка pdf"
                                    onClick={() => {
                                        downloadPdf2(firstAgreementId);
                                    }}
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
                                    variant="outline-danger"
                                    title="ДФА pdf"
                                    onClick={() => {
                                        downloadPdf(firstAgreementId);
                                    }}
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
                                    title="Заявка docx"
                                    onClick={() => {
                                        downloadDocx2(firstAgreementId);
                                    }}
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
                                    variant="outline-primary"
                                    title="ДФА docx"
                                    onClick={() => {
                                        downloadDocx(firstAgreementId);
                                    }}
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
                                >
                                    ОК
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default LizingContractForm;
