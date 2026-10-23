
const $ = id => document.getElementById(id);

let students = load("structure_students");
let tasks = load("structure_tasks");
let completed = load("structure_completed");
let editingRoll = null;
let nextTaskId = Math.max(0, ...tasks.map(t => t.id), ...completed.map(t => t.id)) + 1;
let toastTimer;

function load(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function save() {
    localStorage.setItem("structure_students", JSON.stringify(students));
    localStorage.setItem("structure_tasks", JSON.stringify(tasks));
    localStorage.setItem("structure_completed", JSON.stringify(completed));
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[ch]);
}

function grade(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
}

function priorityName(priority) {
    return { 1: "High", 2: "Medium", 3: "Low" }[priority];
}

function formatDate(date) {
    return new Date(date).toLocaleDateString(undefined, {
        month: "short", day: "numeric", year: "numeric"
    });
}

function showToast(message) {
    $("toast").textContent = message;
    $("toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2500);
}

function navigate(page) {
    document.querySelectorAll(".page").forEach(section => section.classList.remove("active"));
    $(page).classList.add("active");

    document.querySelectorAll(".nav-link").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    $("pageTitle").textContent = {
        overview: "Overview",
        students: "Student Records",
        tasks: "Task Manager"
    }[page];

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-link").forEach(button => {
    button.addEventListener("click", () => navigate(button.dataset.page));
});

document.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", () => navigate(button.dataset.open));
});

function studentRow(student, showActions = true) {
    const currentGrade = grade(Number(student.marks));
    const gradeClass = ["D", "F"].includes(currentGrade) ? "fail" : "";

    return `<tr>
        <td>${escapeHTML(student.name)}</td>
        <td>${escapeHTML(student.rollNo)}</td>
        <td>${Number(student.marks).toFixed(1)} / 100</td>
        <td><span class="grade ${gradeClass}">${currentGrade}</span></td>
        ${showActions ? `<td>
            <button class="row-button" data-action="edit-student" data-roll="${escapeHTML(student.rollNo)}">Edit</button>
            <button class="row-button delete" data-action="delete-student" data-roll="${escapeHTML(student.rollNo)}">Delete</button>
        </td>` : ""}
    </tr>`;
}

function sortedTasks() {
    return [...tasks].sort((a, b) => a.priority - b.priority || a.id - b.id);
}

function taskRow(task) {
    const name = priorityName(task.priority);
    return `<tr>
        <td>${escapeHTML(task.name)}</td>
        <td><span class="priority-badge ${name.toLowerCase()}">${name}</span></td>
        <td>${formatDate(task.createdAt)}</td>
        <td>
            <button class="row-button" data-action="process-task" data-id="${task.id}">Process</button>
            <button class="row-button delete" data-action="delete-task" data-id="${task.id}">Delete</button>
        </td>
    </tr>`;
}

function renderStudents() {
    const search = $("studentSearch").value.trim().toLowerCase();
    const filtered = students.filter(student =>
        student.name.toLowerCase().includes(search) ||
        String(student.rollNo).toLowerCase().includes(search)
    );

    $("studentTable").innerHTML = filtered.map(student => studentRow(student)).join("");
    $("recentStudents").innerHTML = students.slice(0, 5).map(student => studentRow(student, false)).join("");

    $("studentEmpty").classList.toggle("show", filtered.length === 0);
    $("recentEmpty").classList.toggle("show", students.length === 0);
    $("recordCount").textContent = `${filtered.length} record(s)`;
    $("totalStudents").textContent = students.length;

    $("averageMarks").textContent = students.length
        ? (students.reduce((sum, student) => sum + Number(student.marks), 0) / students.length).toFixed(1)
        : "—";
}

function renderTasks() {
    const ordered = sortedTasks();
    $("taskTable").innerHTML = ordered.map(taskRow).join("");

    $("recentTasks").innerHTML = ordered.slice(0, 3).map(task => `
        <div class="task-preview-item">
            <div>
                <strong>${escapeHTML(task.name)}</strong>
                <small>Created ${formatDate(task.createdAt)}</small>
            </div>
            <span class="priority-badge ${priorityName(task.priority).toLowerCase()}">${priorityName(task.priority)}</span>
        </div>
    `).join("");

    $("taskEmpty").classList.toggle("show", tasks.length === 0);
    $("taskPreviewEmpty").classList.toggle("show", tasks.length === 0);
    $("totalTasks").textContent = tasks.length;
    $("highTasks").textContent = tasks.filter(task => task.priority === 1).length;

    $("completedText").textContent = completed.length
        ? completed.slice(0, 5).map(task => `${task.name} (${formatDate(task.completedAt)})`).join(" · ")
        : "No tasks processed yet.";
}

function render() {
    renderStudents();
    renderTasks();
    save();
}

function openStudentForm(student = null) {
    $("studentForm").reset();
    editingRoll = student ? student.rollNo : null;
    $("studentDialogTitle").textContent = student ? "Update student" : "Add student";
    $("rollNumber").disabled = Boolean(student);

    if (student) {
        $("studentName").value = student.name;
        $("rollNumber").value = student.rollNo;
        $("marks").value = student.marks;
    }

    updateGradePreview();
    $("studentDialog").showModal();
}

$("addStudent").addEventListener("click", () => openStudentForm());
$("quickStudent").addEventListener("click", () => openStudentForm());
$("addTask").addEventListener("click", () => {
    $("taskForm").reset();
    $("priority").value = "2";
    $("taskDialog").showModal();
});

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => $(button.dataset.close).close());
});

$("marks").addEventListener("input", updateGradePreview);

function updateGradePreview() {
    const value = $("marks").value;
    const number = Number(value);
    $("gradePreview").textContent =
        value !== "" && number >= 0 && number <= 100 ? grade(number) : "—";
}

$("studentForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("studentName").value.trim();
    const rollNo = $("rollNumber").value.trim();
    const marks = Number($("marks").value);

    if (!name || !rollNo || !Number.isFinite(marks) || marks < 0 || marks > 100) {
        showToast("Enter valid details and marks from 0 to 100.");
        return;
    }

    if (!editingRoll && students.some(student =>
        student.rollNo.toLowerCase() === rollNo.toLowerCase())) {
        showToast("This roll number already exists.");
        return;
    }

    if (editingRoll) {
        const student = students.find(item => item.rollNo === editingRoll);
        if (student) {
            student.name = name;
            student.marks = marks;
            student.updatedAt = new Date().toISOString();
        }
        showToast("Student record updated.");
    } else {
        students.unshift({
            name, rollNo, marks,
            createdAt: new Date().toISOString()
        });
        showToast("Student record added.");
    }

    $("studentDialog").close();
    render();
});

$("studentSearch").addEventListener("input", renderStudents);

$("taskForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("taskName").value.trim();
    const priority = Number($("priority").value);

    if (!name || ![1, 2, 3].includes(priority)) {
        showToast("Enter a valid task and priority.");
        return;
    }

    tasks.push({
        id: nextTaskId++,
        name,
        priority,
        createdAt: new Date().toISOString()
    });

    $("taskDialog").close();
    render();
    showToast("Task added to the queue.");
});

function processTask(id = null) {
    const ordered = sortedTasks();
    const task = id === null
        ? ordered[0]
        : tasks.find(item => item.id === Number(id));

    if (!task) {
        showToast("There are no pending tasks.");
        return;
    }

    tasks = tasks.filter(item => item.id !== task.id);
    completed.unshift({
        ...task,
        completedAt: new Date().toISOString()
    });
    completed = completed.slice(0, 10);

    render();
    showToast(`Processed: ${task.name}`);
}

$("processNext").addEventListener("click", () => processTask());

document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const { action, roll, id } = button.dataset;

    if (action === "edit-student") {
        const student = students.find(item => item.rollNo === roll);
        if (student) openStudentForm(student);
    }

    if (action === "delete-student") {
        const student = students.find(item => item.rollNo === roll);
        if (!student) return;

        if (confirm(`Delete the record for ${student.name}?`)) {
            students = students.filter(item => item.rollNo !== roll);
            render();
            showToast("Student record deleted.");
        }
    }

    if (action === "process-task") processTask(id);

    if (action === "delete-task") {
        const task = tasks.find(item => item.id === Number(id));
        if (!task) return;

        if (confirm(`Delete task "${task.name}"?`)) {
            tasks = tasks.filter(item => item.id !== Number(id));
            render();
            showToast("Task deleted.");
        }
    }
});

$("currentDate").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "short", month: "short", day: "numeric", year: "numeric"
});

render();
