document.querySelector('.create-account-button').addEventListener('click', () => {
  document.querySelector('.sign-up-form').style.display = 'flex';
});

document.querySelector('.close').addEventListener('click', () => {
  document.querySelector('.sign-up-form').style.display = 'none';
});

document.querySelector('.login-button').addEventListener('click', () => {
  const data = {
    username: document.querySelector('#username').value,
    password: document.querySelector('#password').value,
  };
  // Sends account details to the database to check if account exists
  axios
    .post('/login', data)
    .then((response) => {
      // handle success
      window.location = '/game';
    })
    .catch((error) => {
      // handle error
      console.log(error);
      if (error.response.data.error_message === 'error-login') {
        // show error message in html
        const parentDiv = document.querySelector('.login-input-container');
        if (parentDiv.childNodes.length === 0) {
          const errorDiv = document.createElement('div');
          // add class
          errorDiv.classList.add('error-div');
          errorDiv.innerHTML = 'Username does not exist';
          parentDiv.appendChild(errorDiv);
          errorDiv.style.color = 'red';
        } else {
          const checkDiv = document.querySelector('.error-div');
          checkDiv.innerHTML = '';
          checkDiv.innerHTML = 'Username does not exist';
          checkDiv.style.color = 'red';
        }
      } else {
        // show error message in html
        const checkDiv = document.querySelector('.error-div');
        if (checkDiv.innerHTML === 'Username does not exist') {
          checkDiv.innerHTML = '';
          const parentDiv = document.querySelector('.login-input-container');
          checkDiv.innerHTML = 'Wrong Password';
          parentDiv.appendChild(checkDiv);
          checkDiv.style.color = 'red';
        }
      }
    });
});
