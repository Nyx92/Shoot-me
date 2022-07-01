// Model Index File to Make Models Accessible in App
// Initialise and export all the models we define in a single module (index.mjs).
// This makes it easy to access models from different modules within our application
import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../config/config.js';
import initUserModel from './user.mjs';
import initGameStateModel from './gamestate.mjs';
import initSavedGameModel from './savedgame.mjs';

const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};
let sequelize;

// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === 'production') {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}

// If env is not production, retrieve DB auth details from the config
else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// here we are putting initUserModel from user.mmjs into the object "db"
db.User = initUserModel(sequelize, Sequelize.DataTypes);
db.Gamestate = initGameStateModel(sequelize, Sequelize.DataTypes);
db.Savedgame = initSavedGameModel(sequelize, Sequelize.DataTypes);

// The following 2 lines enable Sequelize to recognise the 1-M relationship
// between Item and Category models, providing the mixin association methods.
db.Gamestate.belongsTo(db.User);
db.User.hasMany(db.Gamestate);
// Each user will only have one instance of saved game state
db.Savedgame.belongsTo(db.User);
db.User.hasOne(db.Savedgame);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
