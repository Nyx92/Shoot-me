export const leaderboardCreator = function () {
  const leaderBoardBtn = document.querySelector('#leaderboardBtn');
  leaderBoardBtn.addEventListener('click', () => {
  // if leaderboard is shown, remove leaderboard
    if (document.querySelector('#leaderboard-div')) {
      document.querySelector('#leaderboard-table').innerHTML = '';
    } else {
    // get scores from database and outputs it in a table via a route
      axios
        .get('/leaderboard')
        .then((response) => {
          // handle success
          console.log(response);
          const leaderboardDiv = document.querySelector('#leaderboard-table');
          // build leaderboard modal
          const div = document.createElement('div');
          // give it an id
          div.setAttribute('id', 'leaderboard-div');
          // create table
          const table = document.createElement('table');
          // give it an id
          table.setAttribute('id', 'leaderboard-table');
          // create first row for table headers
          const firstRow = document.createElement('tr');
          // create headers
          const firstHeader = document.createElement('th');
          firstHeader.style.border = '1px solid white';
          const secondHeader = document.createElement('th');
          secondHeader.style.border = '1px solid white';
          const thirdHeader = document.createElement('th');
          firstHeader.innerHTML = '&#11088';
          secondHeader.innerHTML = 'NAME';
          thirdHeader.innerHTML = 'SCORE';
          firstRow.appendChild(firstHeader);
          firstRow.appendChild(secondHeader);
          firstRow.appendChild(thirdHeader);
          // append first row (i.e., headers) into table
          table.appendChild(firstRow);
          // create rows for scores
          for (let i = 0; i < 10; i++) {
            const rows = document.createElement('tr');
            const elementRank = document.createElement('td');
            elementRank.style.border = '1px solid white';
            const elementName = document.createElement('td');
            elementName.style.border = '1px solid white';
            const elementScore = document.createElement('td');
            elementScore.style.border = '1px solid white';
            elementRank.innerHTML = `${i + 1}`;
            elementName.innerHTML = response.data.scoreList[i].user.username;
            elementScore.innerHTML = response.data.scoreList[i].score;
            rows.appendChild(elementRank);
            rows.appendChild(elementName);
            rows.appendChild(elementScore);
            table.appendChild(rows);
          }
          // append table in div
          div.appendChild(table);
          leaderboardDiv.appendChild(div);
          div.style.color = 'white';
          table.style.marginTop = '20px';
          table.style.width = '500px';
          table.style.height = '400px';
          table.style.textAlign = 'center';
          // table.style.borderCollapse = 'collapse';
          // document.querySelectorAll('td').style.border = '1px solid white';
          document.querySelector('table').style.border = '1px solid white';
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    }
  });
};

export const highscoreCreator = function () {
  axios
    .get('/highscore')
    .then((response) => {
      // handle success
      console.log(response);
      const highscoreDiv = document.querySelector('.highscore');
      highscoreDiv.innerHTML = '';
      highscoreDiv.innerHTML = 'HighScore :';
      highscoreDiv.innerHTML += ` ${response.data.highScore.score}`;
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

// export const saveGame = function () {
//   const saveGameBtn = document.querySelector('#save-game-btn');
//   saveGameBtn.addEventListener('click', () => {
//     // once clicked, sends data back to table

//       axios
//         .get('/leaderboard')
//         .then((response) => {
