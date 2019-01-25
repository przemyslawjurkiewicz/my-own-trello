//Enter list of bgcolors:
var bgcolorlist = new Array("#c0dfd9", "#e9ece5", "#b3c2bf", "#b56969", "#edd9c0", "#89bdd3", "#6ed3cf", "#3fb0ac")

//Kodilla api url, prefix eliminate CORS error
var prefix = "https://cors-anywhere.herokuapp.com/"
var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
    'X-Client-Id': '3698',
    'X-Auth-Token': 'a3018df035060d311a790456f2bf9ab8'
};

//Get existing data from server
fetch(prefix + baseUrl + '/board', {
        headers: myHeaders,
        cache: "no-store"
    })
    .then(function (resp) {
        return resp.json();
    })
    .then(function (resp) {
        setupColumns(resp.columns);
    });

//get and add columns 
function setupColumns(columns) {
    columns.forEach(function (column) {
        var col = new Column(column.id, column.name);
        board.addColumn(col);
        setupCards(col, column.cards);
    });
}

//get columns cards
function setupCards(col, cards) {
    cards.forEach(function (card) {
        var cardObj = new Card(card.id, card.name)
        col.addCard(cardObj);
    })
}

//Generate html from temple (mustache js)
function generateTemplate(name, data, basicElement) {
    var template = document.getElementById(name).innerHTML;
    var element = document.createElement(basicElement || 'div');
    Mustache.parse(template);
    element.innerHTML = Mustache.render(template, data);
    return element;
}

//Show modal function
var showModal = function (modal) {
    //reset inputs
    document.querySelectorAll('.modal input').forEach(function (inputs) {
        inputs.value = '';
    });
    document.querySelectorAll('.modal textarea').forEach(function (textarea) {
        textarea.value = '';
    });
    //Add show to overlay.
    document.querySelector('#modal-overlay').classList.add('visible');
    //Add show to modal.
    document.querySelector(modal).classList.add('visible');

};

//Modal add task button listener - stop propagation and hide
document.querySelector('#add-task-button').addEventListener('click', function (event) {
    event.stopPropagation();
    hideModal();
});

//Hide all modals function
var hideModal = function () {
    document.querySelectorAll('.modal').forEach(function (modal) {
        modal.classList.remove('visible');
    });
    document.querySelector('#modal-overlay').classList.remove('visible');
};