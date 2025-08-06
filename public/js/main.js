import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.7/+esm";
const today = dayjs().format('DD.MM.YYYY');

document.querySelector('.js-date').textContent = `${today}`;

const select = document.querySelector('.dropdown__select');
const options = document.querySelector('.dropdown__options');

document.addEventListener('click', (e) => {
  if(e.target.closest('.dropdown__select')) options.classList.toggle('show');
  else options.classList.remove('show');

  if(e.target.closest('.dropdown__options div')){
    select.textContent = e.target.textContent;
    document.getElementById('dropdown-selected').value = e.target.getAttribute('data-value');
    options.classList.remove('show');
  }
})