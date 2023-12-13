const socket = io()

const totalClients = document.getElementById('total_clients')
const msgContainer = document.getElementById('msg_container')
const inputName = document.getElementById('name_input')
const msgForm = document.getElementById('msg_form')
const msgInput = document.getElementById('input_msg')
const msgTone = new Audio('/msg_tone.mp3')

msgForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('total_clients', (data) => {
    totalClients.innerHTML = 'Total Clients: ' + data
})

function sendMessage() {
    if(msgInput.value === '')return

    //console.log(msgInput.value)
    const data = {
        name: inputName.value,
        msg: msgInput.value,
        dateTime: new Date()
    }
    socket.emit('msg', data)
    addMessageToUI(true, data)
    msgInput.value = ''
}

socket.on('chat-msg', (data) => {
    //console.log(data)
    msgTone.play()
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element = `
        <li class="${isOwnMessage ? "right_msg" : "left_msg"}">
            <p class="msg">
                ${data.msg}
                <span>${data.name}  ⚪ ${moment(data.dateTime).fromNow()}</ span>
            </p >
        </li >
        `
    msgContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom(){
    msgContainer.scrollTo(0, msgContainer.scrollHeight)
}

msgInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${inputName.value} Typing...`
    })
})

msgInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${inputName.value} Typing...`
    })
})
msgInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ``,
    })
})

socket.on('feedback', (data) =>{
    clearFeedback()
     const element = `
         <li class="msg_feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
        ` 
    msgContainer.innerHTML += element
})

function clearFeedback() {
    document.querySelectorAll('li.msg_feedback').forEach(element =>{
        element.parentNode.removeChild(element)
    })
}