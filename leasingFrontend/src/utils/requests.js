import axios from "axios";

export const baseUrl = "https://contract180821.ru"; // https://pezdqk.pythonanywhere.com (https://contract180821.ru) 87.249.53.31:8000
export const baseApiUrl = baseUrl + "/api/";

export async function sendPostRequest(url, data, includeAuth = true) {
    try {
        let headers = {
            "Content-Type": "application/json",
        };

        const token = localStorage.getItem("token");

        if (includeAuth && token) {
            headers.Authorization = "Bearer " + token;
        }

        const response = await fetch(baseApiUrl + url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) { // Проверяем статус ответа
            const errorData = await response.json();
            console.error("Server error: ",errorData)
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (e) {
        console.error("Error in sendPostRequest:", e)
        throw e;
    }
}

export async function sendGetRequest(url, params = {}) {
    try {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const paramsString = new URLSearchParams(params).toString();
        const fullUrl = baseApiUrl + url + (paramsString ? `?${paramsString}` : "");
        const response = await fetch(fullUrl, { headers });

        if (!response.ok) {
            const errorData = await response.json()
            console.error('HTTP error:', response.status, errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        // тк pdf и docx требует чистый респонс и обрабатывает его внутри своей функции
        if (url.includes("pdf") || url.includes("docx")){
            return response
        }

        return response.json();
    } catch (error) {
        console.error("Error during request", error)
        return "404";
    }
}

export async function sendPutRequest(url, data, params = {}) {
    try {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const paramsString = new URLSearchParams(params).toString();
        const fullUrl = baseApiUrl + url + (paramsString ? `?${paramsString}` : "");

        const response = await fetch(fullUrl, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json()
            console.error('HTTP error:', response.status, errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error during request", error)
        return "404";
    }
}


export async function sendDeleteRequest(url, params = {}) {
    try {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const paramsString = new URLSearchParams(params).toString();
        const fullUrl = baseApiUrl + url + (paramsString ? `?${paramsString}` : "");
        const response = await fetch(fullUrl, {
            method: "DELETE",
            headers: headers,
        });

        if (!response.ok) {
            const errorData = await response.json()
            console.error('HTTP error:', response.status, errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }
        return response;
    } catch (error) {
        console.error("Error during request", error)
        return "404";
    }
}