import {
  addTodo, getTodosIfCheckedIs, getNumberIfCheckedIs, toggle,
  remove, clearPending, save, tryToReload,
// eslint-disable-next-line import/extensions
} from './todo_db.js';

const dateDiv = document.querySelector('.date');
const pendingNumber = document.querySelector('#pending_number');
const donePercentage = document.querySelector('#done_percentage');
const pendingList = document.querySelector('.pending_list');
const completedList = document.querySelector('.completed_list');
const buttHideComplete = document.querySelector('#butt_hide_complete');
const newText = document.querySelector('input[name="new_todo"]');
const emptyDiv = document.querySelector('#empty');
const hasTodoDiv = document.querySelector('#has_todo');

const showDate = () => {
  const usDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const date = usDate.format(new Date());
  dateDiv.innerHTML = date.replaceAll('/', '-').replace(',', '<br />');
  // sample wants US format, but with wrong separators and an unnecessary line break
};

const getNumbers = () => {
  const pending = getNumberIfCheckedIs(false);
  const completed = getNumberIfCheckedIs(true);
  const total = pending + completed;
  return [pending, completed, total];
};

const updateNumbers = () => {
  const [pending, completed, total] = getNumbers();
  const percentage = (total === 0) ? 0 : Math.round(completed * 100 / total);
  pendingNumber.innerHTML = pending;
  donePercentage.innerHTML = percentage;
};

const getliHTML = (id, text, checked = false) => `
  <li>
    <input type="checkbox" id="cb_${id}" name="cb_${id}" ><label for="cb_${id}" ${checked ? '"checked"' : ''}>${text}</label>
    <div class="del" ><img src="img/delete.png" alt="delete" class="delete" ><div>
  </li>`;
// from here: https://www.flaticon.com/free-icon/delete_3395538
// FA is a lot bigger, no need to include that for one icon

const updatePending = () => {
  const html = getTodosIfCheckedIs(false)
    .map((todo) => getliHTML(todo.id, todo.text, false))
    .join('');
  pendingList.innerHTML = html;
};

const updateDone = () => {
  const html = getTodosIfCheckedIs(true)
    .map((todo) => getliHTML(todo.id, todo.text, false))
    .join('\n');
  completedList.innerHTML = html;
};

const updateDivVisibility = () => {
  const [,, total] = getNumbers();
  if (total === 0) {
    emptyDiv.style.display = 'block';
    hasTodoDiv.style.display = 'none';
  } else {
    emptyDiv.style.display = 'none';
    hasTodoDiv.style.display = 'block';
  }
};

const update = () => {
  showDate();
  updateNumbers();
  updatePending();
  updateDone();
  // eslint-disable-next-line no-use-before-define
  addListeners();
  updateDivVisibility();
  save();
};

function addListeners() {
  document.querySelectorAll('input[type="checkbox"]').forEach((element) => {
    const myId = element.id.slice('cb_'.length);
    element.addEventListener('click', () => {
      toggle(myId);
      update();
    });
    element.parentNode.children[element.parentNode.childElementCount - 1].addEventListener('click', () => {
      remove(myId);
      update();
    });
  });
}

document.querySelector('#butt_clear').addEventListener('click', () => {
  clearPending();
  update();
});

let completedVisible = true;
const toggleComplete = () => {
  completedVisible = !completedVisible;
  if (completedVisible) {
    completedList.style.display = 'block';
    buttHideComplete.innerHTML = 'Hide complete';
  } else {
    completedList.style.display = 'none';
    buttHideComplete.innerHTML = 'Show complete';
  }
};

buttHideComplete.addEventListener('click', toggleComplete);

document.querySelector('.add_new_todo').addEventListener('click', () => {
  const newId = addTodo(newText.value);
  newText.value = '';
  update();
  const newLi = document.getElementById(`cb_${newId}`).parentNode;
  newLi.style.opacity = 0;
  setTimeout(() => {
    newLi.style.opacity = 1;
  }, 200);
});

tryToReload();
update();
