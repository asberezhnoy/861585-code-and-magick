'use strict';

var Random = window.Utils.Random;

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
    wizard.name = names[Random.getRandomArrayIndex(names.length)] + ' ' + surnames[Random.getRandomArrayIndex(surnames.length)];
    wizard.coatColor = coatColors[Random.getRandomArrayIndex(coatColors.length)];
    wizard.eyesColor = eyesColors[Random.getRandomArrayIndex(eyesColors.length)];

    return wizard;
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

var setupForm = window.SetupForm.Current;
setupForm.setServerUrl('https://js.dump.academy/code-and-magick');
setupForm.addSimilarWizards(createMockWizards());

var setupOpenEl = document.querySelector('.setup-open');
setupOpenEl.querySelector('img').tabIndex = 0;
setupOpenEl.addEventListener('keydown', function (evt) {
  if (evt.keyCode === window.KeyCodes.ENTER) {
    setupForm.show();
  }
});
setupOpenEl.addEventListener('click', function () {
  setupForm.show();
});

