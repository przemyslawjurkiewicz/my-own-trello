//Card class
function Card(id, text) {
    var self = this;
    this.id = id;
    this.text = text || 'No text';
    this.element = generateTemplate('card-template', {
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
        var self = this;

        //DELATE card with self id
        fetch(prefix + baseUrl + '/card/' + self.id, {
                cache: "no-store",
                method: 'DELETE',
                headers: myHeaders
            })
            .then(function (resp) {
                return resp.json();
            })
            .then(function (resp) {
                self.element.parentNode.removeChild(self.element);
            })
    }
}