 //Board object
 var board = {
     name: 'Kanban Board',
     addColumn: function (column) {
         this.element.appendChild(column.element);
         initSortable(column.id);
     },
     element: document.querySelector('#board .column-container')
 };

 //Listener for add-column button on board
 document.querySelector('#create-column').addEventListener('click', function () {
     showModal('#add-column');
 });

 //Listener for add-column button on modal.
 document.querySelector('#add-column-button').addEventListener('click', function () {
     var name = document.querySelector('[name="column-name"]').value;

     //compare key end data to send (POST) 
     var data = new FormData();
     data.append('name', name);

     //POST column name GET column id
     fetch(prefix + baseUrl + '/column', {
             cache: "no-store",
             method: 'POST',
             headers: myHeaders,
             body: data,
         })
         .then(function (resp) {
             return resp.json();
         })
         .then(function (resp) {
             var column = new Column(resp.id, name);
             board.addColumn(column);
         });
     hideModal();
 });

 //Sortable.js initiation
 function initSortable(id) {
     var el = document.getElementById(id);
     var sortable = Sortable.create(el, {
         group: 'kanban',
         sort: true,
         onAdd: function (evt) {
             var newColumn = evt.newIndex;
             var card = evt.item.firstElementChild;
             fetch(prefix + baseUrl + '/board', {
                     headers: myHeaders,
                     cache: "no-store"
                 })
                 .then(function (resp) {
                     return resp.json();
                 })
                 .then(function (resp) {
                     changeColumn(resp.columns[newColumn].id);
                 });

             function changeColumn(newColumnId) {
                 console.log(card.id)
                 fetch(prefix + baseUrl + '/card/' + card.id, {
                     cache: "no-store",
                     method: 'PUT',
                     headers: myHeaders,
                     body: JSON.stringify({
                         'bootcamp_kanban_column_id': newColumnId
                     })
                 })
             }
         },
     });
 }