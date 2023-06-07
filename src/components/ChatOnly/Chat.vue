<template>
	<div class="chat">
		<div class="messages" id="msgs">
			<ul class="message-container" id="msgs-container">
				<li v-for="message in messages" :key="message.id">
					<div class="message" :class="{ 'from-me': message.sender === currentUser }">
						<div class="message-text" :class="{ 'from-me': message.sender === currentUser }" @click.ctrl.exact="emitMessage(message)">
							{{ message.text }}
						</div>
						<div class="message-time">{{ message.time }}</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="input-box">
			<textarea type="text" 
								v-model="newMessage" 
								@keydown.enter.shift.exact.prevent="newMessage += '\n'" 
								@keydown.enter.exact.prevent="sendMessage" 
								placeholder="send message">
			</textarea>
			<button @click="onPickFile" v-if="isAllowUpload" :disabled="isWaitingUpload">Upload</button>
			<input
				type="file"
				style="display: none"
				ref="fileInput"
				accept=".doc,.docx,.xlsx,.pptx,.csv,.pdf"
				@change="onFilePicked"
				multiple="multiple"/>
			<button @click="sendMessage" :disabled="isWaitingResponse">Send</button>
		</div>
	</div>
</template>
  
<script>
import axios from 'axios'
export default {
	data() {
		return {
			currentUser: 'user',
			messages: [],
			newMessage: '',
			isWaitingResponse: false,
			isWaitingUpload: false,
			prevChosenFiles: null,
		}
	},
	props: {
		isAllowUpload: false
	},
	mounted() {
// Fetch previous messages from server and store in messages array
		},
	methods: {
		sendMessage() {
			const newMsg = {
				id: Math.random().toString(36).substr(2, 9),
				sender: this.currentUser,
				text: this.newMessage,
				time: new Date().toLocaleTimeString()
			};
			this.messages.push(newMsg);
			this.newMessage = '';
			const payload = {
				query: newMsg.text,
				top_k: 3
			}
			this.isWaitingResponse = true;
			axios.post("http://127.0.0.1:8000/query", payload, {withCredentials: true})
			.then(resp => {
				const respMsg = {
					text: resp.data.msg,
					id: Math.random().toString(36),
					sender: "bot",
					time: new Date().toLocaleTimeString(),
					src: resp.data.src
				}
				this.messages.push(respMsg)
				this.isWaitingResponse = false
				this.scrollToEnd("received")
			})
			.catch(err => {
				this.isWaitingResponse = false
				window.alert(err.response.data.detail)
				if (err.response.status === 401) {
					this.$router.push("/login")
				}
			})
			this.scrollToEnd("sent")
		},
		scrollToEnd(type) {
			this.$nextTick(() => {
				const msgList = document.getElementById('msgs-container');
				const lastMsg = msgList.lastElementChild;
				if (type === "sent") {
					lastMsg.scrollIntoView(false, {behavior: "smooth"})
				}
				else {
					lastMsg.scrollIntoView({block: 'end', behavior: 'smooth'})
				}
			});
		},
		emitMessage(message) {
			if (message.sender !== this.currentUser) {
				this.$emit("transMsg", message)
			}
		},
		onPickFile() {
			this.$refs.fileInput.value = ''
  			this.$refs.fileInput.click();
		},
		onFilePicked(event) {
			const files = event.target.files
			if (files.length !== 0) {
				this.isWaitingUpload = true
				let fileNames = []
				const formData = new FormData()
				for (var i = 0; i < files.length; i++) {
					fileNames.push(files[i].name)
					formData.append('files', files[i])
				}
				axios.post('http://127.0.0.1:8000/upsert-file', formData, {headers: {
					'Content-Type': 'multipart/form-data'
				}, withCredentials: true})
				.then(resp => {
					this.$emit("uploadedFiles", resp.data)
					this.isWaitingUpload = false
				})
				.catch(err => {
					this.isWaitingUpload = false
					window.alert(err.response.data.detail)
					if (err.response.status === 401) {
						this.$router.push("/login")
					}
				})
			}
		},
	}
}
</script>

<style>
.message-container {
	list-style: none;
	margin-block-end: 0px;
}
.chat {
	display: flex;
	flex-direction: column;
	height: 95vh;
	background-color: #002B36;
}

.messages {
	flex: 1;
	overflow-y: scroll;
	max-height: 100%;
}
.messages::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.messages::-webkit-scrollbar-thumb {
  background: #839496;
}

.messages::-webkit-scrollbar-track {
  background: transparent
}

.message {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	margin-bottom: 10px;
}

.from-me {
	align-items: flex-end;
	padding: 10px;
}

.message-text {
	padding: 10px;
	background-color: #eee;
	border-radius: 10px;
	max-width: 45%;
	word-wrap: break-word;
	white-space: pre-wrap;
}
.message-text.from-me {
	background-color: #dcf8c6;
}

.message-time {
	font-size: 12px;
	color: #aaa;
	margin-top: 5px;
}

.input-box {
	display: flex;
	margin: 10px;
}

.input-box textarea {
	flex: 1;
	padding: 10px;
	border-radius: 4px;
	border: 1px solid grey;
	border-bottom: 2px solid #128c7e;
	resize: none;
	font-family: Arial, Helvetica, sans-serif;
}

.input-box textarea:focus {
	outline: none;
	border: 2px solid #128c7e;
}
	
.input-box button {
	padding: 10px;
	border-radius: 5px;
	border: none;
	background-color: #128c7e;
	color: #fff;
	margin-left: 10px;
	cursor: pointer
}
.input-box button:hover {
	background-color: #eee8d5;
	color: #002b36;
	transition-duration: 0.25s;
}
.input-box button:disabled {
	background-color: #647A82;
	color: #fff;
	cursor: not-allowed;
}
</style>