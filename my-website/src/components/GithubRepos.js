import React, { useEffect, useState } from 'react';

function GitHubRepos() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch('/github-repos')
      .then(response => response.json())
      .then(data => {
        setRepos(data);
      });
  }, []);

  return (
    <div id="github-repos">
      <h2>My GitHub Repositories</h2>
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GitHubRepos;