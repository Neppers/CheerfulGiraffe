'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var tabs = [].concat(_toConsumableArray(document.querySelectorAll('.tabs__tab'))); // Convert from NodeList to Array
var panel = document.querySelector('.panel');

// Return all tabs to initial state
var resetTabs = function resetTabs(tabs) {
  tabs.forEach(function (tab) {
    tab.classList.remove('tabs__tab--selected');
    tab.setAttribute('aria-selected', false);
  });
};

// Display interstitial state
var startLoadingState = function startLoadingState() {
  panel.innerHTML = '<div class="loader"></div>';
};

// Display error message
var handleErrors = function handleErrors() {
  panel.innerHTML = '<p>An error occurred</p>';
};

// Display content
var populatePanel = function populatePanel(data) {
  // Extract types from array of objects to array of strings
  var types = [];
  data.types.forEach(function (type) {
    types.push(type.type.name);
  });

  panel.innerHTML = '\n    <div class="pokemon">\n      <h3 class="pokemon__name">' + data.name + '</h3>\n      <p class="pokemon__type">' + types.join(' / ') + '</p>\n      <img class="pokemon__image" src="' + data.sprites.front_default + '">\n    </div>\n  ';

  // Enable styles for when panel is populated
  panel.classList.add('panel--populated');
};

// Event for when tabs are selected
var selectTab = function selectTab(tab) {
  var request = new XMLHttpRequest();
  var id = tab.getAttribute('data-id');

  resetTabs(tabs);
  startLoadingState();

  tab.classList.add('tabs__tab--selected');
  tab.setAttribute('aria-selected', true);

  request.open('GET', 'http://pokeapi.co/api/v2/pokemon/' + id, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      populatePanel(data);
    } else {
      handleErrors();
    }
  };

  request.onerror = function () {
    return handleErrors();
  };

  request.send();
};

// Bind events to tabs
tabs.forEach(function (tab) {
  tab.addEventListener('click', selectTab.bind(null, tab), false);
  tab.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) selectTab(tab); // Only bind for Enter key
  });
});