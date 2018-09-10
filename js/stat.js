'use strict';

function Player(name, time) {
    this.name = name;
    this.time = time;
}

function Font(name, size) {
    this.name = name;
    this.size = size;

    this.toString = function () {
        return this.size + 'px ' + this.name;
    }
}

var barGraphSettings = {
    name: 'Вы',
    left: 100,
    top: 10,
    width: 420,
    height: 270,
    backgoundColor: 'white',
    shadow: {
        backgoundColor: 'rgba(0, 0, 0, 1)',
        rightOffset: 10,
        bottomOffset: 10
    },
    header: {
        text: ['Ура вы победили!', 'Список результатов:'],
        offset: {
            x: 20,
            y: 30
        },
        font: new Font('PT Mono', 16),
    },
    barGraph: {
        offset: {
            x: 30,
            y: 70
        },
        font: new Font('PT Mono', 16),
        height: 150,
        columnWidth: 40,
        distanceBetweenColumns: 50,
        myColumnColor: function () {
            return 'red';
        },
        otherColumnColor: function () {
            var transparency = Math.random();
            if ((transparency - 0.01) < 0) {
                transparency = 0.01;
            }

            return 'rgba(0, 0, 255, ' + Math.random() + ')';
        }
    }
}

function BarGraph(settings) {
    function drawCloud(ctx) {
        ctx.fillStyle = settings.shadow.backgoundColor;
        ctx.fillRect(settings.left + settings.shadow.rightOffset, settings.top + settings.shadow.bottomOffset, settings.width, settings.height);
        ctx.fillStyle = settings.backgoundColor;
        ctx.fillRect(settings.left, settings.top, settings.width, settings.height);
    }

    function drawHeader(ctx, left, top) {
        ctx.fillStyle = 'black';
        ctx.font = settings.header.font.toString();

        var top = settings.top + settings.header.offset.y;

        for (var i = 0; i < settings.header.text.length; i++) {
            ctx.fillText(settings.header.text[i], settings.left + settings.header.offset.x, top);
            top += settings.header.font.size;
        }
    }

    function getBestResult(players) {
        var bestPlayer = players[0];

        for (var i = 1; i < players.length; i++) {
            if (players[i].time > bestPlayer.time) {
                bestPlayer = players[i];
            }
        }
        return bestPlayer;
    }

    function drawForPlayer(ctx, player, height, x, y) {
        ctx.fillStyle = 'black';
        ctx.textBaseLine = 'bottom';
        ctx.font = settings.barGraph.font.toString();
        ctx.fillText(player.time, x, y + settings.barGraph.height - height - settings.barGraph.font.size - 10);
        ctx.fillText(player.name, x, y + settings.barGraph.height);

        ctx.fillStyle = player.name == settings.name ? settings.barGraph.myColumnColor() : settings.barGraph.otherColumnColor();
        ctx.fillRect(x, y + settings.barGraph.height - height - settings.barGraph.font.size - 5, settings.barGraph.columnWidth, height);
    }

    this.draw = function (ctx, players) {
        drawCloud(ctx);
        drawHeader(ctx);

        var bestPlayer = getBestResult(players);
        var columnMaxHeigth = settings.barGraph.height - 2 * settings.barGraph.font.size;
        var countPixelForSecond = columnMaxHeigth / bestPlayer.time;

        for (var i = 0; i < players.length; i++) {
            var height = Math.round(players[i].time * countPixelForSecond);
            var x = settings.left + settings.barGraph.offset.x + i * (settings.barGraph.columnWidth + settings.barGraph.distanceBetweenColumns);
            var y = settings.top + settings.barGraph.offset.y + settings.barGraph.height - height - 2 * settings.barGraph.font.size;
            drawForPlayer(ctx, players[i], height, x, settings.top + settings.barGraph.offset.y);
        }
    }
}


window.renderStatistics = function (ctx, names, times) {
    var players = [];

    for (var i =0; i < names.length; i++) {
        players.push(new Player(names[i], Math.round(times[i])));
    }

    var barGraph = new BarGraph(barGraphSettings);
    barGraph.draw(ctx, players);
};
