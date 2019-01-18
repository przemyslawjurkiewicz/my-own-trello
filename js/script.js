'use strict';
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        //Enter list of bgcolors:
        var bgcolorlist=new Array("#c0dfd9", "#e9ece5", "#b3c2bf", "#b56969", "#edd9c0", "#89bdd3", "#6ed3cf", "#3fb0ac")

        function randomString() {
            var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
            var str = '';
            for (var i = 0; i < 10; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return str;
        }

        function generateTemplate(name, data, basicElement) {
            var template = document.getElementById(name).innerHTML;
            var element = document.createElement(basicElement || 'div');
            Mustache.parse(template);
            element.innerHTML = Mustache.render(template, data);
            return element;
        }

        function Column(name) {
            var self = this;
            this.id = randomString();
            this.name = name;
            this.element = generateTemplate('column-template', {
                name: this.name,
                id: this.id
            });
           
            this.element.querySelector('.column__button--delete').addEventListener('click', function (event) {
                event.stopPropagation();
                self.removeColumn();
            });
            this.element.querySelector('.column__button--add-card').addEventListener('click', function (event) {
                showModal('#add-task');
             document.querySelector('#add-task-button').onclick = function() {
                 self.addCard(new Card(document.querySelector('[name="task-text"]').value));
                };
                
            });
        }

        Column.prototype = {
            addCard: function (card) {
                console.log(card.element);
                this.element.querySelector('.column__card-list').appendChild(card.element);
            },
            removeColumn: function () {
                this.element.parentNode.removeChild(this.element);
            }
        };

        function Card(description) {
            var self = this;
            this.id = randomString();
            this.description = description;
            this.element = generateTemplate('card-template', {
                description: this.description,
                id: this.id
            });
            this.element.querySelector('.card').style.background=bgcolorlist[Math.floor(Math.random()*bgcolorlist.length)];
            this.element.querySelector('.card').addEventListener('click', function (event) {
                event.stopPropagation();

                if (event.target.classList.contains('card__btn--delete')) {
                    self.removeCard();
                }
            });
        }
        Card.prototype = {
            removeCard: function () {
                this.element.parentNode.removeChild(this.element);
            }
        }

        //Show modal function
        var showModal = function (modal) {

            //Add show to overlay.
            document.querySelector('#modal-overlay').classList.add('visible');
            //Add show to modal.
            document.querySelector(modal).classList.add('visible');
            
        };

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


        var board = {
            name: 'Kanban Board',
            addColumn: function (column) {
                this.element.appendChild(column.element);
                initSortable(column.id);
            },
            element: document.querySelector('#board .column-container')
        };

        function initSortable(id) {
            var el = document.getElementById(id);
            var sortable = Sortable.create(el, {
                group: 'kanban',
                sort: true
            });
        }

        document.querySelector('#board .create-column').addEventListener('click', function () {
            // hideModal();
            showModal('#add-column');
        });

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
        var card1 = new Card('New task');
        var card2 = new Card('Create kanban boards');

        // ADDING CARDS TO COLUMNS
        todoColumn.addCard(card1);
        doingColumn.addCard(card2);

    });

})();