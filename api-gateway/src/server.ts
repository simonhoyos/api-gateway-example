import apicache from 'apicache';
import express from 'express';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
  message: 'Too many requests, please slow down!',
});

const app = express();
const port = 3000;

async function getAggregatedData(id: string) {
  const postResponse = await fetch(
    `http://${process.env.POST_API_HOST ?? 'localhost'}:3001/posts/${id}`,
  ).then((res) => res.json());

  const userResponse = await fetch(
    `http://${process.env.USER_API_HOST ?? 'localhost'}:3002/users/${id}`,
  ).then((res) => res.json());

  return {
    data: {
      id: userResponse.login,
      followers_url: userResponse.followers_url,
      following_url: userResponse.following_url,
      subscriptions_url: userResponse.subscriptions_url,
      repos_url: userResponse.repos_url,
      post: postResponse,
    },
    location: userResponse.location,
  };
}

const cache = apicache.middleware;
app.use(cache('5 minutes'));

app.get('/users/:id', limiter, async (req, res) => {
  const id = req.params.id;

  try {
    const aggregatedData = await getAggregatedData(id);

    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Bad request' });
  }
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
