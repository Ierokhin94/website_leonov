import React from 'react'
import Form from 'react-bootstrap/Form';
import "../../css/clientform.css"
import {Container, Modal} from 'react-bootstrap';
import {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputMask from 'react-input-mask';
import {sendGetRequest, sendPostRequest, sendPutRequest} from '../../utils/requests';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useEffect} from 'react';
import {registerLocale, setDefaultLocale} from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import {baseApiUrl} from '../../utils/requests';


import Overlay1 from '../overlays/LizingSubjectForm/overlay1';
import Overlay2 from '../overlays/LizingSubjectForm/overlay2';
import Overlay3 from '../overlays/LizingSubjectForm/overlay3';
import Overlay4 from '../overlays/LizingSubjectForm/overlay4';
import Overlay5 from '../overlays/LizingSubjectForm/overlay5';
import Overlay6 from '../overlays/LizingSubjectForm/overlay6';
import Overlay7 from '../overlays/LizingSubjectForm/overlay7';
import Overlay8 from '../overlays/LizingSubjectForm/overlay8';
import Overlay9 from '../overlays/LizingSubjectForm/overlay9';
import Overlay10 from '../overlays/LizingSubjectForm/overlay10';
import Overlay11 from '../overlays/LizingSubjectForm/overlay11';
import Overlay12 from '../overlays/LizingSubjectForm/overlay12';
import Overlay13 from '../overlays/LizingSubjectForm/overlay13';
import Overlay14 from '../overlays/LizingSubjectForm/overlay14';
import Overlay15 from '../overlays/LizingSubjectForm/overlay15';

function LizingSubjectForm() {
    registerLocale('ru', ru);
    setDefaultLocale('ru');
    const [datePickerError, setDatePickerError] = useState(false);
    const [hasEmptyFields, setHasEmptyFields] = useState(false);
    const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {id} = useParams();
    const [formData, setFormData] = useState({
        title: '',
        pts: '',
        vin: '',
        vehicle_model_ts: '',
        year_of_vehicle_manufacture_ts: '',
        engine_model: '',
        chassis: '',
        body: '',
        body_color: '',
        issued_passport_organization: '',
        passport_issue_date: '',
        registration_certificate: '',
        register_sign: '',
        mileage: '',
        price: '',


    });

    const [isSentSuccessfully, setIsSentSuccessfully] = useState(false);
    const fetchItemData = async (id) => {
        try {
            const data = await sendGetRequest("leasing-item/", {id: id})

            if (data) {
                setFormData(data);
            }
        } catch (error) {
            console.error('Ошибка при получении данных клиента:', error);
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
            return !value || (typeof value === 'string' && value.trim() === '');
        });
        return emptyFields;
    };

    const handleFormSubmit = async () => {
        if (!hasTriedToSubmit) {
            setHasTriedToSubmit(true);
        }

        const emptyFields = validateForm();

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

        try {
            console.log(formData);
            let response = await sendPostRequest("leasing-item/", formData);
            console.log(response);
            setShowModal(true);

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

        const emptyFields = validateForm();

        if (emptyFields.length > 0 || datePickerError) {

            emptyFields.forEach((fieldName) => {

                const inputElement = document.querySelector(`[name="${fieldName}"]`);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            });
            return;
        }
        try {
            const data = sendPutRequest("leasing-item/", formData, { id: id })
            console.log(data);
            setShowModalEdit(true);
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    };


    const handleDateOfPassIsue = (date) => {
        // Преобразовываем дату в формат "YYYY-MM-DD"
        let formattedDateOfPassIsue = null;

        if (date) {
            let year = date.getFullYear()
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = `0${month}`;
            }

            if (day < 10) {
                day = `0${day}`;
            }
            formattedDateOfPassIsue = `${year}-${month}-${day}`;
        }

        console.log(formattedDateOfPassIsue)
        setFormData({
            ...formData,
            passport_issue_date: formattedDateOfPassIsue, // Исправлено: обновляем date_of_birth
        });
    };

    const handleYear = (date) => {
        // Преобразовываем дату в формат "YYYY-MM-DD"
        let formattedYear = null;

        if (date) {
            let year = date.getFullYear()
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = `0${month}`;
            }

            if (day < 10) {
                day = `0${day}`;
            }
            formattedYear = `${year}-${month}-${day}`;
        }

        console.log(formattedYear)
        setFormData({
            ...formData,
            year_of_vehicle_manufacture_ts: formattedYear,
        });
    };

    const parseDateFromString = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // Вычитаем 1 из месяца, так как месяцы в JavaScript начинаются с 0
    };

    const isDateOfPassIsueEmpty = formData.passport_issue_date === '';
    const shouldApplyRedStyle1 = hasTriedToSubmit && isDateOfPassIsueEmpty;
    const isYearEmpty = formData.year_of_vehicle_manufacture_ts === '';
    const shouldApplyRedStyle2 = hasTriedToSubmit && isYearEmpty;

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchItemData(id);
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
                                href='/leasing-subject-list'
                                style={{
                                    margin: '0px',
                                    width: '70px'
                                }}
                            >ПРЕДМЕТЫ ЛИЗИНГА</a>

                            <a
                                className='breadcrumb-d'
                            >/</a>

                            <a
                                className='breadcrumb-link'
                                href='/new-leasing-subject'
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
                                href='/leasing-subject-list'
                                style={{
                                    margin: '0px',
                                    width: '70px'
                                }}
                            >ПРЕДМЕТЫ ЛИЗИНГА</a>

                            <a
                                className='breadcrumb-d'
                            >/</a>

                            <a
                                className='breadcrumb-link'
                                onClick={() => {
                                    window.location.href = `/new-leasing-subject/${id}`;
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
                                <Form.Label>Название <Overlay1/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"

                                    value={formData.title}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    onBlur={() => {
                                        if (!formData.title || formData.title.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="title"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="title"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Паспорт транспортного средства (ПТС) <Overlay2/> </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="pts"

                                    value={formData.pts}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (!formData.pts || formData.pts.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="pts"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="pts"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Идентификационный номер (VIN) <Overlay3/> </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="vin"

                                    value={formData.vin}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (!formData.vin || formData.vin.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="vin"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="vin"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Марка, модель ТС <Overlay4/> </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="vehicle_model_ts"

                                    value={formData.vehicle_model_ts}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    onBlur={() => {
                                        if (!formData.vehicle_model_ts || formData.vehicle_model_ts.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="vehicle_model_ts"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="vehicle_model_ts"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>


                            <Form.Group controlId="dob" className="mb-3">
                                <Col>
                                    <Form.Label>Год изготовления ТС <Overlay5/></Form.Label>
                                </Col>
                                <Col>
                                    <div className="customDatePickerWidth">
                                        <DatePicker
                                            selected={formData.year_of_vehicle_manufacture_ts ? parseDateFromString(formData.year_of_vehicle_manufacture_ts) : null}
                                            onChange={handleYear}
                                            dateFormat="yyyy"
                                            showYearPicker
                                            customInput={
                                                <Form.Control
                                                    name="year_of_vehicle_manufacture_ts"
                                                    className={`custom-datepicker-input ${shouldApplyRedStyle2 ? 'red-form' : ''}`}
                                                    as={InputMask}
                                                    mask="9999"
                                                    style={{width: '100%', borderWidth: '2px'}}
                                                />
                                            }
                                        />
                                    </div>
                                </Col>
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Модель, № двигателя <Overlay6/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="engine_model"

                                    value={formData.engine_model}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={60}
                                    onBlur={() => {
                                        if (!formData.engine_model || formData.engine_model.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="engine_model"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="engine_model"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Шасси (рама) № <Overlay7/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="chassis"

                                    value={formData.chassis}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (!formData.chassis || formData.chassis.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="chassis"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="chassis"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Кузов (кабина, прицеп) № <Overlay8/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="body"

                                    value={formData.body}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (!formData.body || formData.body.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="body"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="body"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Цвет кузова (кабины, прицепа) <Overlay9/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="body_color"

                                    value={formData.body_color}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}

                                    onBlur={() => {
                                        if (!formData.body_color || formData.body_color.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="body_color"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="body_color"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Наименование организации, выдавшей паспорт <Overlay10/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="issued_passport_organization"

                                    value={formData.issued_passport_organization}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    onBlur={() => {
                                        if (!formData.issued_passport_organization || formData.issued_passport_organization.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="issued_passport_organization"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="issued_passport_organization"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="dob" className='mb-3'>
                                <Col>
                                    <Form.Label>Дата выдачи паспорта <Overlay11/></Form.Label>
                                </Col>
                                <Col>
                                    <div className="customDatePickerWidth">
                                        <DatePicker
                                            style={{width: '100% !important'}}
                                            selected={formData.passport_issue_date ? parseDateFromString(formData.passport_issue_date) : null}
                                            onChange={handleDateOfPassIsue}
                                            dateFormat="dd-MM-yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <Form.Control
                                                    name='passport_issue_date'
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


                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Свидетельство о регистрации ТС (СТС) <Overlay12/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="registration_certificate"

                                    value={formData.registration_certificate}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    onBlur={() => {
                                        if (!formData.registration_certificate || formData.registration_certificate.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="registration_certificate"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="registration_certificate"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Регистрационный знак <Overlay13/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="register_sign"

                                    value={formData.register_sign}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (!formData.register_sign || formData.register_sign.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="register_sign"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="register_sign"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Пробег <Overlay14/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="mileage"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');

                                    }}
                                    value={formData.mileage}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (!formData.mileage || formData.mileage.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="mileage"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="mileage"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Цена автомобиля <Overlay15/></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');

                                    }}
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    style={{borderWidth: '2px'}}
                                    maxLength={20}
                                    onBlur={() => {
                                        if (!formData.price || formData.price.trim() === '') {
                                            if (hasTriedToSubmit) {
                                                document.querySelector('[name="price"]').classList.add('error');
                                            }
                                        }
                                    }}
                                    onFocus={() => {
                                        document.querySelector('[name="price"]').classList.remove('error');
                                    }}
                                />
                            </Form.Group>
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

                            <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)}>
                                <Modal.Header>
                                    <Modal.Title
                                        className="text-center"
                                    >Предмет лизинга изменен</Modal.Title>
                                </Modal.Header>

                                <Modal.Footer>
                                    <Button href='/leasing-subject-list' variant="secondary"
                                            onClick={() => setShowModalEdit(false)}>
                                        ОК
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header>
                                    <Modal.Title
                                        className="text-center"
                                    >Предмет лизинга создан</Modal.Title>
                                </Modal.Header>

                                <Modal.Footer>
                                    <Button
                                        href='/leasing-subject-list'
                                        variant="secondary"
                                        onClick={() => setShowModal(false)}
                                        style={{borderWidth: '2px'}}>

                                        ОК
                                    </Button>
                                </Modal.Footer>
                            </Modal>


                        </Form>
                    </div>
                </Container>
            </div>

        </>
    )
}

export default LizingSubjectForm