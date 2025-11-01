import React from 'react';
import {Dropdown} from 'react-bootstrap';

const ClientDropdown = ({clients, onSelectClient}) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Выберите клиента
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {clients.map((client) => (
                    <Dropdown.Item key={client.id} onClick={() => onSelectClient(client)}>
                        {client.surname} {client.name} {client.patronymic}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ClientDropdown;