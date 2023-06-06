<template>
    <div class="container">
        <div class="logo-container">
            <img src="https://companieslogo.com/img/orig/D05.SI_BIG-892c5c97.png?t=1648376862" alt="Login Image">
        </div>
        <nav class="handlers">
            <button class="handler" :class="{ active: currentActiveId==='chat-all'}" @click="activateButton('chat-all')" href="/chat-all" id="chat-all">Chat with Librarian</button>
            <button class="handler" :class="{ active: currentActiveId==='chat-urs'}" @click="activateButton('chat-urs')" href="/chat-urs" id="chat-urs">Chat with Your File</button>
        </nav>
        <nav class="settings">
          <button class="config" v-if="isTempSess" @click="showDialog">Configure</button>
          <button class="inout" @click="logOut">Logout</button>
        </nav>
        <Dialog :visible="dialogVisible" @update:visible="updateDialogVisible"></Dialog>
    </div>
</template>

<script>
import axios from 'axios'
import Dialog from './Config.vue'
export default {
    name: "Banner",
    components: {
      Dialog
    },
    data() {
      return {
        currentActiveId: 'chat-all',
        dialogVisible: false
      };
    },
    methods: {
      activateButton(id) {
        if (this.currentActiveId !== id) {
          if (window.confirm("a switch of the mode would initialize the chat session")) {
            this.currentActiveId = id
          }
        }
        // if (id === 'chat-urs') {
        //   this.showDialog()
        // }
      },
      logOut() {
        axios.get('http://127.0.0.1:8000/logout', {withCredentials: true})
        .then(resp => {
          window.alert(resp.data)
          this.$router.push("/login")
        })
        .catch(err => {
          window.alert(err.data)
        })
      },
      showDialog() {
        this.dialogVisible = true
      },
      updateDialogVisible(value) {
        this.dialogVisible = value
      },
      switchMode(newMode) {
        switch (newMode) {
          case "chat-urs":
            this.showDialog()
            break
          case "chat-all":
            axios.post('http://127.0.0.1:8000/config', null, {
              params: {
                mode: 'query-only',
                chunk_token_length: 500,
                embedding_method: 'openai',
                vectorstore: 'naive'
              }, withCredentials: true
            })
            .then(resp => {
              console.log(resp)
            })
            .catch(err => {
              console.log(err)
            })
            break
          default:
            window.alert("please set the applicable mode")
        }
      },
      allowUpload(flag) {
        this.$emit("allowUpload", flag)
      }
    },
    computed: {
      isTempSess() {
        return this.currentActiveId === "chat-urs"
      }
    },
    watch: {
      currentActiveId: {
        handler(newMode, oldMode) {
          if (newMode === 'chat-urs') {
            this.allowUpload(true)
          }
          else {
            this.allowUpload(false)
          }
          if (newMode !== oldMode) {
            this.switchMode(newMode)
          }
        },
        immediate: true
      }
    },
    // mounted() {
    //   this.currentActiveId = 'chat-urs'
    // }
}
</script>

<style>
.container {
    display: grid;
    justify-content: space-between;
    grid-template-columns: 1fr 5fr 1fr;
    max-width: 100vw;
    height: 5vh;
    overflow: hidden;
    background-color: #839496;
}
.logo-container {
	display: flex;
	justify-content: center;
	align-items: center;
  max-height: 5vh;
}

.logo-container img {
	max-width: 80%;
	max-height: 80%;
}

nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;
    column-gap: 0%;
}
.settings {
  display: flex;
}
.handler,
.config,
.inout {
  height: 100%;
  width: 100%;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  text-decoration: none;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  border-radius: 6px;
  border: none;
  font-size: medium;
  color: #CCCCCC;
  font-weight: 600;
}
.handler {
  border-radius: 0;
  /* border-bottom: #002B36 5px solid; */
}
.handler:hover {
    background-color: #586E75;
    transition-duration: 0.25s;
}
.handler.active,
.handler:active {
  background-color: #002B36;
  transition-duration: .25s;
  color: #839496;
}

.config {
  background-color: #073642;
  border-radius: 0;
}
.inout {
  background-color: #002B36;
  border-radius: 0;
  color: #EAEAEA;
}
</style>