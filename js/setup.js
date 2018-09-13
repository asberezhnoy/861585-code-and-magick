'use strict';

function Query() {
}

Query.querySelector = function (text, parent) {
  var element = parent ? parent.querySelector(text) : document.querySelector(text);
  if (element) {
    return element;
  }
  throw new TypeError('Не найден элемент [' + text + ']');
};

function HtmlElement() {
}

HtmlElement.visible = function (element) {
  element.classList.remove('hidden');
};

function Utils() {
}

Utils.getRandomNumber = function(max, min, handler) {
  var value = min ? Math.random() * (max + 1 - min)  + min : Math.random() * (max + 1);
  return handler ? handler(value) : value;
};

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
    wizard.name = names[Utils.getRandomNumber(names.length - 1, 0, Math.floor)] + ' ' + surnames[Utils.getRandomNumber(surnames.length - 1, 0, Math.floor)];
    wizard.coatColor = coatColors[Utils.getRandomNumber(coatColors.length - 1, 0, Math.floor)];
    wizard.eyesColor = eyesColors[Utils.getRandomNumber(eyesColors.length - 1, 0, Math.floor)];

    return wizard;
  };
}

function WizardListBuilder() {
  var _result = null;
  var _templateElement = Query.querySelector('.setup-similar-item', Query.querySelector('#similar-wizard-template').content);

  this.start = function () {
    _result = document.createDocumentFragment();
  };

  this.add = function (wizard) {
    var element = _templateElement.cloneNode(true);
    Query.querySelector('.setup-similar-label', element).textContent = wizard.name;
    Query.querySelector('.wizard-coat', element).style.fill = wizard.coatColor;
    Query.querySelector('.wizard-eyes', element).style.fill = wizard.eyesColor;
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

  Query.querySelector('.setup-similar-list').appendChild(wizardListBuilder.getResult());
  HtmlElement.visible(Query.querySelector('.setup'));
  HtmlElement.visible(Query.querySelector('.setup-similar'));
}

showWizards(createMockWizards());

