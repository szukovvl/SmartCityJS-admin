<template>
  <v-card outlined>
    <div class="d-inline-flex align-center">
      <v-card-title class="d-flex flex-nowrap text-no-wrap blue-grey--text">
        <v-avatar
          class="mr-2"
          tile
          color="blue-grey"
        >
          <v-icon dark>
            mdi-space-station
          </v-icon>
        </v-avatar>
        &laquo;{{ oes.identy !== undefined ? oes.identy : '' }}&raquo;
      </v-card-title>
      <div class="ma-1 d-flex">
        <div class="d-flex flex-nowrap mt-2 ml-2">
          <v-icon
            small
            color="green"
          >
            mdi-sprout-outline
          </v-icon>
          <div class="ml-1 small-text">
            <div>0,00</div>
            <div class="indigo--text text--accent-4">
              0,00
            </div>
          </div>
        </div>
        <div class="d-flex flex-nowrap mt-2 ml-2">
          <v-icon
            small
            color="orange"
          >
            mdi-power-plug-outline
          </v-icon>
          <div class="ml-1 small-text">
            <div>0,00</div>
            <div class="indigo--text text--accent-4">
              0,00
            </div>
          </div>
        </div>
        <div class="d-flex flex-nowrap mt-2 ml-2">
          <v-icon
            small
            color="blue"
          >
            mdi-lightning-bolt-outline
          </v-icon>
          <div class="ml-1 small-text">
            <div>0,00</div>
            <div class="indigo--text text--accent-4">
              0,00
            </div>
          </div>
        </div>
        <div class="d-flex flex-nowrap mt-2 ml-2">
          <v-icon
            small
            color="blue"
          >
            mdi-lightning-bolt
          </v-icon>
          <div class="ml-1 small-text">
            <div>0,00</div>
            <div class="indigo--text text--accent-4">
              0,00
            </div>
          </div>
        </div>
        <div class="d-flex flex-nowrap mt-2 ml-2">
          <v-icon
            small
            color="indigo--text"
          >
            mdi-piggy-bank-outline
          </v-icon>
          <div class="ml-1 small-text">
            <div>0,00</div>
            <div class="indigo--text text--accent-4">
              0,00
            </div>
          </div>
        </div>
        <div class="d-flex flex-nowrap mt-2 ml-2">
          <v-icon
            small
            color="indigo--text"
          >
            mdi-credit-card-refund-outline
          </v-icon>
          <div class="ml-1 small-text">
            <div>0,00</div>
            <div class="indigo--text text--accent-4">
              0,00
            </div>
          </div>
        </div>
      </div>
      <div class="pa-2">
        <div class="d-inline-flex">
          <div
            v-for="inputLine in inputs"
            :key="inputLine.port.address"
            :class="getPortClass(inputLine.port)"
          >
            <div>
              {{ inputLine.subnet !== undefined ? inputLine.subnet.identy : '' }}
            </div>
            <div class="d-flex flex-nowrap white black--text">
              <v-icon
                small
                color="orange"
              >
                mdi-power-plug-outline
              </v-icon>
              <div class="ml-1 small-text">
                <div>0,00</div>
                <div class="indigo--text text--accent-4">
                  0,00
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-inline-flex">
          <div
            v-for="outputLine in outputs"
            :key="outputLine.port.address"
            :class="getPortClass(outputLine.port)"
          >
            <div>
              {{ outputLine.subnet !== undefined ? outputLine.subnet.identy : '' }}
            </div>
            <div class="d-flex flex-nowrap white black--text">
              <v-icon
                small
                color="orange"
              >
                mdi-power-plug-outline
              </v-icon>
              <div class="ml-1 small-text">
                <div>0,00</div>
                <div class="indigo--text text--accent-4">
                  0,00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { ESO_MAINSTATION_TYPE } from '~/assets/helpers'

export default {
  name: 'MainStationCard',

  props: {
    hub: {
      type: Object,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  }),

  computed: {
    oes () {
      const item = this.$store.state.game.gameResources[ESO_MAINSTATION_TYPE]
        .find(e => e.devaddr === this.hub.address)
      return item !== undefined ? item : { }
    },
    inputs () {
      const lines = this.hub.inputs !== undefined ? this.hub.inputs : []
      const lineInputs = this.oes.data !== undefined ? this.oes.data.inputs : []
      return lines.map(e => ({
        port: e,
        subnet: lineInputs.find(item => e.address === item.devaddr)
      }))
    },
    outputs () {
      const lines = this.hub.outputs !== undefined ? this.hub.outputs : []
      const lineOutputs = this.oes.data !== undefined ? this.oes.data.outputs : []
      return lines.map(e => ({
        port: e,
        subnet: lineOutputs.find(item => e.address === item.devaddr)
      }))
    }
  },

  methods: {
    getPortClass (port) {
      return port.on ? 'px-2 py-1 mx-1 mb-1 blue white--text' : 'px-2 py-1 mx-1 mb-1 blue-grey white--text'
    }
  }
}
</script>

<style scoped>
.small-text {
  font-size: small;
}
</style>
