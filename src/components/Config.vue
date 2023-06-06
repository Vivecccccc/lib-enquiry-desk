<template>
    <div class="dialog-mask" v-if="visible">
      <div class="dialog-wrapper">
        <div class="dialog-header">
          <h3 class="dialog-title">Configuration</h3>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <div class="field">
                <label for="token-length">Chunk Token Length</label>
                <em class="hint" v-if="hintTokenLength">{{ "saved value: " + savedSettings.chunk_token_length }}</em>
            </div>
            <input id="token-length" type="number" v-model="tokenLength" placeholder="500"/>
          </div>
          <div class="form-group">
            <div class="field">
                <label for="embedding-method">Embedding Method</label>
                <em class="hint" v-if="hintEmbeddingMethod">{{ "saved value: " + savedSettings.embedding_method }}</em>
            </div>
            <select id="embedding-method" v-model="embeddingMethod">
              <option value="openai">openai</option>
              <option value="standard">standard</option>
            </select>
          </div>
          <div class="form-group">
            <div class="field">
                <label for="vector-store">Vector Storage</label>
                <em class="hint" v-if="hintVectorStore">{{ "saved value: " + savedSettings.vectorstore }}</em>
            </div>
            <select id="vector-store" v-model="vectorStore">
              <option value="naive">naive</option>
              <option value="faiss">FAISS</option>
            </select>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-primary" @click="saveSettings">Save Config</button>
          <button class="btn btn-secondary" @click="closeDialog" v-if="hasSavedSettings">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        tokenLength: '',
        embeddingMethod: 'openai',
        vectorStore: 'naive',
        savedSettings: {
            chunk_token_length: null,
            embedding_method: null,
            vectorstore: null
        },
      }
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible', false)
      },
      saveSettings() {
        let tokenLength = this.tokenLength ? this.tokenLength : 500
        let embeddingMethod = this.embeddingMethod ? this.embeddingMethod : 'openai'
        let vectorStore = this.vectorStore ? this.vectorStore : 'naive'
        if (window.confirm("any changes on the configuration would initialize a new chat session")) {
            this.savedSettings = {
                chunk_token_length: tokenLength,
                embedding_method: embeddingMethod,
                vectorstore: vectorStore
            }
            axios.post('http://127.0.0.1:8000/config', null, {
            params: {
                mode: 'upsert-and-query',
                chunk_token_length: this.savedSettings.chunk_token_length,
                embedding_method: this.savedSettings.embedding_method,
                vectorstore: this.savedSettings.vectorstore
            }, withCredentials: true})
            .then(resp => {
                console.log(resp)
            })
            .catch(err => {
                window.alert(err.response.data.detail)
                if (err.response.status === 401) {
                    this.$router.push("/login")
                }
            })
        }
        this.closeDialog()
      }
    },
    computed: {
        hintTokenLength() {
            return this.savedSettings.chunk_token_length && this.tokenLength !== this.savedSettings.chunk_token_length
        },
        hintEmbeddingMethod() {
            return this.savedSettings.embedding_method && this.embeddingMethod !== this.savedSettings.embedding_method
        },
        hintVectorStore() {
            return this.savedSettings.vectorstore && this.vectorStore !== this.savedSettings.vectorstore
        },
        hasSavedSettings() {
            return Object.values(this.savedSettings).every(x => x !== null && x !== '')
        }
    },
  }
  </script>
  
  <style>
  .dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dialog-wrapper {
    background-color: #fff;
    border-radius: 5px;
    width: 500px;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  .dialog-title {
    margin: 0;
  }
  
  .dialog-close {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
  }
  
  .dialog-body {
    padding: 10px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  
  .dialog-footer button {
    margin-left: 10px;
  }

  .hint {
    font-size: small;
    color: #CC0000;
  }

  .field {
    display: grid;
    grid-template-columns: 70% 30%;
  }
  </style>