'use strict';

/* ************************   Utils   ***************************** */
function Utils() {
}

Utils.getRandomNumber = function (max, min, handler) {
  var minValue = Number(min);
  var maxValue = Number(max);

  var value = minValue ? Math.random() * (maxValue + 1 - minValue) + minValue : Math.random() * (maxValue + 1);
  return handler ? handler(value) : value;
};

Utils.getRandomArrayIndex = function (length) {
  return Utils.getRandomNumber(length - 1, 0, Math.floor);
};

/* *********************************************************************** */

/* ************************   Elements   ***************************** */
function Elements() {
}

Elements.isTemplate = function (element) {
  return element.tagName === 'TEMPLATE';
};

Elements.find = function (selector, parent) {
  var parentElement = null;

  if (typeof (parent) === 'string') {
    parentElement = Elements.find(parent);
  } else if (parent) {
    parentElement = Elements.isTemplate(parent) ? parent.content : parent;
  } else {
    parentElement = document;
  }

  var element = parentElement.querySelector(selector);
  if (element) {
    return Elements.isTemplate(element) ? element.content : element;
  }
  throw new TypeError('Не найден элемент [' + selector + ']');
};

Elements.findAll = function (selector, parent) {
  var parentElement = null;

  if (typeof (parent) === 'string') {
    parentElement = Elements.find(parent);
  } else if (parent) {
    parentElement = Elements.isTemplate(parent) ? parent.content : parent;
  } else {
    parentElement = document;
  }

  var elementList = parentElement.querySelectorAll(selector);
  if (elementList.length) {
    return elementList;
  }
  throw new TypeError('Не найден элемент [' + selector + ']');
};

Elements.visible = function (element /* селектор или Element */, parent) {
  Elements.removeClass(element, 'hidden', parent);
};

Elements.hide = function (element /* селектор или Element */, parent) {
  Elements.addClass(element, 'hidden', parent);
};

Elements.addClass = function (element /* селектор или Element */, className, parent) {
  var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
  el.classList.add(className);
};

Elements.removeClass = function (element /* селектор или Element */, className, parent) {
  var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
  el.classList.remove(className);
};
/* *********************************************************************** */

function Wizard() {
  this.name = null;
  this.coatColor = null;
  this.eyesColor = null;
}

function MockWizardFactory() {
  var names = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
  var surnames = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
  var coatColors = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var eyesColors = ['black', 'red', 'blue', 'yellow', 'green'];

  this.create = function () {
    var wizard = new Wizard();
    wizard.name = names[Utils.getRandomArrayIndex(names.length)] + ' ' + surnames[Utils.getRandomArrayIndex(surnames.length)];
    wizard.coatColor = coatColors[Utils.getRandomArrayIndex(coatColors.length)];
    wizard.eyesColor = eyesColors[Utils.getRandomArrayIndex(eyesColors.length)];

    return wizard;
  };
}

function WizardListBuilder() {
  var _result = null;
  var _templateElement = getTemplate();

  this.start = function () {
    _result = [];
  };

  this.add = function (wizard) {
    var element = _templateElement.cloneNode(true);
    Elements.find('.setup-similar-label', element).textContent = wizard.name;
    Elements.find('.wizard-coat', element).style.fill = wizard.coatColor;
    Elements.find('.wizard-eyes', element).style.fill = wizard.eyesColor;
    _result.push(element);
  };

  this.getResult = function () {
    return _result;
  };

  function getTemplate() {
    return Elements.find('.setup-similar-item', '#similar-wizard-template');
  }
}

function KeyCodes() {
  throw new Error('Нельзя создавать экземпляр данного класса');
}

KeyCodes.ESC = 27;
KeyCodes.ENTER = 13;

function Setup() {
  var _wizardCoatColors = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var _wizardEyesColors = ['black', ' red', ' blue', 'yellow', 'green'];
  var _wizardFireballColors = ['#ee4830', ' #30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];

  var _root = document.querySelector('.setup');
  var _userNameEl = _root.querySelector('.setup-user-name');
  var _closeEl = _root.querySelector('.setup-close');
  var _setupPlayerEl = _root.querySelector('.setup-player');
  var _wizardappearanceEl = _setupPlayerEl.querySelector('.setup-wizard-appearance');
  var _wizardCoatColorEl = _wizardappearanceEl.querySelectorAll('input')[0];
  var _wizardEyesColorEl = _wizardappearanceEl.querySelectorAll('input')[1];
  var _wizardFireballEl = _setupPlayerEl.querySelector('.setup-fireball-wrap').querySelector('input');

  init();

  this.setServerUrl = function (url) {
    _root.querySelector('.setup-wizard-form').action = url;
  };

  this.addSimilarWizards = function (wizards) {
    var builder = new WizardListBuilder();

    builder.start();
    wizards.forEach(function (value) {
      builder.add(value);
    });

    var elements = builder.getResult();
    var fragment = document.createDocumentFragment();
    elements.forEach(function (value) {
      fragment.appendChild(value);
    });

    _root.querySelector('.setup-similar-list').appendChild(fragment);
  };

  this.show = function (isShowSimular) {
    document.addEventListener('keydown', onDocumentKeyDown);

    Elements.visible('.setup');
    if (isShowSimular || isShowSimular === undefined) {
      Elements.visible('.setup-similar');
    } else {
      Elements.hide('.setup-similar');
    }
  };

  function onCloseClick() {
    document.removeEventListener('keydown', onDocumentKeyDown);

    Elements.hide('.setup');
    Elements.hide('.setup-similar');
  }

  function onUserNameKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      evt.stopPropagation();
    }
  }

  function onSetupCloseKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ENTER) {
      onCloseClick(evt);
    }
    evt.stopPropagation();
  }

  function onDocumentKeyDown(evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      onCloseClick(evt);
    }
  }

  function onWizardCoatClick(evt) {
    var index = Utils.getRandomArrayIndex(_wizardCoatColors.length);

    if (_wizardCoatColorEl.value === _wizardCoatColors[index]) {
      index = (index === (_wizardCoatColors.length - 1)) ? 0 : index + 1;
    }
    _wizardCoatColorEl.value = evt.target.style.fill = _wizardCoatColors[index];
  }

  function onWizardEyesClick(evt) {
    var index = Utils.getRandomArrayIndex(_wizardEyesColors.length);

    if (_wizardEyesColorEl.value === _wizardEyesColors[index]) {
      index = (index === (_wizardEyesColors.length - 1)) ? 0 : index + 1;
    }
    _wizardEyesColorEl.value = evt.target.style.fill = _wizardEyesColors[index];
  }

  function onWizardFireballClick(evt) {
    var index = Utils.getRandomArrayIndex(_wizardFireballColors.length);

    if (_wizardFireballEl.value === _wizardFireballColors[index]) {
      index = (index === (_wizardFireballColors.length - 1)) ? 0 : index + 1;
    }
    _wizardFireballEl.value = evt.currentTarget.style.background = _wizardFireballColors[index];
  }

  function init() {
    _closeEl.addEventListener('click', onCloseClick);
    _closeEl.addEventListener('keydown', onSetupCloseKeyDown);
    _userNameEl.addEventListener('keydown', onUserNameKeyDown);
    _wizardappearanceEl.querySelector('.wizard-coat').addEventListener('click', onWizardCoatClick);
    _wizardappearanceEl.querySelector('.wizard-eyes').addEventListener('click', onWizardEyesClick);
    _wizardFireballEl.parentElement.addEventListener('click', onWizardFireballClick);

    _userNameEl.maxLength = 25;
    _userNameEl.minLength = 2;

    _closeEl.tabIndex = 0;
    _root.querySelector('.setup-submit').type = 'submit';
  }
}

function createMockWizards() {
  var wizardFactory = new MockWizardFactory();
  var buffer = [];

  for (var i = 0; i < 4; i++) {
    buffer.push(wizardFactory.create());
  }
  return buffer;
}

var setup = new Setup();
setup.setServerUrl('https://js.dump.academy/code-and-magick');
setup.addSimilarWizards(createMockWizards());

var setupOpenEl = document.querySelector('.setup-open');
setupOpenEl.querySelector('img').tabIndex = 0;
setupOpenEl.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KeyCodes.ENTER) {
    setup.show();
  }
});
setupOpenEl.addEventListener('click', function () {
  setup.show();
});

