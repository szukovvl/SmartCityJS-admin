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
        :color="avatarColor"
      >
        <v-icon dark>
          {{ avatar }}
        </v-icon>
      </v-avatar>
      &laquo;{{ hub.oes !== undefined ? hub.oes.identy : '' }}&raquo;
    </v-card-title>
  </v-card>
</template>

<script>
import {
  ESO_CONSUMER_TYPE_INDUSTRY,
  ESO_CONSUMER_TYPE_HOSPITAL
} from '~/assets/helpers'

export default {
  name: 'SchemeConsumerCadr',

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
    avatar () {
      if (this.hub.oes !== undefined) {
        switch (this.hub.oes.data.consumertype) {
          case ESO_CONSUMER_TYPE_INDUSTRY: return 'mdi-factory'
          case ESO_CONSUMER_TYPE_HOSPITAL: return 'mdi-hospital-building'
          default: return 'mdi-home-city'
        }
      }
      return 'mdi-home-city'
    },
    avatarColor () {
      if (this.hub.hub !== undefined && this.hub.hub.alien) {
        return 'blue-grey darken-4'
      }
      return 'amber darken-3'
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
            return text + ' amber darken-3'
          }
        }
      }
      return text + ' blue-grey lighten-1'
    },
    getPortName (port) {
      if (this.hub.hub !== undefined && port !== undefined) {
        let line = this.hub.ports.find(e => e.portaddr === port.address)
        if (line !== undefined && line.owndata !== undefined) {
          return line.owndata.subnet.identy
        } else {
          if (this.hub.oes !== undefined) {
            line = this.hub.oes.data.inputs.find(e => e.devaddr === port.address)
            if (line !== undefined) {
              return line.identy
            }
          }
          return '#' + port.address
        }
      }
      return ''
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
