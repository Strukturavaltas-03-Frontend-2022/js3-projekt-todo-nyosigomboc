let state = {
  sequence: 3,
  todos: {
    1: {
      id: 1,
      text: "Delete the default todos :)",
      checked: false,
    },
    2: {
      id: 2,
      text: "At least this has already been completed",
      checked: true,
    },
  },
};

const getNextId = () => state.sequence++;

export const addTodo = (text) => {
  const newId = getNextId();
  state.todos[newId]=({id: newId, text, checked: false, });
  return newId;
}

export const getTodosIfCheckedIs = (checked = false) => Object.values(state.todos).filter((todo) => todo.checked === checked);

export const getNumberIfCheckedIs = (checked = false) => Object.values(state.todos).reduce((prev, todo) => todo.checked === checked ? prev + 1 : prev, 0);

export const toggle = (id) => {
  state.todos[id].checked = !state.todos[id].checked; // ^1
}

export const clear = () => {
  state = {sequence: 1, todos: {}};
};

export const clearPending = () => {
  Object.entries(state.todos).forEach(([key, todo]) => {
    if(!todo.checked) {
      remove(key);
    }
  });
};

export const remove = (id) => {
  if(state.todos.hasOwnProperty(id)){
    delete state.todos[id];
  }
}

const localStorageName = 'todoState';

export const tryToReload = () => {
  const result = localStorage.getItem(localStorageName);
  if(result !== null) {
    state = JSON.parse(result);
  }
}

export const save = () => {
  localStorage.setItem(localStorageName, JSON.stringify(state));
}
