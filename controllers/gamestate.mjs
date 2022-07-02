// this function will deal with all gamestates payloads
export default function initGamestateController(db) {
  // this function stores user's scores in the database
  const score = async (request, response) => {
    const userIdCookie = request.cookies.userId;
    console.log(request.body);
    console.log(request.body.finalScore);
    try {
      await db.Gamestate.create({
        score: request.body.finalScore,
        user_id: userIdCookie,
        // created_at: new Date(),
        // updated_at: new Date(),
      });
      response.send({ data: 'success' });
    } catch (error) {
      console.log(error);
    }
  };

  // this function calls the leaderboard data from the database
  const leaderboard = async (request, response) => {
    try {
      const scoreList = await db.Gamestate.findAll({
        // eager loading
        include: db.User,
        limit: 10,
        order: [['score', 'DESC']],
      });
      response.send({ scoreList });
    } catch (error) {
      console.log(error);
    }
  };

  // this function calls the highscore data from the database
  const highscore = async (request, response) => {
    const userIdCookie = request.cookies.userId;
    try {
      const highScore = await db.Gamestate.findOne({
        where: {
          user_id: userIdCookie,
        },
        include: db.User,
        order: [['score', 'DESC']],
      });
      response.send({ highScore });
    } catch (error) {
      console.log(error);
    }
  };

  // this function stores saved gamestate in the database
  const savedgame = async (request, response) => {
    console.log(request.body);
    console.log('saved score');
    const savedScore = request.body.score;
    console.log('game state');
    const savedgameState = request.body.enemies_pos;
    const userIdCookie = request.cookies.userId;
    console.log(savedScore);
    console.log(savedgameState);
    try {
      const findUser = await db.Savedgame.findOne({
        where: {
          user_id: userIdCookie,
        },
      });
      console.log('this is found user');
      console.log(findUser);
      if (findUser !== null) {
        console.log('updating');
        // find and replace
        await findUser.update({
          score: savedScore,
          user_id: userIdCookie,
          enemies_pos: savedgameState,
        // created_at: new Date(),
        // updated_at: new Date(),
        });
        response.send({ data: 'success1' });
      } else {
        console.log('creating');
        await db.Savedgame.create({
          score: savedScore,
          user_id: userIdCookie,
          enemies_pos: savedgameState,
        // created_at: new Date(),
        // updated_at: new Date(),
        });
        response.send({ data: 'success2' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // this function calls the highscore data from the database
  const loadgame = async (request, response) => {
    console.log('trying to load game?');
    const userIdCookie = request.cookies.userId;
    try {
      const savedGameData = await db.Savedgame.findOne({
        where: {
          user_id: userIdCookie,
        },
      });
      response.send({ savedGameData });
    } catch (error) {
      console.log(error);
    }
  };

  // return all methods we define in an object
  // refer to the routes file above to see this used
  return {
    score, leaderboard, highscore, savedgame, loadgame,
  };
}
