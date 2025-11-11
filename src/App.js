import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState({
    draft: [],
    inProgress: [],
    done: [],
    canceled: [],
  });

  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newTaskObj = {
      id: Date.now().toString(),
      title: newTask,
      description: "",
    };
    setTasks((prev) => ({
      ...prev,
      draft: [...prev.draft, newTaskObj],
    }));
    setNewTask("");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceItems = [...tasks[sourceCol]];
    const destItems = [...tasks[destCol]];

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    setTasks({
      ...tasks,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    });
  };

  const handleSave = () => {
    setTasks((prev) => {
      const updated = { ...prev };
      for (let col in updated) {
        updated[col] = updated[col].map((t) =>
          t.id === editingTask.id ? editingTask : t
        );
      }
      return updated;
    });
    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">ToDoList</h1>

      <div className="add-task">
        <input
          type="text"
          placeholder="Yeni görev ekle..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Ekle</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board">
          {Object.entries(tasks).map(([key, column]) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{column.name || key.replace(/^\w/, (c) => c.toUpperCase())}</h2>
                  {column.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setEditingTask(item)}
                        >
                          <strong>{item.title}</strong>
                          {item.description && (
                            <p className="desc">{item.description}</p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {editingTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>Görevi Düzenle</h3>
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              placeholder="Başlık"
            />
            <textarea
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
              placeholder="Açıklama"
            ></textarea>
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                Kaydet
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
