<template>
  <v-card
    class="card-with-border"
    flat
  >
    <div class="d-inline-flex align-center">
      <v-card-title class="d-flex flex-nowrap text-no-wrap">
        <v-avatar
          class="mr-2"
          tile
          color="#00F"
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
            class="px-2 py-1 mx-1 mb-1 black white--text"
          >
            {{ inputLine.subnet.identy }}
          </div>
        </div>
        <div class="d-inline-flex">
          <div
            v-for="outputLine in outputs"
            :key="outputLine.port"
            class="px-2 py-1 mx-1 mt-1 black white--text"
          >
            {{ outputLine.subnet.identy }}
          </div>
        </div>
      </div>
    </div>
    <div>
      {{ mainstation }}
    </div>
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
        error: e.error !== undefined
      }))
    },
    outputs () {
      const lines = this.oes.outputs !== undefined ? this.oes.outputs : []
      const lineOutputs = this.mainstation.data !== undefined ? this.mainstation.data.outputs : []
      return lines.map(e => ({
        port: e.address,
        subnet: lineOutputs.find(item => e.address === item.devaddr),
        error: e.error !== undefined
      }))
    },
    errors () {
      return this.oes.error !== undefined ||
        this.inputs.some(e => e.error) ||
        this.outputs.some(e => e.error)
    },
    isConnected () {
      return this.oes.connected !== undefined ? this.oes.connected : false
    }
  }
}
</script>

<style>
.card-with-border.v-sheet.v-card {
  border: 2px solid blue;
  border-radius: 8px;
}
</style>
