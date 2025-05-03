import axios from "axios"

export default async function fetchSignInfo(sign: string){
  try {
    const res = await axios.post('http://192.168.1.131:5000/generate_response', {
        sign : sign
    });
    const data = await res.data.response
    return data
  } catch (err) {
    console.error(err);
  }
};