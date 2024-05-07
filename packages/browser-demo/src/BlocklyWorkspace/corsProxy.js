import axios from 'axios';

export async function fetchData(uri) {
  try {
    const response = await axios.get(uri);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error.response.data);
    throw error;
  }
}
