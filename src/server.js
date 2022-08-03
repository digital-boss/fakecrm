import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Dal } from './dal.js';

const app = express();
const port = 3000;

const dal = new Dal();

// Error Handlers

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: err.message });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}


// Middleware

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// Post

app.post('/post', (req, res, next) => {
  try { 
    const post = req.body;
    const id = dal.createPost(post);
    res.json({id});
  } catch (err) {
    next(err);
  }
});

app.put('/post/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    const post = req.body;
    dal.updatePost(id, post);
    res.end();
  } catch (err) {
    next(err);
  }
});

app.get('/post', (req, res, next) => {
  try {
    const r = dal.getPosts();
    res.json(r);
  } catch (err) {
    next(err);
  }
});

app.get('/post/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    const r = dal.getPost(id);
    res.json(r)
  } catch (err) {
    next(err);
  }
});

app.delete('/post/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    const r = dal.deletePost(id);
    res.json(r)
  } catch (err) {
    next(err);
  }
});

// Comment

app.post('/post/:postId/comment', (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comment = req.body;
    const id = dal.createComment(postId, comment);
    res.json({id});
  } catch (err) {
    next(err);
  }
});

app.put('/post/:postId/comment/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    const postId = req.params.postId;
    const comment = req.body;
    dal.updateComment(postId, id, comment);
    res.end();
  } catch (err) {
    next(err);
  }
});

app.get('/post/:postId/comment', (req, res, next) => {
  try {
    const postId = req.params.postId;
    const r = dal.getPostComments(postId);
    res.json(r);
  } catch (err) {
    next(err);
  }
});

app.get('/post/:postId/comment/:id', (req, res, next) => {
  try {
    const postId = req.params.postId;
    const id = req.params.id;
    const r = dal.getPostComment(postId, id);
    res.json(r)
  } catch (err) {
    next(err);
  }
});

app.delete('/post/:postId/comment/:id', (req, res, next) => {
  try {
    const postId = req.params.postId;
    const id = req.params.id;
    const r = dal.deleteComment(postId, id);
    res.json(r)
  } catch (err) {
    next(err);
  }
});

// Server

function handle(signal) {
  console.log(`Received ${signal}`);
  // dal.persist();
  process.exit();
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
process.on('SIGBREAK', handle);

app.listen(port, () => console.log(`FakeCrm listening on port ${port}!`));