'use strict';

(function () {
  var Ekements = window.Utils.Elements;
  var Random = window.Utils.Random;
  var Point = window.drawing.Point;

  function WizardListBuilder() {
    var _result = null;
    var _templateElement = getTemplate();

    this.start = function () {
      _result = [];
    };

    this.add = function (wizard) {
      var element = _templateElement.cloneNode(true);
      element.querySelector('.setup-similar-label').textContent = wizard.name;
      element.querySelector('.wizard-coat').style.fill = wizard.coatColor;
      element.querySelector('.wizard-eyes').style.fill = wizard.eyesColor;
      _result.push(element);
    };

    this.getResult = function () {
      return _result;
    };

    function getTemplate() {
      return Ekements.find('.setup-similar-item', '#similar-wizard-template');
    }
  }

  function SetupForm() {
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
    var _userPicEl = _root.querySelector('.setup-user-pic');

    var _clientRect = null;
    var _isDrag = false;
    var _startMouseCoord = null;

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

      Ekements.visible('.setup');
      if (isShowSimular || isShowSimular === undefined) {
        Ekements.visible('.setup-similar');
      } else {
        Ekements.hide('.setup-similar');
      }

      if (_clientRect === null) {
        _clientRect = Ekements.getRect(_root);
      } else {
        _root.style.left = _clientRect.leftTopCorner.x + 'px';
        _root.style.top = _clientRect.leftTopCorner.y + 'px';
      }
    };

    function onCloseClick() {
      document.removeEventListener('keydown', onDocumentKeyDown);

      Ekements.hide('.setup');
      Ekements.hide('.setup-similar');
    }

    function onUserNameKeyDown(evt) {
      if (evt.keyCode === window.KeyCodes.ESC) {
        evt.stopPropagation();
      }
    }

    function onSetupCloseKeyDown(evt) {
      if (evt.keyCode === window.KeyCodes.ENTER) {
        onCloseClick(evt);
      }
      evt.stopPropagation();
    }

    function onDocumentKeyDown(evt) {
      if (evt.keyCode === window.KeyCodes.ESC) {
        onCloseClick(evt);
      }
    }

    function onWizardCoatClick(evt) {
      var index = Random.getRandomArrayIndex(_wizardCoatColors.length);

      if (_wizardCoatColorEl.value === _wizardCoatColors[index]) {
        index = (index === (_wizardCoatColors.length - 1)) ? 0 : index + 1;
      }
      _wizardCoatColorEl.value = evt.target.style.fill = _wizardCoatColors[index];
    }

    function onWizardEyesClick(evt) {
      var index = Random.getRandomArrayIndex(_wizardEyesColors.length);

      if (_wizardEyesColorEl.value === _wizardEyesColors[index]) {
        index = (index === (_wizardEyesColors.length - 1)) ? 0 : index + 1;
      }
      _wizardEyesColorEl.value = evt.target.style.fill = _wizardEyesColors[index];
    }

    function onWizardFireballClick(evt) {
      var index = Random.getRandomArrayIndex(_wizardFireballColors.length);

      if (_wizardFireballEl.value === _wizardFireballColors[index]) {
        index = (index === (_wizardFireballColors.length - 1)) ? 0 : index + 1;
      }
      _wizardFireballEl.value = evt.currentTarget.style.background = _wizardFireballColors[index];
    }

    function onUserPicClick(evt) {
      document.removeEventListener('mousemove', onUserPicMouseMove);

      if (_isDrag) {
        evt.preventDefault();
        _isDrag = false;
      }
    }

    function onUserPicMouseUp(evt) {
      document.removeEventListener('mousemove', onUserPicMouseMove);
      document.removeEventListener('mouseup', onUserPicMouseMove);

      if (_isDrag) {
        move(evt.clientX, evt.clientY);
        evt.preventDefault();
        _startMouseCoord = null;
      }
    }

    function onUserPicMouseDown(evt) {
      _isDrag = false;
      _startMouseCoord = new Point(evt.clientX, evt.clientY);

      document.addEventListener('mousemove', onUserPicMouseMove);
      document.addEventListener('mouseup', onUserPicMouseUp);
    }

    function onUserPicMouseMove(evt) {
      if (isDraggin(evt.clientX, evt.clientY)) {
        _isDrag = true;
        move(evt.clientX, evt.clientY);
      }
    }

    function move(x, y) {
      var shift = {
        offsetX: _startMouseCoord.x - x,
        offsetY: _startMouseCoord.y - y
      };

      _root.style.left = (_root.offsetLeft - shift.offsetX) + 'px';
      _root.style.top = (_root.offsetTop - shift.offsetY) + 'px';

      _startMouseCoord.x = x;
      _startMouseCoord.y = y;
    }

    function isDraggin(x, y) {
      return Math.abs(_startMouseCoord.x - x) >= 5 || Math.abs(_startMouseCoord.y - y) >= 5;
    }

    function init() {
      _closeEl.addEventListener('click', onCloseClick);
      _closeEl.addEventListener('keydown', onSetupCloseKeyDown);
      _userNameEl.addEventListener('keydown', onUserNameKeyDown);
      _wizardappearanceEl.querySelector('.wizard-coat').addEventListener('click', onWizardCoatClick);
      _wizardappearanceEl.querySelector('.wizard-eyes').addEventListener('click', onWizardEyesClick);
      _wizardFireballEl.parentElement.addEventListener('click', onWizardFireballClick);
      _userPicEl.addEventListener('mousedown', onUserPicMouseDown);
      _userPicEl.addEventListener('click', onUserPicClick);
      var inp = _root.querySelector('.setup-title').querySelector('.setup-user').querySelector('.upload').querySelector('input');
      inp.addEventListener('mousedown', onUserPicMouseDown);
      inp.addEventListener('click', onUserPicClick);

      _userNameEl.maxLength = 25;
      _userNameEl.minLength = 2;

      _closeEl.tabIndex = 0;
      _root.querySelector('.setup-submit').type = 'submit';
    }
  }

  SetupForm.Current = new SetupForm();

  window.SetupForm = SetupForm;
})();
