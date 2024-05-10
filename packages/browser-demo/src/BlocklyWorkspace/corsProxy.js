import axios from 'axios';

export async function fetchData(uri) {
  const response = await axios.get(uri);
  return response.data;
}
