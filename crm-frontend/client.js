document.addEventListener('DOMContentLoaded', async () => {
  // url сервера
  const SERVER_URL = 'http://localhost:3000';

  // оверлей загрузки
  const loadingOverlayAddFormChange = document.getElementById('loadingOverlayAddFormChange');
  const loadingOverlayFormDelete = document.getElementById('loadingOverlayFormDelete')

  // функцуия оверлея загрузки
  function toggleLoadingOverlay(overlay, show) {
    overlay.style.display = show ? 'flex' : 'none';
  }

  async function serverUpdateClient(id, updatedClient) {
    toggleLoadingOverlay(loadingOverlayAddFormChange, true);
    let response = await fetch(`${SERVER_URL}/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClient),
    });
    return response.json();
  }

  async function serverDeleteClient(id) {
    let response = await fetch(`${SERVER_URL}/api/clients/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('id');
  if (!clientId) {
    document.getElementById('clientCard').innerHTML = 'ID клиента не указан.';
    return;
  }

  const response = await fetch(`${SERVER_URL}/api/clients/${clientId}`);
  const client = await response.json();

  if (!client) {
    document.getElementById('clientCard').innerHTML = 'Клиент не найден.';
    return;
  }

  function userInformation() {
    document.getElementById('clientName').textContent = `Имя: ${client.name}`;
    document.getElementById('clientSurname').textContent = `Фамилия: ${client.surname}`;
    document.getElementById('clientLastName').textContent = `Отчество: ${client.lastName}`;
    const contactsContainer = document.getElementById('clientContacts');
    contactsContainer.innerHTML = '';

    client.contacts.forEach(contact => {
      const contactElement = document.createElement('div');
      contactElement.classList.add('client__page-contact');
      contactElement.innerHTML = `${contact.type}: ${contact.value}`;
      contactsContainer.appendChild(contactElement);
    });
  }

  userInformation();

  let clientsList = [];

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

    const deleteIcon = document.createElement('img');
    deleteIcon.src = './img/icon-cansel.svg';
    deleteIcon.alt = 'Удалить контакт';
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

  const modalChange = document.getElementById('modalChange');
  const closeModalButtonChange = document.querySelector('.modules__close-сhange');
  const cancelButtonChange = document.getElementById('cancelButtonChange');
  const formChangeID = document.getElementById('formChangeID');
  formChangeID.classList.add('text-grey', 'modules__form-change-id');

  const formAddClientChange = document.getElementById('addClientChange');
  const contactsContainerChange = document.getElementById('contactsContainerChange');
  const addContactButtonChange = document.getElementById('addContactChange');

  const errorMessageChange = document.createElement('div');
  errorMessageChange.classList.add('errors-add-clients');
  formAddClientChange.insertBefore(errorMessageChange, formAddClientChange.lastElementChild);

  const deleteContactBtn = document.getElementById('deleteContact');
  const closeModalButtonDelete = document.querySelector('.modules__close-delete');
  const cancelButtonDelete = document.getElementById('cancelButtonDelete');
  const modalDelete = document.getElementById('modalDelete');

  // Функции для управления модальными окнами
  function handleModal(modal, openButton, closeButton, cancelButton, additionalCloseFunction = null) {
    if (openButton) {
      openButton.addEventListener('click', () => {
        modal.style.display = 'block';
      });
    }

    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
      if (additionalCloseFunction) additionalCloseFunction();
    });

    cancelButton.addEventListener('click', () => {
      modalChange.style.display = 'none';
      if (additionalCloseFunction) additionalCloseFunction();
    });

    window.addEventListener('click', (event) => {
      if (event.target === modalChange) {
        modalChange.style.display = 'none';
        if (additionalCloseFunction) additionalCloseFunction();
      }
    });
  }

  handleModal(modalChange, null, closeModalButtonChange, cancelButtonChange, () => {
    cleanFieldChange();
  });

  handleModal(modalDelete, null, closeModalButtonDelete, cancelButtonDelete);

  const cleanFieldChange = () => {
    clientNameInputChange.value = '';
    clientSurnameInputChange.value = '';
    clientLastNameInputChange.value = '';
    contactsContainerChange.innerHTML = '';
  }

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

  editClientButton.addEventListener('click', () => {
    modalChange.style.display = 'block';
    cleanFieldChange();

    formChangeID.textContent = `ID: ${client.id}`;
    clientNameInputChange.value = client.name;
    clientSurnameInputChange.value = client.surname;
    clientLastNameInputChange.value = client.lastName;

    client.contacts.forEach(contact => {
      const contactGroup = createContactGroup(contact);
      contactsContainerChange.appendChild(contactGroup);
    });

    formAddClientChange.onsubmit = async (e) => {
      e.preventDefault();

      const errors = validateChangeForm();

      if (errors.length > 0) {
        errorMessageChange.innerHTML = errors.join('<br>');
      } else {
        errorMessageChange.innerHTML = '';

        const updatedClient = {
          name: clientNameInputChange.value,
          surname: clientSurnameInputChange.value,
          lastName: clientLastNameInputChange.value,
          contacts: [],
        };

        const contactGroups = contactsContainerChange.querySelectorAll('.modules__contact-group');
        contactGroups.forEach(contactGroup => {
          const type = contactGroup.querySelector('.modules__contact-type').value;
          const value = contactGroup.querySelector('.modules__contact-value').value;
          updatedClient.contacts.push({ type, value });
        });

        await serverUpdateClient(client.id, updatedClient);

        client.name = updatedClient.name;
        client.surname = updatedClient.surname;
        client.lastName = updatedClient.lastName;
        client.contacts = updatedClient.contacts;

        userInformation();

        cleanFieldChange();
        modalChange.style.display = 'none';
      }
    };
  });

  const deleteClient = async function() {
    modalDelete.style.display = 'block';

    deleteContactBtn.onclick = async () => {
      try {
        await serverDeleteClient(client.id);
        clientsList = clientsList.filter(cl => cl.id !== client.id);
        modalDelete.style.display = 'none';
      } catch (error) {
        console.error('Ошибка при удалении клиента:', error);
      }
    };
  };

  cancelButtonChange.addEventListener('click', () => {
    deleteClient();
  });

  addContactButtonChange.addEventListener('click', () => {
    const contactGroup = createContactGroup();
    contactsContainerChange.appendChild(contactGroup);
  });

});
