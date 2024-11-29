const contactNameInput = document.getElementById("contact-name") as HTMLInputElement;
const contactsList = document.getElementById("contacts-list") as HTMLElement;
const chatTitle = document.getElementById("chat-title") as HTMLElement;
const messageHistory = document.getElementById("message-history") as HTMLElement;
  
const addContactButton = document.getElementById("add-contact") as HTMLButtonElement;

const messageInput = document.getElementById("message-input") as HTMLInputElement;
const sendMessageButton = document.getElementById("send-message") as HTMLButtonElement;


type Contact = {
  id: string;
  name: string;
};
type Messages = Record<string, string[]>;

let contacts: Contact[] = JSON.parse(localStorage.getItem("contacts") || "[]");
let currentContactId: string | null = null;
let messages: Messages = JSON.parse(localStorage.getItem("messages") || "{}");

  
function saveContacts(){
  localStorage.setItem("contacts", JSON.stringify(contacts));
};

function renderContacts(){
  contactsList.innerHTML = "";
  contacts.forEach(({ id, name }) => {
    const li = document.createElement("li");
    li.textContent = name;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.onclick = (event)=>{
      deleteBtn(event,li,id)
    }
    

    li.addEventListener("click", () => {
      selectContact(id, name);
    });

    li.appendChild(deleteButton);
    contactsList.appendChild(li);
  });
};


function deleteBtn(event : any , element : any, id : any){
  event.stopPropagation();
      contacts = contacts.filter((contact) => contact.id !== id);
      saveContacts();
      element.remove();

      if (currentContactId === id) {
        currentContactId = null;
        chatTitle.textContent = "Messages";
        messageHistory.innerHTML = "";

        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        params.delete("contactId");
        url.search = params.toString();
        window.history.pushState({}, "", url);
      }
}

function addContact(){
  const contactName = contactNameInput.value.trim();
    if (contactName && !contacts.some((contact) => contact.name === contactName)) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: contactName,
      };
      contacts.push(newContact);
      saveContacts();
      renderContacts();
      contactNameInput.value = "";
    } else {
      alert(contactName ? "Contact already exists!" : "Please enter a contact name.");
    }
}

function selectContact(id: string, name: string): void{
  currentContactId = id;
  chatTitle.textContent = `Chat with ${name}`;

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  params.set("contactId", id);
  url.search = params.toString();
  window.history.pushState({}, "", url);

  renderMessages();
};

function renderMessages(){
  messageHistory.innerHTML = "";
  if (currentContactId && messages[currentContactId]) {
    messages[currentContactId].forEach((msg) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", "sent");
      messageDiv.textContent = msg;
      messageHistory.appendChild(messageDiv);
    });
  }
  messageHistory.scrollTop = messageHistory.scrollHeight;
};

function saveMessages(){
  localStorage.setItem("messages", JSON.stringify(messages));
};

function sendMessage(){
  const message = messageInput.value.trim();
    if (message) {
      if (!currentContactId) {
        alert("Please select a contact to send a message.");
        return;
      }
      if (!messages[currentContactId]) {
        messages[currentContactId] = [];
      }
      messages[currentContactId].push(message);
      saveMessages();
      renderMessages();
      messageInput.value = "";
    } else {
      alert("Please enter a message.");
    }
}

contactNameInput.addEventListener("keydown", (event : KeyboardEvent) => {
  if(event.key === "Enter") {
    event.preventDefault();
    addContactButton.click();
  }
});

//contactNameInput.addEventListener("event-name", function_definition)

  
messageInput.addEventListener("keydown", (event : KeyboardEvent) => {
  if(event.key === "Enter") {
    event.preventDefault();
    sendMessageButton.click();
  }
});

document.addEventListener("DOMContentLoaded", () =>{
  
  const contactName = contactNameInput.value.trim();
  if (contactName && !contacts.some((contact) => contact.name === contactName)) {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: contactName,
    };
    contacts.push(newContact);
    saveContacts();
    renderContacts();
    contactNameInput.value = "";
  } 

  const initializeState = (): void => {
    const params = new URLSearchParams(window.location.search);
    const contactId = params.get("contactId");
    if (contactId) {
      const contact = contacts.find((c) => c.id === contactId);
      if (contact) {
        selectContact(contact.id, contact.name);
      }
    }
  };

  renderContacts();
  initializeState();

 
});

