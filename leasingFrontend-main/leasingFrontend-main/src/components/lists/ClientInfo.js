import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseApiUrl, sendGetRequest} from '../../utils/requests';

const ClientInfo = ({ clientId }) => {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    // Функция для получения клиента по id
    const getClientById = async (id) => {
      try {
        const data = await sendGetRequest("clients/", { id: id})
        setClientData(data);

      } catch (error) {
        console.error('Произошла ошибка при отправке запроса:', error);
      }
    };

    if (clientId) {
      getClientById(clientId);
    }
  }, [clientId]);
  const getFirstLetter = (str) => {
    if (str && str.length > 0) {
      return str[0]; // Возвращаем первый символ строки
    }
    return ''; // Возвращаем пустую строку, если строка пуста
  };


  return (
    <div>
      {clientData ? (
        <div>
            {clientData.surname} {getFirstLetter(clientData.name)}. {getFirstLetter(clientData.patronymic)}.
        </div>
      ) : (
        <p>Загрузка данных о клиенте...</p>
      )}
    </div>
  );
};

export default ClientInfo;