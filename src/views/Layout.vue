<script>
import Banner from '../components/Banner.vue'
import Chat from '../components/ChatOnly/Chat.vue'
import Source from '../components/Source/Source.vue'
export default {
    name: "Layout",
    components: {
        Banner, Chat, Source
    },
    data() {
        return {
            clickedMsg: null,
            isAllowUpload: false,
            uploadedFiles: [],
            uploadedFilesIdSet: new Set()
        }
    },
    props: ["message"],
    methods: {
        logTransMsg(msg) {
            this.clickedMsg = msg
        },
        setAllowUpload(flag) {
            this.isAllowUpload = flag
        },
        extendUploadedFiles(filesInfo) {
            let ids = filesInfo.ids
            let urls = filesInfo.urls
            let duplicateFileName = []
            for (var i = 0; i < ids.length; i++) {
                let id = ids[i]
                let fileName = urls[i]
                if (this.uploadedFilesIdSet.has(id)) {
                    duplicateFileName.push(fileName)
                    continue
                }
                let load = {
                    'id': id,
                    'fileName': fileName
                }
                this.uploadedFiles.push(load)
                this.uploadedFilesIdSet.add(id)
            }
            if (duplicateFileName.length !== 0) {
                window.alert(`duplicate documents detected: ${duplicateFileName}`)
            }
        },
    }
}
</script>

<template>
    <div class="layout">
        <div>
            <Banner @allowUpload="setAllowUpload"/>
        </div>
        <div class="main-grid">
            <Chat @transMsg="logTransMsg" @uploadedFiles="extendUploadedFiles" :isAllowUpload="isAllowUpload"/>
            <Source :clickedMsg="clickedMsg" :uploadedFiles="uploadedFiles"/>
        </div>
    </div>
</template>

<style>
.layout {
    display: grid;
    grid-template-rows: 5vh 95vh;
}
.main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
}
</style>