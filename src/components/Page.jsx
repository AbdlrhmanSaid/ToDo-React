import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Alert,
  Badge,
  ListGroup,
} from "react-bootstrap";
import "./page.css";

const Page = () => {
  const [toDos, setToDos] = useState(() => {
    const savedToDos = localStorage.getItem("toDos");
    return savedToDos ? JSON.parse(savedToDos) : [];
  });
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef();

  const submitButton = (e) => {
    e.preventDefault();
    const text = inputRef.current.value.trim();

    if (!text) {
      setInputError(true);
      return;
    }

    setInputError(false);
    const newItem = {
      completed: false,
      text,
      createdAt: new Date().toISOString(),
    };
    setToDos([...toDos, newItem]);
    inputRef.current.value = "";
  };

  const handleDone = (index) => {
    const newToDos = [...toDos];
    newToDos[index].completed = !newToDos[index].completed;
    setToDos(newToDos);
  };

  const handleDelete = (index) => {
    const newToDos = [...toDos];
    newToDos.splice(index, 1);
    setToDos(newToDos);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitButton(e);
    }
  };

  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  }, [toDos]);

  const sortedToDos = [...toDos].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="todo-app">
      <Container className="py-4">
        <div className="app-header p-4 mb-4 rounded shadow-sm">
          <h1 className="display-4 mb-3 text-primary">To-Do List</h1>
          <p className="lead text-muted">Organize your tasks efficiently</p>

          <Form onSubmit={submitButton} className="mt-4">
            <div className="d-flex gap-2">
              <Form.Control
                placeholder="What needs to be done?"
                ref={inputRef}
                onKeyPress={handleKeyPress}
                className="flex-grow-1"
                isInvalid={inputError}
              />
              <Button type="submit" variant="primary" className="px-4">
                Add Task
              </Button>
            </div>
            {inputError && (
              <Form.Text className="text-danger">
                Please enter a task before adding
              </Form.Text>
            )}
          </Form>
        </div>

        <div className="stats mb-3 d-flex justify-content-between">
          <Badge pill bg="info" className="px-3 py-2">
            Total: {toDos.length}
          </Badge>
          <Badge pill bg="success" className="px-3 py-2">
            Completed: {toDos.filter((todo) => todo.completed).length}
          </Badge>
          <Badge pill bg="warning" className="px-3 py-2 text-dark">
            Pending: {toDos.filter((todo) => !todo.completed).length}
          </Badge>
        </div>

        <ListGroup className="shadow-sm">
          {sortedToDos.length > 0 ? (
            sortedToDos.map(({ text, completed, createdAt }, index) => (
              <ListGroup.Item
                key={`${createdAt}-${index}`}
                className={`d-flex justify-content-between align-items-center p-3 ${
                  completed ? "completed-task" : ""
                }`}
              >
                <div
                  className="task-content flex-grow-1"
                  onClick={() => handleDone(index)}
                  style={{ cursor: "pointer" }}
                >
                  <span
                    className={`task-text ${completed ? "text-muted" : ""}`}
                  >
                    {text}
                  </span>
                  {completed && (
                    <small className="text-muted ms-2">(Completed)</small>
                  )}
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  className="ms-2"
                >
                  <i className="bi bi-trash"></i> Delete
                </Button>
              </ListGroup.Item>
            ))
          ) : (
            <Alert variant="light" className="text-center py-4">
              <div className="empty-state">
                <i className="bi bi-emoji-smile display-4 text-muted mb-3"></i>
                <h4>Nothing to do!</h4>
                <p className="text-muted">Add your first task above</p>
              </div>
            </Alert>
          )}
        </ListGroup>

        {toDos.length > 0 && (
          <div className="mt-3 text-end">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setToDos([])}
            >
              Clear All Tasks
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Page;
