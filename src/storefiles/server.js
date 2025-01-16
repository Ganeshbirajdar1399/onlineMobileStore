const jsonServer = require('json-server');
const bcrypt = require('bcryptjs');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // This points to your db.json file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom middleware for hashing password before saving the user
server.use((req, res, next) => {
  if (req.method === 'POST' && req.url === '/users') {
    const { password } = req.body;

    if (password) {
      // Hash the password before saving to db.json
      req.body.password = bcrypt.hashSync(password, 10); // 10 salt rounds
    }
  }
  next();
});

// Use the router to handle the endpoints
server.use(router);

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
