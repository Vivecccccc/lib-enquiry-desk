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
          <label class="fn-ele" v-for="fn in uploadedFiles" :key="fn.fileName">
            <div class="fn-text" :class="{active: isSrc(fn.fileName)}">
              {{ fn.fileName }}
            </div>
          </label>
        </ul>
      </div>
      <div class="messages" id="messages-src">
        <div class="src-banner">
          <h4>References</h4>
        </div>
        <ul class="message-container">
          <li v-for="src in sources" :key="src.src">
            <div class="message">
              <div class="srcsrc">{{ src.src }}</div>
              <div class="message-text" id="src-text">
                {{ src.text }}
              </div>
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
    },
    isSrc(fn) {
      for (var i = 0; i < this.sources.length; i++) {
        let src = this.sources[i]
        if (fn === src.src) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    clickedMsg() {
      let sources = []
      let srcs = this.clickedMsg.src
      for (var i = 0; i < src.length; i++) {
        let src = srcs[i]
        sources.push(src)
      }
      this.sources = sources
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
.fn-text.active {
  color: #fdf6e3;
  font-weight: bold;
}
.srcsrc {
  padding-bottom: 5px;
  font-size: small;
}
#messages-src::-webkit-scrollbar {
  display: none;
}
#src-text {
  max-width: 80%;
}
</style>