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
        userId: userIdCookie,
        // created_at: new Date(),
        // updated_at: new Date(),
      });
      // response.redirect('/home');
    } catch (error) {
      console.log(error);
    }
  };

  // this function calls the leaderboard data from the database
  const leaderboard = async (request, response) => {
    try {
      const scoreList = await db.Gamestate.findAll({
        limit: 10,
        order: [['score', 'DESC']],
      });
      response.send({ scoreList });
    } catch (error) {
      console.log(error);
    }
  };

  // return all methods we define in an object
  // refer to the routes file above to see this used
  return {
    score, leaderboard,
  };
}
