import {
  MDCDialog,
  MDCList,
  MDCRipple,
  MDCTabBar,
  MDCTopAppBar,
  MDCTextField,
  MDCTextFieldHelperText,
} from './components';

const mainEl = document.querySelector('.main-content');

// Top app bar
const topAppBarEls = Array.from(mainEl.querySelectorAll('.mdc-top-app-bar'));
topAppBarEls.forEach((el) => new MDCTopAppBar(el));

// Tabs
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

Array.from(document.querySelectorAll('.mdc-tab')).forEach(
    (tab) => tab.addEventListener('MDCTab:interacted', (e) => {
      switchToTab(e.detail.tabId);
    }),
);

const switchToTab = (activatedTabId) => {
  const activatedTab = document.querySelector(`#${activatedTabId}`);
  const activatedTabIndex = Array.from(document.querySelectorAll('.mdc-tab')).indexOf(activatedTab);
  tabBar.activateTab(activatedTabIndex);
  Array.from(document.querySelectorAll('.tab-content')).forEach((tabContent) => {
    tabContent.style.display = tabContent.id.slice(0, -1 * '-content'.length) == activatedTabId.slice(0, -1 * '-tab'.length) ? 'block' : 'none';
  });
};

// Card
const cardPrimaryActionEls = Array.from(mainEl.querySelectorAll('.mdc-card__primary-action'));
cardPrimaryActionEls.forEach((el) => new MDCRipple(el));

// Text field
const helperTextEls = Array.from(mainEl.querySelectorAll('.mdc-text-field-helper-text'));
helperTextEls.forEach((el) => new MDCTextFieldHelperText(el));

// bind validator to load-button
const loadButton = document.getElementById('load-button');
loadButton.addEventListener('click', () => {
  const textFieldInputs = Array.from(mainEl.querySelectorAll('.mdc-text-field__input'));

  // if both inputs are empty, show helper text
  const empty = textFieldInputs.every((el) => el.value === '');
  if (empty) {
    const textFieldEls = Array.from(mainEl.querySelectorAll('.mdc-text-field'));
    textFieldEls.forEach((el) => {
      const textField = new MDCTextField(el);
      
      // Highlight helper text
      textField.root_.classList.add('mdc-text-field--invalid');
      textField.valid = false;
      textField.helperTextContent = 'One of these fields is required';
    });
  } else {
    // switch to execute tab
    switchToTab('execute-tab');

    module$examples$web$mobile$src$mobile.init();
  }
});

function openReconnectDialog() {
  const dialogEl = mainEl.querySelector('.mdc-dialog');
  const dialog = new MDCDialog(dialogEl);
  dialog.open();
}

// List
function initLists() {
  const listEls = Array.from(mainEl.querySelectorAll('.mdc-list'));
  listEls.forEach((el) => {
    const list = new MDCList(el);
    list.listElements.map((listItemEl) => new MDCRipple(listItemEl));
    list.singleSelection = true;
  });
}

initLists();

export default {
  initLists,
  openReconnectDialog,
};
