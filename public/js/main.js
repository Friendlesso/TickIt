import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.7/+esm";
const today = dayjs().format('DD.MM.YYYY');

document.querySelector('.js-date').textContent = `${today}`;