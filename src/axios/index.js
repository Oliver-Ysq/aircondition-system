import axios from "axios";

const instance = axios.create({
    baseURL: "http://121.36.93.141:8000/",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
});

export default instance;
