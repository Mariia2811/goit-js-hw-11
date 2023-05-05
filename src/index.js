import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const apiKey = '36095282-c36062feac43667220302dbf6';
let currentPage = 1;
let searchQuery = '';
let lightbox;

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

// Detect when user has scrolled to bottom of page
window.addEventListener('scroll', function () {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    form.dispatchEvent(new Event('submit'));
  }
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
