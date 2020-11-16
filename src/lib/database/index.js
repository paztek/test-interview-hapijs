const todos = [
    {
        id: 1,
        label: 'Do the laundry',
        done: false,
    },
    {
        id: 2,
        label: 'Feed the cat',
        done: false,
    },
    {
        id: 3,
        label: 'Refactor stuff',
        done: true,
    },
];

let sequenceId = 3;

exports.findById = (id) => {
    return todos.find((t) => t.id === id) || null;
}

exports.findAll = () => {
    return todos;
}

exports.create = (todo) => {
    sequenceId++;
    todo.id = sequenceId;
    todos.push(todo);

    return todo;
}

exports.update = (todo) => {
    const existingTodo = todos.find((t) => t.id === todo.id);

    if (!existingTodo) {
        throw new Error(`Todo ${todo.id} not found`);
    }

    existingTodo.label = todo.label;
    existingTodo.done = todo.done;

    return existingTodo;
}

exports.delete = (todo) => {
    const existingTodo = todos.find((t) => t.id === todo.id);

    if (!existingTodo) {
        throw new Error(`Todo ${todo.id} not found`);
    }

    const index = todos.indexOf(existingTodo);

    todos.splice(index, 1);
}

exports.deleteById = (id) => {
    const index = todos.findIndex((t) => t.id === id);

    todos.splice(index, 1);
}
