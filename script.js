 
"use strict";   //kurallı yazım için kullanılan ifade

let gorevlistesi = [];

if(localStorage.getItem("gorevlistesi")!==null)
{
    gorevlistesi=JSON.parse(localStorage.getItem("gorevlistesi"));
}


let editId;
let isEditTask=false;
const taskInput = document.querySelector("#txtTaskName");
const clearbtn = document.querySelector("#clearbtn");
const filters = document.querySelectorAll(".filters span");




displayTasks("all");


function displayTasks (filter) {

    let ul = document.getElementById("task-list");  
    ul.innerHTML="";

   if(gorevlistesi.length == 0) {
    ul.innerHTML="<p class='p-3 m-0'> Görev Listesi Boş.</p>"
   }
   else {

    for (let gorev of gorevlistesi ) {

      let compeleted =  gorev.durum == "compeleted" ? "checked":""; 
      if(filter==gorev.durum || filter=="all") {

        let li = `
    <li class="task list-group-item">
        <div class="form-check">
            <input type="checkbox" onclick="updateStatus(this)" class="form-check-input" id="${gorev.id}" ${compeleted}>
            <label for="${gorev.id}" class="form-check-label ${compeleted}"> ${gorev.gorevAdi}</label>
        </div>
            <div class="dropdown">
            <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fa-solid fa-ellipsis"></i>
            </button>
            <ul class="dropdown-menu">
                <li><a onclick="deletTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Sil</a></li>
                <li><a onclick='editTask(${gorev.id},"${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
            </ul>
        </div>
     </li>
    `;
    ul.insertAdjacentHTML("beforeend",li);
}

    }
  }
}
document.querySelector("#btnAddNewTask").addEventListener("click",newtask);
document.querySelector("#btnAddNewTask").addEventListener("keypress",function(event){
if(event.key=="Enter") {
    document.getElementById("btnAddNewTask").click();
}
});

for (let span of filters) {
    span.addEventListener("click", function(){
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    })
}

function newtask(event) {

if(taskInput.value=="") {
    alert("lütfen değer giriniz")
}

else {
    if(!isEditTask) {
        // ekleme
        gorevlistesi.push({"id":gorevlistesi.length + 1, "gorevAdi":taskInput.value, "durum":"pending"});

    }
    else {
    // güncelleme
    for(let gorev of gorevlistesi) {
         if(gorev.id==editId) {
            gorev.gorevAdi = taskInput.value;
         }
         isEditTask = false;
    }


    }


taskInput.value="";

displayTasks(document.querySelector("span.active").id);
event.preventDefault();
localStorage.setItem("gorevlistesi",JSON.stringify(gorevlistesi));

}

}
function deletTask(id) {
    let  deletedId;
    // for(let index in gorevlistesi) {
    //     if(gorevlistesi[index==id]) {
    //         deletedId=index;
    //     }
    // }
    // alternatif bir dögü sistemi
    // deletedId= gorevlistesi.findIndex(function(gorev){
    //     return gorev.id==id;
    // });

    // arrow function
    deletedId = gorevlistesi.findIndex(gorev => gorev.id==id);


    gorevlistesi.splice(deletedId,1);  
     displayTasks(document.querySelector("span.active").id);
     localStorage.setItem("gorevlistesi",JSON.stringify(gorevlistesi));

     
}

function editTask(taskId, taskName) {

    editId= taskId;
    isEditTask=true;
    taskInput.value=taskName;
    taskInput.focus();
    taskInput.classList.add("active");

}
clearbtn.addEventListener("click",function(){
    gorevlistesi.splice(0,gorevlistesi.length);
    localStorage.setItem("gorevlistesi",JSON.stringify(gorevlistesi));

    displayTasks();
 
}) ;

function updateStatus(selectedTask) {
    // console.log(selectedTask.parentElement.lastElementChild);
     let label = selectedTask.nextElementSibling;
     let durum;
     if(selectedTask.checked) {
        label.classList.add("checked");
        durum="compeleted";
     }
     else {
        label.classList.remove("checked");
        durum="pending";
     }
    for(let gorev of gorevlistesi) {
        if(gorev.id==selectedTask.id) {
            gorev.durum=durum;
        }
    }
    displayTasks(document.querySelector("span.active").id);
    
    localStorage.setItem("gorevlistesi",JSON.stringify(gorevlistesi));

}
