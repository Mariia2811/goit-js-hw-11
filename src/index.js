import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const apiKey = '36095282-c36062feac43667220302dbf6';
let currentPage = 1;
let searchQuery = '';

loadMoreButton.style.display = 'none';

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  searchQuery = form.elements.searchQuery.value;

  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      if (currentPage === 1) {
        gallery.innerHTML = '';
      }

      data.hits.forEach(hit => {
        const cardHTML = createPhotoCard(hit);
        gallery.insertAdjacentHTML('beforeend', cardHTML);
      });

      currentPage++;

      if (data.totalHits > currentPage * 40) {
        loadMoreButton.style.display = 'block';
      } else {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    } else {
      if (currentPage === 1) {
        gallery.innerHTML = '';
        Notiflix.Report.failure('Search Results', 'Sorry, there are no images matching your search query. Please try again.');
      } else {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

loadMoreButton.addEventListener('click', function () {
  loadMoreButton.disabled = true;
  form.dispatchEvent(new Event('submit'));
  loadMoreButton.disabled = false;
});

form.addEventListener('submit', function () {
  loadMoreButton.style.display = 'none';
});

function createPhotoCard(hit) {
  return `<div class="photo-card">
    <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"><b>Likes</b>: ${hit.likes}</p>
      <p class="info-item"><b>Views</b>: ${hit.views}</p>
      <p class="info-item"><b>Comments</b>: ${hit.comments}</p>
      <p class="info-item"><b>Downloads</b>: ${hit.downloads}</p>
    </div>
  </div>`;
}
