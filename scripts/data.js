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
        {"name":"fsgs", "required": false, "comment": "Для всех"},
        {"name":"fsgs", "required": true, "comment": "Для всех"}
    ],
    "comment": "Для всех"
  },

  { "name": "Специальные",
    "documents": [
        {"name":"fsgs", "required": true, "comment": "Для всех"},
        {"name":"fsgs", "required": true, "comment": "Для всех"}
    ],
    "comment": "Для всех"
  }
]

const documents = [
  {name:"Тестовое задание кандидата", required: true, comment: "Для всех"},
  {name:"Трудовой договор", required: true, comment: "Для всех"},
  {name:"Мед. книжка", required: true, comment: "Для всех"},
]
