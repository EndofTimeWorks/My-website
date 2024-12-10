import React from 'react';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/pages/APCSP.html">APCSP Project</a></li>
        <li><a href="/pages/github-repos.html">GitHub Projects</a></li>
      </ul>
      <input type="color" id="theme-color-picker" title="Choose your color" />
    </nav>
  );
}

export default Navbar;