'use strict';


/* ************************   Elements   ***************************** */
function Elements() {
}

Elements.find = function (selector, parent) {
  var element = parent ? parent.querySelector(selector) : document.querySelector(selector);
  if (element) {
    return element;
  }
  throw new TypeError('Не найден элемент [' + selector + ']');
};

Elements.visible = function (element /* селектор или Element */, parent) {
  Elements.removeClass(element, 'hidden', parent);
};

Elements.removeClass = function (element /* селектор или Element */, className, parent) {
  var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
  el.classList.remove(className);
};
/* *********************************************************************** */

/* ************************   Utils   ***************************** */
function Utils() {
}

Utils.getRandomNumber = function (max, min, handler) {
  var value = min ? Math.random() * (max + 1 - min) + min : Math.random() * (max + 1);
  return handler ? handler(value) : value;
};

Utils.getRandomArrayIndex = function (length) {
  return Utils.getRandomNumber(length - 1, 0, Math.floor);
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
  var _templateElement = Elements.find('.setup-similar-item', Elements.find('#similar-wizard-template').content);

  this.start = function () {
    _result = document.createDocumentFragment();
  };

  this.add = function (wizard) {
    var element = _templateElement.cloneNode(true);
    Elements.find('.setup-similar-label', element).textContent = wizard.name;
    Elements.find('.wizard-coat', element).style.fill = wizard.coatColor;
    Elements.find('.wizard-eyes', element).style.fill = wizard.eyesColor;
    _result.appendChild(element);
  };

  this.getResult = function () {
    return _result;
  };
}

function createMockWizards() {
  var wizardFactory = new MockWizardFactory();
  var buffer = [];

  for (var i = 0; i < 4; i++) {
    buffer.push(wizardFactory.create());
  }
  return buffer;
}

function showWizards(wizards) {
  var wizardListBuilder = new WizardListBuilder();

  wizardListBuilder.start();
  wizards.forEach(function (value) {
    wizardListBuilder.add(value);
  });

  Elements.find('.setup-similar-list').appendChild(wizardListBuilder.getResult());
  Elements.visible('.setup');
  Elements.visible('.setup-similar');
}

showWizards(createMockWizards());
