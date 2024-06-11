import { useState } from 'react';
import decodeAndSchedule from './DecodeToken';

global.webViewComponent = function FirstWebView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    await decodeAndSchedule(username, password);
  };

  return (
    <div className="form">
      <h1>Hi! This is my first web view!</h1>
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
    </div>
  );
};
