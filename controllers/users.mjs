// db is an argument to this function so
// that we can make db queries inside
import e from 'express';
import jsSHA from 'jssha';
import { resolve } from 'path';

// this function will authenticate user's login details
export default function initUsersController(db) {
  // initialize salt as a constant
  const SALT = 'bubas are fun';
  // getHash function
  const getHash = (input) => {
  // create new SHA object
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    // create an unhashed cookie string based on user ID and salt
    const unhashedString = `${input}-${SALT}`;
    // generate a hashed cookie string using SHA object
    shaObj.update(unhashedString);
    return shaObj.getHash('HEX');
  };

  // this function stores user's sign up particulars in the database
  const signUp = (request, response) => {
    const usernameInput = request.body.username;
    const emailInput = request.body.email;
    const passwordInput = request.body.password;
    const hashedPassword = getHash(passwordInput);
    console.log(usernameInput);

    db.User.create({
      username: usernameInput,
      email: emailInput,
      password: hashedPassword,
    })
      .then(() => {
        console.log('success!!');
        response.redirect('/');
      })
      .catch((error) => console.log(error));
  };

  // this function authenticates user's particulars in the database
  const login = async (request, response) => {
    request.isUserLoggedIn = false;
    console.log(request.body.username);
    console.log(request.body.password);
    const usernameInput = request.body.username;
    const passwordInput = request.body.password;
    const hashedUser = getHash(usernameInput);
    const hashedPassword = getHash(passwordInput);

    const foundUsername = await db.User.findOne({
      where: {
        username: usernameInput,
      },
    });
    // if username is found
    if (foundUsername) {
      // check if password is correct
      if (foundUsername.dataValues.password === hashedPassword) {
        // account is verified, add a cookie and go on to game
        const userId = foundUsername.dataValues.id;
        console.log('cookies are set');
        response.cookie('userId', userId);
        response.cookie('loggedInHash', hashedUser);
        response.cookie('username', usernameInput);
        if (request.cookies.loggedInHash && request.cookies.username) {
          console.log('cookies exist');
        }
        response.status(200).send({ success_message: 'success!' });
      } else {
        // let them know password is wrong
        response.status(403).send({ error_message: 'error-password' });
      }
    } else {
      // let them know username is wrong
      response.status(403).send({ error_message: 'error-login' });
    }
  };

  const game = (request, response, next) => {
    // // first check if user is logged in
    if (request.cookies.loggedInHash && request.cookies.username) {
      const hash = getHash(request.cookies.username);
      if (request.cookies.loggedInHash === hash) {
        response.sendFile(resolve('dist', 'main.html'));
      }
    } else {
      // lack the requisite cookies, redirect to login page
      console.log('failed login');
      response.redirect('/');
    }
  };

  // return all methods we define in an object
  // refer to the routes file above to see this used
  return {
    signUp, login, game,
  };
}
