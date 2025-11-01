import React from 'react';
import {Dropdown} from 'react-bootstrap';

const ClientDropdown = ({clients, onSelectClient}) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                ПОИСК
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {clients.map((client) => (
                    <div style={{padding: '0px'}}>
                        <Dropdown.Item key={client.id} onClick={() => onSelectClient(client)}>
                            {client.surname} {client.name} {client.patronymic}
                        </Dropdown.Item>
                        <Dropdown.Divider/>
                    </div>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ClientDropdown;