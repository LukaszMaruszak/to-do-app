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
    let title = input_title.value;
    let date = input_date.value;

    if (title && date && parseInt(list_id) !== 0) {
        console.log("insert")

        fetch(`http://localhost:3108/insert/${title},${list_id},0,${date}`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(item =>  {
                console.log("wstawiony obiekt",  item)
                addToDo(item.data['title'], item.data['id'], item.data['TaskDate'], item.data['Done'])
            });

        input_date.value = "";
        input_title.value = "";
    }

})


function addToDo(toDo, id, date, done) {
    // nazwa, id, data, czy zrobione
    done = parseInt(done);
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

    let done = checkDone(element.classList)
    fetch(`http://localhost:3108/update/${id},${done}`, {
        method: 'PATCH',
    })
    .then(res => res.json())
        .then(item => console.log(item));


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

    let list_name = event.target.text;
    document.getElementById('photo-description').innerText = list_name;

    let id =  event.target.id;
    list_id = id;

    fetch('/getTaskFromList/' + id)
        .then(res => res.json())
        .then(data => loadList(data['data']));
});


