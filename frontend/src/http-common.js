import axios from "axios";

const IP_ADDRESS = process.env.IP_ADDRESS;

export default axios.create({
  baseURL: `http://${IP_ADDRESS}:8081/api`,
  headers: {
    "Content-type": "application/json"
  }
});
