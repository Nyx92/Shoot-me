import './styles.scss';
import { leaderboardCreator, highscoreCreator } from './server_side_features.js';

// add highscore functionality (i.e., retrieve player's highscore) into the highscore button
highscoreCreator();
// add leaderboard functionality (i.e., retrieve leaderboard) into the leaderboard button
leaderboardCreator();
// #### GLOBAL VARIABLES ####
// canvas creation
const canvas = document.querySelector('canvas');
// specify 2d
const c = canvas.getContext('2d');
// set canvas width to match screen size
canvas.width = innerWidth;
// set canvas height to match screen size
canvas.height = innerHeight;
// global array known as projectiles
let projectiles = [];
// global array known as enemies
let enemies = [];
// global array known as players
let players = [];
// global array known as particles
let particles = [];
// global array to store id per frame
let animationId;
// global const to store speed of projectiles, default, 4
const speedOfProjectiles = 4;
const scoreEl = document.querySelector('#scoreEl');
const modalScoreEl = document.querySelector('.total-score');
const startGameBtn = document.querySelector('#startGamebtn');
const loadGameBtn = document.querySelector('#loadGamebtn');
let score = 0;

// Enemy class as global variable, in order for loaded game data to access the class
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  // function that draws each enemy as a circle in the canvas
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  // updates enemy with velocity
  update() {
    // to execute draw function of the enemy in the update function
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// function to draw player
const createPlayer = function (x, y, radius, color) {
  class Player {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
    }

    // create a draw function for Player that draws the Player as a circle in the canvas
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }

    update() {
      // to execute draw function of the player in the update function
      this.draw();
    }
  }

  // create player
  const player = new Player(x, y, radius, color);

  // updates the global array variable known as players
  players.push(player);
};

// function to create projectile feature
const createProjectileFeature = function (event) {
  // function to determine velocity direction and speed for projectiles based on user's clicks
  const calcVelocityProjectiles = function (event) {
    // clientX and clientY refers to the X and Y axis of position of clicks
    const angle = Math.atan2(
      event.clientY - canvas.height / 2,
      event.clientX - canvas.width / 2,
    );
    const velocity = {
      x: Math.cos(angle) * speedOfProjectiles,
      y: Math.sin(angle) * speedOfProjectiles,
    };
    return velocity;
  };

  class Projectile {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }

    // function that draws each projectile as a circle in the canvas
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }

    // updates projectile with velocity
    update() {
      // to execute draw function of the projectile in the update function
      this.draw();
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }

  // determine velocity direction based on user's clicks
  const projectileVelocity = calcVelocityProjectiles(event);

  // each time user clicks, a new variable called projectile is created
  // since x and y axis are the same as the player's, the projectile spawns from the player
  const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', projectileVelocity);

  // updates the global array variable known as projectiles
  projectiles.push(projectile);
};

// function to create enemy feature
const createEnemyFeature = function () {
  // set max and min radius of enemies
  const maxEnemyRadius = 40;
  const minEnemyRadius = 5;
  const radius = Math.random() * (maxEnemyRadius - minEnemyRadius) + minEnemyRadius;
  // x and y will store the value of where the enemy will spawn at
  let x;
  let y;

  // randomly decides where the enemy spawns
  // if less than .5, spawns left or right
  if (Math.random() < 0.5) {
    // spawns left or right
    // if x < 0.5, x = 0 - radius else canvas.width + radius
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    y = Math.random() * canvas.height;
    // else spawns top, down
  } else {
    x = Math.random() * canvas.width;
    // spawns top or down
    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
  }

  // color of enemy
  const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

  class Enemy {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }

    // function that draws each enemy as a circle in the canvas
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }

    // updates enemy with velocity
    update() {
      // to execute draw function of the enemy in the update function
      this.draw();
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }

  // function to determine velocity for enemies
  const calcVelocityEnemies = function (y, x) {
    // calculates how the enemy will travel to hit the middle (i.e., player)
    const angle = Math.atan2(
      canvas.height / 2 - y,
      canvas.width / 2 - x,
    );
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    return velocity;
  };

  const enemyVelocity = calcVelocityEnemies(y, x);
  // updates the global array variable known as enemies in intervals
  enemies.push(new Enemy(x, y, radius, color, enemyVelocity));
};

// function to create particles feature
const createParticles = function (x, y, radius, color, velocity) {
  // friction is the factor to slow down particles explosion
  const friction = 0.99;
  class Particle {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
      this.alpha = 1;
    }

    // function that draws each enemy as a circle in the canvas
    draw() {
      c.save();
      c.globalAlpha = this.alpha;
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      c.restore();
    }

    // updates enemy with velocity
    update() {
      // to execute draw function of the enemy in the update function
      this.draw();
      this.velocity.x *= friction;
      this.velocity.y *= friction;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 0.01;
    }
  }

  // updates the global array variable known as particles
  particles.push(new Particle(x, y, radius, color, velocity));
};

// function to animate all elements
const animate = function () {
  // animation function refreshes per frame
  // animationId stores the id of each of the frame as a digit
  animationId = requestAnimationFrame(animate);
  // defining the background of the game
  c.fillStyle = 'rgba(0, 0, 0, 0.1)';
  // clears canvas, and filling it with a background color to get the circle effect
  c.fillRect(0, 0, canvas.width, canvas.height);
  // create player right in the middle of the canvas, after the clearing of canvas
  createPlayer(canvas.width / 2, canvas.height / 2, 10, 'white');
  // draw player/s
  players.forEach((player) => {
    player.update();
  });
  // draw particles, if any
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  // references the global array known as projectiles to draw projectiles
  projectiles.forEach((projectile, index) => {
    // draw projectile
    projectile.update();
    // remove projectile from projectiles array once they hit the edge to optimize performance
    if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
      setTimeout(() => {
        // if collided, remove projectile
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  // references the global array known as enemies to draw enemies
  enemies.forEach((enemy, index) => {
    // draw enemy
    enemy.update();
    // collision detection: if enemy had collided into player
    players.forEach((player) => {
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      if (dist - enemy.radius - player.radius < 1) {
        // freeze animation
        cancelAnimationFrame(animationId);
        // bring up scoreboard modal
        const modal = document.querySelector('.modal');
        // add class to show modal
        modal.classList.remove('remove-modal');
      }
    });

    // collision detection: if projectile had collided into an enemy
    projectiles.forEach((projectile, projectileIndex) => {
      const powerOfExplosions = Math.random() * 6;
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // collision logic
      if (dist - enemy.radius - projectile.radius < 1) {
        // increase our score
        score += 100;
        scoreEl.innerHTML = score;
        // update modal scoreboard
        modalScoreEl.innerHTML = score;
        // create particles upon collision
        for (let i = 0; i < enemy.radius * 2; i++) {
          createParticles(projectile.x, projectile.y, Math.random() * 2, enemy.color, { x: (Math.random() - 0.5) * powerOfExplosions, y: (Math.random() - 0.5) * powerOfExplosions });
        }

        // if enemy radius is bigger than 20 reduce its radius by 10; to ensure enemy doesnt get too small
        if (enemy.radius - 10 > 5) {
          // gsap is a library for smooth animation, in this case to shrink enemy smoothly
          gsap.to(enemy, {
            // reduce radius by 10
            radius: enemy.radius - 10,
          });

          setTimeout(() => {
            // if collided, remove projectile
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          // setTimeout waits until the next frame before the enemy is removed from the array
          // without setTimeout, enemy.update() will continue to want to draw the enemy even though it has already been removed
          setTimeout(() => {
            // if collided, remove enemy
            enemies.splice(index, 1);
            // if collided, remove projectile
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  // }
  });
};

// restart function
const restart = function () {
  projectiles = [];
  enemies = [];
  players = [];
  particles = [];
  score = 0;
  scoreEl.innerHTML = 0;
  modalScoreEl.innerHTML = 0;
};

// add save game function to save game button
const saveGame = function () {
  const saveGameBtn = document.querySelector('#save-game-btn');
  saveGameBtn.addEventListener('click', () => {
    const enemiesConvertJson = enemies.map((x) => x);

    // finds and removes all _gsap keys because it causes a circular structure
    enemiesConvertJson.forEach((x) => {
      delete x._gsap;
    });
    // convert data in array so JSON to send to server
    const enemiesConvertedJson = JSON.stringify(enemiesConvertJson);

    // once clicked, sends data back to table
    const data = {
      score: document.querySelector('#scoreEl').innerHTML,
      enemies_pos: enemiesConvertedJson,
    };
    axios
      .post('/savedgame', data)
      .then((response) => {
      })
      .catch((error) => {
      // handle error
        console.log(error);
      });
  });
};

// main game
const main = function () {
  // save game button only works after start button is clicked
  saveGame();
  // create player right in the middle of the canvas
  createPlayer(canvas.width / 2, canvas.height / 2, 10, 'white');
  // draw player/s
  players.forEach((player) => {
    player.update();
  });
  // add an event listener which triggers  projectiles via createProjectileFeature function
  window.addEventListener('click', (event) => {
    createProjectileFeature(event);
  });
  // set interval to create enemies
  setInterval(createEnemyFeature, 1000);
  animate();
};

// when start game button is clicked
startGameBtn.addEventListener('click', () => {
  document.querySelector('.modal').classList.add('remove-modal');
  // if score is not zero, sends the results back to database
  if (score !== 0) {
    const data = {
      finalScore: score,
    };
    // updates user's score in the database
    axios
      .post('/score', data)
      .then((response) => {
      // handle success
        console.log(response);
        highscoreCreator();
      })
      .catch((error) => {
      // handle error
        console.log(error);
      });
  }
  // clears the canvas, scores
  restart();
  // starts the game
  main();
});

// when load game button is clicked
loadGameBtn.addEventListener('click', () => {
  document.querySelector('.modal').classList.add('remove-modal');
  // clears the canvas, scores
  restart();
  // calls saved game data from database
  axios
    .get('/loadgame')
    .then((response) => {
      // handle success
      console.log(response);
      // update score
      const savedScore = response.data.savedGameData.score;
      score = savedScore;
      scoreEl.innerHTML = score;
      // convert JSON data to Javascript
      const convertSavedGameData = JSON.parse(response.data.savedGameData.enemies_pos);
      // update the data into the class Enemy for it to use the update function
      for (let i = 0; convertSavedGameData.length; i++) {
        enemies.push(new Enemy(convertSavedGameData[i].x, convertSavedGameData[i].y, convertSavedGameData[i].radius, convertSavedGameData[i].color, convertSavedGameData[i].velocity));
      }
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
  // starts the game
  main();
});
