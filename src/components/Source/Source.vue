<template>
  <div class="src-container">
    <div class="src-banner">
      <h3>Possible Sources</h3>
    </div>
    <div class="file-msg">
      <div class="files">
        <div class="src-banner">
          <h4>Uploaded Files</h4>
        </div>
        <ul class="file-container">
          <label class="fn-ele" v-for="fn in uploadedFiles" :key="fn.id">
            {{ fn.fileName }}
          </label>
        </ul>
      </div>
      <div class="messages" id="messages-src">
        <div class="src-banner">
          <h4>References</h4>
        </div>
        <ul class="message-container">
          <li v-for="src in sources" :key="src.id">
            <div class="message">
              <div class="message-text">
                {{ src.text }}
              </div>
              <div class="message-src">{{ src.src }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      sources: [],
    }
  },
  props:{
    clickedMsg: Object,
    uploadedFiles: Array
  },
  methods: {
    logClickedMsg(msg) {
      console.log(msg)
    }
  },
  watch: {
    clickedMsg() {
      this.sources.push(this.clickedMsg)
    },
  },
}
</script>

<style>
.src-container {
  display: grid;
  grid-template-rows: 5% 95%;
  background-color: #647A82;
  max-height: 95vh;
}
.src-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: #839496;
  border-bottom: 1px dashed #1E2A3A;
  border-right: 1px dashed #1E2A3A;
}
.file-msg {
  display: grid;
  grid-template-columns: 30% 70%;
}
.file-container {
  padding: 5px;
  list-style: none;
}
.files {
  overflow-y: scroll;
  padding-right: 0px;
  border-right: 1px dashed #1E2A3A;
}
.files::-webkit-scrollbar {
  display: none;
}

.files::-webkit-scrollbar-thumb {
  background: #839496;
}

.files::-webkit-scrollbar-track {
  background: #002B36
}
.fn-ele {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
  font-size: smaller;
}
#messages-src::-webkit-scrollbar {
  display: none;
}
</style>