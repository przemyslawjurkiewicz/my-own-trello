'use strict';
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        //Enter list of bgcolors:
        var bgcolorlist = new Array("#c0dfd9", "#e9ece5", "#b3c2bf", "#b56969", "#edd9c0", "#89bdd3", "#6ed3cf", "#3fb0ac")

        //Random string for id
        function randomString() {
            var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
            var str = '';
            for (var i = 0; i < 10; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return str;
        }

        //Generate html from temple (mustache js)
        function generateTemplate(name, data, basicElement) {
            var template = document.getElementById(name).innerHTML;
            var element = document.createElement(basicElement || 'div');
            Mustache.parse(template);
            element.innerHTML = Mustache.render(template, data);
            return element;
        }

        //Column class
        function Column(name) {
            var self = this;
            this.id = randomString();
            this.name = name;
            this.element = generateTemplate('column-template', {
                name: this.name,
                id: this.id
            });
            //Column delate button listener
            this.element.querySelector('.column__button--delete').addEventListener('click', function (event) {
                event.stopPropagation();
                self.removeColumn();
            });
            //Add card button listener
            this.element.querySelector('.column__button--add-card').addEventListener('click', function (event) {
                //Show modal to add task
                showModal('#add-task');
                //Click button on modal - add task
                document.querySelector('#add-task-button').onclick = function () {
                    self.addCard(new Card(document.querySelector('[name="card-name"]').value, document.querySelector('[name="task-text"]').value));
                };

            });
        }

        //Column class prototype
        Column.prototype = {
            addCard: function (card) {
                console.log(card.element);
                this.element.querySelector('.column__card-list').appendChild(card.element);
            },
            removeColumn: function () {
                this.element.parentNode.removeChild(this.element);
            }
        };

        //Card class
        function Card(description, text) {
            var self = this;
            this.id = randomString();
            this.description = description;
            this.text = text;
            this.element = generateTemplate('card-template', {
                description: this.description,
                text: this.text,
                id: this.id
            });
            this.element.querySelector('.card').style.background = bgcolorlist[Math.floor(Math.random() * bgcolorlist.length)];
            this.element.querySelector('.card').addEventListener('click', function (event) {
                event.stopPropagation();

                if (event.target.classList.contains('card__btn--delete')) {
                    self.removeCard();
                }
            });
        }
        //Card class prototype
        Card.prototype = {
            removeCard: function () {
                this.element.parentNode.removeChild(this.element);
            }
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

        //Board object
        var board = {
            name: 'Kanban Board',
            addColumn: function (column) {
                this.element.appendChild(column.element);
                initSortable(column.id);
            },
            element: document.querySelector('#board .column-container')
        };

        //Sortable.js initiation
        function initSortable(id) {
            var el = document.getElementById(id);
            var sortable = Sortable.create(el, {
                group: 'kanban',
                sort: true
            });
        }

        //Listener for add-column button on board
        document.querySelector('#create-column').addEventListener('click', function () {
            showModal('#add-column');
        });

        //Listener for add-column button on modal.
        document.querySelector('#add-column-button').addEventListener('click', function () {
            var name = document.querySelector('[name="column-name"]').value;
            var column = new Column(name);
            board.addColumn(column);
            hideModal();
        });


        // CREATING COLUMNS
        var todoColumn = new Column('To do');
        var doingColumn = new Column('Doing');
        var doneColumn = new Column('Done');

        // ADDING COLUMNS TO THE BOARD
        board.addColumn(todoColumn);
        board.addColumn(doingColumn);
        board.addColumn(doneColumn);

        // CREATING CARDS
        var card1 = new Card('New task', 'Example text.');
        var card2 = new Card('Create kanban boards', 'Make a new board.');

        // ADDING CARDS TO COLUMNS
        todoColumn.addCard(card1);
        doingColumn.addCard(card2);

    });

})();