import React from 'react';
import Navbar from './components/Navbar';
import SpotifyList from './components/SpotifyList';
import GitHubRepos from './components/GitHubRepos';
import './index.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <h1>Welcome to my resume website</h1>
        <p>This is the homepage. It is currently a WIP.</p>
      </main>
      <SpotifyList />
      <GitHubRepos />
    </div>
  );
}

export default App;
