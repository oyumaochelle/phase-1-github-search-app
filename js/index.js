document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      // Call the GitHub User Search Endpoint
      searchUsers(searchTerm)
        .then(users => {
          displayUsers(users);
          // Add click event listeners to each user for fetching and displaying repositories
          users.forEach(user => {
            const userElement = document.getElementById(`user-${user.login}`);
            userElement.addEventListener('click', () => {
              fetchUserRepos(user.login)
                .then(repos => displayRepos(repos));
            });
          });
        })
        .catch(error => console.error('Error searching for users:', error));
    });
  
    function searchUsers(searchTerm) {
      const apiUrl = `https://api.github.com/search/users?q=${searchTerm}`;
      return fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json())
      .then(data => data.items);
    }
  
    function fetchUserRepos(username) {
      const apiUrl = `https://api.github.com/users/${username}/repos`;
      return fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json());
    }

    function displayUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
          <img src='${user.avatar_url}' alt='${user.login}' />
          <span>${user.login}</span>
        `;
        userItem.id = `user-${user.login}`;
        userList.appendChild(userItem);

        //adding a click event listener to the link and displaying
        // repositories
        const userLink = document.getElementById('user-${user-login}-link');
        userLink.addEventListener('click', async (event)=>{
            event.preventDefault();
            try{
                const repos = await fetchUserRepos(user.login);
                displayRepos(repos);
            } catch (error){
                console.error('Error fetching repositoties for ${user.logi}', error.message)
            }
        })
      });
    }
  
    function displayRepos(repos) {
      reposList.innerHTML = '';
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
          <a href='${repo.html_url}'${repo.name}</a>
        `;
        reposList.appendChild(repoItem);
      });
    }
  });
  