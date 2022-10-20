<template>
  <div>
    <div
      v-for="item in unknownOes"
      :key="'u_' + item.hub.address"
    >
      <div class="d-flex justify-center mb-4">
        <SchemeUnknownCadr :hub="item" />
      </div>
    </div>
    <div>
      {{ oesDevices }}
    </div>
    <div>
      {{ generatorsOes }}
    </div>
    <div
      v-for="item in generatorsOes"
      :key="'g_' + item.hub.address"
    >
      <div class="d-flex justify-center mb-4">
        <SchemeGeneratorCadr :hub="item" />
      </div>
    </div>
    <div class="d-flex justify-center">
      <SchemeMainStationCadr :oes="data" />
    </div>
    <div
      v-for="item in industryOes"
      :key="'i_' + item.hub.address"
    >
      <div class="d-flex justify-center mb-4">
        <SchemeUnknownCadr :hub="item" />
      </div>
    </div>
    <div
      v-for="item in hospitalOes"
      :key="'h_' + item.hub.address"
    >
      <div class="d-flex justify-center mb-4">
        <SchemeUnknownCadr :hub="item" />
      </div>
    </div>
    <div
      v-for="item in districtOes"
      :key="'d_' + item.hub.address"
    >
      <div class="d-flex justify-center mb-4">
        <SchemeUnknownCadr :hub="item" />
      </div>
    </div>
  </div>
</template>

<script>
import SchemeMainStationCadr from '~/components/gamecontrol/scheme-main-station-card.vue'
import SchemeUnknownCadr from '~/components/gamecontrol/scheme-unknown-card.vue'
import SchemeGeneratorCadr from '~/components/gamecontrol/scheme-generator-card.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,
  ESO_CONSUMER_TYPE,
  ESO_DISTRIBUTOR_TYPE,
  ESO_MAINSTATION_TYPE,
  ESO_CONSUMER_TYPE_INDUSTRY,
  ESO_CONSUMER_TYPE_HOSPITAL,
  ESO_CONSUMER_TYPE_DISTRICT
} from '~/assets/helpers'

export default {
  name: 'SchemeView',

  components: {
    SchemeMainStationCadr,
    SchemeUnknownCadr,
    SchemeGeneratorCadr
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
      const devs = []
      items.forEach((hub) => {
        const ports = []
        hub.hub.inputs.forEach((port) => {
          ports.push(this.allPorts.find(a => a.portaddr === port.address))
        })
        devs.push({
          hub: hub.hub,
          oes: undefined,
          ports: ports.filter(a => a !== undefined)
        })
      })
      return devs
    },
    industryOes () {
      const items = this.oesDevices
        .filter(e => e.oes !== undefined && e.oes.componentType === ESO_CONSUMER_TYPE)
        .filter(e => e.oes.data.consumertype === ESO_CONSUMER_TYPE_INDUSTRY)
      const devs = []
      items.forEach((hub) => {
        const ports = []
        hub.hub.inputs.forEach((port) => {
          ports.push(this.allPorts.find(a => a.portaddr === port.address))
        })
        devs.push({
          hub: hub.hub,
          oes: undefined,
          ports: ports.filter(a => a !== undefined)
        })
      })
      return devs
    },
    hospitalOes () {
      const items = this.oesDevices
        .filter(e => e.oes !== undefined && e.oes.componentType === ESO_CONSUMER_TYPE)
        .filter(e => e.oes.data.consumertype === ESO_CONSUMER_TYPE_HOSPITAL)
      const devs = []
      items.forEach((hub) => {
        const ports = []
        hub.hub.inputs.forEach((port) => {
          ports.push(this.allPorts.find(a => a.portaddr === port.address))
        })
        devs.push({
          hub: hub.hub,
          oes: undefined,
          ports: ports.filter(a => a !== undefined)
        })
      })
      return devs
    },
    districtOes () {
      const items = this.oesDevices
        .filter(e => e.oes !== undefined && e.oes.componentType === ESO_CONSUMER_TYPE)
        .filter(e => e.oes.data.consumertype === ESO_CONSUMER_TYPE_DISTRICT)
      const devs = []
      items.forEach((hub) => {
        const ports = []
        hub.hub.inputs.forEach((port) => {
          ports.push(this.allPorts.find(a => a.portaddr === port.address))
        })
        devs.push({
          hub: hub.hub,
          oes: undefined,
          ports: ports.filter(a => a !== undefined)
        })
      })
      return devs
    },
    generatorsOes () {
      const items = this.oesDevices
        .filter(e => e.oes !== undefined && e.oes.componentType === ESO_GENERATOR_TYPE)
        .concat(
          this.oesDevices
            .filter(e => e.oes !== undefined && e.oes.componentType === ESO_GREEGENERATOR_TYPE),
          this.oesDevices
            .filter(e => e.oes !== undefined && e.oes.componentType === ESO_STORAGE_TYPE)
        )
      const devs = []
      items.forEach((hub) => {
        const ports = []
        hub.hub.inputs.forEach((port) => {
          ports.push(this.allPorts.find(a => a.portaddr === port.address))
        })
        devs.push({
          hub: hub.hub,
          oes: undefined,
          ports: ports.filter(a => a !== undefined)
        })
      })
      return devs
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
      return this.buildExtConnections(this.data.inputs)
    },
    outputPorts () {
      return this.buildExtConnections(this.data.outputs)
    },
    allPorts () {
      return this.inputPorts.concat(this.outputPorts)
    }
  },

  methods: {
    buildExtConnections (items) {
      const ports = []
      if (items !== undefined) {
        items
          .filter(e => e.connections !== undefined)
          .forEach((e) => {
            e.connections.forEach((conn) => {
              ports.push({
                portaddr: conn.address, // адрес порта подключенного устройства
                oesport: e, // порт-подключения устройства-владельца
                owndata: this.subnets
                  .find(l => l.subnet.devaddr === e.address) // владелец (устройство и подсеть)
              })
            })
          })
      }
      return ports
    }
  }
}
</script>
