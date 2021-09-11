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

// Tabs
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

Array.from(document.querySelectorAll('.mdc-tab')).forEach(
  tab => tab.addEventListener('MDCTab:interacted', (e) => {
    switchToTab(e.detail.tabId);
  })
);

const switchToTab = (activatedTabId) => {
  const activatedTab = document.querySelector(`#${activatedTabId}`);
  const activatedTabIndex = Array.from(document.querySelectorAll('.mdc-tab')).indexOf(activatedTab);
  tabBar.activateTab(activatedTabIndex);
  Array.from(document.querySelectorAll('.tab-content')).forEach(tabContent => {
    tabContent.style.display = tabContent.id.slice(0, -1 * '-content'.length) == activatedTabId.slice(0, -1 * '-tab'.length) ? 'block' : 'none';
  });
}

// Card
const cardPrimaryActionEls = Array.from(mainEl.querySelectorAll('.mdc-card__primary-action'));
cardPrimaryActionEls.forEach((el) => new MDCRipple(el));

// Text field
const helperTextEls = Array.from(mainEl.querySelectorAll('.mdc-text-field-helper-text'));
helperTextEls.forEach((el) => new MDCTextFieldHelperText(el));

// bind validator to button with id load-button
const loadButton = document.getElementById('load-button');
loadButton.addEventListener('click', () => {
  const textFieldEls = Array.from(mainEl.querySelectorAll('.mdc-text-field'));

  textFieldEls.forEach((el) => {
    let textField = new MDCTextField(el);
    
    // Show error if empty
    if(textField.input_.value.length == 0) {
      textField.root_.classList.add('mdc-text-field--invalid');
      textField.valid = false;
      textField.helperTextContent = 'This field is required';
      textField.helperText_.classList.add('mdc-text-field-helper-text--persistent');
      textField.helperText_.classList.add('mdc-text-field-helper-text--validation-msg');
      return;
    }

    // Activate dialog
    const dialogEl = mainEl.querySelector('.mdc-dialog');
    const dialog = new MDCDialog(dialogEl);
    dialog.open();

    // switch to execute tab
    switchToTab('execute-tab');

    init();
  });
});

// List
function initLists() {
  const listEls = Array.from(mainEl.querySelectorAll('.mdc-list'));
  listEls.forEach((el) => {
    let list = new MDCList(el);
    list.listElements.map((listItemEl) => new MDCRipple(listItemEl));
    list.singleSelection = true;
  });
};

initLists();

export default{
  initLists,
}