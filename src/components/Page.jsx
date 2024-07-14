import React, { useState, useRef, useEffect } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import "./page.css";

const Page = () => {
  const [toDos, setToDos] = useState(() => {
    const savedToDos = localStorage.getItem("toDos");
    return savedToDos ? JSON.parse(savedToDos) : [];
  });
  const inputRef = useRef();

  const submitButton = (e) => {
    e.preventDefault();
    const text = inputRef.current.value;
    const newItem = { completed: false, text };
    if (text) {
      setToDos([...toDos, newItem]);
      inputRef.current.value = "";
    }
  };

  const handleDone = (index) => {
    const newtoDos = [...toDos];
    newtoDos[index].completed = !newtoDos[index].completed;
    setToDos(newtoDos);
  };

  const handleDelete = (index) => {
    const newtoDos = [...toDos];
    newtoDos.splice(index, 1);
    setToDos(newtoDos);
  };

  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  }, [toDos]);

  console.log(toDos.length);

  return (
    <div className="page text-center border rounded shadow bg-white">
      <Container fluid>
        <h1 className="my-3 p-3 rounded" style={{ background: "#eee" }}>
          To Do List
        </h1>
        <Form onSubmit={submitButton}>
          <Form.Control placeholder="Add Task" ref={inputRef} />
          <Button type="submit" variant="primary" className="mt-3">
            Add
          </Button>
        </Form>
        <ul className="list-group m-3">
          {toDos.length > 0 ? (
            toDos.map(({ text, completed }, index) => (
              <div
                key={index}
                className="liParent rounded overflow-hidden my-1"
              >
                <li
                  className={
                    completed ? "done list-group-item " : "list-group-item "
                  }
                  onClick={() => handleDone(index)}
                >
                  {text}
                  {completed && (
                    <span className="text-muted float-end">✅</span>
                  )}
                </li>
                <Button
                  variant="danger"
                  className="ml-2 w-100"
                  onClick={() => handleDelete(index)}
                >
                  🗙
                </Button>
              </div>
            ))
          ) : (
            <Alert variant="secondary">
              <h4>Nothing To Do</h4>
            </Alert>
          )}
          {}
        </ul>
      </Container>
    </div>
  );
};

export default Page;
