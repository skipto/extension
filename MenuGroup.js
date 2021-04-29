/* MenuGroup.js */

const template = document.createElement('template');
template.innerHTML = `<div role="group"></div>`;

class MenuGroup extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({mode: 'open'});

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'menu.css');
    this.shadowRoot.appendChild(link);

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.group = this.shadowRoot.querySelector('div');
    this.onMenuitemClicked = defaultClickHandler;
  }

  set attributes (obj) {
    this.setAttribute('id', obj.elemId);
    this.setAttribute('aria-labelledby', obj.labelId);
  }

  createMenuitem (className, dataId) {
    const div = document.createElement('div');
    div.role = 'menuitem';
    div.tabindex = '-1';
    div.className = className;
    div.setAttribute('data-skipto', dataId);
    div.addEventListener('click', this.onMenuitemClicked);
    const a = document.createElement('a');
    a.href = '#';
    div.appendChild(a);
    return div;
  }

  // Note: This property must be set *before* creating menuitems
  set menuitemClickHandler (func) {
    this.onMenuitemClicked = func;
  }
}

class LandmarksGroup extends MenuGroup {
  constructor () {
    super();
    this.attributes = { elemId: 'landmarks-group', labelId: 'landmarks-label'};
  }

  // Use this setter to pass in menu data from external module
  set menuitems (landmarksInfo) {
    console.log('in landmarksGroup');
    // const group = this.shadowRoot.querySelector('div[role="group"]')
    for (const info of landmarksInfo) {
      const div = this.createMenuitem('landmark', info.dataId);
      const a = div.querySelector('a');

      if (info.ariaRole === 'main') {
        div.classList.add('main');
      }

      const roleSpan = document.createElement('span');
      roleSpan.className = 'role';
      roleSpan.textContent = info.ariaRole;
      a.appendChild(roleSpan);

      if (info.accessibleName) {
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = info.accessibleName;
        a.appendChild(nameSpan);
      }

      this.group.appendChild(div);
    }
  }
}

class HeadingsGroup extends MenuGroup {
  constructor () {
    super();
    this.attributes = { elemId: 'headings-group', labelId: 'headings-label'};
  }

  // Use this setter to pass in menu data from external module
  set menuitems (headingsInfo) {
    console.log('in headingsGroup');
    const emptyContentMsg = '[empty text content]';
    for (const info of headingsInfo) {
      const div = this.createMenuitem('heading', info.dataId);
      if (info.tagName === 'h1') { div.classList.add('h1') }
      const a = div.querySelector('a');

      const textSpan = document.createElement('span');
      textSpan.className = 'text';
      textSpan.classList.add(info.tagName);
      textSpan.textContent = info.content ? info.content : emptyContentMsg;
      a.appendChild(textSpan);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = info.tagName;
      a.appendChild(nameSpan);

      this.group.appendChild(div);
    }
  }
}

function defaultClickHandler (evt) {
  console.log(evt.currentTarget.getAttribute('data-skipto'));
}

customElements.define('landmarks-group', LandmarksGroup);
customElements.define('headings-group', HeadingsGroup);
export { LandmarksGroup, HeadingsGroup };
