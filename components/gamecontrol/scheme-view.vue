<template>
  <div>
    <div
      v-for="item in unknownOes"
      :key="'u_' + item.hub.address"
    >
      <div class="d-flex justify-center mb-4">
        <SchemeUnknownCadr :hub="item.hub" />
      </div>
    </div>
    <div
      v-for="item in oesDevices"
      :key="'g_' + item.hub.address"
    >
      <div class="d-flex justify-center mb-4">
        {{ item }}
      </div>
    </div>
    <div class="d-flex justify-center">
      <SchemeMainStationCadr :oes="data" />
    </div>
    <p>&nbsp;</p>
    <p>
      {{ data }}
    </p>
    <p>&nbsp;</p>
    <p>
      {{ allPorts }}
    </p>
  </div>
</template>

<script>
import SchemeMainStationCadr from '~/components/gamecontrol/scheme-main-station-card.vue'
import SchemeUnknownCadr from '~/components/gamecontrol/scheme-unknown-card.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,
  ESO_CONSUMER_TYPE,
  ESO_DISTRIBUTOR_TYPE,
  ESO_MAINSTATION_TYPE
} from '~/assets/helpers'

export default {
  name: 'SchemeView',

  components: {
    SchemeMainStationCadr,
    SchemeUnknownCadr
  },

  props: {
    data: {
      type: Object,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  }),

  computed: {
    resourceGenerators () {
      const items = this.$store.state.game.gameResources[ESO_GENERATOR_TYPE]
      return items !== undefined ? items : []
    },
    resourceAlternations () {
      const items = this.$store.state.game.gameResources[ESO_GREEGENERATOR_TYPE]
      return items !== undefined ? items : []
    },
    resourceStorages () {
      const items = this.$store.state.game.gameResources[ESO_STORAGE_TYPE]
      return items !== undefined ? items : []
    },
    allGenerators () {
      return this.resourceGenerators.concat(this.resourceAlternations, this.resourceStorages)
    },

    consumers () {
      const items = this.$store.state.game.gameResources[ESO_CONSUMER_TYPE]
      return items !== undefined ? items : []
    },
    distributors () {
      const items = this.$store.state.game.gameResources[ESO_DISTRIBUTOR_TYPE]
      return items !== undefined ? items : []
    },
    root () {
      const items = this.$store.state.game.gameResources[ESO_MAINSTATION_TYPE]
      if (items !== undefined) {
        return items.find(e => e.devaddr === this.data.address)
      }
      return undefined
    },
    allOes () {
      return this.allGenerators.concat(this.consumers, this.distributors)
    },

    oesDevices () {
      if (this.data.devices === undefined) {
        return []
      }
      return this.data.devices.map(e => ({
        hub: e,
        oes: this.allOes.find(item => item.devaddr === e.address)
      }))
    },
    oesDistributors () {
      return this.oesDevices.filter(e => e.oes !== undefined && e.oes.componentType === ESO_DISTRIBUTOR_TYPE)
    },
    unknownOes () {
      const items = this.oesDevices.filter(e => e.oes === undefined)
      items.forEach((e) => {
        const ports = []
        e.hub.inputs.forEach((conn) => {
          ports.push(this.allPorts.find(a => a.address === conn.address))
        })
        e.ports = ports
      })
      return items
    },

    subnets () {
      const items = []
      if (this.root !== undefined) {
        this.root.data.inputs.forEach(e => items.push({
          subnet: e,
          owner: this.root
        }))
        this.root.data.outputs.forEach(e => items.push({
          subnet: e,
          owner: this.root
        }))
      }
      this.oesDistributors.forEach((e) => {
        e.data.outputs.forEach(item => items.push({
          subnet: item,
          owner: e
        }))
      })
      return items
    },
    inputPorts () {
      const ports = []
      if (this.data.inputs !== undefined) {
        this.data.inputs.filter(e => e.connections !== undefined).forEach((e) => {
          e.connections.forEach((conn) => {
            ports.push({
              address: conn.address,
              hub: this.data,
              subnet: this.subnets.find(l => l.devaddr === e.address)
            })
          })
        })
      }
      return ports
    },
    outputPorts () {
      const ports = []
      if (this.data.outputs !== undefined) {
        this.data.outputs.filter(e => e.connections !== undefined).forEach((e) => {
          e.connections.forEach((conn) => {
            ports.push({
              address: conn.address,
              hub: this.data,
              subnet: this.subnets.find(l => l.subnet.devaddr === e.address)
            })
          })
        })
      }
      return ports
    },
    allPorts () {
      return this.inputPorts.concat(this.outputPorts)
    }
  }
}
</script>
