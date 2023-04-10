const header = "Документы"

const categories = [
  {
    "name": "Обязательные для всех",
    "documents": [
        {"name":"Паспорт", "required": true, "comment": "Для вех"},
        {"name":"ИНН", "required": true, "comment": "Для всех"}
    ],
    "comment": "Для всех"
  },

  {
    "name": "Обязательные для трудоустройства",
    "documents": [
        {"name":"Парт. билет", "required": false, "comment": ""},
        {"name":"Рентген черепной коробки", "required": true, "comment": "Для всех"}
    ],
    "comment": "Для всех"
  },

  { "name": "Специальные",
    "documents": [
        {"name":"Справка о погашенной судимости", "required": true, "comment": "Для всех"},
        {"name":"Диплом ветеринара", "required": true, "comment": "Для всех"}
    ],
    "comment": "Для всех"
  }
]

const documents = [
  {name:"Тестовое задание кандидата", required: true, comment: "Для всех"},
  {name:"Трудовой договор", required: true, comment: "Для всех"},
  {name:"Мед. книжка", required: true, comment: "Для всех"},
]
