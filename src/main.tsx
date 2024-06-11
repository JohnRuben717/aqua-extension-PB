import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../components/LoginForm';

const App: React.FC = () => {
    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));