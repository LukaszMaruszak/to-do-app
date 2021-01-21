const list = document.getElementById("list");
const input_title = document.getElementById("input-title");
const input_date = document.getElementById("input-date");
const add_item = document.getElementById("add_item");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle";
const LINE_THROUGH = "lineThrough";

let list_id = 0;

let id;

function loadList(array) {
    id = array.length;
    array.forEach(function (item) {
        // nazwa, id, data, czy zrobione
        addToDo(item['Title'], item['Task_ID'], item['Task_Date'].split("T")[0], item['Done']);
    });
}

add_item.addEventListener("click", function () {
    const title = input_title.value;
    const date = input_date.value;

    if (title && date && parseInt(list_id) !== 0) {
        console.log("insert")
        fetch('http://localhost:3108/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                Title: title,
                ListID: list_id,
                Done: 0,
                TaskDate: date,
                ID: id++
            })
        })
            .then(response => response.json())
            .then(item => {
                addToDo(item.data['title'], item.data['id'], item.data['TaskDate'], item.data['Done'])
            });


        title.value = "";
        date.value = "";
    }
})


function addToDo(toDo, id, date, done) {
    // nazwa, id, data, czy zrobione
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="task">
                    <i class="far ${DONE} co" id="${id}" onclick="completeToDo('${id}')"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <p class="task-time ${LINE}">${date}</p>
                    <i class="far fa-trash-alt de" id="${id}" onclick="removeToDo('${id}')"></i>
                </li>`;

    const position = "beforeend"

    list.insertAdjacentHTML(position, item);
}


function checkDone(element) {

    if(element.contains(CHECK)){
        // element został odzaznaczony
        return 0;
    }
    else if(element.contains(UNCHECK)){
        //element został zaznaczony
        return 1;
    }
}

function completeToDo(id) {
    let element = document.getElementById(id);


    fetch('http://localhost:3108/update', {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            Done: checkDone(element.classList)
        })
    })
        .then(res => res.json())
        // .then(data => console.log(data))

    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    element.parentNode.querySelector(".task-time").classList.toggle(LINE_THROUGH);
}

function removeToDo(id) {
    fetch('http://localhost:3108/delete/' + id, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => console.log(data));

    let element = document.getElementById(id);
    element.parentNode.parentNode.removeChild(element.parentNode);

}

document.getElementById('lists').addEventListener('click', function (event){
    document.getElementById('list').innerHTML = '';

    let lists = document.getElementById('lists');

    //po każdym kliknięciu zminiam kolor na czarny
    for (let item of lists.children){
        item.firstChild.classList.remove('selected')
    }

    event.target.classList.add("selected");
    console.log(event.target.classList)
    let list_name = event.target.text;
    document.getElementById('photo-description').innerText = list_name;

    let id =  event.target.id;
    list_id = id;

    fetch('http://localhost:3108/getTaskFromList/' + id)
        .then(res => res.json())
        .then(data => loadList(data['data']));
});


