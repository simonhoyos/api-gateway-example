import express from 'express';

const app = express();
const port = 3001;

app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
    ).then((res) => res.json());

    if (post == null) {
      res.status(404).send('Post not found');
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
