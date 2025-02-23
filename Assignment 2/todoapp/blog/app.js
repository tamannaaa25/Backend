const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
    next();
});

// Load Posts
const loadPosts = () => {
    try {
        const data = fs.readFileSync('posts.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Routes
app.get('/', (req, res) => {
    const posts = loadPosts();
    res.render('home', { posts });
});

app.get('/post', (req, res) => {
    const posts = loadPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (post) {
        res.render('post', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

app.get('/add-post', (req, res) => {
    res.render('addPost');
});

app.post('/add-post', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send('Title and Content are required');
    }

    let posts = loadPosts();
    const newPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 1,
        title,
        content,
        date: new Date().toLocaleString()
    };

    posts.push(newPost);
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));

    res.redirect('/');
});

// Set EJS as view engine
app.set('view engine', 'ejs');

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
