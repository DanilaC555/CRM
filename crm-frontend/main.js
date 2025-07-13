document.addEventListener('DOMContentLoaded', async () => {

  // url сервера
  const SERVER_URL = 'http://localhost:3000';

  // оверлей загрузки
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingOverlayChange = document.getElementById('loadingOverlayChange');
  const loadingOverlayAddFormChange = document.getElementById('loadingOverlayAddFormChange');
  const loadingOverlayFormDelete = document.getElementById('loadingOverlayFormDelete')

  // функцуия оверлея загрузки
  function toggleLoadingOverlay(overlay, show) {
    overlay.style.display = show ? 'flex' : 'none';
  }

  // добавление на сервер клиента
  async function serverSaveClients(objClients) {
    toggleLoadingOverlay(loadingOverlayAddFormChange, true);
    // обращение к серверу
    let response = await fetch(SERVER_URL + '/api/clients', {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objClients),
    });
    // хранение данных, которые вернёт сервер
    let data = await response.json();
    toggleLoadingOverlay(loadingOverlayAddFormChange, false);
    return data;
  }

  // получение данных с сервера
  async function serverGetClients() {
    toggleLoadingOverlay(loadingOverlay, true);
    // обращение к серверу
    let response = await fetch(SERVER_URL + '/api/clients', {
      method:'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    // хранение данных, которые вернёт сервер
    let data = await response.json();
    toggleLoadingOverlay(loadingOverlay, false);
    return data;
  };

  // Обновление клиента на сервере
  async function serverUpdateClient(id, updatedClient) {
    toggleLoadingOverlay(loadingOverlayChange, true);
    // обращение к серверу
    let response = await fetch(SERVER_URL + `/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClient),
    });
    // хранение данных, которые вернёт сервер
    let data = await response.json();
    toggleLoadingOverlay(loadingOverlayChange, false);
    return data;
  }

  // удаление клиента
  async function serverDeleteClient(id) {
    toggleLoadingOverlay(loadingOverlayFormDelete, true);
    // обращение к серверу
    let response = await fetch(SERVER_URL + `/api/clients/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    // хранение данных, которые вернёт сервер
    let data = await response.json();
    toggleLoadingOverlay(loadingOverlayFormDelete, false);
    return data;
  }

  // Получение данных клиента по его идентификатору
  async function serverGetClientById(id) {
    toggleLoadingOverlay(loadingOverlayChange, true);
    try {
      const response = await fetch(`${SERVER_URL}/api/clients/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      toggleLoadingOverlay(loadingOverlayChange, false);
      return data;
    } catch (error) {
      console.error('Error fetching client data:', error);
      return null;
    }
  }

  // список клиентов
  let clientsList = [];

  async function loadClients() {
    // получение с сервера данных и присваивание к массиву клиентов
    let serverData = await serverGetClients();
    // Обработка полученных данных
    if (serverData !== false) {
      clientsList = serverData;
    }
    renderClientsList(clientsList);
  }

  // Вызов функции загрузки клиентов
  loadClients();

  // добавление элементов таблицы
  const tbody = document.getElementById('clientTableBody');

  // элементы модального окна добавления
  const modal = document.getElementById('modal');
  const openModalButton = document.getElementById('openModalButton');
  const closeModalButton = document.querySelector('.modules__close');
  const cancelButton = document.getElementById('cancelButton');

  // добавление элементов формы добавления
  const formAddClient = document.getElementById('addClient');
  const contactsContainer = document.getElementById('contactsContainer');
  const addContactButton = document.getElementById('addContact');

  // элементы модального окна изменения
  const modalChange = document.getElementById('modalChange');
  const closeModalButtonChange = document.querySelector('.modules__close-сhange');
  const cancelButtonChange = document.getElementById('cancelButtonChange');
  const formChangeID = document.getElementById('formChangeID');
  formChangeID.classList.add('text-grey', 'modules__form-change-id');

  // добавление элементов формы изменения
  const formAddClientChange = document.getElementById('addClientChange');
  const contactsContainerChange = document.getElementById('contactsContainerChange');
  const addContactButtonChange = document.getElementById('addContactChange');

  // Получаем значения полей формы добавления
  const clientNameInput = document.getElementById('clientNameInput');
  const clientSurnameInput = document.getElementById('clientSurnameInput');
  const clientLastNameInput = document.getElementById('clientLastNameInput');

  // Получаем значения полей формы изменения
  const clientNameInputChange = document.getElementById('clientNameInputChange');
  const clientSurnameInputChange = document.getElementById('clientSurnameInputChange');
  const clientLastNameInputChange = document.getElementById('clientLastNameInputChange');

  // элементы модального окна удаления
  const modalDelete = document.getElementById('modalDelete');
  const closeModalButtonDelete = document.querySelector('.modules__close-delete');
  const cancelButtonDelete = document.getElementById('cancelButtonDelete');

  // удалить клиента
  const deleteContactBtn = document.getElementById('deleteContact');

  // элементы сортирвоки
  const sortFIO = document.getElementById('sortFIO');
  const sortDateStart = document.getElementById('sortDateStart');
  const sortDateLast = document.getElementById('sortDateLast');
  const sortID = document.getElementById('sortID');

  const sortIconIdTop = document.getElementById('sortIconIdBottom');
  const sortIconIdBottom = document.getElementById('sortIconIdTop')

  const sortIconFioBottom = document.getElementById('sortIconFioBottom');
  const sortIconFioTop = document.getElementById('sortIconFioTop');

  const sortIconDateStartBottom = document.getElementById('sortIconDateStartBottom');
  const sortIconDateStartTop = document.getElementById('sortIconDateStartTop');

  const sortIconDateLastBottom = document.getElementById('sortIconDateLastBottom');
  const sortIconDateLastTop = document.getElementById('sortIconDateLastTop');

  // создание ошибки и добавление его внизу
  // валидация добавления
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('errors-add-clients')
  formAddClientChange.insertBefore(errorMessage, formAddClientChange.lastElementChild);
  addClient.insertBefore(errorMessage, addClient.lastElementChild);

  // валидация изменения
  const errorMessageChange = document.createElement('div');
  errorMessageChange.classList.add('errors-add-clients');
  formAddClientChange.insertBefore(errorMessageChange, formAddClientChange.lastElementChild);

  // функция для очистки формы
  const cleanField = () => {
    clientNameInput.value = '';
    clientSurnameInput.value = '';
    clientLastNameInput.value = '';
    contactsContainer.innerHTML = '';
  }

  const cleanFieldChange = () => {
    clientNameInputChange.value = '';
    clientSurnameInputChange.value = '';
    clientLastNameInputChange.value = '';
    contactsContainerChange.innerHTML = '';
  }

   // функция для создания контактной группы
   const createContactGroup = (contact = { type: 'Телефон', value: '' }) => {

    const contactGroup = document.createElement('div');
    contactGroup.classList.add('modules__contact-group', 'flex');

    const select = document.createElement('select');
    select.classList.add('modules__form-select-style', 'modules__contact-type');
    select.innerHTML = `
      <option value="Телефон" ${contact.type === 'Телефон' ? 'selected' : ''}>Телефон</option>
      <option value="Email" ${contact.type === 'Email' ? 'selected' : ''}>Email</option>
      <option value="Facebook" ${contact.type === 'Facebook' ? 'selected' : ''}>Facebook</option>
      <option value="VK" ${contact.type === 'VK' ? 'selected' : ''}>VK</option>
      <option value="Другое" ${contact.type === 'Другое' ? 'selected' : ''}>Другое</option>
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Введите контакт';
    input.classList.add('input-placeholder', 'modules__contact-value');
    input.value = contact.value;

    const deleteButtonContacts = document.createElement('button');
    deleteButtonContacts.type = 'button';
    deleteButtonContacts.classList.add('btn-reset', 'modules__contact-delete');

    const deleteIcon = document.createElement('span');
    deleteIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <g clip-path="url(#clip0_121_2516)">
          <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"/>
        </g>
        <defs>
          <clipPath id="clip0_121_2516">
            <rect width="16" height="16" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    `
    deleteIcon.classList.add('contact-delete-icon');

    deleteButtonContacts.appendChild(deleteIcon);
    deleteButtonContacts.addEventListener('click', () => {
      contactGroup.remove();
    });

    contactGroup.appendChild(select);
    contactGroup.appendChild(input);
    contactGroup.appendChild(deleteButtonContacts);

    return contactGroup;
  }

  // задержка времени
  const WAIT_TIME_MS = 300;
  let timeout;

  // Функции для управления модальными окнами
  function handleModal(modal, openButton, closeButton, cancelButton, additionalCloseFunction = null) {
    if (openButton) {
      openButton.addEventListener('click', () => {
        modal.style.display = 'block';
        openButton.style.display = 'none'; // cкрыть кнопку "Добавить клиента"
      });
    }

    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
      openButton.style.display = 'block';
      if (additionalCloseFunction) additionalCloseFunction();
    });

    cancelButton.addEventListener('click', () => {
      modal.style.display = 'none';
      if (additionalCloseFunction) additionalCloseFunction();
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
        openButton.style.display = 'block';
        if (additionalCloseFunction) additionalCloseFunction();
      }
    });
  }

  handleModal(modal, openModalButton, closeModalButton, cancelButton, () => {
    cleanField();
  });

  handleModal(modalChange, null, closeModalButtonChange, cancelButtonChange, () => {
    cleanFieldChange();
  });

  handleModal(modalDelete, null, closeModalButtonDelete, cancelButtonDelete);

  // валидация
  // функция валидации добавления
  const validateAddForm = () => {
    const errors = [];

    const firstNameAddErrors = clientSurnameInput.value.trim();
    const surnameAddErrors = clientNameInput.value.trim();
    const lastNameAddErrors = clientLastNameInput.value.trim();

    if (!firstNameAddErrors) {
        errors.push('Ошибка: Имя не должно быть пустым.');
    };

    if (!surnameAddErrors) {
        errors.push('Ошибка: Фамилия не должна быть пустой.');
    };

    if (!lastNameAddErrors) {
        errors.push('Ошибка: Отчество не должно быть пустым.');
    };

    // Проверка на наличие хотя бы одного контакта
    const contactGroups = contactsContainer.querySelectorAll('.modules__contact-group');
    let contactFilled = false;
    contactGroups.forEach(contactGroup => {
      const value = contactGroup.querySelector('.modules__contact-value').value.trim();
      if (value) {
        contactFilled = true;
      }
    });

    if (!contactFilled) {
      errors.push('Ошибка: Нужно заполнить хотя бы один контакт.');
    };

    if (contactGroups.length > 10) {
      errors.push('Ошибка: Нельзя добавить больше 10 контактов.');
    };

    return errors;
  };

  // функция валидации изменения
  const validateChangeForm = () => {
    const errors = [];

    const firstNameChangeErrors = clientNameInputChange.value.trim();
    const surnameChangeErrors = clientSurnameInputChange.value.trim();
    const lastNameChangeErrors = clientLastNameInputChange.value.trim();

    if (!firstNameChangeErrors) {
      errors.push('Ошибка: Имя не должно быть пустым.');
    }

    if (!surnameChangeErrors) {
      errors.push('Ошибка: Фамилия не должна быть пустой.');
    }

    if (!lastNameChangeErrors) {
      errors.push('Ошибка: Отчество не должно быть пустым.');
    }

    // Проверка на наличие хотя бы одного контакта
    const contactGroups = contactsContainerChange.querySelectorAll('.modules__contact-group');
    let contactFilled = false;
    contactGroups.forEach(contactGroup => {
      const value = contactGroup.querySelector('.modules__contact-value').value.trim();
      if (value) {
        contactFilled = true;
      }
    });

    if (!contactFilled) {
      errors.push('Ошибка: Нужно заполнить хотя бы один контакт.');
    }

    if (contactGroups.length > 10) {
      errors.push('Ошибка: Нельзя добавить больше 10 контактов.');
    };

    return errors;
  };

  // создание tr клиента
 const createClientTr = (client) => {
    const clientTr = document.createElement('tr');
    clientTr.classList.add('table-tr-border');

    // ID клиента
    const clientID = document.createElement('td');
    clientID.textContent = client.id;
    clientID.classList.add('text-grey', 'table-tb');

    // Ф.И.О. клиента
    const clientFIO = document.createElement('td');
    clientFIO.innerHTML = `<a href="client.html?id=${client.id}">${client.surname} ${client.name} ${client.lastName}</a>`;
    clientFIO.classList.add('text-standart', 'table-tb');

    // Дата и время создания
    const clientCreatedAt = document.createElement('td');
    const createdAtDate = new Date(client.createdAt);
    const createdAtStr = createdAtDate.toLocaleDateString() + ' <span class="text-grey">' + createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>';
    clientCreatedAt.innerHTML = createdAtStr;
    clientCreatedAt.classList.add('text-standart', 'table__td-At', 'table-tb');

    // Дата и время изменения
    const clientUpdatedAt = document.createElement('td');
    const updatedAtDate = new Date(client.updatedAt);
    const updatedAtStr = updatedAtDate.toLocaleDateString() + ' <span class="text-grey">' + updatedAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>';
    clientUpdatedAt.innerHTML = updatedAtStr;
    clientUpdatedAt.classList.add('text-standart', 'table__td-UpdAt', 'table-tb');

    // Контакты
    const clientContacts = document.createElement('td');
    clientContacts.classList.add('text-standart', 'table-tb');

    // для первых четырёх контактов
    const contactsContainer = document.createElement('div');
    contactsContainer.classList.add('contacts-container-visible-4')

    // для оставшихся контактов, которые будут скрыты по умолчанию
    const hiddenContactsContainer = document.createElement('div');
    hiddenContactsContainer.classList.add('contacts-container-hidden')
    hiddenContactsContainer.style.display = 'none';

    // Создание и настройка кнопки "Показать больше"
    const showMoreButton = document.createElement('button');
    showMoreButton.textContent = `+${client.contacts.length - 4}`;
    showMoreButton.style.display = client.contacts.length > 4 ? 'block' : 'none';
    showMoreButton.classList.add('btn-reset', 'show-more-btn');

    // обработчик при нажатии показывает скрытые контакты
    showMoreButton.addEventListener('click', () => {
      hiddenContactsContainer.style.display = 'block';
      showMoreButton.style.display = 'none';
    });

    client.contacts.forEach((contact, index) => {
      let icon;
      switch(contact.type) {
        case 'Телефон':
          icon = 'phone-icon.svg';
          break;
        case 'Email':
          icon = 'mail-icon.svg';
          break;
        case 'Facebook':
          icon = 'fb-icon.svg';
          break;
        case 'VK':
          icon = 'vk-icon.svg';
          break;
        default:
          icon = 'other-icon.svg';
      };

      const contactElement =
        `<div class="contact-icon-container">
        <img src="./img/${icon}" alt="${contact.type}" class="contact-icon">
        <span class="contact-info">
        <span class="contacts-info-type">${contact.type}:</span>
        <span class="contacts-info-value">${contact.value}</span>
        </span>
        </div>`;

      if (index < 4) {
        contactsContainer.innerHTML += contactElement;
      } else {
        hiddenContactsContainer.innerHTML += contactElement;
      };
    });

    clientContacts.appendChild(contactsContainer);
    clientContacts.appendChild(hiddenContactsContainer);
    clientContacts.appendChild(showMoreButton);

    // действия
    const actionsContscts = document.createElement('td');
    actionsContscts.classList.add('table-tb')

    const actionContsctsWrapper = document.createElement('div');
    actionContsctsWrapper.classList.add('table__td-action-wrapper', 'flex');

    // изменить
    const actionChangeBtn = document.createElement('button');
    actionChangeBtn.classList.add('btn-reset', 'text-standart', 'action-btn-change');
    actionChangeBtn.textContent = 'Изменить';

    // удалить
    const deleteChangeBtn = document.createElement('button');
    deleteChangeBtn.classList.add('btn-reset', 'text-standart', 'action-btn-delete');
    deleteChangeBtn.textContent = 'Удалить';

    // добавление действий
    actionContsctsWrapper.append(actionChangeBtn, deleteChangeBtn);
    actionsContscts.append(actionContsctsWrapper);

    // Обработчик кнопки "Изменить"
    actionChangeBtn.addEventListener('click', async () => {

      modalChange.style.display = 'block'; // модальное окно

      cleanFieldChange();  // Очистка формы

      formChangeID.textContent = `ID: ${client.id}`;

      // Получение данных клиента и отображение их в форме
      const clientData = await serverGetClientById(client.id);
      clientNameInputChange.value = clientData.name;
      clientSurnameInputChange.value = clientData.surname;
      clientLastNameInputChange.value = clientData.lastName;

      // Заполнение контактов
      clientData.contacts.forEach(contact => {
        const contactGroup = createContactGroup(contact);
        contactsContainerChange.appendChild(contactGroup);
      });

    // Обработчик сохранения изменений
    formAddClientChange.onsubmit = async (e) => {
      e.preventDefault();

      // ошибки
      const errors = validateChangeForm();

      if (errors.length > 0) {
        errorMessageChange.innerHTML = errors.join('<br>');
      } else {
      errorMessageChange.innerHTML = '';

      // Собираем обновлённые данные клиента из формы
      const updatedClient = {
        name: clientNameInputChange.value,
        surname: clientSurnameInputChange.value,
        lastName: clientLastNameInputChange.value,
        contacts: [],
      };

      // Получаем обновлённые контакты клиента
      const contactGroups = contactsContainerChange.querySelectorAll('.modules__contact-group');
      contactGroups.forEach(contactGroup => {
        const type = contactGroup.querySelector('.modules__contact-type').value;
        const value = contactGroup.querySelector('.modules__contact-value').value;
        updatedClient.contacts.push({ type, value });
      });

      // Отправляем обновлённые данные на сервер
      await serverUpdateClient(client.id, updatedClient);

      // Поиск индекса клиента, найден ли клиент, обновление клиента
      const index = clientsList.findIndex(cl => cl.id === client.id);
      if (index !== -1) {
        clientsList[index] = {
          // Копирование свойств, свойства из объекта updatedClient добавляются в новый объект
          ...updatedClient,
          // чтобы остались не изменные
          id: client.id,
          createdAt: client.createdAt,
          // тут изменяем для времени изменения
          updatedAt: new Date().toISOString()
        };
      };
      renderClientsList(clientsList);
      cleanFieldChange();
      modalChange.style.display = 'none';
      }
    };
  });

  // удаление
  const deleteClient = function deleteClients() {
     // Открываем модальное окно удаления
     modalDelete.style.display = 'block';

     deleteContactBtn.onclick = async () => {
       await serverDeleteClient(client.id);
       // удаление клиента из списка клиентов
       clientsList = clientsList.filter(cl => cl.id !== client.id);
       // перерисовка списка клиентов
       renderClientsList(clientsList);
       modalDelete.style.display = 'none';
     };
  }

  // обработчик удаление в модальном окне изменения
    cancelButtonChange.addEventListener('click', () => {
      deleteClient();
    });

    // Обработчик кнопки "удалить"
    deleteChangeBtn.addEventListener('click', () => {
      deleteClient();
    });

    clientTr.append(clientID, clientFIO, clientCreatedAt, clientUpdatedAt, clientContacts, actionsContscts)

    return clientTr;
  };

  // Отрисовка списка клиентов
  const renderClientsList = (clients) => {
    tbody.innerHTML = '';
    clients.forEach(client => {
      const clientTr = createClientTr(client);
      tbody.appendChild(clientTr);
    });
  };

  // Инициализация модальных окон и отрисовка списка клиентов
  renderClientsList(clientsList);

  // Обработчик добавления клиента
  formAddClient.onsubmit = async (e) => {
    e.preventDefault();

    // ошибки
    const errors = validateAddForm();

    if (errors.length > 0) {
      errorMessage.innerHTML = errors.join('<br>');
    } else {
      errorMessage.innerHTML = '';

      const newClient = {
        name: clientNameInput.value,
        surname: clientSurnameInput.value,
        lastName: clientLastNameInput.value,
        contacts: [],
      };

      const contactGroups = contactsContainer.querySelectorAll('.modules__contact-group');
      contactGroups.forEach(contactGroup => {
        const type = contactGroup.querySelector('.modules__contact-type').value;
        const value = contactGroup.querySelector('.modules__contact-value').value;
        newClient.contacts.push({ type, value });
      });

      const savedClient = await serverSaveClients(newClient);

      clientsList.push(savedClient);

      renderClientsList(clientsList);
      cleanField();
    };
  }

  // Обработчик кнопки добавления контакта
  addContactButton.addEventListener('click', () => {
    const contactGroup = createContactGroup();
    contactsContainer.appendChild(contactGroup);

  });

  // Обработчик кнопки добавления контакта (изменения)
  addContactButtonChange.addEventListener('click', () => {
    const contactGroup = createContactGroup();
    contactsContainerChange.appendChild(contactGroup);
  });

  // сортировка
  const sortClientsContainer = () => {

    // Флаг сортировки
    // изначально по возвростанию
    let sortDirection = {
      id: true,
    };

    // Функция для сортировки
    const sortClients = (keys, direction) => {
      clientsList.sort((a, b) => {
        for (const key of keys) {
        // Если значение свойства a[key] меньше, чем b[key],
        // возвращаем -1, если направление сортировки по возрастанию
        // (direction равен true). Если направление сортировки по убыванию, возвращаем 1.
        if (a[key] < b[key]) return direction ? -1 : 1;
        // if (sortDirection = true) {
        //   sortIconIdTop.style.display = 'block'
        // }
        // Если значение свойства a[key] больше, чем b[key], возвращаем
        // 1 для сортировки по возрастанию и -1 для сортировки по убыванию.
        if (a[key] > b[key]) return direction ? 1 : -1;
        // if (sortDirection = false) {
        //   sortIconIdBottom.style.display = 'block';
        // }
        // Если значения равны, возвращается 0, что означает, что порядок
        // этих элементов относительно друг друга не изменится.
        return 0;
        };
      });
    };

    // сортировка по id
    sortID.addEventListener('click', () => {
      sortDirection.id = !sortDirection.id;
      if (sortDirection.id) {
        sortIconIdTop.style.display = 'inline-block';
      } else {
        sortIconIdTop.style.display = 'none'
      }
      if (!sortDirection.id) {
        sortIconIdBottom.style.display = 'inline-block';
      } else {
        sortIconIdBottom.style.display = 'none';
      }
      sortClients(['id'], sortDirection.id);
      renderClientsList(clientsList);
    });

    // сотрирвока по фио
    sortFIO.addEventListener('click', () => {
      sortDirection.clientFIO = !sortDirection.clientFIO;
      if (sortDirection.clientFIO) {
        sortIconFioTop.style.display = 'inline-block';
      } else {
        sortIconFioTop.style.display = 'none'
      }
      if (!sortDirection.clientFIO) {
        sortIconFioBottom.style.display = 'inline-block';
      } else {
        sortIconFioBottom.style.display = 'none';
      }
      sortClients(['surname', 'name', 'lastName'], sortDirection.clientFIO);
      renderClientsList(clientsList);
    });

    // дата и время создания
    sortDateStart.addEventListener('click', () => {
      sortDirection.clientCreatedAt = !sortDirection.clientCreatedAt;
      if (sortDirection.clientCreatedAt) {
        sortIconDateStartTop.style.display = 'inline-block';
      } else {
        sortIconDateStartTop.style.display = 'none'
      }
      if (!sortDirection.clientCreatedAt) {
        sortIconDateStartBottom.style.display = 'inline-block';
      } else {
        sortIconDateStartBottom.style.display = 'none';
      }
      sortClients(['createdAt'], sortDirection.clientCreatedAt);
      renderClientsList(clientsList);
    });

    // последние изменение
    sortDateLast.addEventListener('click', () => {
      sortDirection.clientUpdatedAt = !sortDirection.clientUpdatedAt;
      if (sortDirection.clientUpdatedAt) {
        sortIconDateLastTop.style.display = 'inline-block';
      } else {
        sortIconDateLastTop.style.display = 'none'
      }
      if (!sortDirection.clientUpdatedAt) {
        sortIconDateLastBottom.style.display = 'inline-block';
      } else {
        sortIconDateLastBottom.style.display = 'none';
      }
      sortClients(['updatedAt'], sortDirection.clientUpdatedAt);
      renderClientsList(clientsList);
    });
  };

  sortClientsContainer();

  // поиск
  const searchInput = () => {
  const searchInputElement = document.getElementById('search-input');
  const autocompleteResults = document.getElementById('autocomplete-results');
  let selectedIndex = -1;

  // Функция для фильтрации и отображения клиентов
  const filterAndRenderClients = () => {
    const searchText = searchInputElement.value.trim().toLowerCase();

    const filteredClients = clientsList.filter(client => {
      // Фильтрация по полному имени
      const fullName = `${client.surname} ${client.name} ${client.lastName}`.toLowerCase();
      if (fullName.includes(searchText)) {
        return true;
      }

      // Фильтрация по контактам
      for (const contact of client.contacts) {
        const contactType = contact.type.toLowerCase();
        const contactValue = contact.value.toLowerCase();
        if (contactType.includes(searchText) || contactValue.includes(searchText)) {
          return true;
        }
      }

      // Фильтрация по дате создания
      const createdAtDate = new Date(client.createdAt);
      const createdAtDateString = createdAtDate.toLocaleDateString() + ' ' + createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
      if (createdAtDateString.includes(searchText)) {
        return true;
      }

      // Фильтрация по дате последнего обновления
      const updatedAtDate = new Date(client.updatedAt);
      const updatedAtDateString = updatedAtDate.toLocaleDateString() + ' ' + updatedAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
      if (updatedAtDateString.includes(searchText)) {
        return true;
      }

      // Фильтрация по ID
      if (!isNaN(searchText)) {
        if (client.id.toString().includes(searchText)) {
          return true;
        }
      }
      return false;
    });

    // Отображение отфильтрованных клиентов
    renderClientsList(filteredClients);
  };

  // Функция для обновления автодополнения
  const updateAutocomplete = (query) => {
    if (!query) {
      autocompleteResults.innerHTML = '';
      return;
    }

    const results = clientsList.filter(client => {
      const fullName = `${client.surname} ${client.name} ${client.lastName}`;
      return fullName.toLowerCase().includes(query.toLowerCase());
    });

    autocompleteResults.innerHTML = results.map((client, index) => `
      <div class="autocomplete-item" data-index="${index}">
        ${client.surname} ${client.name} ${client.lastName}
      </div>
    `).join('');
  };

  // Обработка ввода пользователя
  searchInputElement.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const query = e.target.value;
      filterAndRenderClients();
      updateAutocomplete(query);
    }, WAIT_TIME_MS);
  });

  // Обработка выбора из списка автодополнения
  autocompleteResults.addEventListener('click', (e) => {
    if (e.target.classList.contains('autocomplete-item')) {
      const index = e.target.dataset.index;
      const client = clientsList[index];
      searchInputElement.value = `${client.surname} ${client.name} ${client.lastName}`;
      autocompleteResults.innerHTML = '';
      filterAndRenderClients(); // Обновляем результаты поиска для выбранного клиента
    }
  });

  // Обработка клавиатурных событий
  searchInputElement.addEventListener('keydown', (e) => {
    const items = autocompleteResults.querySelectorAll('.autocomplete-item');

    if (e.key === 'ArrowDown') {
      if (selectedIndex < items.length - 1) {
        selectedIndex++;
      }
      updateSelectedItem();
    } else if (e.key === 'ArrowUp') {
      if (selectedIndex > 0) {
        selectedIndex--;
      }
      updateSelectedItem();
    } else if (e.key === 'Enter') {
      if (selectedIndex > -1) {
        items[selectedIndex].click();
      }
    }
  });

  const updateSelectedItem = () => {
    const items = autocompleteResults.querySelectorAll('.autocomplete-item');
    items.forEach((item, index) => {
      if (index === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  };

  // Закрытие автодополнения при клике вне элемента
  document.addEventListener('click', (e) => {
    if (!searchInputElement.contains(e.target) && !autocompleteResults.contains(e.target)) {
      autocompleteResults.innerHTML = '';
    }
  });
  };

  searchInput(); // Инициализация поиска и автодополнения

});
