const { todoapp } = require('./app');

const port = process.env.PORT || 3000;

todoapp.listen(port, () => {
  console.log(`Todo backend running on http://localhost:${port}`);
});
