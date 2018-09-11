
const ROUTES = {
	LIST: 'list',
	ADD: 'add',
	EDIT: 'edit'
};

var appState = {
	todoList: []
}

var taskId = 1;

var TEMPLATES = {
	EDIT_TASK: '<div class="edit-task-title-container">'
		+ '<span class="edit-task-title">Title</span>'
		+ '<input type="text" class="edit-task-input">'
		+ '</div>'
		+ '<div class="edit-task-description-container">'
		+ '<span class="edit-task-description-title">Title</span>'
		+ '<textarea name="descripton" class="edit-task-textarea"></textarea>'
		+ '</div>'
		+ '<div class="cancel-create-buttons">'
		+ '<button class="button-cancel">Cancel</button>'
		+ '<button class="button-save">Save</button>'
		+ '</div>',
	ADD_TASK: '<div class="new-task-title-container">'
		+ '<span class="new-task-title">Title</span>'
		+ '<input type="text" class="new-task-input" placeholder="Enter task title">'
		+ '</div>'
		+ '<div class="new-task-description-container">'
		+ '<span class="new-task-description-title">Title</span>'
		+ '<textarea name="descripton" class="new-task-textarea" placeholder="Enter description"></textarea>'
		+ '</div>'
		+ '<div class="cancel-create-buttons">'
		+ '<button class="button-cancel">Cancel</button>'
		+ '<button class="button-create">Create</button>'
		+ '</div>',
	CONFIRMATION: '<div class="confirm-container">'
		+ '<span class="confirm-ask-text">Do you realy want to delete this task?</span>'
		+ '<div class="confirm-buttons">'
		+ '<button class="confirm-button-yes">Yes</button>'
		+ '<button class="confirm-button-cancel">Cancel</button>'
		+ '</div>'
		+ '</div>'
};

const MAIN_CONTAINER = getElement('.window-main');

init();


function init() {
	//
	navigate(ROUTES.LIST);

}

function navigate(route, evt) {
	//
	switch (route) {
		case 'list':
			showListOfTasks();
			break;
		case 'add':
			addTask();
			break;
		case 'edit':
			editTask(evt);
			break;
	}
}

function showListOfTasks() {
	//

	clearContainer();

	let currTitleContainer = createEl('div', 'route-title-container', 'Current Tasks');

	let currTasksContainer = createEl('div', 'current-task-container');

	let taskList = appState.todoList.map((item) => { return fillTaskList(item) });

	if (taskList.length > 0) {
		taskList.forEach((listItem) => {
			currTasksContainer.appendChild(listItem);
		});
	}
	

	let btnAdd = createEl('button', 'button-add', 'Add Task');

	btnAdd.addEventListener('click', (evt) => { navigate(ROUTES.ADD); })

	MAIN_CONTAINER.appendChild(currTitleContainer);
	MAIN_CONTAINER.appendChild(currTasksContainer);
	MAIN_CONTAINER.appendChild(btnAdd);

}

function fillTaskList(item) {
	//
	let currTaskWrapper = createEl('div', 'current-task-wrapper');

	currTaskWrapper.id = item.id.toString();

	let currTaskTemplate = '<div class="task-contents">'
		+ '<span class="current-task-title">' + item.name + '</span>' + '<br>'
		+ '<span class="current-task-description">' + item.description + '</span>' + '<br>'
		+ '<span class="current-task-date">' + item.creationDate + '</span>'
		+ '</div>'
		+ '<div class="task-edit">'
		+ '<button class="button-edit">Edit</button>'
		+ '<button class="button-remove">Remove</button>'
		+ '</div>';

	currTaskWrapper.innerHTML = currTaskTemplate;

	getElement('.button-edit', currTaskWrapper).addEventListener('click', (evt) => { navigate(ROUTES.EDIT, evt); });
	getElement('.button-remove', currTaskWrapper).addEventListener('click', (evt) => { removeTask(evt); });

	return currTaskWrapper;

}

function removeTask(evt) {
	//
	let taskWrapToRemove = findRequiredParent(evt.target, 'current-task-wrapper');

	confirmRemoving(taskWrapToRemove);

}

function confirmRemoving(taskWrapToRemove) {
	//
	let confirmWindow = createEl('div', 'confirm-window');

	confirmWindow.innerHTML = TEMPLATES.CONFIRMATION;

	getElement('.confirm-button-yes', confirmWindow).addEventListener('click', (evt) => { 
		appState.todoList.forEach((task, itemNum) => {
			if (+taskWrapToRemove.id === task.id) {
				appState.todoList.splice(itemNum, 1);
			}

			showListOfTasks();
		});

		MAIN_CONTAINER.removeChild(confirmWindow);
	});
	getElement('.confirm-button-cancel', confirmWindow).addEventListener('click', (evt) => { showListOfTasks(); });

	MAIN_CONTAINER.appendChild(confirmWindow);
}

function editTask(evt) {
	//
	clearContainer();

	let editTitleContainer = createEl('div', 'route-title-container', 'Edit Task');

	let editTaskForm = createEl('div', 'edit-task-form');

	let editTaskTemplate = TEMPLATES.EDIT_TASK;

	editTaskForm.innerHTML = editTaskTemplate;

	let reqTaskWrapper = findRequiredParent(evt.target, 'current-task-wrapper');

	adaptCurrTaskValues(reqTaskWrapper, editTaskForm);

	getElement('.button-cancel', editTaskForm).addEventListener('click', (evt) => { showListOfTasks(); });
	getElement('.button-save', editTaskForm).addEventListener('click', (evt) => { 
		adaptCurrTaskValues(reqTaskWrapper, editTaskForm, true);
		// тут переделать. кнопка должна находить родителя независимо от этого таскрепера
	 });

	MAIN_CONTAINER.appendChild(editTitleContainer);
	MAIN_CONTAINER.appendChild(editTaskForm);

}

function adaptCurrTaskValues(taskWrapper, taskForm, save) {
	//
	appState.todoList.forEach((task) => {
		if (+taskWrapper.id === task.id) {
			if (save) {
				task.name = getElement('.edit-task-input', taskForm).value
				task.description = getElement('.edit-task-textarea', taskForm).value;
				showListOfTasks();
			} else {
				getElement('.edit-task-input', taskForm).value = task.name;
				getElement('.edit-task-textarea', taskForm).value = task.description;
			}
		}
	});

}

function findRequiredParent(elem, query) {
	//
	let reqElem;
	if (elem.parentElement.classList.contains(query)) {
		reqElem = elem.parentElement;
	} else {
		reqElem = findRequiredParent(elem.parentElement, query);
	}

	return reqElem;
}

function addTask() {
	//
	clearContainer();

	let addTitleContainer = createEl('div', 'route-title-container', 'Create New Task');

	let newTaskForm = createEl('div', 'new-task-form');

	let newTaskTemplate = TEMPLATES.ADD_TASK;

	newTaskForm.innerHTML = newTaskTemplate;

	getElement('.button-cancel', newTaskForm).addEventListener('click', (evt) => { showListOfTasks(); });
	getElement('.button-create', newTaskForm).addEventListener('click', (evt) => { createTask(newTaskForm); });

	MAIN_CONTAINER.appendChild(addTitleContainer);
	MAIN_CONTAINER.appendChild(newTaskForm);

}

function createTask(newTaskForm) {
	//
	let newTask = {};
	newTask.id = taskId;
	newTask.name = getElement('.new-task-input', newTaskForm).value;
	newTask.description = getElement('.new-task-textarea', newTaskForm).value;
	newTask.creationDate = new Date().toString();
	taskId += 1;
	appState.todoList.push(newTask);

	showListOfTasks();
}

function getElement(query, parentNode) {
	if (parentNode) {
		return parentNode.querySelector(query);
	} else {
		return document.body.querySelector(query);
	}
}

function createEl(tag, className, textContent) {
	//
	let newEl = document.createElement(tag);
	newEl.classList.add(className);
	if (textContent) {
		newEl.innerHTML = '<span class="route-title">'
		+ textContent + '</span>';
	}
	return newEl;
}

function clearContainer() {
	//
	MAIN_CONTAINER.innerHTML = '';
}