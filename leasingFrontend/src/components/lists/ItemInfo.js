import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {baseApiUrl, sendGetRequest} from '../../utils/requests';

const ItemInfo = ({itemId}) => {
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        // Функция для получения клиента по id
        const getItemById = async (id) => {
            try {
                const data = await sendGetRequest("leasing-item/", {id: id})

                setItemData(data);

            } catch (error) {
                console.error('Произошла ошибка при отправке запроса:', error);
            }
        };

        if (itemId) {
            getItemById(itemId);
        }
    }, [itemId]);
    const getFirstLetter = (str) => {
        if (str && str.length > 0) {
            return str[0]; // Возвращаем первый символ строки
        }
        return ''; // Возвращаем пустую строку, если строка пуста
    };


    return (
        <div>
            {itemData ? (
                <div>
                    {itemData.title}
                </div>
            ) : (
                <p>Загрузка данных о клиенте...</p>
            )}
        </div>
    );
};

export default ItemInfo;