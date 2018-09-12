'use strict';

var PLAYER_NAME = 'Вы';

function Player(name, time) {
  this.name = name;
  this.time = time;
}

function Font(name, size) {
  this.name = name;
  this.size = size;

  this.toString = function () {
    return this.size + 'px ' + this.name;
  };
}

function Coord(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;

  this.add = function (addLeft, addTop, addWidth, addHeight) {
    return new Coord(this.left + addLeft, this.top + addTop, this.width + addWidth, this.height + addHeight);
  };
}

function DrawingWarpper(ctx) {
  this.drawRectangle = function (coord, backgoundColor) {
    ctx.fillStyle = backgoundColor;
    ctx.fillRect(coord.left, coord.top, coord.width, coord.height);
  };

  this.drawText = function (text, coord, font) {
    ctx.fillStyle = 'black';
    ctx.font = font.toString();

    if (Array.isArray(text)) {
      for (var i = 0; i < text.length; i++) {
        ctx.fillText(text[i], coord.left, coord.top + i * font.size);
      }
    } else {
      ctx.fillText(text, coord.left, coord.top);
    }
  };
}

function BarGrap() {
  this.columnWidth = 40;
  this.distanceBetweenColumns = 50;

  this.draw = function (drawingWarpper, players, coord) {
    for (var i = 0; i < players.length; i++) {
      var columnCoord = new Coord(coord.left + i * (this.columnWidth + this.distanceBetweenColumns), coord.top, this.columnWidth, coord.height);
      var column = new BarGraphColumn();
      column.draw(drawingWarpper, players[i], columnCoord);
    }
  };
}

function BarGraphColumn() {
  var _drawingWarpper = null;
  var _coord = null;
  var _player = null;
  var _rectangleHeight = null;
  var _rectanglePadding = 5;
  var _topTitleCoord = null;
  var _bottomTitleCoord = null;
  var _rectangleCoord = null;

  this.draw = function (drawingWarpper, player, coord) {
    _drawingWarpper = drawingWarpper;
    _coord = coord;
    _player = player;

    init();

    drawTopTitle();
    drawBottomTitle();
    drwaRectangle();
  };

  function init() {
    _rectangleHeight = Math.round(_player.time * BarGraphColumn.countPixrlsForTimeUnit);
    _topTitleCoord = new Coord(_coord.left, _coord.top + _coord.height - _rectangleHeight - BarGraphColumn.titleFont.size - 2 * _rectanglePadding);
    _rectangleCoord = new Coord(_coord.left, _topTitleCoord.top + _rectanglePadding, _coord.width, _rectangleHeight);
    _bottomTitleCoord = new Coord(_coord.left, _rectangleCoord.top + _rectangleCoord.height + BarGraphColumn.titleFont.size + _rectanglePadding, _coord.width, _rectangleHeight);
  }

  function drawTopTitle() {
    _drawingWarpper.drawText(_player.time, _topTitleCoord, BarGraphColumn.titleFont);
  }

  function drawBottomTitle() {
    _drawingWarpper.drawText(_player.name, _bottomTitleCoord, BarGraphColumn.titleFont);
  }

  function drwaRectangle() {
    var color = _player.name === PLAYER_NAME ? BarGraphColumn.myColumnColor() : BarGraphColumn.otherColumnColor();
    _drawingWarpper.drawRectangle(_rectangleCoord, color);
  }
}

BarGraphColumn.titleFont = new Font('PT Mono', 16);
BarGraphColumn.countPixrlsForTimeUnit = null;
BarGraphColumn.myColumnColor = function () {
  return 'red';
};
BarGraphColumn.otherColumnColor = function () {
  var transparency = Math.random();
  if ((transparency - 0.01) < 0) {
    transparency = 0.01;
  }
  return 'rgba(0, 0, 255, ' + Math.random() + ')';
};

BarGraphColumn.getCountPixrlsForTimeUnit = function (barGraphHeight, bestPlayer) {
  var columnMaxHeigth = barGraphHeight - 2 * BarGraphColumn.titleFont.size;
  return columnMaxHeigth / bestPlayer.time;
};


window.renderStatistics = function (ctx, names, times) {
  var players = [];
  var bestPlayer = null;

  for (var i = 0; i < names.length; i++) {
    var player = new Player(names[i], Math.round(times[i]));
    players.push(player);
    if (bestPlayer === null || player.time > bestPlayer.time) {
      bestPlayer = player;
    }
  }

  var workPlaceCoor = new Coord(100, 0, 410, 270);

  var drawingWrapper = new DrawingWarpper(ctx);
  drawingWrapper.drawRectangle(workPlaceCoor.add(10, 10, 0, 0), 'rgba(0, 0, 0, 0.8)');
  drawingWrapper.drawRectangle(workPlaceCoor, 'white');
  drawingWrapper.drawText(['Ура вы победили!', 'Список результатов:'], workPlaceCoor.add(20, 40, 0, 0), new Font('PT Mono', 16));
  var barGraphCoord = workPlaceCoor.add(35, 90, -10, -120);
  BarGraphColumn.countPixrlsForTimeUnit = BarGraphColumn.getCountPixrlsForTimeUnit(barGraphCoord.height, bestPlayer);
  var barGraph = new BarGrap();
  barGraph.draw(drawingWrapper, players, barGraphCoord);
};
