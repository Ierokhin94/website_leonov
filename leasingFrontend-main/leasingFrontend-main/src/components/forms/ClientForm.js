import React from 'react'
import Col from 'react-bootstrap/Col';
import {Modal, Container, Tooltip} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import '../../css/clientform.css'
import Button from 'react-bootstrap/Button';
import {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputMask from 'react-input-mask';
import {sendGetRequest, sendPostRequest, sendPutRequest} from '../../utils/requests';
import InputGroup from 'react-bootstrap/InputGroup'
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useEffect} from 'react';
import {registerLocale, setDefaultLocale} from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import {baseApiUrl} from '../../utils/requests';


import Overlay from "../overlays/ClientForm/overlay";
import data from "bootstrap/js/src/dom/data";

function ClientForm() {
    registerLocale('ru', ru);
    setDefaultLocale('ru');
    const [datePickerError, setDatePickerError] = useState(false);
    const [hasEmptyFields, setHasEmptyFields] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isCheckedAdditionally, setIsCheckedAdditionally] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {id} = useParams();
    const [firstClientId, setFirstClientId] = useState(null);
    const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

    const [isDateValid, setIsDateValid] = useState(true);

    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        patronymic: '',
        gender: '',
        date_of_birth: '',
        passport_series: '',
        passport_number: '',
        department_code: '',
        issued_by: '',
        date_of_issued: '',
        registration_address: '',
        place_of_birth: '',
        address: '',

    });
    const [bankData, setBankData] = useState({
        taxpayer_identification_number: null,
        phone_number: null,
        email: null,
        bank_of_recipient: null,
        bik_bank: null,
        inn_bank: null,
        kpp_bank: null,
        krr_bank: null,
        recipient_account: null,
    });

    const [additionallyData, setAdditionallyData] = useState({
        surnameAdditionally: '',
        nameAdditionally: '',
        patronymicAdditionally: '',
        date_of_birthAdditionally: '',
        place_of_birthAdditionally: '',
        genderAdditionally: '',
        passport_seriesAdditionally: '',
        passport_numberAdditionally: '',
        issued_byAdditionally: '',
        date_of_issuedAdditionally: '',
        department_codeAdditionally: '',
        registration_addressAdditionally: '',
        number_formAdditionally: '',
        date_of_issued_of_attorneyAdditionally: '',
        notary_full_nameAdditionally: '',
        number_registryAdditionally: '',
    });

    const [isSentSuccessfully, setIsSentSuccessfully] = useState(false);
    const fetchClientData = async (id) => {
        try {
            const response = sendGetRequest("clients/", {id: id}).then((clientData) => {

                setFormData({
                    ...formData,
                    surname: clientData.surname,
                    name: clientData.name,
                    patronymic: clientData.patronymic,
                    gender: clientData.gender,
                    date_of_birth: clientData.date_of_birth,
                    passport_series: clientData.passport_series,
                    passport_number: clientData.passport_number,
                    department_code: clientData.department_code,
                    issued_by: clientData.issued_by,
                    date_of_issued: clientData.date_of_issued,
                    registration_address: clientData.registration_address,
                    place_of_birth: clientData.place_of_birth,
                    address: clientData.address,
                });

                setBankData({
                    ...bankData,
                    taxpayer_identification_number: clientData.taxpayer_identification_number,
                    phone_number: clientData.phone_number,
                    email: clientData.email,
                    bank_of_recipient: clientData.bank_of_recipient,
                    bik_bank: clientData.bik_bank,
                    inn_bank: clientData.inn_bank,
                    kpp_bank: clientData.kpp_bank,
                    krr_bank: clientData.krr_bank,
                    recipient_account: clientData.recipient_account,
                });

                setAdditionallyData({
                    ...additionallyData,
                    surnameAdditionally: clientData.surnameAdditionally,
                    nameAdditionally: clientData.nameAdditionally,
                    patronymicAdditionally: clientData.patronymicAdditionally,
                    date_of_birthAdditionally: clientData.date_of_birthAdditionally,
                    place_of_birthAdditionally: clientData.place_of_birthAdditionally,
                    genderAdditionally: clientData.genderAdditionally,
                    passport_seriesAdditionally: clientData.passport_seriesAdditionally,
                    passport_numberAdditionally: clientData.passport_numberAdditionally,
                    issued_byAdditionally: clientData.issued_byAdditionally,
                    date_of_issuedAdditionally: clientData.date_of_issuedAdditionally,
                    department_codeAdditionally: clientData.department_codeAdditionally,
                    registration_addressAdditionally: clientData.registration_addressAdditionally,
                    number_formAdditionally: clientData.number_formAdditionally,
                    date_of_issued_of_attorneyAdditionally: clientData.date_of_issued_of_attorneyAdditionally,
                    notary_full_nameAdditionally: clientData.notary_full_nameAdditionally,
                    number_registryAdditionally: clientData.number_registryAdditionally,
                });

                // для отображения чекбокса по доверенности с галочкой, если нам пришла фамилия, из доверенности,
                // значит и остальные поля заполнены, следовательно нужно отобразить чекбокс и собержимое полей
                if (clientData.surnameAdditionally) {
                    setIsCheckedAdditionally(true)
                }
            })

            // const response = await axios.get(`${baseApiUrl}clients/?id=${id}`);


        } catch (error) {
            console.error('Ошибка при получении данных клиента:', error);
            throw error;
        }
    };
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleInput2Change = (e) => {
        const {name, value} = e.target;
        setBankData({...bankData, [name]: value == '' ? null : value});
    };

    const handleInput3Change = (e) => {
        const {name, value} = e.target;
        setAdditionallyData({...additionallyData, [name]: value})
    }


    const validateForm = () => {
        const emptyFields = Object.keys(formData).filter((fieldName) => {
            const value = formData[fieldName];
            return !value || (typeof value === 'string' && value.trim() === '');
        });
        return emptyFields;
    };

    const validateFormAdditionally = () => {
        const emptyFields = Object.keys(additionallyData).filter((fieldName) => {
            const value = additionallyData[fieldName];
            return !value || (typeof value === 'string' && value.trim() === '');
        });
        return emptyFields;
    };


    const handleFormSubmit = async () => {
        if (!hasTriedToSubmit) {
            setHasTriedToSubmit(true);
        }

        /* конкретная копипаста проверки валидации для отображения красных полей, если и поля основной информации активированы,
         и поля по доверенности, подсвети оба, иначе пускай подсвечивает их по отдельности
        так сделано иначе return срабатывает и поля по доверенности не сработают, если не заполнены основные*/

        const emptyFields = validateForm();
        const emptyFieldsAdditionally = validateFormAdditionally();
        if (emptyFields.length > 0 && emptyFieldsAdditionally.length > 0) {
            emptyFields.forEach((fieldName) => {
                // Пример: установить класс "error" для поля с именем "fieldName"
                const inputElement = document.querySelector(`[name="${fieldName}"]`);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            });
            emptyFieldsAdditionally.forEach((fieldName) => {
                // Пример: установить класс "error" для поля с именем "fieldName"
                const inputElement = document.querySelector(`[name="${fieldName}"]`);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            });
            return; // Не отправлять форму, если есть пустые поля
        }


        if (emptyFields.length > 0 || datePickerError) {
            // Подсветить пустые поля красным
            emptyFields.forEach((fieldName) => {
                // Пример: установить класс "error" для поля с именем "fieldName"
                const inputElement = document.querySelector(`[name="${fieldName}"]`);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            });
            return; // Не отправлять форму, если есть пустые поля
        }

        if (isCheckedAdditionally) {
            if (emptyFieldsAdditionally.length > 0 || datePickerError) {
                // Подсветить пустые поля красным
                emptyFieldsAdditionally.forEach((fieldName) => {
                    // Пример: установить класс "error" для поля с именем "fieldName"
                    const inputElement = document.querySelector(`[name="${fieldName}"]`);
                    if (inputElement) {
                        inputElement.classList.add('error');
                    }
                });
                return; // Не отправлять форму, если есть пустые поля
            }
        }

        try {
            const baseData = {
                surname: formData.surname,
                name: formData.name,
                patronymic: formData.patronymic,
                gender: formData.gender,
                date_of_birth: formData.date_of_birth,
                passport_series: formData.passport_series,
                passport_number: formData.passport_number,
                department_code: formData.department_code,
                issued_by: formData.issued_by,
                date_of_issued: formData.date_of_issued,
                registration_address: formData.registration_address,
                place_of_birth: formData.place_of_birth,
                address: formData.address,

                taxpayer_identification_number: bankData.taxpayer_identification_number,
                phone_number: bankData.phone_number,
                email: bankData.email,

                bank_of_recipient: bankData.bank_of_recipient,
                bik_bank: bankData.bik_bank,
                inn_bank: bankData.inn_bank,
                kpp_bank: bankData.kpp_bank,
                krr_bank: bankData.krr_bank,
                recipient_account: bankData.recipient_account,
            }

            let additionalDataToSend = {};
            console.log(isCheckedAdditionally)
            if (isCheckedAdditionally) {
                // Если чекбокс установлен, берем данные из additionallyData
                additionalDataToSend = {
                    surnameAdditionally: additionallyData.surnameAdditionally,
                    nameAdditionally: additionallyData.nameAdditionally,
                    patronymicAdditionally: additionallyData.patronymicAdditionally,
                    date_of_birthAdditionally: additionallyData.date_of_birthAdditionally,
                    place_of_birthAdditionally: additionallyData.place_of_birthAdditionally,
                    genderAdditionally: additionallyData.genderAdditionally,
                    passport_seriesAdditionally: additionallyData.passport_seriesAdditionally,
                    passport_numberAdditionally: additionallyData.passport_numberAdditionally,
                    issued_byAdditionally: additionallyData.issued_byAdditionally,
                    date_of_issuedAdditionally: additionallyData.date_of_issuedAdditionally,
                    department_codeAdditionally: additionallyData.department_codeAdditionally,
                    registration_addressAdditionally: additionallyData.registration_addressAdditionally,
                    number_formAdditionally: additionallyData.number_formAdditionally,
                    date_of_issued_of_attorneyAdditionally: additionallyData.date_of_issued_of_attorneyAdditionally,
                    notary_full_nameAdditionally: additionallyData.notary_full_nameAdditionally,
                    number_registryAdditionally: additionallyData.number_registryAdditionally,
                };


                // проверка на то, что все поля заполнены
                const isAdditionalDataComplete = Object.values(additionalDataToSend).every(value => value != null && value !== '');

                if (!isAdditionalDataComplete) {
                    console.error('Пожалуйста, заполните все дополнительные поля.');
                    return;
                }

            } else {
                // Если чекбокс не установлен, устанавливаем дополнительные данные в null
                additionalDataToSend = {
                    surnameAdditionally: null,
                    nameAdditionally: null,
                    patronymicAdditionally: null,
                    date_of_birthAdditionally: null,
                    place_of_birthAdditionally: null,
                    genderAdditionally: null,
                    passport_seriesAdditionally: null,
                    passport_numberAdditionally: null,
                    issued_byAdditionally: null,
                    date_of_issuedAdditionally: null,
                    department_codeAdditionally: null,
                    registration_addressAdditionally: null,
                    number_formAdditionally: null,
                    date_of_issued_of_attorneyAdditionally: null,
                    notary_full_nameAdditionally: null,
                    number_registryAdditionally: null,
                };
            }

            const requestData = {
                ...baseData,
                ...additionalDataToSend,
            };

            console.log(requestData);
            const token = localStorage.getItem('token'); // Получаем токен из localStorage
            if (!token) { // Если токена нет - не делаем запрос
                return;
            }
            console.log(token)
            let response = await sendPostRequest("clients/", requestData, token);
            console.log(response);
            setShowModal(true);

            if (response.hasOwnProperty("id")) {
                setFirstClientId(response.id);
                // Теперь переменная "id" содержит значение ID из response
                console.log("ID:", firstClientId);

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
            console.error('Error:', error);
        }
    };

    const handleSaveClick = async () => {
        if (!hasTriedToSubmit) {
            setHasTriedToSubmit(true);
        }

        /* конкретная копипаста проверки валидации для отображения красных полей, если и поля основной информации активированы,
             и поля по доверенности, подсвети оба, иначе пускай подсвечивает их по отдельности
            так сделано иначе return срабатывает и поля по доверенности не сработают, если не заполнены основные*/

        const emptyFields = validateForm();
        const emptyFieldsAdditionally = validateFormAdditionally();
        if (emptyFields.length > 0 && emptyFieldsAdditionally.length > 0) {
            emptyFields.forEach((fieldName) => {
                // Пример: установить класс "error" для поля с именем "fieldName"
                const inputElement = document.querySelector(`[name="${fieldName}"]`);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            });
            emptyFieldsAdditionally.forEach((fieldName) => {
                // Пример: установить класс "error" для поля с именем "fieldName"
                const inputElement = document.querySelector(`[name="${fieldName}"]`);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            });
            return; // Не отправлять форму, если есть пустые поля
        }


        if (emptyFields.length > 0 || datePickerError) {
            // Подсветить пустые поля красным
            emptyFields.forEach((fieldName) => {
                // Пример: установить класс "error" для поля с именем "fieldName"
                const inputElement = document.querySelector(`[name="${fieldName}"]`);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            });
            return; // Не отправлять форму, если есть пустые поля
        }

        if (isCheckedAdditionally) {
            if (emptyFieldsAdditionally.length > 0 || datePickerError) {
                // Подсветить пустые поля красным
                emptyFieldsAdditionally.forEach((fieldName) => {
                    // Пример: установить класс "error" для поля с именем "fieldName"
                    const inputElement = document.querySelector(`[name="${fieldName}"]`);
                    if (inputElement) {
                        inputElement.classList.add('error');
                    }
                });
                return; // Не отправлять форму, если есть пустые поля
            }
        }
        try {
            const baseData = {
                surname: formData.surname,
                name: formData.name,
                patronymic: formData.patronymic,
                gender: formData.gender,
                date_of_birth: formData.date_of_birth,
                passport_series: formData.passport_series,
                passport_number: formData.passport_number,
                department_code: formData.department_code,
                issued_by: formData.issued_by,
                date_of_issued: formData.date_of_issued,
                registration_address: formData.registration_address,
                place_of_birth: formData.place_of_birth,
                address: formData.address,

                taxpayer_identification_number: bankData.taxpayer_identification_number,
                phone_number: bankData.phone_number,
                email: bankData.email,

                bank_of_recipient: bankData.bank_of_recipient,
                bik_bank: bankData.bik_bank,
                inn_bank: bankData.inn_bank,
                kpp_bank: bankData.kpp_bank,
                krr_bank: bankData.krr_bank,
                recipient_account: bankData.recipient_account,
            }


            let additionalDataToSend = {};
            console.log("checkbox: ", isCheckedAdditionally)
            if (isCheckedAdditionally) {
                // Если чекбокс установлен, берем данные из additionallyData
                additionalDataToSend = {
                    surnameAdditionally: additionallyData.surnameAdditionally,
                    nameAdditionally: additionallyData.nameAdditionally,
                    patronymicAdditionally: additionallyData.patronymicAdditionally,
                    date_of_birthAdditionally: additionallyData.date_of_birthAdditionally,
                    place_of_birthAdditionally: additionallyData.place_of_birthAdditionally,
                    genderAdditionally: additionallyData.genderAdditionally,
                    passport_seriesAdditionally: additionallyData.passport_seriesAdditionally,
                    passport_numberAdditionally: additionallyData.passport_numberAdditionally,
                    issued_byAdditionally: additionallyData.issued_byAdditionally,
                    date_of_issuedAdditionally: additionallyData.date_of_issuedAdditionally,
                    department_codeAdditionally: additionallyData.department_codeAdditionally,
                    registration_addressAdditionally: additionallyData.registration_addressAdditionally,
                    number_formAdditionally: additionallyData.number_formAdditionally,
                    date_of_issued_of_attorneyAdditionally: additionallyData.date_of_issued_of_attorneyAdditionally,
                    notary_full_nameAdditionally: additionallyData.notary_full_nameAdditionally,
                    number_registryAdditionally: additionallyData.number_registryAdditionally,
                };


                // проверка на то, что все поля заполнены
                const isAdditionalDataComplete = Object.values(additionalDataToSend).every(value => value != null && value !== '');

                if (!isAdditionalDataComplete) {
                    console.error('Пожалуйста, заполните все дополнительные поля.');
                    return;
                }

            } else {
                // Если чекбокс не установлен, устанавливаем дополнительные данные в null
                additionalDataToSend = {
                    surnameAdditionally: null,
                    nameAdditionally: null,
                    patronymicAdditionally: null,
                    date_of_birthAdditionally: null,
                    place_of_birthAdditionally: null,
                    genderAdditionally: null,
                    passport_seriesAdditionally: null,
                    passport_numberAdditionally: null,
                    issued_byAdditionally: null,
                    date_of_issuedAdditionally: null,
                    department_codeAdditionally: null,
                    registration_addressAdditionally: null,
                    number_formAdditionally: null,
                    date_of_issued_of_attorneyAdditionally: null,
                    notary_full_nameAdditionally: null,
                    number_registryAdditionally: null,
                };
            }

            const requestData = {
                ...baseData,
                ...additionalDataToSend,
            };


            console.log(requestData);
            const response = sendPutRequest("clients/", requestData, {id: id})
            console.log(response);
            setShowModalEdit(true);

            // Обработка успешного ответа от сервера
            if (response.status === 200) {
                // Возможно, вы захотите обновить состояние после успешного сохранения
                // Например, сбросить форму или обновить данные в соответствии с ответом
                // setFormData(/* новое состояние данных формы */);
            }
        } catch (error) {
            // Обработка ошибок при выполнении PUT-запроса
            console.error('Ошибка при сохранении данных:', error);
        }
    };

    function downloadDocx(clientId) {
        sendGetRequest("anketa/docx", {client_id: clientId})
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `Согласие_Заявителя_${clientId}.docx`;

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
    };

    function downloadPdf(clientId) {
        sendGetRequest("anketa/pdf", {client_id: clientId})
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error("Failed to fetch the document.");
            })
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const fileName = `Согласие_Заявителя_${clientId}.pdf`;

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                a.click();
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);

        // Если галочка установлена, копируем адрес регистрации в фактический адрес
        if (!isChecked) {
            setFormData({
                ...formData,
                address: formData.registration_address,
            });
        } else {
            setFormData({
                ...formData,
                address: '', // Если галочка снята, очищаем фактический адрес
            });
        }
    };
    const handleCheckboxAdditionallyChange = () => {
        setIsCheckedAdditionally(!isCheckedAdditionally);
    }

    // Универсальная функция форматирования даты
    const formatDate = (date) => {
        if (!date) {
            return null;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${year}-${month}-${day}`;
    };


    // Общая функция-обработчик для даты
    const handleDateChange = (date, setState, stateKey) => {
        const formattedDate = formatDate(date);
        console.log(formattedDate);
        setState((prevState) => ({
            ...prevState,
            [stateKey]: formattedDate,
        }));
    };


    const handleDateOfIssuedChange = (date) => {
        handleDateChange(date, setFormData, "date_of_issued");
    };

    const handleDateOfIssued2Change = (date) => {
        handleDateChange(date, setAdditionallyData, "date_of_issuedAdditionally");
    };

    const handleDateOfIssued3Change = (date) => {
        handleDateChange(date, setAdditionallyData, "date_of_issued_of_attorneyAdditionally");
    };


    const handleDateOfBirthChange = (date) => {
        handleDateChange(date, setFormData, "date_of_birth");
    };

    const handleDateOfBirth2Change = (date) => {
        handleDateChange(date, setAdditionallyData, "date_of_birthAdditionally");
    };

    const parseDateFromString = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // Вычитаем 1 из месяца, так как месяцы в JavaScript начинаются с 0
    };

    const isDateOfIssuedEmpty = formData.date_of_issued === '';
    const shouldApplyRedStyle1 = hasTriedToSubmit && isDateOfIssuedEmpty;
    const isDateOfBirthEmpty = formData.date_of_birth === '';
    const shouldApplyRedStyle2 = hasTriedToSubmit && isDateOfBirthEmpty;

    const isDateOfBirthAdditionallyEmpty = additionallyData.date_of_birthAdditionally === '';
    const shouldApplyRedStyle3 = hasTriedToSubmit && isDateOfBirthAdditionallyEmpty;
    const isDateOfIssuedAdditionallyEmpty = additionallyData.date_of_issuedAdditionally === '';
    const shouldApplyRedStyle4 = hasTriedToSubmit && isDateOfIssuedAdditionallyEmpty;
    const isDateOfIssuedAttorneyAdditionallyEmpty = additionallyData.date_of_issued_of_attorneyAdditionally === '';
    const shouldApplyRedStyle5 = hasTriedToSubmit && isCheckedAdditionally && isDateOfIssuedAttorneyAdditionallyEmpty

    const [hasErrorSer, setHasErrorSer] = useState(false);
    const [errorMessageSer, setErrorMessageSer] = useState("");

    const [hasErrorSerAdditionally, setHasErrorSerAdditionally] = useState(false);
    const [errorMessageSerAdditionally, setErrorMessageSerAdditionally] = useState("");

    const [hasErrorNumb, setHasErrorNumb] = useState(false);
    const [errorMessageNumb, setErrorMessageNumb] = useState("");

    const [hasErrorNumbAdditionally, setHasErrorNumbAdditionally] = useState(false);
    const [errorMessageNumbAdditionally, setErrorMessageNumbAdditionally] = useState("");

    const [hasErrorIIN, setHasErrorIIN] = useState(false);
    const [errorMessageIIN, setErrorMessageIIN] = useState("");
    const [hasErrorCode, setHasErrorCode] = useState(false);
    const [errorMessageCode, setErrorMessageCode] = useState("");

    const [hasErrorCodeAdditionally, setHasErrorCodeAdditionally] = useState(false);
    const [errorMessageCodeAdditionally, setErrorMessageCodeAdditionally] = useState("");

    const [hasErrorEmail, setHasErrorEmail] = useState(false);
    const [errorMessageEmail, setErrorMessageEmail] = useState("");


    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchClientData(id);
        }
    }, [id]);
    return (
        <>
            <div className='breadcrumb'>
                {!isLoading && (
                    <Container fluid>
                        <Col md="auto">
                            <a
                                className='breadcrumb-link'
                                href='/client-list'
                                style={{
                                    margin: '0px',
                                    width: '70px'
                                }}
                            >КЛИЕНТЫ</a>

                            <a
                                className='breadcrumb-d'
                            >/</a>

                            <a
                                className='breadcrumb-link'
                                href='/new-client'
                                style={{
                                    margin: '0px',
                                    width: '70px'
                                }}
                            >ДОБАВИТЬ</a>
                        </Col>
                    </Container>)}

                {isLoading && (
                    <Container fluid>
                        <Col md="auto">
                            <a
                                className='breadcrumb-link'
                                href='/client-list'
                                style={{
                                    margin: '0px',
                                    width: '70px'
                                }}
                            >КЛИЕНТЫ</a>

                            <a
                                className='breadcrumb-d'
                            >/</a>

                            <a
                                className='breadcrumb-link'
                                onClick={() => {
                                    window.location.href = `/new-client/${id}`;
                                }}
                                style={{
                                    margin: '0px',
                                    width: '70px'
                                }}
                            >РЕДАКТИРОВАТЬ</a>
                        </Col>
                    </Container>)}
            </div>


            <div className='container-client-form'>
                <Container>
                    <div>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Фамилия <Overlay
                                    tooltipText={'ИВАНОВ (Взять из паспорта клиента, все большими буквами)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="surname"

                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={60}
                                    onBlur={() => {
                                        if (!formData.surname || formData.surname.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="surname"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="surname"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Имя <Overlay
                                    tooltipText={'ИВАН (Взять из паспорта клиента, все большими буквами)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"

                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={60}
                                    onBlur={() => {
                                        if (!formData.name || formData.name.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="name"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="name"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Отчество <Overlay
                                    tooltipText={'ИВАНОВИЧ (Взять из паспорта клиента, все большими буквами)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="patronymic"

                                    value={formData.patronymic}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={60}
                                    onBlur={() => {
                                        if (!formData.patronymic || formData.patronymic.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="patronymic"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="patronymic"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState" className='mb-3'>
                                <Form.Label>Пол <Overlay
                                    tooltipText={'Взять из паспорта клиента, выбрать из предложенных вариантов'}/></Form.Label>
                                <Form.Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    onBlur={() => {
                                        if (!formData.gender || formData.gender.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="gender"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="gender"]').classList.remove('error');
                                    }}
                                >
                                    <option value="">Выбрать...</option>
                                    <option value="М">Мужской</option>
                                    <option value="Ж">Женский</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="dob" className='mb-3'>
                                <Col>
                                    <Form.Label>Дата рождения <Overlay
                                        tooltipText={'Взять из паспорта клиента, ввести с помощью календаря'}/></Form.Label>
                                </Col>
                                <Col>
                                    <div className="customDatePickerWidth">
                                        <DatePicker
                                            style={{width: '100% !important'}}
                                            selected={formData.date_of_birth ? parseDateFromString(formData.date_of_birth) : null}
                                            onChange={handleDateOfBirthChange}
                                            dateFormat="dd-MM-yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <Form.Control
                                                    name='date_of_birth'
                                                    className={`custom-datepicker-input ${
                                                        shouldApplyRedStyle2 ? 'red-form' : '' // Опциональный стиль для поля ввода
                                                    }`}
                                                    as={InputMask}
                                                    mask="99-99-9999"
                                                    style={{width: '100%', borderWidth: '2px'}}
                                                />
                                            }
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                <Form.Label>Место Рождения <Overlay
                                    tooltipText={'Г. САНКТ-ПЕТЕРБУРГ (Взять из паспорта клиента, все большими буквами)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="place_of_birth"
                                    value={formData.place_of_birth}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={180}
                                    onBlur={() => {
                                        if (!formData.place_of_birth || formData.place_of_birth.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="place_of_birth"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="place_of_birth"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Документ</Form.Label>
                                <Form.Control
                                    placeholder='Паспорт РФ'
                                    type="text"
                                    aria-label="Disabled input example"
                                    disabled
                                    readOnly
                                    style={{borderWidth: '2px'}}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                                <Form.Label>Код подразделения <Overlay
                                    tooltipText={'780-030 (Взять из паспорта клиента, через дефис)'}/></Form.Label>
                                <Form.Control

                                    type="text"
                                    name="department_code"

                                    value={formData.department_code}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={7}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        if (e.target.value.length >= 3) {
                                            e.target.value = e.target.value.slice(0, 3) + '-' + e.target.value.slice(3);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!formData.department_code || formData.department_code.trim().length < 7) {
                                            setHasErrorCode(true);
                                            setErrorMessageCode("Код подразделения должен содержать 6 символов.");
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="department_code"]').classList.add('error');
                                            }
                                        }

                                    }}
                                    onFocus={() => {
                                        setHasErrorCode(false);
                                        setErrorMessageCode("");
                                        document.querySelector('[name="department_code"]').classList.remove('error');
                                    }}
                                />
                                {hasErrorCode && <div className="error-message">{errorMessageCode}</div>}
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                <Form.Label>Серия документа <Overlay
                                    tooltipText={'4019 (Взять из паспорта клиента, без пробелов)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="passport_series"
                                    value={formData.passport_series}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={4}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                    onBlur={() => {
                                        if (!formData.passport_series || formData.passport_series.trim().length < 4) {
                                            setHasErrorSer(true);
                                            setErrorMessageSer("Серия документа должна содержать 4 символа.");
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="passport_series"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        setHasErrorSer(false);
                                        setErrorMessageSer("");
                                        document.querySelector('[name="passport_series"]').classList.remove('error');
                                    }}
                                />
                                {hasErrorSer && <div className="error-message">{errorMessageSer}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                                <Form.Label>Номер документа <Overlay
                                    tooltipText={'376523 (Взять из паспорта клиента, без пробелов)'}/></Form.Label>
                                <Form.Control

                                    type="text"
                                    name="passport_number"

                                    value={formData.passport_number}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={6}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                    onBlur={() => {
                                        if (!formData.passport_number || formData.passport_number.trim().length < 6) {
                                            setHasErrorNumb(true);
                                            setErrorMessageNumb("Номер документа должен содержать 6 символов.");
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="passport_number"]').classList.add('error');
                                            }
                                        }

                                    }}
                                    onFocus={() => {
                                        setHasErrorNumb(false);
                                        setErrorMessageNumb("");
                                        document.querySelector('[name="passport_number"]').classList.remove('error');
                                    }}
                                />
                                {hasErrorNumb && <div className="error-message">{errorMessageNumb}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
                                <Form.Label>Кем выдан <Overlay
                                    tooltipText={'ГУ МВД РОССИИ ПО Г. САНКТ-ПЕТЕРБУРГУ И ЛЕНИНГРАДСКОЙ ОБЛАСТИ (Взять из паспорта клиента, все большими буквами)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="issued_by"
                                    value={formData.issued_by}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    onBlur={() => {
                                        if (!formData.issued_by || formData.issued_by.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="issued_by"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="issued_by"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="docIssuingDate" className="mb-3">
                                <Col>
                                    <Form.Label>Дата выдачи <Overlay
                                        tooltipText={'Взять из паспорта клиента, ввести с помощью календаря'}/></Form.Label>
                                </Col>
                                <Col>
                                    <div className="customDatePickerWidth">
                                        <DatePicker
                                            as={InputMask}
                                            mask="99-99-9999"
                                            wrapperClassName="w-full"
                                            style={{width: '100% !important'}}
                                            selected={formData.date_of_issued ? parseDateFromString(formData.date_of_issued) : null}
                                            onChange={handleDateOfIssuedChange}
                                            dateFormat="dd-MM-yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <Form.Control
                                                    className={`custom-datepicker-input ${
                                                        shouldApplyRedStyle1 ? 'red-form' : '' // Опциональный стиль для поля ввода
                                                    }`}
                                                    as={InputMask}
                                                    mask="99-99-9999"
                                                    style={{width: '100%', borderWidth: '2px'}}
                                                />
                                            }
                                        />
                                    </div>
                                </Col>
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                <Form.Label>Адрес регистрации <Overlay
                                    tooltipText={'Г. САНКТ-ПЕТЕРБУРГ, ПР-КТ МОСКОВСКИЙ, Д. 25, К. 1, КВ. 156 (Взять из паспорта клиента, все большими буквами)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="registration_address"
                                    value={formData.registration_address}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    onBlur={() => {
                                        if (!formData.registration_address || formData.registration_address.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="registration_address"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="registration_address"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Form.Check
                                        type="checkbox"
                                        id="registrationCheckbox"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                        style={{marginRight: '5px'}}
                                    />
                                    <Form.Label
                                        htmlFor="registrationCheckbox"
                                        style={{
                                            paddingLeft: '10px',
                                            paddingTop: '6px'
                                        }}
                                    >
                                        Адрес регистрации совпадает с фактическим
                                    </Form.Label>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput9">
                                <Form.Label>Фактический адрес <Overlay
                                    tooltipText={'Г. САНКТ-ПЕТЕРБУРГ, ПР-КТ МОСКОВСКИЙ, Д. 25, К. 1, КВ. 156 (Взять из паспорта клиента, все большими буквами)'}/></Form.Label>

                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    onBlur={() => {
                                        if (!formData.address || formData.address.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="address"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="address"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput10">
                                <Form.Label>ИНН <Overlay
                                    tooltipText={'781236784589 (Взять из анкеты клиента, без пробелов)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="taxpayer_identification_number"

                                    value={bankData.taxpayer_identification_number}
                                    onChange={handleInput2Change}
                                    style={{borderWidth: '2px'}}
                                    maxLength={12}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');

                                    }}
                                    onBlur={() => {
                                        if (bankData.taxpayer_identification_number.length !== 0 && (bankData.taxpayer_identification_number.length !== 10
                                            && bankData.taxpayer_identification_number.length !== 12)) {

                                            if (hasTriedToSubmit) {
                                                setHasErrorIIN(true);
                                                setErrorMessageIIN("ИНН должен сождержать от 10 до 12 символов.");
                                                document.querySelector('[name="taxpayer_identification_number"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        setHasErrorIIN(false);
                                        setErrorMessageIIN("");
                                        document.querySelector('[name="taxpayer_identification_number"]').classList.remove('error');
                                    }}
                                />
                                {hasErrorIIN && <div className="error-message">{errorMessageIIN}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput11">
                                <Col>
                                    <Form.Label>Номер телефона <Overlay
                                        tooltipText={'+79211234567 (Номер мобильного телефона +7**********)'}/></Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control

                                        style={{width: '100%', borderWidth: '2px'}}
                                        as={InputMask}
                                        mask="+7 (999) 999-99-99"
                                        type="text"
                                        name="phone_number"

                                        value={bankData.phone_number}
                                        onChange={handleInput2Change}

                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput12">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"

                                    value={bankData.email}
                                    onChange={handleInput2Change}
                                    style={{borderWidth: '2px'}}
                                    maxLength={60}
                                    onBlur={() => {
                                        if (bankData.email !== '' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(bankData.email)) {
                                            setHasErrorEmail(true);
                                            setErrorMessageEmail("Введите email");
                                            if (hasTriedToSubmit) {

                                                document.querySelector('[name="email"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        setHasErrorEmail(false);
                                        setErrorMessageEmail("");
                                        document.querySelector('[name="email"]').classList.remove('error');
                                    }}
                                />


                                {hasErrorEmail && <div className="error-message">{errorMessageEmail}</div>}
                            </Form.Group>


                            <div style={{marginBottom: "80px"}}></div>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput12">
                                <Form.Label>Номер счета <Overlay
                                    tooltipText={'«40817810909010178408» (Всегда начинается с «408…» Запросить реквизиты у клиента)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="recipient_account"
                                    value={bankData.recipient_account}
                                    onChange={handleInput2Change}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput12">
                                <Form.Label>Наименование банка <Overlay
                                    tooltipText={'«АО «Альфа-Банк», г. Москва» (Запросить реквизиты у клиента)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bank_of_recipient"
                                    value={bankData.bank_of_recipient}
                                    onChange={handleInput2Change}

                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput12">
                                <Form.Label>Бик <Overlay
                                    tooltipText={'«044525593» (Последние три цифры совпадают с тремя последними цифрами Корр. Счет \n' + 'Запросить реквизиты у клиента)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bik_bank"
                                    value={bankData.bik_bank}
                                    onChange={handleInput2Change}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}

                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput12">
                                <Form.Label>Корр. Счёт <Overlay
                                    tooltipText={'«30101810200000000593» (Последние три цифры совпадают с тремя последними БИК\n' + 'Запросить реквизиты у клиента)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="krr_bank"
                                    value={bankData.krr_bank}
                                    onChange={handleInput2Change}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}

                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput12">
                                <Form.Label>ИНН банка <Overlay
                                    tooltipText={'«7728168971» \n' + '(Запросить реквизиты у клиента)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="inn_bank"
                                    value={bankData.inn_bank}
                                    onChange={handleInput2Change}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}


                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput12">
                                <Form.Label>КПП банка <Overlay
                                    tooltipText={'«770801001»\n' + '(Запросить реквизиты у клиента)'}/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="kpp_bank"
                                    value={bankData.kpp_bank}
                                    onChange={handleInput2Change}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}

                                />
                            </Form.Group>

                            <Form.Group>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Form.Check
                                        type="checkbox"
                                        id="registrationCheckboxAdditionally"
                                        checked={isCheckedAdditionally}
                                        onChange={handleCheckboxAdditionallyChange}
                                        style={{
                                            marginRight: '5px',
                                        }}
                                    />
                                    <Form.Label
                                        htmlFor="registrationCheckboxAdditionally"
                                        style={{
                                            paddingLeft: '10px',
                                            paddingTop: '6px'
                                        }}
                                    >
                                        По доверенности от
                                    </Form.Label>
                                </div>
                            </Form.Group>

                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Фамилия <Overlay
                                        tooltipText={'ПЕТРОВ (Взять из доверенности, все большими буквами)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="surnameAdditionally"

                                        value={additionallyData.surnameAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        maxLength={60}
                                        onBlur={() => {
                                            if (!additionallyData.surnameAdditionally || additionallyData.surnameAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="surnameAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="surnameAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Имя <Overlay
                                        tooltipText={'ПЁТР (Взять из доверенности, все большими буквами)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nameAdditionally"

                                        value={additionallyData.nameAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        maxLength={60}
                                        onBlur={() => {
                                            if (!additionallyData.nameAdditionally || additionallyData.nameAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="nameAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="nameAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                    <Form.Label>Отчество <Overlay
                                        tooltipText={'ПЕТРОВИЧ (Взять из доверенности, все большими буквами)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="patronymicAdditionally"

                                        value={additionallyData.patronymicAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        maxLength={60}
                                        onBlur={() => {
                                            if (!additionallyData.patronymicAdditionally || additionallyData.patronymicAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="patronymicAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="patronymicAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group controlId="dob" className='mb-3'>
                                    <Col>
                                        <Form.Label>Дата рождения <Overlay
                                            tooltipText={'Взять из доверенности, ввести с помощью календаря'}/></Form.Label>
                                    </Col>
                                    <Col>
                                        <div className="customDatePickerWidth">
                                            <DatePicker
                                                style={{width: '100% !important'}}
                                                selected={additionallyData.date_of_birthAdditionally ? parseDateFromString(additionallyData.date_of_birthAdditionally) : ''}
                                                onChange={(data) => handleDateOfBirth2Change(data)}
                                                dateFormat="dd-MM-yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                customInput={
                                                    <Form.Control
                                                        name='date_of_birthAdditionally'
                                                        className={`custom-datepicker-input ${
                                                            shouldApplyRedStyle3 ? 'red-form' : '' // Опциональный стиль для поля ввода
                                                        }`}
                                                        as={InputMask}
                                                        mask="99-99-9999"
                                                        style={{width: '100%', borderWidth: '2px'}}
                                                    />
                                                }
                                            />
                                        </div>
                                    </Col>
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                    <Form.Label>Место Рождения <Overlay
                                        tooltipText={'Г. САНКТ-ПЕТЕРБУРГ (Взять из доверенности, все большими буквами)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="place_of_birthAdditionally"
                                        value={additionallyData.place_of_birthAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        maxLength={180}
                                        onBlur={() => {
                                            if (!additionallyData.place_of_birthAdditionally || additionallyData.place_of_birthAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="place_of_birthAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="place_of_birthAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group as={Col} controlId="formGridState" className='mb-3'>
                                    <Form.Label>Пол <Overlay
                                        tooltipText={'Взять из доверенности, выбрать из предложенных вариантов'}/></Form.Label>
                                    <Form.Select
                                        name="genderAdditionally"
                                        value={additionallyData.genderAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        onBlur={() => {
                                            if (!additionallyData.genderAdditionally || additionallyData.genderAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="genderAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="genderAdditionally"]').classList.remove('error');
                                        }}
                                    >
                                        <option value="">Выбрать...</option>
                                        <option value="М">Мужской</option>
                                        <option value="Ж">Женский</option>
                                    </Form.Select>
                                </Form.Group>
                            )}


                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                    <Form.Label>Серия документа <Overlay
                                        tooltipText={'4019 (Взять из доверенности, без пробелов)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="passport_seriesAdditionally"
                                        value={additionallyData.passport_seriesAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        maxLength={4}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        onBlur={() => {
                                            if (!additionallyData.passport_seriesAdditionally || additionallyData.passport_seriesAdditionally.trim().length < 4) {
                                                setHasErrorSerAdditionally(true);
                                                setErrorMessageSerAdditionally("Серия документа должна содержать 4 символа.");
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="passport_seriesAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            setHasErrorSerAdditionally(false);
                                            setErrorMessageSerAdditionally("");
                                            document.querySelector('[name="passport_seriesAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                    {hasErrorSerAdditionally &&
                                        <div className="error-message">{errorMessageSerAdditionally}</div>}
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                                    <Form.Label>Номер документа <Overlay
                                        tooltipText={'376523 (Взять из доверенности, без пробелов)'}/></Form.Label>
                                    <Form.Control

                                        type="text"
                                        name="passport_numberAdditionally"

                                        value={additionallyData.passport_numberAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        maxLength={6}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                        onBlur={() => {
                                            if (!additionallyData.passport_numberAdditionally || additionallyData.passport_numberAdditionally.trim().length < 6) {
                                                setHasErrorNumbAdditionally(true);
                                                setErrorMessageNumbAdditionally("Номер документа должен содержать 6 символов.");
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="passport_numberAdditionally"]').classList.add('error');
                                                }
                                            }

                                        }}
                                        onFocus={() => {
                                            setHasErrorNumbAdditionally(false);
                                            setErrorMessageNumbAdditionally("");
                                            document.querySelector('[name="passport_numberAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                    {hasErrorNumbAdditionally &&
                                        <div className="error-message">{errorMessageNumbAdditionally}</div>}
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
                                    <Form.Label>Кем выдан <Overlay
                                        tooltipText={'ГУ МВД РОССИИ ПО Г. САНКТ-ПЕТЕРБУРГУ И ЛЕНИНГРАДСКОЙ ОБЛАСТИ (Взять из доверенности, все большими буквами)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="issued_byAdditionally"
                                        value={additionallyData.issued_byAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        onBlur={() => {
                                            if (!additionallyData.issued_byAdditionally || additionallyData.issued_byAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="issued_byAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="issued_byAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group controlId="docIssuingDate" className="mb-3">
                                    <Col>
                                        <Form.Label>Дата выдачи <Overlay
                                            tooltipText={'Взять из доверенности, ввести с помощью календаря'}/></Form.Label>
                                    </Col>
                                    <Col>
                                        <div className="customDatePickerWidth">
                                            <DatePicker
                                                as={InputMask}
                                                mask="99-99-9999"
                                                wrapperClassName="w-full"
                                                style={{width: '100% !important'}}
                                                selected={additionallyData.date_of_issuedAdditionally ? parseDateFromString(additionallyData.date_of_issuedAdditionally) : null}
                                                onChange={(data) => handleDateOfIssued2Change(data)}
                                                dateFormat="dd-MM-yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                customInput={
                                                    <Form.Control
                                                        className={`custom-datepicker-input ${
                                                            shouldApplyRedStyle4 ? 'red-form' : '' // Опциональный стиль для поля ввода
                                                        }`}
                                                        as={InputMask}
                                                        mask="99-99-9999"
                                                        style={{width: '100%', borderWidth: '2px'}}
                                                    />
                                                }
                                            />
                                        </div>
                                    </Col>
                                </Form.Group>
                            )}


                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                                    <Form.Label>Код подразделения <Overlay
                                        tooltipText={'Взять из доверенности, через дефис'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="department_codeAdditionally"
                                        value={additionallyData.department_codeAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        maxLength={7}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            if (e.target.value.length >= 3) {
                                                e.target.value = e.target.value.slice(0, 3) + '-' + e.target.value.slice(3);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!additionallyData.department_codeAdditionally || additionallyData.department_codeAdditionally.trim().length < 7) {
                                                setHasErrorCodeAdditionally(true);
                                                setErrorMessageCodeAdditionally("Код подразделения должен содержать 6 символов.");
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="department_codeAdditionally"]').classList.add('error');
                                                }
                                            }

                                        }}
                                        onFocus={() => {
                                            setHasErrorCodeAdditionally(false);
                                            setErrorMessageCodeAdditionally("");
                                            document.querySelector('[name="department_codeAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                    {hasErrorCodeAdditionally &&
                                        <div className="error-message">{errorMessageCodeAdditionally}</div>}
                                </Form.Group>
                            )}


                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                                    <Form.Label>Адрес регистрации <Overlay
                                        tooltipText={'Г. САНКТ-ПЕТЕРБУРГ, ПР-КТ МОСКОВСКИЙ, Д. 25, К. 1, КВ. 156 (Взять из доверенности, все большими буквами)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="registration_addressAdditionally"
                                        value={additionallyData.registration_addressAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        onBlur={() => {
                                            if (!additionallyData.registration_addressAdditionally || additionallyData.registration_addressAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="registration_addressAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="registration_addressAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}


                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput12">
                                    <Form.Label>Номер бланка доверенности <Overlay
                                        tooltipText={'78АВ4351904 (Взять из доверенности, большими буквами без пробелов, 1ая строчка красным)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="number_formAdditionally"
                                        value={additionallyData.number_formAdditionally}
                                        onChange={handleInput3Change}
                                        onBlur={() => {
                                            if (!additionallyData.number_formAdditionally || additionallyData.number_formAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="number_formAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="number_formAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group controlId="docIssuingDate" className="mb-3">
                                    <Col>
                                        <Form.Label>Дата выдачи доверенности <Overlay
                                            tooltipText={'Взять из доверенности, ввести с помощью календаря'}/></Form.Label>
                                    </Col>
                                    <Col>
                                        <div className="customDatePickerWidth">
                                            <DatePicker
                                                as={InputMask}
                                                mask="99-99-9999"
                                                wrapperClassName="w-full"
                                                style={{width: '100% !important'}}
                                                selected={additionallyData.date_of_issued_of_attorneyAdditionally ? parseDateFromString(additionallyData.date_of_issued_of_attorneyAdditionally) : null}
                                                onChange={(data) => handleDateOfIssued3Change(data)}
                                                dateFormat="dd-MM-yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                customInput={
                                                    <Form.Control
                                                        className={`custom-datepicker-input ${
                                                            shouldApplyRedStyle5 ? 'red-form' : '' // Опциональный стиль для поля ввода
                                                        }`}
                                                        as={InputMask}
                                                        mask="99-99-9999"
                                                        style={{width: '100%', borderWidth: '2px'}}
                                                    />
                                                }
                                            />
                                        </div>
                                    </Col>
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>ФИО нотариуса, выдавшего доверенность <Overlay
                                        tooltipText={'Иванова Татьяна Ивановна (В конце доверенности, совпадает с печатью)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="notary_full_nameAdditionally"

                                        value={additionallyData.notary_full_nameAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        maxLength={180}
                                        onBlur={() => {
                                            if (!additionallyData.notary_full_nameAdditionally || additionallyData.notary_full_nameAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="notary_full_nameAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="notary_full_nameAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}

                            {isCheckedAdditionally && (
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                    <Form.Label>Номер в реестре <Overlay
                                        tooltipText={'78/125-н/78-2025-3-535 (В конце доверенности)'}/></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="number_registryAdditionally"

                                        value={additionallyData.number_registryAdditionally}
                                        onChange={handleInput3Change}
                                        style={{borderWidth: '2px'}}
                                        onBlur={() => {
                                            if (!additionallyData.number_registryAdditionally || additionallyData.number_registryAdditionally.trim() === '') {
                                                if (hasTriedToSubmit) {
                                                    document.querySelector('[name="number_registryAdditionally"]').classList.add('error');
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            document.querySelector('[name="number_registryAdditionally"]').classList.remove('error');
                                        }}
                                    />
                                </Form.Group>
                            )}


                            <Row>

                                {!isLoading && (
                                    <Col style={{textAlign: 'right'}}>
                                        <Button variant="primary" type="button" onClick={handleFormSubmit}>
                                            Создать
                                        </Button>
                                    </Col>)}

                                {isLoading && (
                                    <Col style={{textAlign: 'right'}}>
                                        <Button variant="primary" type="button"
                                                onClick={handleSaveClick}>Сохранить</Button>
                                    </Col>)}
                            </Row>

                        </Form>

                        <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)}>
                            <Modal.Header>
                                <Modal.Title
                                    className="text-center"
                                >Клиент изменен</Modal.Title>
                            </Modal.Header>

                            <Modal.Footer>
                                <Button variant="outline-danger" onClick={() => downloadPdf(id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                              d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"/>
                                    </svg>
                                </Button>
                                <Button variant="outline-primary"
                                        onClick={() => downloadDocx(id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-filetype-docx" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                              d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"/>
                                    </svg>
                                </Button>
                                <Button href='/client-list' variant="secondary" onClick={() => setShowModalEdit(false)}>
                                    ОК
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header>
                                <Modal.Title
                                    className="text-center"
                                >Клиент создан</Modal.Title>
                            </Modal.Header>

                            <Modal.Footer>
                                <Button variant="outline-danger"
                                        onClick={() => downloadPdf(id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                              d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"/>
                                    </svg>
                                </Button>
                                <Button variant="outline-primary"
                                        onClick={() => downloadDocx(firstClientId)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-filetype-docx" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                              d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"/>
                                    </svg>
                                </Button>
                                <Button href='/client-list' variant="secondary" onClick={() => setShowModal(false)}>
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


export default ClientForm
