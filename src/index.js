import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api.js';
import { createPhotoCard } from './markup.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
let currentPage = 1;
let searchQuery = '';
let lightbox;
let isLoading = false;

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  searchQuery = form.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return;
  }

  gallery.innerHTML = '';
  currentPage = 1;
  isLoading = false;

  try {
    const hits = await fetchImages(searchQuery, currentPage);
    hits.forEach(hit => {
      const cardHTML = createPhotoCard(hit);
      gallery.insertAdjacentHTML('beforeend', cardHTML);
    });

    currentPage++;

    if (lightbox) {
      lightbox.refresh();
    } else {
      lightbox = new SimpleLightbox('.gallery a');
    }
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Report.failure('Search Results', 'Sorry, there are no images matching your search query. Please try again.');
  }
});

window.addEventListener('scroll', async function () {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (searchQuery && !isLoading) {
      isLoading = true;

      try {
        const hits = await fetchImages(searchQuery, currentPage);
        hits.forEach(hit => {
          const cardHTML = createPhotoCard(hit);
          gallery.insertAdjacentHTML('beforeend', cardHTML);
        });

        currentPage++;
        isLoading = false;

        if (lightbox) {
          lightbox.refresh();
        } else {
          lightbox = new SimpleLightbox('.gallery a');
        }
      } catch (error) {
        console.error('Error:', error);
        Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
      }
    }
  }
});
