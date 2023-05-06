export function createPhotoCard(hit) {
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