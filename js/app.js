//npm install -g firebase-tools

// Your web app's Firebase configuration
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyAfY0oqiNVVr7RhxeCYyv45xdsV_sNhNhw",
//     authDomain: "taskfinder-682bc.firebaseapp.com",
//     projectId: "taskfinder-682bc",
//     storageBucket: "taskfinder-682bc.appspot.com",
//     messagingSenderId: "783010412972",
//     appId: "1:783010412972:web:7571394f87681c3c202209"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const dbRef = firebase.database().ref();
// const usersRef = dbRef.child('users');
// usersRef.on("child_added", snap=>{
//     let user = snap.val();
//     let li = document.createElement('li');
//     li.innerHTML = user.name;
//     document.querySelector('.users').appendChild(li)
// })

import DATA_STORE from '../json/data.json' assert {type: 'json'}

// class DataStore{
//     #app;
//     #dbRef
//     constructor(){
//         // const firebaseConfig = {
//         //     apiKey: "AIzaSyAfY0oqiNVVr7RhxeCYyv45xdsV_sNhNhw",
//         //     authDomain: "taskfinder-682bc.firebaseapp.com",
//         //     projectId: "taskfinder-682bc",
//         //     storageBucket: "taskfinder-682bc.appspot.com",
//         //     messagingSenderId: "783010412972",
//         //     appId: "1:783010412972:web:7571394f87681c3c202209"
//         // };

//         // this.#app = initializeApp(firebaseConfig);
//         // this.#dbRef = this.#app.database().ref();
// alert("hellp")
//         console.log(DATA_STORE)
//     }

//     aleert = ()=>{
//         console.log("jejk")
//     }
//     GetUsers = ()=>{
//         const usersRef = dbRef.child('users');
//         usersRef.on("child_added", snap=>{
//             let user = snap.val();
//             let li = document.createElement('li');
//             li.innerHTML = user.name;
//             document.querySelector('.users').appendChild(li)
//         })
//     }
// }

// export {DataStore};
const weekday = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
const _1st = [1, 21, 31]
const _2nd = [2, 22]
const _3rd = [3]

export const DateString = () => {
    let now = new Date()
    let _date = now.getDate()
    let suffix = _1st.some(x => x === _date) ? "st" : _2nd.some(x => x === _date) ? 'nd' : _3rd.some(x => x === _date) ? 'rd' : 'th'
    let date = `${weekday[now.getDay()]}, ${now.getDate()}${suffix} ${months[now.getMonth()]}. ${now.getFullYear()}`
    return date;
}

//GET USER OBJECT
const User = (id) => DATA_STORE.users.find(x => x.id === parseInt(id))

//GET TASK OBJECT BY TASK ID
const definedTask = (task_list) => {
    return DATA_STORE.tasks.map(task => {
        let isAssigned = task_list.some(el => el === task.id) ? true : false
        return { "code": task.code, "description": task.description, isAssigned }
    })
}

const SetTaskTable = (tasks) => {
    let tr = ''
    tasks.map(task => {
        let icon = task.isAssigned ? '<i class="fa fa-check-circle fa-2x text-success"></i>' : '<i class="fa fa-times-circle fa-2x text-danger"></i>'
        tr += `  <tr>
                        <td class="h6"><b>${task.code}</b> </br> ${task.description}</td>
                        <td>${icon}</td>
                    </tr>`
    })
    return tr
}

//GET TASKS THAT HAVE BEEN SCHEDULED FOR THE CURRENT DAY
const ScheduleToday = (scheduleList) => {
    const now = new Date();
    let month = (now.getMonth() + 1).toString().length > 1 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`
    let day = (now.getDate()).toString().length > 1 ? now.getDate() : `0${now.getDate()}`
    const today = `${now.getFullYear()}-${month}-${day}`

    console.log(today, "today")
    return scheduleList.filter(i => i.date === today)
}

export const DataStore = {
    "GetUsers": () => {
        return DATA_STORE.users
    },

    "GetSchedule": () => {
        let schedules = DATA_STORE.schedules
        let schedule = ScheduleToday(schedules)
        if (!schedule || schedule.length < 1) return null

        let users_task = []
        schedule.forEach(item => {
            let taskIDs = JSON.parse(item.task_id); //scheduled task id's

            let _tasks = definedTask(taskIDs); //get defined task list
            let i = {
                "userData": User(item.user_id),
                "task": _tasks
            }

            users_task.push(i)
        })
        console.log(users_task, "New object")

        let taskDate = DateString()

        return { tasks: users_task, taskDate }
    },

    "GetTask": () => {
        return DATA_STORE.tasks
    }
}

export const UI = {
    "SetUserData": (userData, date) => {
        $('#user-pic').attr('src', `./img/${userData.img}`)
        $('#userName').text(userData.name)
        $('#portfolio').text(userData.portfolio)
        $('#stack').text(userData.stack)
        $('#date').text(date)
    },

    "SetTaskTable": (tasks) => {
        $('#task-list').html('')
        let tr = ''
        tasks.map(task => {
            let icon = task.isAssigned ? '<i class="fa fa-check-circle fa-2x text-success"></i>' : '<i class="fa fa-times-circle fa-2x text-danger"></i>'
            tr += `  <tr>
                            <td class="h6"><b>${task.code}</b> </br> ${task.description}</td>
                            <td>${icon}</td>
                        </tr>`

            $('#task-list').append(tr)
        })
        return tr
    },

    "SetDate": () => $('#date').html('').text(DateString()),

    "SetCards": (Data) => {
        $('#cardx').html('')
        Data.forEach((data, i) => {
            console.log(data.task);
            let table = SetTaskTable(data.task)
            let card =
                `
                        <div class="card my-4">
                            <div class="card-header">
                                Featured ${++i}
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3" style="border-right: 1px solid black">
                                        <div id="pic" class="">
                                            <img src="./img/${data.userData.img}" alt="user picture" class="picture p-3" id="user-pic">
                                        </div>
                                        <div id="info" class="align-self-center d-block p-3">
                                            <p id="userName" class="h3 text-primary text-uppercase font-weight-bold">${data.userData.name}</p>
                                            <p id="portfolio" class="h6 text-capitalize">${data.userData.portfolio}</p>
                                            <p id="stack" class="h6 text-capitalize">${data.userData.stack}</p>
                                        </div>
                                    </div>
                                    <div class="col-md-9">
                                        <table class="table table-striped table-hover table-bordered">
                                            <caption>List of tasks</caption>
                                            <tbody id="task-list">
                                                ${table}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
            $('#cardx').append(card)
        })
    }
}


