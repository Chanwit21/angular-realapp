/*
 * from https://www.techiediaries.com/fake-api-jwt-json-server/
 * updated and mixed with
 * https://spin.atomicobject.com/2018/10/08/mock-api-json-server/
 */
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;
const SECRET_KEY = '123546798';
const expiresIn = '1h';
server.use(jsonServer.bodyParser);
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Create a token from payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
}

// Verify the token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => (decode !== undefined ? decode : err));
}
var result = {};
// Check if the user exists in database
function isAuthenticated({ email, password }) {
  result = router.db.get('customers').find({ email: email }).value();
  if (result && result.password === password) {
    return true;
  } else {
    return false;
  }
}

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  if (email != null) {
    if (isAuthenticated({ email, password }) === false) {
      const status = 401;
      const message = 'Incorrect email or password';
      res.status(status).json({ status, message });
      //  res.status(400).jsonp({ error: 'No valid user of email ' + email });
      return;
    }

    //const access_token = createToken({ email, password });
    const access_token = createToken({ email, dummy: 'dummy_payload' });
    let user = { username: 'Test User', accessToken: access_token, ...result };
    res.status(200).jsonp(user);
  } else {
    res.status(400).jsonp({ error: 'No valid email ' });
  }
});

/*
server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401;
    const message = 'Bad authorization header';
    res.status(status).json({ status, message });
    return;
  }
  try {
    let v = verifyToken(req.headers.authorization.split(' ')[1]);
    console.log('Verify token ', v);
    next();
  } catch (err) {
    const status = 401;
    const message = 'Error: access_token is not valid';
    res.status(status).json({ status, message });
  }
});
*/

server.use((req, res, next) => {
  const path = req.path;
  console.log(path);

  if (path.includes('/user')) {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      const status = 401;
      const message = 'Bad authorization header';
      res.status(status).json({ status, message });
      return;
    }
    try {
      let v = verifyToken(req.headers.authorization.split(' ')[1]);

      console.log('Verify token ', v);
      if (v.exp !== undefined) {
        next();
      } else {
        const status = 401;
        const message = 'Error: access_token is not valid';
        res.status(status).json({ status, message });
      }
    } catch (err) {
      const status = 401;
      const message = 'Error: access_token is not valid';
      res.status(status).json({ status, message });
    }
  } else {
    next();
  }
});
server.get('/user/me', (req, res) => {
  res.jsonp({ name: 'Great Bebetter', email: 'yourname@yourorg.com' });
});

server.use(router);
server.listen(port, () => {
  console.log('JSON server is running');
});
