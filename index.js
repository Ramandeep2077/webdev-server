const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

let courses = [
  { _id: "1234", courseNumber: "CS1234", name: "CS1234 React JS", subtitle: "Full Stack software developer", startDate: "2026-09-09", image: "/images/reactjs.jpg", term: "Fall 2026" },
  { _id: "2345", courseNumber: "CS2345", name: "CS2345 Node JS", subtitle: "Server side JavaScript", startDate: "2026-09-09", image: "/images/nodejs.jpg", term: "Fall 2026" },
  { _id: "3456", courseNumber: "CS3456", name: "CS3456 MongoDB", subtitle: "NoSQL Databases", startDate: "2026-09-09", image: "/images/mongodb.jpg", term: "Fall 2026" },
];

let modules = [
  { _id: "mod-1234-1", course: "1234", name: "Week 1: React Foundations", lessons: [{ title: "LEARNING OBJECTIVES", items: ["Understand component-based interfaces"] }] },
  { _id: "mod-1234-2", course: "1234", name: "Week 2: State and Events", lessons: [{ title: "READING", items: ["Manage component state"] }] },
  { _id: "mod-2345-1", course: "2345", name: "Week 1: Node.js Runtime", lessons: [{ title: "READING", items: ["Use Node.js modules"] }] },
  { _id: "mod-2345-2", course: "2345", name: "Week 2: Express APIs", lessons: [{ title: "LAB", items: ["Build REST endpoints"] }] },
  { _id: "mod-3456-1", course: "3456", name: "Week 1: Document Databases", lessons: [{ title: "LEARNING OBJECTIVES", items: ["Model document data"] }] },
];

let todos = [
  { id: 1, title: "Build the HTTP server", completed: false },
  { id: 2, title: "Create REST routes", completed: true },
  { id: 3, title: "Deploy to Render", completed: false },
];

const assignment = { id: 1, title: "RESTful Web APIs", grade: 100 };
const moduleObject = { id: 1, name: "Lab 5: HTTP Servers" };

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Kambaz server" });
});

app.get("/lab5/welcome", (req, res) => {
  res.send("Welcome to Lab 5");
});

app.get("/lab5/add/:a/:b", (req, res) => {
  res.json(Number(req.params.a) + Number(req.params.b));
});

app.get("/lab5/subtract/:a/:b", (req, res) => {
  res.json(Number(req.params.a) - Number(req.params.b));
});

app.get("/lab5/multiply/:a/:b", (req, res) => {
  res.json(Number(req.params.a) * Number(req.params.b));
});

app.get("/lab5/divide/:a/:b", (req, res) => {
  res.json(Number(req.params.a) / Number(req.params.b));
});

app.get("/lab5/calculator", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  let result = a + b;
  if (req.query.operation === "subtract") result = a - b;
  if (req.query.operation === "multiply") result = a * b;
  if (req.query.operation === "divide") result = a / b;
  res.json(result);
});

app.get("/lab5/assignment", (req, res) => res.json(assignment));
app.get("/lab5/assignment/title", (req, res) => res.send(assignment.title));
app.get("/lab5/assignment/grade", (req, res) => res.json(assignment.grade));
app.get("/lab5/module", (req, res) => res.json(moduleObject));
app.get("/lab5/module/name", (req, res) => res.send(moduleObject.name));

app.get("/lab5/todos", (req, res) => {
  if (req.query.completed === "true") {
    return res.json(todos.filter((todo) => todo.completed));
  }
  res.json(todos);
});
app.get("/lab5/todos/:id", (req, res) => {
  const todo = todos.find((item) => item.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});
app.post("/lab5/todos", (req, res) => {
  const todo = { id: Date.now(), title: req.body.title || "New Todo", completed: false, ...req.body };
  todos.push(todo);
  res.json(todo);
});
app.put("/lab5/todos/:id", (req, res) => {
  const index = todos.findIndex((todo) => todo.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Todo not found" });
  todos[index] = { ...todos[index], ...req.body };
  res.json(todos[index]);
});
app.delete("/lab5/todos/:id", (req, res) => {
  const index = todos.findIndex((todo) => todo.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Todo not found" });
  todos.splice(index, 1);
  res.sendStatus(200);
});

app.get("/api/courses", (req, res) => res.json(courses));
app.get("/api/courses/:courseId", (req, res) => {
  const course = courses.find((item) => item._id === req.params.courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});
app.post("/api/courses", (req, res) => {
  const course = { _id: Date.now().toString(), ...req.body };
  courses.push(course);
  res.json(course);
});
app.put("/api/courses/:courseId", (req, res) => {
  const index = courses.findIndex((item) => item._id === req.params.courseId);
  if (index === -1) return res.status(404).json({ message: "Course not found" });
  courses[index] = { ...courses[index], ...req.body };
  res.json(courses[index]);
});
app.delete("/api/courses/:courseId", (req, res) => {
  courses = courses.filter((item) => item._id !== req.params.courseId);
  modules = modules.filter((item) => item.course !== req.params.courseId);
  res.sendStatus(200);
});

app.get("/api/courses/:courseId/modules", (req, res) => {
  res.json(modules.filter((item) => item.course === req.params.courseId));
});
app.post("/api/courses/:courseId/modules", (req, res) => {
  const module = { _id: `mod-${Date.now()}`, course: req.params.courseId, ...req.body, lessons: req.body.lessons || [] };
  modules.push(module);
  res.json(module);
});
app.put("/api/modules/:moduleId", (req, res) => {
  const index = modules.findIndex((item) => item._id === req.params.moduleId);
  if (index === -1) return res.status(404).json({ message: "Module not found" });
  modules[index] = { ...modules[index], ...req.body };
  res.json(modules[index]);
});
app.delete("/api/modules/:moduleId", (req, res) => {
  modules = modules.filter((item) => item._id !== req.params.moduleId);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Kambaz server listening on port ${PORT}`);
});
