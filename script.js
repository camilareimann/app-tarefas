const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

const addOrUpdateTask = () => {
    addOrUpdateTaskBtn.innerText = "Add Tarefa";
    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    const taskObj = {
        id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title: titleInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
        concluded: false
    };

    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj;
    }

    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskContainer()
    reset()
};

const updateTaskContainer = () => {
    tasksContainer.innerHTML = "";

    taskData.forEach(({ id, title, date, description, concluded }) => {
        const statusColor = concluded ? "green" : "red";
        const concludedStatus = `<span style="color: ${statusColor};">${concluded ? "Concluido" : "Não concluido"}</span>`;

        tasksContainer.innerHTML += `
            <div class="task" id="${id}">
                <p><strong>Titulo:</strong> ${title}</p>
                <p><strong>Data:</strong> ${date}</p>
                <p><strong>Descrição:</strong> ${description}</p>
                <p><strong>Status:</strong> ${concludedStatus}</p>
                <button onclick="editTask(this)" type="button" class="btn">Editar</button>
                <button onclick="deleteTask(this)" type="button" class="btn">Deletar</button>
                <button onclick="markTaskAsConcluded(this)" type="button" class="btn">Concluído?</button>
            </div>`;
    });
};


const deleteTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(
        (item) => item.id === buttonEl.parentElement.id
    );

    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem("data", JSON.stringify(taskData));
}

const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(
        (item) => item.id === buttonEl.parentElement.id
    );

    currentTask = taskData[dataArrIndex];

    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    descriptionInput.value = currentTask.description;

    addOrUpdateTaskBtn.innerText = "Adicionar tarefa";

    taskForm.classList.toggle("hidden");
}

const reset = () => {
    titleInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    taskForm.classList.toggle("hidden");
    currentTask = {};
}

if (taskData.length) {
    updateTaskContainer()
}

openTaskFormBtn.addEventListener("click", () =>
    taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
    const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

    if (formInputsContainValues && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        reset();
    }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
    confirmCloseDialog.close();
    reset()
});

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addOrUpdateTask();
});

const markTaskAsConcluded = (buttonEl) => {
    const taskId = buttonEl.parentElement.id;
    const dataArrIndex = taskData.findIndex((item) => item.id === taskId);
    taskData[dataArrIndex].concluded = !taskData[dataArrIndex].concluded;
    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskContainer();
};