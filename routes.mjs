import { resolve } from 'path';
// import the controller
import initUsersController from './controllers/users.mjs';
import db from './models/index.mjs';

export default function bindRoutes(app) {
  // pass in the db for all items callbacks
  const usersController = initUsersController(db);
  // login/sign-up page
  app.get('/', (request, response) => {
    response.render('landing');
  });
  // when a user submits a sign-up form
  app.post('/sign-up', usersController.signUp);
  // when a user attempts to login
  app.post('/login', usersController.login);
  /// game route returns the Webpack-generated main.html file
  app.get('/game', usersController.game);
}
// app.get('/game', (request, response) => {
//   response.sendFile(resolve('dist', 'main.html'));
// });
