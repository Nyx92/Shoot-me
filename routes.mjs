import { resolve } from 'path';
// import the controller
import initUsersController from './controllers/users.mjs';
import initGamestateController from './controllers/gamestate.mjs';
import db from './models/index.mjs';

export default function bindRoutes(app) {
  // pass in the db for all items callbacks
  const usersController = initUsersController(db);
  const gamestateController = initGamestateController(db);
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
  // submits score data to form leaderboard
  app.post('/score', gamestateController.score);
  // returns leaderboard data
  app.get('/leaderboard', gamestateController.leaderboard);
  // returns player's highscore data
  app.get('/highscore', gamestateController.highscore);
  // submits saved gamestate
  app.post('/savedgame', gamestateController.savedgame);
  // submits saved gamestate
  app.get('/loadgame', gamestateController.loadgame);
}
// app.get('/game', (request, response) => {
//   response.sendFile(resolve('dist', 'main.html'));
// });
