import papi, { logger } from '@papi/frontend';
import { useState } from 'react';

const usernameKey = 'savedUsername';
const passwordKey = 'savedPassword';

global.webViewComponent = function FirstWebView() {
  const [username, setUsername] = useState(localStorage.getItem(usernameKey) ?? '');
  const [password, setPassword] = useState(localStorage.getItem(passwordKey) ?? '');
  const [loginMessage, setLoginMessage] = useState('');

  const handleSubmit = async () => {
    logger.info(`webView - username: ${username}, password: ${password}`);
    const response = await papi.commands.sendCommand('aqua.login', username, password);
    setLoginMessage(response.message);
    // Note: We don't actually want to save usernames and passwords in local storage!
    // This is just a demonstration of how localStorage can be used in the webView. Since we
    // are storing things on the backend and generating tokens there, we can keep all credentials
    // on the backend and just use webViews for displaying data.
    if (response.loginSucceeded) {
      localStorage.setItem(usernameKey, username);
      localStorage.setItem(passwordKey, password);
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
};
