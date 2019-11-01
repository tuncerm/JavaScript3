'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepoDetails(repo, parent) {
    const item = createAndAppend('div', parent, { class: 'main-item' });
    const table = createAndAppend('table', item);
    const trName = createAndAppend('tr', table);
    createAndAppend('td', trName, { text: 'Repository: ', class: 'bold' });
    createAndAppend('td', trName, { text: repo.name });
    const trDesc = createAndAppend('tr', table);
    createAndAppend('td', trDesc, { text: 'Description: ', class: 'bold' });
    createAndAppend('td', trDesc, { text: repo.description });
    const trForks = createAndAppend('tr', table);
    createAndAppend('td', trForks, { text: 'Forks: ', class: 'bold' });
    createAndAppend('td', trForks, { text: repo.forks });
    const trUpdated = createAndAppend('tr', table);
    createAndAppend('td', trUpdated, { text: 'Updated: ', class: 'bold' });
    createAndAppend('td', trUpdated, {
      text: new Date(repo.updated_at).toLocaleString(),
    });
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      const header = createAndAppend('div', root, { class: 'main-header' });
      createAndAppend('h4', header, { text: 'HYF Repositories' });
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      repos.forEach(repo => renderRepoDetails(repo, root));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
