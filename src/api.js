const apiKey = '36095282-c36062feac43667220302dbf6';

export async function fetchImages(searchQuery, page = 1, perPage = 40) {
  const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
  const data = await response.json();
  if (data.hits && data.hits.length > 0) {
    return data.hits;
  } else {
    throw new Error('No images found.');
  }
}