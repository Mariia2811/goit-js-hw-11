import axios from 'axios';

const API_KEY = '36095282-c36062feac43667220302dbf6';

export async function fetchImages(searchQuery, page = 1, perPage = 40) {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    const { data } = response;

    if (data.hits && data.hits.length > 0) {
      return data.hits;
    } else {
      throw new Error('No images found.');
    }
  } catch (error) {
    throw new Error('Failed to fetch images');
  }
}
