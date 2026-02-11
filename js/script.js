// ===== SELEÇÃO DE ELEMENTOS =====
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#input");
const todoList = document.querySelector(".todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const overlay = document.querySelector(".overlay");
const searchInput = document.querySelector("#search-input");
const eraseButton = document.querySelector("#erase-button");
const filterSelect = document.querySelector("#filter-select");

// ===== VARIÁVEIS GLOBAIS =====
let todos = [];
let oldInputValue;

// ===== FUNÇÕES PRINCIPAIS =====

// Guardar tarefas no localStorage
const salvarTarefasLocalStorage = () => {
    const json = JSON.stringify(todos);
    localStorage.setItem("minhastarefas", json);
    console.log("✅ Salvo no localStorage:", todos);
};

// Forçar background dos inputs de pesquisa e filtro (fallback caso CSS seja ignorado)
const applySearchFilterBg = () => {
    try {
        const si = document.getElementById('search-input');
        const fs = document.getElementById('filter-select');
        if (si) {
            si.style.backgroundColor = '#fff';
            si.style.borderRadius = '6px';
        }
        if (fs) {
            fs.style.backgroundColor = '#fff';
            fs.style.borderRadius = '6px';
        }
        console.log('🎯 Background aplicado via JS a search/filter');
    } catch (err) {
        console.error('Erro aplicando background via JS:', err);
    }
};

// Carregar tarefas do localStorage
const carregarTarefasLocalStorage = () => {
    console.log("📥 Iniciando carregamento do localStorage...");
    
    const json = localStorage.getItem("minhastarefas");
    console.log("📦 Dados brutos do localStorage:", json);
    
    if (json) {
        try {
            todos = JSON.parse(json);
            console.log("✅ Parseado com sucesso:", todos);
            renderizarTodasTarefas();
        } catch (error) {
            console.error("❌ Erro ao fazer parse:", error);
            todos = [];
            localStorage.setItem("minhastarefas", JSON.stringify([]));
        }
    } else {
        console.log("ℹ️ Nenhuma tarefa encontrada no localStorage");
        todos = [];
    }
};

// Renderizar todas as tarefas
const renderizarTodasTarefas = () => {
    console.log("🎨 Limpando e renderizando todas as tarefas...");
    todoList.innerHTML = "";
    
    todos.forEach((todo) => {
        renderizarTarefa(todo);
    });
    
    console.log("✅ Total de tarefas renderizadas:", todos.length);
};

// Renderizar uma tarefa individual
const renderizarTarefa = (todo) => {
    const div = document.createElement("div");
    div.classList.add("todo");
    if (todo.done) {
        div.classList.add("done");
    }
    div.setAttribute("data-id", todo.id);
    
    const h3 = document.createElement("h3");
    h3.innerText = todo.text;
    div.appendChild(h3);
    
    const btnConcluir = document.createElement("button");
    btnConcluir.classList.add("finish-todo");
    btnConcluir.innerHTML = '<i class="fa-solid fa-check"></i>';
    div.appendChild(btnConcluir);
    
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("edit-todo");
    btnEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';
    div.appendChild(btnEditar);
    
    const btnDeletar = document.createElement("button");
    btnDeletar.classList.add("remove-todo");
    btnDeletar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    div.appendChild(btnDeletar);
    
    todoList.appendChild(div);
};

// Adicionar nova tarefa
const adicionarTarefa = (texto) => {
    const novoId = Date.now();
    const novaTarefa = {
        id: novoId,
        text: texto,
        done: false
    };
    
    todos.push(novaTarefa);
    console.log("➕ Tarefa adicionada:", novaTarefa);
    salvarTarefasLocalStorage();
    renderizarTarefa(novaTarefa);
    
    todoInput.value = "";
    todoInput.focus();
};

// Deletar tarefa
const deletarTarefa = (id) => {
    console.log("🗑️ Deletando tarefa com ID:", id);
    
    // Remove do array
    todos = todos.filter(todo => todo.id !== id);
    console.log("📊 Tarefas restantes:", todos);
    
    // Salva no localStorage
    salvarTarefasLocalStorage();
    
    // Remove do DOM
    const elemento = document.querySelector(`[data-id="${id}"]`);
    if (elemento) {
        elemento.remove();
        console.log("✅ Elemento removido do DOM");
    }
};

// Atualizar tarefa
const atualizarTarefa = (id, novoTexto) => {
    console.log("✏️ Atualizando tarefa ID:", id);
    
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, text: novoTexto };
        }
        return todo;
    });
    
    salvarTarefasLocalStorage();
    
    const elemento = document.querySelector(`[data-id="${id}"] h3`);
    if (elemento) {
        elemento.innerText = novoTexto;
    }
};

// Marcar como concluída
const marcarConcluida = (id) => {
    console.log("✔️ Marcando tarefa como concluída, ID:", id);
    
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, done: !todo.done };
        }
        return todo;
    });
    
    salvarTarefasLocalStorage();
    
    const elemento = document.querySelector(`[data-id="${id}"]`);
    if (elemento) {
        elemento.classList.toggle("done");
    }
};

// Pesquisar tarefas
const pesquisarTarefas = (termo) => {
    const todasTarefas = document.querySelectorAll(".todo");
    
    todasTarefas.forEach((tarefa) => {
        const texto = tarefa.querySelector("h3").innerText.toLowerCase();
        if (texto.includes(termo.toLowerCase())) {
            tarefa.style.display = "flex";
        } else {
            tarefa.style.display = "none";
        }
    });
};

// Filtrar tarefas
const filtrarTarefas = (filtro) => {
    const todasTarefas = document.querySelectorAll(".todo");
    
    todasTarefas.forEach((tarefa) => {
        if (filtro === "all") {
            tarefa.style.display = "flex";
        } else if (filtro === "done") {
            tarefa.style.display = tarefa.classList.contains("done") ? "flex" : "none";
        } else if (filtro === "todo") {
            tarefa.style.display = !tarefa.classList.contains("done") ? "flex" : "none";
        }
    });
};

// Abrir modal
const openModal = () => {
    overlay.classList.remove("hidden");
};

// Fechar modal
const closeModal = () => {
    overlay.classList.add("hidden");
};

// Alternar formulários
const alternarFormularios = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

// ===== EVENTOS =====

// Evento: Adicionar tarefa
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const valor = todoInput.value.trim();
    if (valor) {
        adicionarTarefa(valor);
    }
});

// Evento: Cliques nos botões de ação
document.addEventListener("click", (e) => {
    const botao = e.target;
    const tarefaDiv = botao.closest(".todo");
    
    if (!tarefaDiv) return;
    
    const id = parseInt(tarefaDiv.getAttribute("data-id"));
    const titulo = tarefaDiv.querySelector("h3").innerText;
    
    // Botão de concluir
    if (botao.classList.contains("finish-todo")) {
        marcarConcluida(id);
    }
    
    // Botão de editar
    if (botao.classList.contains("edit-todo")) {
        alternarFormularios();
        editInput.value = titulo;
        oldInputValue = titulo;
    }
    
    // Botão de deletar
    if (botao.classList.contains("remove-todo")) {
        if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
            deletarTarefa(id);
        }
    }
});

// Evento: Cancelar edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alternarFormularios();
});

// Evento: Submeter edição
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const novoTexto = editInput.value.trim();
    if (novoTexto) {
        const tarefaParaAtualizar = todos.find(todo => todo.text === oldInputValue);
        if (tarefaParaAtualizar) {
            atualizarTarefa(tarefaParaAtualizar.id, novoTexto);
        }
        alternarFormularios();
    }
});

// Evento: Pesquisa
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        pesquisarTarefas(e.target.value);
    });
}

// Evento: Limpar pesquisa
if (eraseButton) {
    eraseButton.addEventListener("click", (e) => {
        e.preventDefault();
        searchInput.value = "";
        pesquisarTarefas("");
    });
}

// Evento: Filtro
if (filterSelect) {
    filterSelect.addEventListener("change", (e) => {
        filtrarTarefas(e.target.value);
    });
}

// ===== INICIALIZAÇÃO =====
console.log("🚀 Script carregado!");
console.log("document.readyState:", document.readyState);

if (document.readyState === "loading") {
    console.log("⏳ Aguardando DOM...");
    document.addEventListener("DOMContentLoaded", () => {
        console.log("✅ DOM pronto!");
        carregarTarefasLocalStorage();
        applySearchFilterBg();
    });
} else {
    console.log("✅ DOM já estava pronto!");
    carregarTarefasLocalStorage();
    applySearchFilterBg();
}
