<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <button @click="addFiles()">
        Add Files
      </button>
    </div>
    <div class="large-12 medium-12 small-12 cell">
      <label>File
        <input
          id="file"
          ref="file"
          type="file"
          @change="handleFileUpload()"
        >
      </label>
      <button @click="submitFile()">
        Submit
      </button>
    </div>
    <div class="mt-8">
      <v-file-input
        id="file_a"
        ref="file_a"
        hide-input
      />
      <button @click="submitFileA()">
        Submit A
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TechnologyComponent',

  data: () => ({
    file: undefined,
    picon: undefined
  }),

  methods: {
    handleFileUpload () {
      /* eslint-disable no-console */
      console.log('handleFileUpload')
      /* eslint-enable no-console */
      this.file = this.$refs.file.files[0]
      /* eslint-disable no-console */
      console.log('handleFileUpload: file:', this.file)
      /* eslint-enable no-console */
    },
    submitFile () {
      /* eslint-disable no-console */
      console.log('submitFile')
      /* eslint-enable no-console */
      const formData = new FormData()
      formData.append('points_file', this.file)
      this.$axios.$post('/api/forecast/upload/181', formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          progress: false
        })
        .then((v) => {
          /* eslint-disable no-console */
          console.log(v)
          /* eslint-enable no-console */
        })
        .catch((error) => {
          /* eslint-disable no-console */
          if (error.response) {
            console.error('ошибка %d: %s', error.response.status, error.response.data)
          }
          /* eslint-enable no-console */
        })
    },
    addFiles () {
      /* eslint-disable no-console */
      console.log('addFiles', this)
      /* eslint-enable no-console */
      this.$refs.file.click()
    },
    submitFileA () {
      /* eslint-disable no-console */
      console.log('addFiles', this.$refs.file_a)
      /* eslint-enable no-console */
    }
  }
}
</script>

<style scoped>
input[type="file"] {
  position: absolute;
  top: -500px;
}
</style>
