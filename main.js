
init();


function init() {
	// Main function. Initiates all procedures

	let actTaskContainer = getElement('.act-task-container'); // Container for the list of actual tasks
	
	let actTaskList = document.createElement('ul'); // List of actual tasks creation
	actTaskList.classList.add('act-task-list');

	actTaskContainer.appendChild(actTaskList);
	
	addTask(getElement('.btn-task-add'), getElement('.input-task'));
}


function getElement(query, parentNode) {
	if (parentNode) {
		return parentNode.querySelector(query);
	} else {
		return document.body.querySelector(query);
	}
	
}

function addTask(addBtn, getInput) {
	// Function appends new task item to the actual-task container

	getInput.value = '';

	addBtn.addEventListener('click', evt => {
		if (getInput.value) {
			actTaskItemForm(getInput);
		}

	});

}

function actTaskItemForm(getInput) {
	// Function creates new task block

	let actTaskTemplate = '<label class="act-task-label">' 
		+ getInput.value + '</label>' 
		+ '<input type="text" class="task-edit invisible">' 
		+ '<button class="act-task-edit">Edit</button>'
		+ '<button class="act-task-save invisible">Save</button>'
		+ '<button class="act-task-remove">Delete</button>';

	let actTaskItem = document.createElement('li');
	actTaskItem.classList.add('act-task-item');

	actTaskItem.innerHTML = actTaskTemplate;

	getElement('.act-task-list').appendChild(actTaskItem);

	getInput.value = '';

	actTaskItem.children[2].addEventListener('click', editTask);
	actTaskItem.children[3].addEventListener('click', saveTask);
	actTaskItem.children[4].addEventListener('click', removeTask);

}

function editTask() {
	// Function replaces label-node by input-node in order to edit task

	let label = getElement('.act-task-label', this.parentNode);
	let input = getElement('.task-edit', this.parentNode);

	let editBtn = getElement('.act-task-edit', this.parentNode);
	let saveBtn = getElement('.act-task-save', this.parentNode);
	
	classToggle(label, input, 'invisible');
	classToggle(editBtn, saveBtn, 'invisible');

}

function classToggle(itemOut, itemIn, classToToggle) {
	// Function toggles class of entered items
	itemOut.classList.toggle(classToToggle);
	itemIn.classList.toggle(classToToggle);

	if (itemOut.nodeName === 'LABEL') {
		itemIn.value = itemOut.innerHTML;
	} else if (itemOut.nodeName === 'INPUT') {
		itemIn.innerHTML = itemOut.value;
	} 
	
}

function saveTask() {
	// Function saves task has been edited

	let label = getElement('.act-task-label', this.parentNode);
	let input = getElement('.task-edit', this.parentNode);

	let editBtn = getElement('.act-task-edit', this.parentNode);
	let saveBtn = getElement('.act-task-save', this.parentNode);

	classToggle(input, label, 'invisible');
	classToggle(editBtn, saveBtn, 'invisible');
}

function removeTask() {
	// Function removes LI-node with the current task

	let currLi = this.parentNode;
	currLi.classList.add('to-remove');

	currLi.parentNode.removeChild(getElement('.to-remove'));

}