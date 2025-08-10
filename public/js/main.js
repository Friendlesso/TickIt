import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.7/+esm";

const TaskManager = {
  init() {
    this.finishTask();
    this.deleteTask();
    this.editTask();
    this.updateProgress();
  },

  finishTask(){
    document.querySelectorAll('.button__finish').forEach(btn => {
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
  },

  deleteTask(){
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
  },

  editTask(){
    const editModal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('edit-modal__close');

    document.querySelectorAll('.button__edit').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();

        const id = btn.dataset.id;
        const title = btn.dataset.title;
        const type = btn.dataset.type;
        const deadline = btn.dataset.deadline;

        document.getElementById('edit-task-form__id').value = id || '';
        document.getElementById('edit-task-form__title').value = title || '';
        document.getElementById('edit-task-form__deadline').value = deadline || '';

        const hiddenInput = document.getElementById('dropdown-selected-edit');
        if(hiddenInput) hiddenInput.value = type || '';

        const dropdownSelect = editModal.querySelector('.dropdown__select p');
        if(dropdownSelect) {
          dropdownSelect.textContent = type || 'Select task type';
        }

        editModal.classList.remove('hidden');
      });
    });

    closeBtn.addEventListener('click', () => {
      editModal.classList.add('hidden');
    })
  },

  updateProgress() {
    const totalTasks = document.querySelectorAll('.tasks--today .task').length;
    const completedTasks = document.querySelectorAll('.tasks--completed .task').length;
    const allTasks = totalTasks + completedTasks;

    let percentage = 0;
    if(allTasks > 0) {
      percentage = Math.round((completedTasks / allTasks) * 100);
    }

    const progressBar = document.querySelector('.progress__bar');
    const progressText = document.querySelector('.progress__text');

    if(progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent = `${percentage}% Completed`
  }
};

const Dropdowns = {
  init() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
      const select = dropdown.querySelector('.dropdown__select');
      const options = dropdown.querySelector('.dropdown__options');
      const hiddenInput = dropdown.querySelector('input[type="hidden"]');
      console.log('hiddenInput:', hiddenInput); 

      select.addEventListener('click', e => {
        e.stopPropagation();
        options.classList.toggle('show');
      });

      options.querySelectorAll('div').forEach(option => {
        option.addEventListener('click', e => {
          select.textContent = option.textContent;
          if(hiddenInput && hiddenInput.tagName === 'INPUT' && hiddenInput.type === 'hidden'){
            hiddenInput.value = option.getAttribute('data-value');
          }
          options.classList.remove('show');
        });
      });

      document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
          const options = dropdown.querySelector('.dropdown__options');
          options.classList.remove('show');
        });
      });
    });
  }
};

const ThemeSwitcher = {
  init() {
    const root = document.documentElement;
    const switchBtn = document.querySelector('.switch-mode');

    if (!switchBtn) return;

    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark'){
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    switchBtn.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      localStorage.setItem('theme', isDark? 'dark' : 'light');
    });
  }
};

function displayDate(dayjs) {
  const today = dayjs().format('DD.MM.YYYY');

  document.querySelector('.js-date').textContent = `${today}`;
}

document.addEventListener('DOMContentLoaded', () => {
  TaskManager.init();
  Dropdowns.init();
  ThemeSwitcher.init();
  displayDate(dayjs);
})



