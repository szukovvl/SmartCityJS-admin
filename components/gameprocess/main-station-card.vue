<template>
  <v-card
    color="indigo lighten-4"
    outlined
  >
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
            <div>{{ carbon_total }}</div>
            <div class="indigo--text text--accent-4">
              {{ carbon }}
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
            <div>{{ energy_total }}</div>
            <div class="indigo--text text--accent-4">
              {{ energy }}
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
            <div>{{ reserve_total }}</div>
            <div class="indigo--text text--accent-4">
              {{ reserve }}
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
            <div>{{ generation_total }}</div>
            <div class="indigo--text text--accent-4">
              {{ generation }}
            </div>
          </div>
        </div>
        <div class="d-flex flex-nowrap mt-2 ml-2">
          <v-icon
            small
            color="indigo"
          >
            mdi-piggy-bank-outline
          </v-icon>
          <div class="ml-1 small-text">
            <div>{{ debit_total }}</div>
            <div class="indigo--text text--accent-4">
              {{ debit }}
            </div>
          </div>
        </div>
        <div class="d-flex flex-nowrap mt-2 ml-2">
          <v-icon
            small
            color="indigo"
          >
            mdi-credit-card-refund-outline
          </v-icon>
          <div class="ml-1 small-text">
            <div>{{ credit_total }}</div>
            <div class="indigo--text text--accent-4">
              {{ credit }}
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
            <div class="text-no-wrap">
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
                <div>{{ numberAsString(inputLine.values !== undefined ? inputLine.values.totals.energy : 0.0) }}</div>
                <div class="indigo--text text--accent-4">
                  {{ numberAsString(inputLine.values !== undefined ? inputLine.values.values.energy : 0.0) }}
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
            <div class="text-no-wrap">
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
                <div>{{ numberAsString(outputLine.values !== undefined ? outputLine.values.totals.energy : 0.0) }}</div>
                <div class="indigo--text text--accent-4">
                  {{ numberAsString(outputLine.values !== undefined ? outputLine.values.values.energy : 0.0) }}
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
import {
  roundToTwoAsStr,
  formatValueLocale,

  ESO_MAINSTATION_TYPE
} from '~/assets/helpers'

export default {
  name: 'MainStationCard',

  props: {
    hub: {
      type: Object,
      default () {
        return { }
      }
    },
    dataset: {
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
    line_vals () {
      return this.dataset.port_values !== undefined ? this.dataset.port_values : []
    },
    inputs () {
      const lines = this.hub.inputs !== undefined ? this.hub.inputs : []
      const lineInputs = this.oes.data !== undefined ? this.oes.data.inputs : []
      return lines.map(e => ({
        port: e,
        subnet: lineInputs.find(item => e.address === item.devaddr),
        values: this.line_vals.find(item => e.address === item.port)
      }))
    },
    outputs () {
      const lines = this.hub.outputs !== undefined ? this.hub.outputs : []
      const lineOutputs = this.oes.data !== undefined ? this.oes.data.outputs : []
      return lines.map(e => ({
        port: e,
        subnet: lineOutputs.find(item => e.address === item.devaddr),
        values: this.line_vals.find(item => e.address === item.port)
      }))
    },
    tracert () {
      return this.dataset.root_values !== undefined ? this.dataset.root_values : { }
    },
    totals () {
      return this.tracert.totals !== undefined ? this.tracert.totals : { }
    },
    values () {
      return this.tracert.values !== undefined ? this.tracert.values : { }
    },

    carbon_total () {
      return formatValueLocale(this.totals.carbon)
    },
    energy_total () {
      return formatValueLocale(this.totals.energy)
    },
    reserve_total () {
      return formatValueLocale(0)
    },
    generation_total () {
      return formatValueLocale(this.totals.generation)
    },
    debit_total () {
      return roundToTwoAsStr(this.totals.debit)
    },
    credit_total () {
      return roundToTwoAsStr(this.totals.credit)
    },

    carbon () {
      return formatValueLocale(this.values.carbon)
    },
    energy () {
      return formatValueLocale(this.values.energy)
    },
    reserve () {
      return formatValueLocale(0)
    },
    generation () {
      return formatValueLocale(this.values.generation)
    },
    debit () {
      return roundToTwoAsStr(this.values.debit)
    },
    credit () {
      return roundToTwoAsStr(this.values.credit)
    }
  },

  methods: {
    getPortClass (port) {
      return port.on ? 'px-2 py-1 mx-1 mb-1 blue white--text' : 'px-2 py-1 mx-1 mb-1 blue-grey white--text'
    },
    numberAsString (v) {
      return formatValueLocale(v)
    }
  }
}
</script>

<style scoped>
.small-text {
  font-size: small;
}
</style>
