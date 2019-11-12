'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      this.container.innerHTML = null;
      const contDetails = createAndAppend('div', this.container, {
        class: 'main-content',
      });
      createAndAppend('p', contDetails, {
        text: 'Contributions',
        class: 'c-text',
      });
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
    }
  }

  window.ContributorsView = ContributorsView;
}
