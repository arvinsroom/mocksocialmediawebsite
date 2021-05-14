import axios from "axios";

const environment = process.env.NODE_ENV;
export default axios.create({
  baseURL: environment === 'development' ? 'http://localhost:8081/api' : 'https://studysocial.media/api',
  headers: {
    "Content-type": "application/json"
  }
});
