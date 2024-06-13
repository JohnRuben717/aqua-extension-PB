import React, { useState } from 'react';

global.webViewComponent = function FirstWebView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    const credentials = {
      username: username,
      password: password,
    };
    localStorage.setItem('credentials', JSON.stringify(credentials));
    alert('Credentials saved!');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div>AQuA extension login</div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
