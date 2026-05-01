fetch("/api/github-repos")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch repositories");
        }

        return response.json();
    })
    .then((data) => {
        const repoList = document.getElementById("repo-list");
        if (!repoList) {
            return;
        }

        data.forEach((repo) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                <p>${repo.description || "No description provided."}</p>
            `;
            repoList.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error(error);
    });
