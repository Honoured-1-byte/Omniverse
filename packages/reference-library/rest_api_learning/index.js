const express = require('express');
const app = express();
const port = 8080;
const path = require('path');

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let posts = [ 
  { id: '1a', title: 'Post 1', content: 'This is the content of post 1' },
  { id: '2b', title: 'Post 2', content: 'This is the content of post 2' },
];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/posts'); // Redirect to all posts page
});

app.post('/posts', (req, res) => {
  res.render("index.ejs", { posts }); // Just renders the index.ejs view
});

app.get('/posts/:id', (req, res) => {
  let { id } = req.params;
  let post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render("show.ejs", { post }); // Renders detail page for the post
});

app.get('/posts/new', (req, res) => {
  res.render("new.ejs"); // Form to create new post
});

// Single working route to handle form submission
app.post('/posts/new', (req, res) => {
  const newPost = {
    id: Math.random().toString(36).substring(2, 8), // 6-char ID
    title: req.body.title,
    content: req.body.content
  };
  posts.push(newPost);
  res.redirect('/posts');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
