<template>
  <v-card
    class="card-with-border"
    flat
  >
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
    <div class="d-inline-flex">
      <div
        v-for="port in hub.hub.inputs"
        :key="port.address"
        :class="getPortClass(port)"
      >
        {{ getPortName(port) }}
      </div>
    </div>
  </v-card>
</template>

<script>
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GREENGENERATION_TYPE_SOLAR
} from '~/assets/helpers'

export default {
  name: 'SchemeGeneratorCadr',

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
        switch (this.hub.oes.componentType) {
          case ESO_STORAGE_TYPE: return 'mdi-battery-charging-70'
          case ESO_GREEGENERATOR_TYPE:
            if (this.hub.oes.data.generation_type === ESO_GREENGENERATION_TYPE_SOLAR) {
              return 'mdi-solar-power-variant-outline'
            }
            return 'mdi-wind-power-outline'
          default: return 'mdi-engine-outline'
        }
      }
      return 'mdi-engine-outline'
    },
    avatarColor () {
      if (this.hub.hub !== undefined && this.hub.hub.alien) {
        return 'blue-grey darken-4'
      }
      return '#008000'
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
  border: 2px solid #008000;
  border-radius: 8px;
}
</style>
