const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const cors = require('cors');

app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = "mongodb://localhost:27017/To-Do";

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Task Schema
const taskSchema = new Schema({
    tasks: { type: String, required: true },
    completed: { type: Boolean, default: false }, // Ensure consistent field name
});

// Task Model
const Tasks = mongoose.model('Tasks', taskSchema);

// POST: Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const task = new Tasks(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Retrieve all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Tasks.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const result = await Tasks.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH: Update the completed status of a task
app.patch('/tasks/:id', async (req, res) => {
    try {
        const task = await Tasks.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.completed = req.body.completed ?? task.completed;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Centralized Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An internal server error occurred' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
