const modal = document.querySelector('.order');
const carts = document.querySelectorAll('.cart');

function onDocumentPressEsc(evt) {
  if (evt.keyCode === 27) {
    closeModal();
  }
}

function closeModal() {
  modal.classList.remove('order--open');
  modal.classList.add('order--closed');
  document.removeEventListener('keydown', onDocumentPressEsc);
}

function onOrderClick(evt) {
  evt.preventDefault();
  modal.classList.remove('order--closed');
  modal.classList.add('order--open');
  document.addEventListener('keydown', onDocumentPressEsc);
}

for (let i in carts) {
  carts[i].addEventListener('click', onOrderClick);
}
