renderTasks();

function renderTasks(){
    renderTodoList(getTodo());
    renderInProgressList(getInProgress());
    renderReadyForReviewList(getReadyForReview());
    renderDoneList(getDone());
}

function renderTodoList(arr){
    const column = document.querySelector('#addTaskColumn');
    arr.forEach((task, index)=>{
        column.append(renderTask(task));
    })
}
function renderInProgressList(arr){
    const column = document.querySelector('#inProgressColumn');
    arr.forEach((task, index)=>{
        column.append(renderTask(task));
    })
}
function renderReadyForReviewList(arr){
    const column = document.querySelector('#readyForReviewColumn');
    arr.forEach((task, index)=>{
        column.append(renderTask(task));
    })
}
function renderDoneList(arr){
    const column = document.querySelector('#doneColumn');
    arr.forEach((task, index)=>{
        column.append(renderTask(task));
    })
}

const addTaskButton = document.querySelector('#addTask');
addTaskButton.addEventListener('click', handleAddTask);

function handleAddTask(){
    const input = document.querySelector('#addTaskInput');
    const value = input.value;
    input.value = "";
    if(!value){
        return;
    }
    const column = document.querySelector('#addTaskColumn');
    const todoList = [...getTodo()];
    const task = new Task(value);
    todoList.push(task);
    setTodo(todoList);
    column.append(renderTask(task));
}
function renderTask(task){
    const div = document.createElement('div');
    div.innerText = task.body;
    div.classList.add('task');
    div.draggable = true;
    div.addEventListener('dragstart', dragStart);
    div.addEventListener('dragend', dragEnd);
    div.setAttribute('id', task.id);
    return div;
}

let draggedNode = null;
let draggedColumn = null;

function dragStart(){
    draggedNode = this;
    draggedColumn = this.closest('.tasksWrapper');
}
function dragEnd(){
    draggedNode = null;
    draggedColumn = null;
}
const status = document.querySelectorAll('.status');
status.forEach((individualStatusColumn)=>{
    individualStatusColumn.addEventListener('dragenter', dragEnter);
    individualStatusColumn.addEventListener('dragleave', dragLeave);
    individualStatusColumn.addEventListener('dragover', dragOver);
    individualStatusColumn.addEventListener('drop', dragDrop);
})
function dragEnter(){
}
function dragLeave(){
}
function dragOver(e){
    e.preventDefault();
}
function dragDrop(e){
    this.querySelector('.tasksWrapper').append(draggedNode);
    //remove from dragStart list
    updateListsAfterDragAndDrop(draggedColumn, draggedNode, this);
}
class Task{
    constructor(body){
        this.body = body;
        this.id = Math.random() * 100000;
    }
}
function setTodo(arr){
    localStorage.setItem('todoList',JSON.stringify(arr));
}
function setInProgress(arr){
    localStorage.setItem('inprogressList',JSON.stringify(arr));
}
function setReadyForReview(arr){
    localStorage.setItem('readyForReviewList',JSON.stringify(arr));
}
function setDone(arr){
    localStorage.setItem('doneList',JSON.stringify(arr));
}
function getTodo(){
    return JSON.parse(localStorage.getItem('todoList')) || [];
}
function getInProgress(){
    return JSON.parse(localStorage.getItem('inprogressList')) || [];
}
function getReadyForReview(){
    return JSON.parse(localStorage.getItem('readyForReviewList')) || [];
}
function getDone(){
    return JSON.parse(localStorage.getItem('doneList')) || [];
}

function updateListsAfterDragAndDrop(draggedColumn, draggedNode, droppedNode){
    //get id of drag start
    const columnId = draggedColumn.getAttribute('id');
    //get id of current task
    const taskId = draggedNode.getAttribute('id');
    //remove from old list and update
    let listToBeSpliced = null;
    let task = null;
    if(columnId === "addTaskColumn"){
        listToBeSpliced = getTodo();
        const res = handleTaskRemoval(listToBeSpliced, taskId)
        task = res[1];
        setTodo(res[0]);
    } else if(columnId === "inProgressColumn"){
        listToBeSpliced = getInProgress();
        const res = handleTaskRemoval(listToBeSpliced, taskId)
        task = res[1];
        setInProgress(res[0]);
    } else if(columnId === "readyForReviewColumn"){
        listToBeSpliced = getReadyForReview();
        const res = handleTaskRemoval(listToBeSpliced, taskId)
        task = res[1];
        setReadyForReview(res[0]);
    } else {
        listToBeSpliced = getDone();
        const res = handleTaskRemoval(listToBeSpliced, taskId)
        task = res[1];
        setDone(res[0]);
    }
    //append to new list and update
    const droppedColumn = droppedNode.querySelector('.tasksWrapper');
    const droppedColumnId = droppedColumn.getAttribute('id');
    let listToBeAddedTo = null;
    if(droppedColumnId === "addTaskColumn"){
        listToBeAddedTo = [...getTodo()];
        listToBeAddedTo.push(task);
        setTodo(listToBeAddedTo);
    } else if(droppedColumnId === "inProgressColumn"){
        listToBeAddedTo = [...getInProgress()];
        listToBeAddedTo.push(task);
        setInProgress(listToBeAddedTo);
    } else if(droppedColumnId === "readyForReviewColumn"){
        listToBeAddedTo = [...getReadyForReview()];
        listToBeAddedTo.push(task);
        setReadyForReview(listToBeAddedTo);
    } else {
        listToBeAddedTo = [...getDone()];
        listToBeAddedTo.push(task);
        setDone(listToBeAddedTo);
    }
}
function handleTaskRemoval(arr, id){
    const filteredArr = arr.filter((task)=>task.id !== +id);
    const task = arr.filter((task)=>task.id === +id);
    return [filteredArr, task[0]];
}

