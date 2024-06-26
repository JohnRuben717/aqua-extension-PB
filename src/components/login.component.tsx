import papi, { logger } from '@papi/frontend';
import type { LoginResponse } from 'aqua-extension';
import { useState } from 'react';

const usernameKey = 'savedUsername';
const passwordKey = 'savedPassword';
// const tokenKey = 'savedToken'; // Add a key for the token

function Login() {
  const [username, setUsername] = useState(localStorage.getItem(usernameKey) ?? '');
  const [password, setPassword] = useState(localStorage.getItem(passwordKey) ?? '');
  const [loginMessage, setLoginMessage] = useState('');

  const handleSubmit = async () => {
    logger.info(`webView - username: ${username}, password: ${password}`);
    const response: LoginResponse = await papi.commands.sendCommand(
      'aqua.login',
      username,
      password,
    );
    setLoginMessage(response.message);
    if (response.loginSucceeded) {
      localStorage.setItem(usernameKey, username);
      localStorage.setItem(passwordKey, password);
      logger.info(`Storing token in localStorage: ${response.token}`);
      // if (response.token) localStorage.setItem(tokenKey, response.token); // Store the token
      localStorage.setItem('assessmentData', JSON.stringify(response.assessmentData));
      localStorage.setItem('versionData', JSON.stringify(response.versionData));
    }
  };

  return (
    <div className="form">
      <h1>AQuA Login</h1>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <br />
      <label>{loginMessage}</label>
    </div>
  );
}

export default Login;
