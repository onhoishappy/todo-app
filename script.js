// ✏️ 사진 목록: photos/폴더이름/ 안에 사진을 넣고, 여기에 파일 이름을 적어 주세요.
const albums = {
    claude:  { title: "#claude", photos: [] },
    running: { title: "#러닝",   photos: [] },
    hiking:  { title: "#등산",   photos: [] },
    travel:  { title: "#여행",   photos: [] },
};
// 예시) running: { title: "#러닝", photos: ["marathon.jpg", "hanriver.png"] },

function sayHello() {
    document.getElementById("message").textContent = "행복한 하루 되세요 🌸";
}

function openGallery(key) {
    const album = albums[key];
    const gallery = document.getElementById("gallery");
    document.getElementById("modal-title").textContent = album.title;
    gallery.innerHTML = "";

    if (album.photos.length === 0) {
        gallery.innerHTML =
            '<p class="empty">아직 사진이 없어요 📷<br>photos/' + key + ' 폴더에 사진을 넣어 주세요.</p>';
    }

    album.photos.forEach(function (name) {
        const img = document.createElement("img");
        img.src = "photos/" + key + "/" + name;
        img.alt = album.title + " 사진";
        img.onclick = function () {
            document.getElementById("viewer-img").src = img.src;
            document.getElementById("viewer").classList.add("open");
        };
        gallery.appendChild(img);
    });

    document.getElementById("modal").classList.add("open");
}

function closeGallery(event) {
    // 바깥 어두운 영역이나 X 버튼을 눌렀을 때만 닫기
    if (event && event.target.id !== "modal") return;
    document.getElementById("modal").classList.remove("open");
}

// ESC 키로 닫기
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        document.getElementById("viewer").classList.remove("open");
        document.getElementById("modal").classList.remove("open");
    }
});

// ===== 할 일 목록 =====
const TODO_KEY = "todos";
const THEME_KEY = "theme";

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoEmpty = document.getElementById("todo-empty");
const remainingCount = document.getElementById("remaining-count");
const themeToggle = document.getElementById("theme-toggle");

let todos = loadTodos();

// localStorage에서 목록 불러오기 (데이터가 손상됐으면 빈 목록)
function loadTodos() {
    try {
        const saved = JSON.parse(localStorage.getItem(TODO_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function saveTodos() {
    try {
        localStorage.setItem(TODO_KEY, JSON.stringify(todos));
    } catch {
        // 저장이 막힌 환경(시크릿 모드 등)에서는 무시
    }
}

// todos 배열을 기준으로 화면 목록 다시 그리기
function renderTodos() {
    todoList.innerHTML = "";

    todos.forEach(function (todo) {
        const li = document.createElement("li");
        li.className = "todo-item" + (todo.done ? " done" : "");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.addEventListener("change", function () { toggleTodo(todo.id); });

        const text = document.createElement("span");
        text.className = "todo-text";
        text.textContent = todo.text; // HTML 태그가 그대로 실행되지 않도록 textContent 사용
        text.addEventListener("click", function () { toggleTodo(todo.id); });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.type = "button";
        deleteBtn.textContent = "✕";
        deleteBtn.setAttribute("aria-label", "삭제");
        deleteBtn.addEventListener("click", function () { deleteTodo(todo.id); });

        li.append(checkbox, text, deleteBtn);
        todoList.appendChild(li);
    });

    todoEmpty.classList.toggle("hidden", todos.length > 0);
    remainingCount.textContent = todos.filter(function (todo) { return !todo.done; }).length;
}

function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    todos.push({ id: Date.now(), text: trimmed, done: false });
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(function (todo) {
        return todo.id === id ? { ...todo, done: !todo.done } : todo;
    });
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(function (todo) { return todo.id !== id; });
    saveTodos();
    renderTodos();
}

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = "";
    todoInput.focus();
});

// ===== 다크모드 =====
function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);
    themeToggle.textContent = isDark ? "☀️" : "🌙";
}

function toggleTheme() {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch {
        // 저장 실패 시 이번 세션에만 적용
    }
}

themeToggle.addEventListener("click", toggleTheme);

// 시작 시 저장된 테마와 목록 불러오기
let savedTheme = "light";
try {
    savedTheme = localStorage.getItem(THEME_KEY) || "light";
} catch {
    // 기본값(light) 사용
}
applyTheme(savedTheme);
renderTodos();
