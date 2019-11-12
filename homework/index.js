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

  async function fetchJSON(url, filter, sort) {
    const response = await axios.get(url);
    const filtered = response.data.map(item => {
      const newItem = {};
      filter.forEach(key => (newItem[key] = item[key]));
      return newItem;
    });
    const sorted = filtered.sort(sort);
    return sorted;
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

  async function renderRepoDetails(repoID, container) {
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

    try {
      const contributors = await fetchJSON(repo.contributors_url, contributorFields, (a, b) => b.contributions - a.contributions);
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
    } catch (e) {
      return createAndAppend('div', contDetails, {
        text: e.message,
        class: 'alert-error',
      });
    }
  }

  async function main(url) {
    const root = document.getElementById('root');
    const header = createAndAppend('div', root, { class: 'main-header' });
    const p = createAndAppend('p', header, {
      class: 'header-text',
      text: 'HYF Repositories',
    });
    try {
      const repos = await fetchJSON(url, repoFields, (a, b) => a['name'].localeCompare(b['name']));
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
    } catch (e) {
      createAndAppend('div', root, {
        text: e.message,
        class: 'alert-error',
      });
    }
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
