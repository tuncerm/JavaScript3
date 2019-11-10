'use strict';

{
  const repoFields = [
    'id',
    'name',
    'description',
    'html_url',
    'contributors_url',
    'updated_at',
    'forks',
  ];

  const contributorFields = [
    'login',
    'avatar_url',
    'html_url',
    'contributions',
  ];

  const repositories = [];

  function fetchJSON(url, cb, filter, sort) {
    fetch(url)
      .then(data => {
        if (data.status > 199 && data.status < 300) {
          return data.json();
        }
        throw new Error(data.status);
      })
      .then(data =>
        data.map(item => {
          const newItem = {};
          filter.forEach(key => (newItem[key] = item[key]));
          return newItem;
        }),
      )
      .then(data => data.sort(sort))
      .then(data => cb(null, data))
      .catch(cb);
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

  function renderRepoDetails(repoID, container) {
    const repo = repositories.filter(r => r.id == repoID)[0];
    container.innerHTML = null;
    const repoDetails = createAndAppend('div', container, {
      class: 'main-content',
    });
    const table = createAndAppend('table', repoDetails);
    const rRepo = createAndAppend('tr', table);
    createAndAppend('td', rRepo, { text: 'Repository:', class: 'bold center' });
    const repoLink = createAndAppend('td', rRepo);
    createAndAppend('a', repoLink, {
      href: repo.html_url,
      target: '_blank',
      text: repo.name,
    });
    const rDesc = createAndAppend('tr', table);
    createAndAppend('td', rDesc, {
      text: 'Description:',
      class: 'bold center',
    });
    createAndAppend('td', rDesc, { text: repo.description });
    const rForks = createAndAppend('tr', table);
    createAndAppend('td', rForks, { text: 'Forks:', class: 'bold center' });
    createAndAppend('td', rForks, { text: repo.forks });
    const rUpdated = createAndAppend('tr', table);
    createAndAppend('td', rUpdated, { text: 'Updated:', class: 'bold center' });
    createAndAppend('td', rUpdated, {
      text: new Date(repo.updated_at).toLocaleString(),
    });
    const contDetails = createAndAppend('div', container, {
      class: 'main-content',
    });
    createAndAppend('p', contDetails, {
      text: 'Contributions',
      class: 'c-text',
    });
    fetchJSON(
      repo.contributors_url,
      (err, contributors) => {
        if (err) {
          return createAndAppend('div', contDetails, {
            text: err.message,
            class: 'alert-error',
          });
        }
        contributors.forEach(contributor => {
          const contDiv = createAndAppend('div', contDetails, {
            class: 'content-item',
          });
          const contP = createAndAppend('p', contDiv);
          createAndAppend('img', contP, {
            src: contributor.avatar_url,
            class: 'left avatar',
          });
          createAndAppend('a', contP, {
            text: contributor.login,
            class: 'text',
            href: contributor.html_url,
            target: '_blank',
          });
          createAndAppend('span', contP, {
            text: contributor.contributions,
            class: 'right medal',
          });
        });
      },
      contributorFields,
      (a, b) => b.contributions - a.contributions,
    );
  }

  function main(url) {
    fetchJSON(
      url,
      (err, repos) => {
        const root = document.getElementById('root');
        const header = createAndAppend('div', root, { class: 'main-header' });
        const p = createAndAppend('p', header, {
          class: 'header-text',
          text: 'HYF Repositories',
        });
        if (err) {
          createAndAppend('div', root, {
            text: err.message,
            class: 'alert-error',
          });
          return;
        }
        const select = createAndAppend('select', p, { class: 'select' });
        const repoDetails = createAndAppend('div', root, {
          class: 'main',
        });
        select.addEventListener('change', event => {
          renderRepoDetails(event.target.value, repoDetails);
        });
        repos.forEach(repo => {
          repositories.push(repo);
          createAndAppend('option', select, {
            value: repo.id,
            text: repo.name,
          });
        });
        const event = new Event('change');
        select.dispatchEvent(event);
      },
      repoFields,
      (a, b) => a['name'].localeCompare(b['name']),
    );
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
