const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const tasksFile = "tasks.json";

app.use(express.static("public"));



app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const readTasks = () => {
    try {
        const data = fs.readFileSync(tasksFile, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};


const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};


app.get("/tasks", (req, res) => {
    const tasks = readTasks();
    res.render("tasks", { tasks });
});


app.get("/task", (req, res) => {
    const tasks = readTasks();
    const taskId = parseInt(req.query.id);
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
        res.render("task", { task });
    } else {
        res.status(404).send("Task not found");
    }
});


app.get("/add-task", (req, res) => {
    res.render("addTask");
});


app.post("/add-task", (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.redirect("/tasks");
});


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});


app.get("/", (req, res) => {
    res.redirect("/tasks");  
});
