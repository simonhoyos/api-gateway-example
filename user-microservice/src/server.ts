import express from 'express';

const app = express();
const port = 3002;

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await fetch(`https://api.github.com/users/${userId}`).then(
      (res) => res.json(),
    );

    if (user == null) {
      res.status(404).send('User not found');
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
