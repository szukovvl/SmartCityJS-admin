<template>
  <v-card
    :class="mainClass"
    flat
  >
    <div class="d-inline-flex align-center">
      <v-card-title class="d-flex flex-nowrap text-no-wrap">
        <v-avatar
          class="mr-2"
          tile
          :color="mainColor"
        >
          <v-icon dark>
            mdi-space-station
          </v-icon>
        </v-avatar>
        &laquo;{{ mainstation.identy !== undefined ? mainstation.identy : '' }}&raquo;
      </v-card-title>
      <div class="pa-2">
        <div class="d-inline-flex">
          <div
            v-for="inputLine in inputs"
            :key="inputLine.port"
            :class="inputLine.classoes"
          >
            {{ inputLine.subnet !== undefined ? inputLine.subnet.identy : '' }}
          </div>
        </div>
        <div class="d-inline-flex">
          <div
            v-for="outputLine in outputs"
            :key="outputLine.port"
            :class="outputLine.classoes"
          >
            {{ outputLine.subnet !== undefined ? outputLine.subnet.identy : '' }}
          </div>
        </div>
      </div>
    </div>
    <v-card-text
      v-if="errorMsg.length !== 0"
      class="deep-orange--text text-accent-3"
    >
      <div
        v-for="(error, index) in errorMsg"
        :key="'e_' + index"
        class="mt-2"
      >
        {{ error }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { ESO_MAINSTATION_TYPE } from '~/assets/helpers'

export default {
  name: 'SchemeMainStationCadr',

  props: {
    oes: {
      type: Object,
      required: true,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  }),

  computed: {
    mainstation () {
      const items = this.$store.state.game.gameResources[ESO_MAINSTATION_TYPE]
        .find(e => e.devaddr === this.oes.address)
      return items !== undefined ? items : { }
    },
    inputs () {
      const lines = this.oes.inputs !== undefined ? this.oes.inputs : []
      const lineInputs = this.mainstation.data !== undefined ? this.mainstation.data.inputs : []
      return lines.map(e => ({
        port: e.address,
        subnet: lineInputs.find(item => e.address === item.devaddr),
        error: e.error !== undefined,
        classoes: this.getInputLineClass(e)
      }))
    },
    outputs () {
      const lines = this.oes.outputs !== undefined ? this.oes.outputs : []
      const lineOutputs = this.mainstation.data !== undefined ? this.mainstation.data.outputs : []
      return lines.map(e => ({
        port: e.address,
        subnet: lineOutputs.find(item => e.address === item.devaddr),
        error: e.error !== undefined,
        classoes: this.getOutputLineClass(e)
      }))
    },
    errors () {
      return this.oes.error !== undefined ||
        this.inputs.some(e => e.error) ||
        this.outputs.some(e => e.error)
    },
    isConnected () {
      return this.oes.connected !== undefined ? this.oes.connected : false
    },
    mainColor () {
      if (this.errors) {
        return 'deep-orange accent-3'
      }
      if (this.isConnected) {
        return '#00F'
      }
      return '#78909C'
    },
    mainClass () {
      if (this.errors) {
        return 'card-with-errorborder'
      }
      if (this.isConnected) {
        return 'card-with-border'
      }
      return 'card-with-offborder'
    },
    errorMsg () {
      const msg = []
      if (this.errors) {
        if (this.oes.error !== undefined) {
          msg.push(this.oes.error)
        }
        this.oes.inputs.filter(e => e.error !== undefined).forEach((e) => { msg.push(e.error) })
        this.oes.outputs.filter(e => e.error !== undefined).forEach((e) => { msg.push(e.error) })
      }
      return msg
    }
  },

  methods: {
    getInputLineClass (inline) {
      const str = 'px-2 py-1 mx-1 mb-1 white--text'
      if (inline.error) {
        return str + ' deep-orange accent-3'
      }
      if (this.isConnected) {
        return str + ' green'
      }
      return str + ' blue-grey lighten-1'
    },
    getOutputLineClass (inline) {
      const str = 'px-2 py-1 mx-1 mt-1 white--text'
      if (inline.error) {
        return str + ' deep-orange accent-3'
      }
      if (this.isConnected) {
        return str + ' amber'
      }
      return str + ' blue-grey lighten-1'
    }
  }
}
</script>

<style scoped>
.card-with-border.v-sheet.v-card {
  border: 2px solid blue;
  border-radius: 8px;
}
.card-with-offborder.v-sheet.v-card {
  border: 2px solid #78909C;
  border-radius: 8px;
}
.card-with-errorborder.v-sheet.v-card {
  border: 2px solid #FF3D00;
  border-radius: 8px;
}
</style>
