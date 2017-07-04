const tabs = [...document.querySelectorAll('.tabs__tab')]; // Convert from NodeList to Array
const panel = document.querySelector('.panel');

// Return all tabs to initial state
const resetTabs = (tabs) => {
  tabs.forEach(tab => {
    tab.classList.remove('tabs__tab--selected')
    tab.setAttribute('aria-selected', false);
  });
};

// Display interstitial state
const startLoadingState = () => {
  panel.innerHTML = '<div class="loader"></div>';
}

// Display error message
const handleErrors = () => {
  panel.innerHTML = '<p>An error occurred</p>';
}

// Display content
const populatePanel = (data) => {
  // Extract types from array of objects to array of strings
  const types = [];
  data.types.forEach((type) => {
    types.push(type.type.name);
  });

  panel.innerHTML = `
    <div class="pokemon">
      <h3 class="pokemon__name">${data.name}</h3>
      <p class="pokemon__type">${types.join(' / ')}</p>
      <img class="pokemon__image" src="${data.sprites.front_default}">
    </div>
  `;

  // Enable styles for when panel is populated
  panel.classList.add('panel--populated');
};

// Event for when tabs are selected
const selectTab = (tab) => {
  const request = new XMLHttpRequest()
  const id = tab.getAttribute('data-id');

  resetTabs(tabs);
  startLoadingState();

  tab.classList.add('tabs__tab--selected');
  tab.setAttribute('aria-selected', true);

  request.open('GET', `http://pokeapi.co/api/v2/pokemon/${id}`, true);

  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText);
      populatePanel(data);
    } else {
      handleErrors();
    }
  };

  request.onerror = () => handleErrors();

  request.send();
};

// Bind events to tabs
tabs.forEach(tab => {
  tab.addEventListener('click', selectTab.bind(null, tab), false);
  tab.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) selectTab(tab); // Only bind for Enter key
  });
});
