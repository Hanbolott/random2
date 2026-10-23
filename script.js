// ============================================
// РАНДОМАЙЗЕР ОБЕДА
// ============================================


// --------------------------------------------
// СОТРУДНИКИ
// --------------------------------------------

const DEFAULT_EMPLOYEES = [

    // Парни
    {
        name: "Байэль",
        gender: "male"
    },
    {
        name: "Айзат",
        gender: "male"
    },
    {
        name: "Тунунук",
        gender: "male"
    },
    {
        name: "Рамазан",
        gender: "male"
    },
    {
        name: "Санжар",
        gender: "male"
    },
    {
        name: "Курсант",
        gender: "male",
        fixed: true
    },
    {
        name: "Хан",
        gender: "male"
    },


    // Девушки
    {
        name: "Ася",
        gender: "female"
    },
    {
        name: "Айпери",
        gender: "female"
    },
    {
        name: "Наргиз",
        gender: "female"
    },
    {
        name: "Айдана",
        gender: "female"
    },
    {
        name: "Гулназ",
        gender: "female"
    },
    {
        name: "Айдай",
        gender: "female"
    },
    {
        name: "Арина",
        gender: "female"
    },
    {
        name: "Эльнура",
        gender: "female"
    },
    {
        name: "Малика",
        gender: "female"
    },
    {
        name: "Эльзира",
        gender: "female"
    },
    {
        name: "Айгуль",
        gender: "female"
    }

];


// --------------------------------------------
// НАСТРОЙКИ
// --------------------------------------------

const TIMES = [
    "11:00–12:00",
    "12:00–13:00",
    "13:00–14:00"
];

const GROUP_SIZE = 6;

const STORAGE_EMPLOYEES = "lunch_employees";
const STORAGE_HISTORY = "lunch_history";
const STORAGE_LAST_DATE = "lunch_last_date";


// --------------------------------------------
// DOM
// --------------------------------------------

const scheduleElement =
    document.getElementById("schedule");

const currentDateElement =
    document.getElementById("currentDate");

const generateButton =
    document.getElementById("generateButton");

const settingsButton =
    document.getElementById("settingsButton");

const settingsModal =
    document.getElementById("settingsModal");

const closeSettings =
    document.getElementById("closeSettings");

const employeeList =
    document.getElementById("employeeList");

const employeeName =
    document.getElementById("employeeName");

const employeeGender =
    document.getElementById("employeeGender");

const addEmployeeButton =
    document.getElementById("addEmployeeButton");

const showHistoryButton =
    document.getElementById("showHistoryButton");

const historyModal =
    document.getElementById("historyModal");

const closeHistory =
    document.getElementById("closeHistory");

const historyList =
    document.getElementById("historyList");


// --------------------------------------------
// LOCAL STORAGE
// --------------------------------------------

function getEmployees() {

    const saved =
        localStorage.getItem(STORAGE_EMPLOYEES);

    if (!saved) {

        localStorage.setItem(
            STORAGE_EMPLOYEES,
            JSON.stringify(DEFAULT_EMPLOYEES)
        );

        return [...DEFAULT_EMPLOYEES];
    }

    return JSON.parse(saved);
}


function saveEmployees(employees) {

    localStorage.setItem(
        STORAGE_EMPLOYEES,
        JSON.stringify(employees)
    );
}


function getHistory() {

    const saved =
        localStorage.getItem(STORAGE_HISTORY);

    if (!saved) {
        return [];
    }

    return JSON.parse(saved);
}


function saveHistory(history) {

    localStorage.setItem(
        STORAGE_HISTORY,
        JSON.stringify(history)
    );
}


// --------------------------------------------
// DATE
// --------------------------------------------

function getDateKey(date = new Date()) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(date = new Date()) {

    return new Intl.DateTimeFormat(
        "ru-RU",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(date);
}


// --------------------------------------------
// RANDOM
// --------------------------------------------

function shuffle(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}


// --------------------------------------------
// СОЗДАНИЕ ГРУПП
// --------------------------------------------

function createGroups(employees) {

    if (employees.length !== 18) {

        alert(
            `Для корректной работы нужно 18 сотрудников.\n\nСейчас: ${employees.length}`
        );

        return null;
    }


    const males =
        shuffle(
            employees.filter(
                person =>
                    person.gender === "male" &&
                    !person.fixed
            )
        );


    const females =
        shuffle(
            employees.filter(
                person =>
                    person.gender === "female"
            )
        );


    const kursant =
        employees.find(
            person =>
                person.name === "Курсант"
        );


    // ----------------------------------------
    // Три группы
    // ----------------------------------------

    const groups = [
        [],
        [],
        []
    ];


    // ----------------------------------------
    // Курсант всегда в группе №3
    // ----------------------------------------

    groups[2].push(kursant);


    // ----------------------------------------
    // Минимум 2 парня в каждой группе
    // ----------------------------------------

    // Берём 6 обычных парней:
    // 2 -> группа 1
    // 2 -> группа 2
    // 2 -> группа 3

    for (let i = 0; i < 6; i++) {

        const groupIndex =
            Math.floor(i / 2);

        groups[groupIndex].push(
            males[i]
        );
    }


    // Оставшийся парень
    // может быть добавлен в группу
    // где меньше мужчин

    const remainingMales =
        males.slice(6);


    // ----------------------------------------
    // Девушки
    // ----------------------------------------

    const allRemaining = [
        ...remainingMales,
        ...females
    ];


    const shuffledRemaining =
        shuffle(allRemaining);


    for (const person of shuffledRemaining) {

        const possibleGroups =
            groups
                .map((group, index) => ({
                    group,
                    index
                }))
                .filter(
                    item =>
                        item.group.length < GROUP_SIZE
                );


        if (possibleGroups.length === 0) {
            break;
        }


        // Сначала выбираем группу
        // с наименьшим количеством людей

        possibleGroups.sort(
            (a, b) =>
                a.group.length -
                b.group.length
        );


        const smallest =
            possibleGroups.filter(
                item =>
                    item.group.length ===
                    possibleGroups[0].group.length
            );


        const selected =
            smallest[
                Math.floor(
                    Math.random() *
                    smallest.length
                )
            ];


        selected.group.push(person);
    }


    // ----------------------------------------
    // Перемешиваем людей внутри групп
    // ----------------------------------------

    return groups.map(group =>
        shuffle(group)
    );
}


// --------------------------------------------
// ГЕНЕРАЦИЯ РАСПИСАНИЯ
// --------------------------------------------

function generateSchedule() {

    const employees =
        getEmployees();

    const groups =
        createGroups(employees);

    if (!groups) {
        return;
    }


    const schedule = {

        date: getDateKey(),

        groups: groups.map(
            (people, index) => ({

                time: TIMES[index],

                people: people

            })
        )

    };


    saveTodaySchedule(schedule);

    renderSchedule(schedule);
}


// --------------------------------------------
// СОХРАНЕНИЕ
// --------------------------------------------

function saveTodaySchedule(schedule) {

    let history =
        getHistory();


    const today =
        getDateKey();


    // Удаляем старую запись этого дня

    history =
        history.filter(
            item =>
                item.date !== today
        );


    history.unshift(schedule);


    // Оставляем последние 30 дней

    history =
        history.slice(0, 30);


    saveHistory(history);


    localStorage.setItem(
        STORAGE_LAST_DATE,
        today
    );
}


// --------------------------------------------
// ПОЛУЧИТЬ СЕГОДНЯШНЕЕ
// --------------------------------------------

function getTodaySchedule() {

    const history =
        getHistory();

    const today =
        getDateKey();


    return history.find(
        item =>
            item.date === today
    );
}


// --------------------------------------------
// ОТОБРАЖЕНИЕ
// --------------------------------------------

function renderSchedule(schedule) {

    scheduleElement.innerHTML = "";


    schedule.groups.forEach(
        (group, index) => {

            const card =
                document.createElement("div");

            card.className =
                "schedule-card";


            const header =
                document.createElement("div");

            header.className =
                "schedule-header";


            header.innerHTML = `

                <div>
                    <div class="time">
                        ${group.time}
                    </div>

                    <div class="people-count">
                        ${group.people.length} человек
                    </div>
                </div>

                <div class="group-badge">
                    Группа ${index + 1}
                </div>

            `;


            const people =
                document.createElement("div");

            people.className =
                "people";


            group.people.forEach(
                person => {

                    const personElement =
                        document.createElement("div");

                    personElement.className =
                        "person";


                    if (
                        person.name === "Курсант"
                    ) {

                        personElement.classList.add(
                            "kursant"
                        );
                    }


                    const firstLetter =
                        person.name
                            .charAt(0)
                            .toUpperCase();


                    personElement.innerHTML = `

                        <div class="avatar ${person.gender}">
                            ${firstLetter}
                        </div>

                        <span>
                            ${person.name}
                        </span>

                    `;


                    people.appendChild(
                        personElement
                    );
                }
            );


            card.appendChild(header);

            card.appendChild(people);

            scheduleElement.appendChild(card);

        }
    );
}


// --------------------------------------------
// ИСТОРИЯ
// --------------------------------------------

function renderHistory() {

    const history =
        getHistory();


    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            `<p style="color:#999;font-size:13px;">
                История пока пустая
            </p>`;

        return;
    }


    history.forEach(
        schedule => {

            const item =
                document.createElement("div");

            item.className =
                "history-item";


            const date =
                new Date(
                    schedule.date + "T12:00:00"
                );


            item.innerHTML = `

                <div class="history-date">
                    ${formatDate(date)}
                </div>

                ${schedule.groups.map(
                    group => `

                        <div class="history-time">
                            ${group.time}
                        </div>

                        <div class="history-names">
                            ${group.people
                                .map(person => person.name)
                                .join(", ")}
                        </div>

                    `
                ).join("")}

            `;


            historyList.appendChild(item);
        }
    );
}


// --------------------------------------------
// СОТРУДНИКИ — НАСТРОЙКИ
// --------------------------------------------

function renderEmployees() {

    const employees =
        getEmployees();


    employeeList.innerHTML = "";


    employees.forEach(
        (person, index) => {

            const item =
                document.createElement("div");

            item.className =
                "employee-item";


            item.innerHTML = `

                <div class="employee-info">

                    <strong>
                        ${person.name}
                    </strong>

                    <span class="gender-label">
                        ${
                            person.gender === "male"
                                ? "парень"
                                : "девушка"
                        }
                    </span>

                    ${
                        person.fixed
                            ? `<span class="gender-label">
                                • всегда 13:00
                               </span>`
                            : ""
                    }

                </div>

                <button
                    class="delete-employee"
                    data-index="${index}"
                >
                    ×
                </button>

            `;


            employeeList.appendChild(item);
        }
    );


    document
        .querySelectorAll(".delete-employee")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    const employees =
                        getEmployees();


                    if (
                        employees[index].name ===
                        "Курсант"
                    ) {

                        alert(
                            "Курсант — обязательный сотрудник и не может быть удалён."
                        );

                        return;
                    }


                    employees.splice(
                        index,
                        1
                    );


                    saveEmployees(
                        employees
                    );


                    renderEmployees();
                }
            );
        });
}


// --------------------------------------------
// ДОБАВЛЕНИЕ СОТРУДНИКА
// --------------------------------------------

function addEmployee() {

    const name =
        employeeName.value.trim();

    const gender =
        employeeGender.value;


    if (!name) {

        alert(
            "Введите имя сотрудника."
        );

        return;
    }


    const employees =
        getEmployees();


    const exists =
        employees.some(
            person =>
                person.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        alert(
            "Такой сотрудник уже есть."
        );

        return;
    }


    employees.push({

        name: name,

        gender: gender

    });


    saveEmployees(
        employees
    );


    employeeName.value = "";


    renderEmployees();
}


// --------------------------------------------
// АВТОМАТИЧЕСКАЯ РОТАЦИЯ
// --------------------------------------------

function initialize() {

    currentDateElement.textContent =
        formatDate();


    let today =
        getTodaySchedule();


    if (!today) {

        generateSchedule();

    } else {

        renderSchedule(today);

    }
}


// --------------------------------------------
// КНОПКИ
// --------------------------------------------

generateButton.addEventListener(
    "click",
    () => {

        const confirmGenerate =
            confirm(
                "Перегенерировать расписание на сегодня?"
            );


        if (confirmGenerate) {

            generateSchedule();

        }

    }
);


settingsButton.addEventListener(
    "click",
    () => {

        renderEmployees();

        settingsModal.classList.remove(
            "hidden"
        );

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        settingsModal.classList.add(
            "hidden"
        );

    }
);


addEmployeeButton.addEventListener(
    "click",
    addEmployee
);


showHistoryButton.addEventListener(
    "click",
    () => {

        renderHistory();

        historyModal.classList.remove(
            "hidden"
        );

    }
);


closeHistory.addEventListener(
    "click",
    () => {

        historyModal.classList.add(
            "hidden"
        );

    }
);


// --------------------------------------------
// ЗАПУСК
// --------------------------------------------

initialize();

// Проверяем смену даты каждую минуту
setInterval(() => {
    const today = getDateKey();

    const displayedDate =
        currentDateElement.textContent;

    if (today !== localStorage.getItem(STORAGE_LAST_DATE)) {
        currentDateElement.textContent = formatDate();

        generateSchedule();
    }
}, 60000);