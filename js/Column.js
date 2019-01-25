//Column class
function Column(id, name) {
    var self = this;
    this.id = id;
    this.name = name || 'No name';
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
            var cardText = document.querySelector('[name="task-text"]').value;

            //compare key end data to send (POST)             
            var data = new FormData();

            //why name? because API need it !!
            data.append('name', cardText);
            data.append('bootcamp_kanban_column_id', self.id);

            //POST card name, GET card id, then add card
            fetch(prefix + baseUrl + '/card', {
                    cache: "no-store",
                    method: 'POST',
                    headers: myHeaders,
                    body: data,
                })
                .then(function (res) {
                    return res.json();
                })
                .then(function (resp) {
                    var card = new Card(resp.id, cardText);
                    self.addCard(card);
                });
        };
    });
}

//Column class prototype
Column.prototype = {
    addCard: function (card) {
        //console.log(card.element);
        this.element.querySelector('.column__card-list').appendChild(card.element);
    },
    removeColumn: function () {
        var self = this;

        //DELATE column with self id
        fetch(prefix + baseUrl + '/column/' + self.id, {
                cache: "no-store",
                method: 'DELETE',
                headers: myHeaders
            })
            .then(function (resp) {
                return resp.json();
            })
            .then(function (resp) {
                self.element.parentNode.removeChild(self.element);
            });
    }
};