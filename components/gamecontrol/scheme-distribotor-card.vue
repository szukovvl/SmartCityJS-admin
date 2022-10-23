<template>
  <v-card
    class="card-with-border"
    flat
  >
    <div class="d-inline-flex">
      <div
        v-for="port in hub.hub.inputs"
        :key="port.address"
        :class="getPortClass(port)"
      >
        {{ getPortName(port) }}
      </div>
    </div>
    <v-card-title class="d-flex flex-nowrap text-no-wrap">
      <v-avatar
        class="mr-2"
        tile
        color="amber darken-3"
      >
        <v-icon dark>
          mdi-home-lightning-bolt
        </v-icon>
      </v-avatar>
      &laquo;{{ hub.oes !== undefined ? hub.oes.identy : '' }}&raquo;
    </v-card-title>
    <div class="d-inline-flex">
      <div
        v-for="outputLine in outputs"
        :key="outputLine.port"
        :class="outputLine.classoes"
      >
        {{ outputLine.subnet !== undefined ? outputLine.subnet.identy : '' }}
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
export default {
  name: 'SchemeDistributorCadr',

  props: {
    hub: {
      type: Object,
      required: true,
      default () {
        return { hub: { } }
      }
    }
  },

  data: () => ({
  }),

  computed: {
    outputs () {
      const lines = this.hub.hub !== undefined ? this.hub.hub.outputs : []
      const lineOutputs = this.hub.oes !== undefined ? this.hub.oes.data.outputs : []
      return lines.map(e => ({
        port: e.address,
        subnet: lineOutputs.find(item => e.address === item.devaddr),
        error: e.error !== undefined,
        classoes: this.getOutputLineClass(e)
      }))
    },
    errors () {
      return this.hub.hub !== undefined &&
        (this.hub.hub.error !== undefined ||
        this.hub.hub.inputs.some(e => e.error) ||
        this.hub.hub.outputs.some(e => e.error))
    },
    errorMsg () {
      const msg = []
      if (this.errors) {
        if (this.hub.hub.error !== undefined) {
          msg.push(this.hub.error)
        }
        this.hub.hub.inputs.filter(e => e.error !== undefined).forEach((e) => { msg.push(e.error) })
        this.hub.hub.outputs.filter(e => e.error !== undefined).forEach((e) => { msg.push(e.error) })
      }
      return msg
    }
  },

  methods: {
    getPortClass (port) {
      const text = 'px-2 py-1 mx-1 mt-1 white--text'
      if (this.hub.hub !== undefined) {
        const line = this.hub.ports.find(e => e.portaddr === port.address)
        if (port !== undefined && line !== undefined) {
          if (line.oesport.error !== undefined) {
            return text + ' deep-orange accent-3'
          } else {
            return text + ' green'
          }
        }
      }
      return text + ' blue-grey lighten-1'
    },
    getPortName (port) {
      if (this.hub.hub !== undefined && port !== undefined) {
        const line = this.hub.ports.find(e => e.portaddr === port.address)
        if (line !== undefined && line.owndata !== undefined) {
          return line.owndata.subnet.identy
        } else {
          /* if (this.hub.oes !== undefined) {
            line = this.hub.oes.data.inputs.find(e => e.devaddr === port.address)
            if (line !== undefined) {
              return line.identy
            }
          } */
          return '#' + port.address
        }
      }
      return '###'
    },
    getOutputLineClass (inline) {
      const str = 'px-2 py-1 mx-1 mt-1 white--text'
      if (inline.error) {
        return str + ' deep-orange accent-3'
      }
      return str + ' amber'
    }
  }
}
</script>

<style scoped>
.card-with-border.v-sheet.v-card {
  border: 2px solid #FF8F00;
  border-radius: 8px;
}
</style>
