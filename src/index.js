import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const apiKey = '36095282-c36062feac43667220302dbf6';
let currentPage = 1;
let searchQuery = '';
let lightbox;

loadMoreButton.style.display = 'none';

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  searchQuery = form.elements.searchQuery.value;

  // Clear gallery when searching for a new keyword
  gallery.innerHTML = '';

  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
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

      // Refresh SimpleLightbox to include new images
      if (lightbox) {
        lightbox.refresh();
      } else {
        lightbox = new SimpleLightbox('.gallery a');
      }
    } else {
      Notiflix.Report.failure('Search Results', 'Sorry, there are no images matching your search query. Please try again.');
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
    <a href="${hit.largeImageURL}" class="gallery__item" data-source="${hit.largeImageURL}">
      <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item"><b>Likes</b>: ${hit.likes}</p>
      <p class="info-item"><b>Views</b>: ${hit.views}</p>
      <p class="info-item"><b>Comments</b>: ${hit.comments}</p>
      <p class="info-item"><b>Downloads</b>: ${hit.downloads}</p>
    </div>
  </div>`;
}
