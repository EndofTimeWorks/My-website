fetch('/github-repos')
    .then(response => response.json())
    .then(data => {
        const repoList = document.getElementById('repo-list');
        data.forEach(repo => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<h3>${repo.name}</h3><p>${repo.readme}</p>`;
            repoList.appendChild(listItem);
        });
    });