<template>
  <v-card
    color="brown lighten-4"
    outlined
  >
    <div class="d-inline-flex">
      <div
        v-for="port in device.hub.inputs"
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
        color="blue-grey"
      >
        <v-icon dark>
          mdi-home-lightning-bolt
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
    <div class="d-inline-flex">
      <div
        v-for="line in outputs"
        :key="line.port.address"
        :class="getPortClass(line.port)"
      >
        <div>
          {{ line.subnet !== undefined ? line.subnet.identy : '' }}
        </div>
        <div class="d-flex flex-nowrap white black--text">
          <v-icon
            small
            color="orange"
          >
            mdi-power-plug-outline
          </v-icon>
          <div class="ml-1 small-text">
            <div>{{ numberAsString(line.values !== undefined ? line.values.totals.energy : 0.0) }}</div>
            <div class="indigo--text text--accent-4">
              {{ numberAsString(line.values !== undefined ? line.values.values.energy : 0.0) }}
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
  formatValueLocale
} from '~/assets/helpers'

export default {
  name: 'DistributorCadr',

  props: {
    device: {
      type: Object,
      default () {
        return { hub: { } }
      }
    },
    ports: {
      type: Array,
      default () {
        return []
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
      return this.device.oes !== undefined ? this.device.oes : { }
    },
    line_vals () {
      return this.dataset.port_values !== undefined ? this.dataset.port_values : []
    },
    outputs () {
      const lines = this.device.hub.outputs !== undefined ? this.device.hub.outputs : []
      const lineOutputs = this.device.oes.data !== undefined ? this.device.oes.data.outputs : []
      return lines.map(e => ({
        port: e,
        subnet: lineOutputs.find(item => e.address === item.devaddr),
        values: this.line_vals.find(item => e.address === item.port)
      }))
    },

    tracert () {
      return this.dataset.hub_values !== undefined ? this.dataset.hub_values : []
    },
    totals () {
      const item = this.tracert.find(e => e.hub === this.device.hub.address)
      return item !== undefined ? item.totals : { }
    },
    values () {
      const item = this.tracert.find(e => e.hub === this.device.hub.address)
      return item !== undefined ? item.values : { }
    },

    carbon_total () {
      return formatValueLocale(this.totals.carbon, 3)
    },
    energy_total () {
      return formatValueLocale(this.totals.energy, 3)
    },
    reserve_total () {
      return formatValueLocale(this.totals.reserve_generation, 3)
    },
    generation_total () {
      return formatValueLocale(this.totals.generation, 3)
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
      return formatValueLocale(this.values.reserve_generation)
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
      return port.on ? 'px-2 py-1 mx-1 mt-1 white--text blue' : 'px-2 py-1 mx-1 mt-1 white--text blue-grey'
    },
    getPortName (port) {
      const fnd = this.ports.find(e => e.port.address === port.address)
      if (fnd !== undefined && fnd.ownsubnet !== undefined) {
        return fnd.ownsubnet.identy
      }
      return '#' + this.device.oes !== undefined ? this.device.oes.identy : port.address
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
