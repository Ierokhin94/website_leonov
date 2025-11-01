import React, {useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import {useNavigate} from 'react-router-dom';
import '../css/loginpage.css';
import {sendPostRequest} from '../utils/requests';
import Alert from 'react-bootstrap/Alert';


function LoginPage() {
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await sendPostRequest("login/", formData, false); // не отправляем токен при логине

            console.log("Response:", response)
            if (response && response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("authenticated", "true");
                navigate('/client-list');
            } else {
                setShowError(true);
                console.error("Ошибка: Токен не получен или ответ сервера некорректен");
            }
        } catch (error) {
            console.error('Error during login:', error);
            setShowError(true);
        }

    };


    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <div className="form-container-login">
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <div className="title">
                                        <Form.Label>Войдите, чтобы начать работу</Form.Label>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Логин"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Пароль"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Row>
                                    <Col>

                                        <Alert show={showError} variant="danger" className='custom-alert'
                                               onClose={() => setShowError(false)} dismissible>
                                            Неправильный логин или пароль
                                        </Alert>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{textAlign: 'right'}}>
                                        <Button variant="primary" type="submit">
                                            Войти
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>
                        </div>
                    </Col>
                </Row>

            </Container>
        </div>
    );
}

export default LoginPage;
