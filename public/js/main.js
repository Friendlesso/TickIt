  import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.7/+esm";
document.addEventListener('DOMContentLoaded', () => {
  finishTask()
  deleteTask();
  formTypeDropdown();
  displayDate(dayjs);
})


function displayDate(dayjs) {
  const today = dayjs().format('DD.MM.YYYY');

  document.querySelector('.js-date').textContent = `${today}`;
}

function formTypeDropdown(){
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
}

function deleteTask(){
  document.querySelectorAll('.button__delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      try{
        const res = await fetch('/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({id})
        });

        if (res.ok) {
          location.reload()
        } else {
          console.error('Server response with an error:', res.status);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    });
  });
}

function finishTask(){
  document.querySelectorAll('.buttons__finish').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      try{
        const res = await fetch('/finish', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id})
        });
        if (res.ok) {
          location.reload()
        } else {
          console.error('Server response with an error:', res.status);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    });
  });
}

