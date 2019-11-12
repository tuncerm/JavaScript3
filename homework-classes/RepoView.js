'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repo) {
      this.container.innerHTML = null;
      const repoDetails = createAndAppend('div', this.container, {
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
    }
  }

  window.RepoView = RepoView;
}
