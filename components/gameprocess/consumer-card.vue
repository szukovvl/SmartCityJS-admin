<template>
  <v-card
    color="amber lighten-4"
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
    <v-card-title class="d-flex flex-nowrap text-no-wrap blue-grey--text">
      <v-avatar
        class="mr-2"
        tile
        color="blue-grey"
      >
        <v-icon dark>
          {{ avatar }}
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
          color="indigo"
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
          color="indigo"
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
  </v-card>
</template>

<script>
import {
  ESO_CONSUMER_TYPE_HOSPITAL,
  ESO_CONSUMER_TYPE_INDUSTRY
} from '~/assets/helpers'

export default {
  name: 'ConsumerCadr',

  props: {
    device: {
      type: Object,
      default () {
        return { }
      }
    },
    ports: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data: () => ({
  }),

  computed: {
    oes () {
      return this.device.oes !== undefined ? this.device.oes : { }
    },
    avatar () {
      if (this.device.oes !== undefined) {
        switch (this.device.oes.data.consumertype) {
          case ESO_CONSUMER_TYPE_INDUSTRY: return 'mdi-factory'
          case ESO_CONSUMER_TYPE_HOSPITAL: return 'mdi-hospital-building'
          default: return 'mdi-home-city'
        }
      }
      return 'mdi-timeline-question-outline'
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
    }
  }
}
</script>

<style scoped>
.small-text {
  font-size: small;
}
</style>
