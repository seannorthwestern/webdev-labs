const ws = window.WebSocket || window.MozWebSocket;
// shortcut:
const qs = document.querySelector.bind(document);
let connection;
let username = "";
    
const initializeConnection = ev => {
    const url = qs('#server').value;
    connection = new ws(url);
    console.log(`Connecting to ${url}...`);

    connection.onopen = () => {
        // fires when the server message received indicating an open connection
        console.log("WebSocket connection is open.");
        utils.showLogin();
    };
    
    connection.onclose = () => {
        // fires when the server message received indicating a closed connection
        console.log("WebSocket connection is closed.");
        alert('Socket server disconnected!');
    };
    
    connection.onerror = e => {
        // fires when the server indicates a websocket error
        console.error("WebSocket error observed:", e);
    };
    
    connection.onmessage = e => {
        const data = JSON.parse(e.data);
        switch(data.type) {
            case "login":
                // a user has just connected...
                console.log('A user has just connected:', data);
                yourJob.showUsers(data);
                break;
            case "disconnect":
                // a user has just disconnected...
                console.log('A user has just disconnected:', data);
                yourJob.showUsers(data);
                break;
            case "chat":
                yourJob.showChat(data);
                break;
            default:
                console.error("Message type not recognized.");
                console.log(data);
        }
    };
};

// code that responds to messages received from the server:
const yourJob = {
    showUsers: data => {
        // TODO: clear usersList and re-populate it using the received data
        qs("#users-list").innerHTML = `
            <ul>
                <li>
                ${data.users.join('</li><li>')}
                </li>
            </ul>`;
    },

    showChat: data => {
        if (data.username === username) {
            qs("#chat").insertAdjacentHTML("beforeend", `<div class="right"><strong>You:</strong> ${data.text}</div>`);
        } else {
            qs("#chat").insertAdjacentHTML("beforeend", `<div class="left"><strong>${data.username}:</strong> ${data.text}</div>`);
        }
    }
};


// code that sends messages to the server:
const notify = {
    sendChat: () => {
        if (qs("#message").value !== "") {
            connection.send(JSON.stringify({
                type: "chat",
                text: qs("#message").value,
                username: username
            }));
            qs("#message").value = "";
        }
    },

    logout: () => {
        if (!connection) {
            return;
        }
        connection.send(JSON.stringify({
            type: "disconnect",
            username: username
        }));
    },

    login: () => {
        username = qs("#name").value;
        if (!username) {
            return;
        }
        if (!connection) {
            return;
        }

        // log into server:
        connection.send(JSON.stringify({
            type: "login",
            username: username
        }));

        // update UI:
        utils.showChatInterface();
    }
}

const utils = {
    resetApp: () => {
        connection = null;
        utils.showElements(['#ws-status']);
        utils.hideElements(
            ['#name-display', '#chat-container', '#send-container', '#status']);
        qs("#chat").innerHTML = '';
    },

    showLogin: () => {
        utils.hideElements(['#step1']);
        utils.showElements(['#step2', '#ws-status']);
        qs("#ws-status").textContent = "Connected";
    },

    showChatInterface: () => {
        qs("#name-display").textContent = `Signed in as ${username}.`;
        utils.hideElements(['#step2']);
        utils.showElements(
            ['#name-display', '#chat-container', '#send-container', '#status']);
    },

    showElements: elements => {
        document.querySelectorAll(elements).forEach(elem => {
            elem.classList.remove('hidden');
        })
    },
    hideElements: elements => {
        document.querySelectorAll(elements).forEach(elem => {
            elem.classList.add('hidden');
        })
    }
};


qs('#connect').addEventListener('click', initializeConnection);
qs("#set-name").addEventListener("click", notify.login);
qs('#send').addEventListener('click', notify.sendChat);
// logout when the user closes the tab:
window.addEventListener('beforeunload', notify.logout);
