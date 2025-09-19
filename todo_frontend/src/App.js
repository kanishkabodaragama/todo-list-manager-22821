import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App
 * A classic-styled Todo List application implementing add, list, update, and delete.
 * Uses in-memory storage for todos and adheres to the provided style guide colors.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Seed with example todos on first mount for demonstration
  useEffect(() => {
    setTodos([
      { id: createId(), text: 'Welcome to your Todo List', completed: false },
      { id: createId(), text: 'Click text to edit inline', completed: false },
      { id: createId(), text: 'Use the ✓ and 🗑 to complete or delete', completed: true },
    ]);
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Helpers
  function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  // PUBLIC_INTERFACE
  function handleAddTodo(e) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    const next = { id: createId(), text: value, completed: false };
    setTodos((prev) => [next, ...prev]);
    setInput('');
  }

  // PUBLIC_INTERFACE
  function handleDelete(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText('');
    }
  }

  // PUBLIC_INTERFACE
  function handleToggleComplete(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // PUBLIC_INTERFACE
  function beginEdit(id, currentText) {
    setEditingId(id);
    setEditingText(currentText);
  }

  // PUBLIC_INTERFACE
  function commitEdit(id) {
    const text = editingText.trim();
    if (!text) {
      // If cleared, delete instead of saving empty
      handleDelete(id);
      return;
    }
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    setEditingId(null);
    setEditingText('');
  }

  // PUBLIC_INTERFACE
  function cancelEdit() {
    setEditingId(null);
    setEditingText('');
  }

  // PUBLIC_INTERFACE
  function handleKeyDownEdit(e, id) {
    if (e.key === 'Enter') {
      commitEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed);
    if (filter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="App classic-app">
      <header className="topbar shadow-sm">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden>✓</span>
            <span className="brand-title">Todo Manager</span>
          </div>
          <div className="actions">
            <button
              className="btn subtle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="panel shadow-md">
          <h1 className="panel-title">Tasks</h1>

          <form className="addbar" onSubmit={handleAddTodo} role="form" aria-label="Add todo">
            <input
              type="text"
              className="input"
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="New todo text"
            />
            <button type="submit" className="btn primary" aria-label="Add todo">
              Add
            </button>
          </form>

          <div className="toolbar">
            <div className="filters" role="group" aria-label="Filters">
              <FilterButton current={filter} setFilter={setFilter} value="all" label="All" />
              <FilterButton current={filter} setFilter={setFilter} value="active" label="Active" />
              <FilterButton current={filter} setFilter={setFilter} value="completed" label="Completed" />
            </div>
            <div className="meta">
              <span className="muted">{remaining} remaining</span>
            </div>
          </div>

          <ul className="list" role="list" aria-label="Todo list">
            {filteredTodos.length === 0 && (
              <li className="empty muted">No todos to display.</li>
            )}
            {filteredTodos.map((todo) => (
              <li key={todo.id} className={`item ${todo.completed ? 'done' : ''}`}>
                <button
                  className="icon-btn check"
                  onClick={() => handleToggleComplete(todo.id)}
                  aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
                  title={todo.completed ? 'Mark as active' : 'Mark as completed'}
                >
                  {todo.completed ? '✓' : '○'}
                </button>

                {editingId === todo.id ? (
                  <input
                    className="edit-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => commitEdit(todo.id)}
                    onKeyDown={(e) => handleKeyDownEdit(e, todo.id)}
                    autoFocus
                    aria-label="Edit todo"
                  />
                ) : (
                  <button
                    className="item-text"
                    onClick={() => beginEdit(todo.id, todo.text)}
                    title="Click to edit"
                  >
                    {todo.text}
                  </button>
                )}

                <div className="spacer" />

                {editingId === todo.id ? (
                  <div className="inline-actions">
                    <button className="btn small success" onMouseDown={(e)=>e.preventDefault()} onClick={() => commitEdit(todo.id)}>
                      Save
                    </button>
                    <button className="btn small subtle" onMouseDown={(e)=>e.preventDefault()} onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(todo.id)}
                    aria-label="Delete todo"
                    title="Delete todo"
                  >
                    🗑
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer muted">
        <p>Classic UI • Custom Theme • React</p>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * FilterButton
 * Small helper component for toggling filters with visual accent on active state.
 */
function FilterButton({ current, setFilter, value, label }) {
  const active = current === value;
  return (
    <button
      className={`chip ${active ? 'active' : ''}`}
      onClick={() => setFilter(value)}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default App;
