<template>
  <div>
    <div>{{ sss.toLocaleTimeString() }}</div>
    <InformationPanel :data="data" />
    <UnusedDevicesPanel
      v-if="data.udevices !== undefined && data.udevices.length !== 0"
      :data="data"
    />
    <div class="d-flex justify-center">
      <GeneratorCard
        v-for="item in generators"
        :key="item.hub.address"
        class="ma-2"
        :device="item"
        :ports="allPorts"
      />
    </div>
    <MainStationCard :hub="data.root" />
    <v-row cols="3">
      <v-col>
        <ConsumerCadr
          v-for="item in hospitals"
          :key="'h_' + item.hub.address"
          class="ma-2"
          :device="item"
          :ports="allPorts"
        />
      </v-col>
      <v-col>
        <ConsumerCadr
          v-for="item in industries"
          :key="'i_' + item.hub.address"
          class="ma-2"
          :device="item"
          :ports="allPorts"
        />
      </v-col>
      <v-col>
        <v-row class="mt-1">
          <DistributorCadr
            v-for="item in distributors"
            :key="'i_' + item.hub.address"
            class="ma-2"
            :device="item"
            :ports="allPorts"
          />
        </v-row>
        <v-row>
          <ConsumerCadr
            v-for="item in districts"
            :key="'i_' + item.hub.address"
            class="ma-2"
            :device="item"
            :ports="allPorts"
          />
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import InformationPanel from '~/components/gameprocess/info-panel.vue'
import UnusedDevicesPanel from '~/components/gameprocess/unused-panel.vue'
import MainStationCard from '~/components/gameprocess/main-station-card.vue'
import GeneratorCard from '~/components/gameprocess/generator-card.vue'
import ConsumerCadr from '~/components/gameprocess/consumer-card.vue'
import DistributorCadr from '~/components/gameprocess/distributor-card.vue'
import {
  ESO_GENERATOR_TYPE,
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_CONSUMER_TYPE,
  ESO_DISTRIBUTOR_TYPE,
  ESO_MAINSTATION_TYPE,
  ESO_CONSUMER_TYPE_HOSPITAL,
  ESO_CONSUMER_TYPE_INDUSTRY,
  ESO_CONSUMER_TYPE_DISTRICT
} from '~/assets/helpers'

export default {
  name: 'GamerAreaComponent',

  components: {
    InformationPanel,
    UnusedDevicesPanel,
    MainStationCard,
    GeneratorCard,
    ConsumerCadr,
    DistributorCadr
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
    gameDataset () {
      const item = this.$store.state.game.datasets.find(e => e.key === this.data.root.address)
      return item !== undefined ? item : { }
    },
    seconds () {
      return this.gameDataset.seconds
    },
    sss () {
      const dataobj = new Date()
      dataobj.setSeconds(this.seconds)
      return dataobj
    },
    devices () {
      return this.data.root !== undefined && this.data.root.devices !== undefined ? this.data.root.devices : []
    },
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
      return this.resourceGenerators.concat(
        this.resourceAlternations,
        this.resourceStorages
      )
    },
    consumers () {
      const items = this.$store.state.game.gameResources[ESO_CONSUMER_TYPE]
      return items !== undefined ? items : []
    },
    substations () {
      const items = this.$store.state.game.gameResources[ESO_DISTRIBUTOR_TYPE]
      return items !== undefined ? items : []
    },
    allOes () {
      return this.allGenerators.concat(this.consumers, this.substations, this.substations)
    },
    extDevices () {
      return this.devices.map(e => ({
        hub: e,
        oes: this.allOes.find(a => a.devaddr === e.address)
      })).filter(e => e.oes !== undefined)
    },
    generators () {
      return this.extDevices.filter(e => e.oes.componentType === ESO_GENERATOR_TYPE ||
        e.oes.componentType === ESO_GREEGENERATOR_TYPE ||
        e.oes.componentType === ESO_STORAGE_TYPE)
    },
    hospitals () {
      return this.extDevices.filter(e => e.oes.componentType === ESO_CONSUMER_TYPE &&
        e.oes.data.consumertype === ESO_CONSUMER_TYPE_HOSPITAL)
    },
    industries () {
      return this.extDevices.filter(e => e.oes.componentType === ESO_CONSUMER_TYPE &&
        e.oes.data.consumertype === ESO_CONSUMER_TYPE_INDUSTRY)
    },
    districts () {
      return this.extDevices.filter(e => e.oes.componentType === ESO_CONSUMER_TYPE &&
        e.oes.data.consumertype === ESO_CONSUMER_TYPE_DISTRICT)
    },
    distributors () {
      return this.extDevices.filter(e => e.oes.componentType === ESO_DISTRIBUTOR_TYPE)
    },

    mainstation () {
      const items = this.$store.state.game.gameResources[ESO_MAINSTATION_TYPE]
      if (items !== undefined) {
        return items.find(e => e.devaddr === this.data.root.address)
      }
      return undefined
    },
    oesLines () {
      let lines = []
      if (this.mainstation !== undefined) {
        lines = this.mainstation.data.inputs.concat(this.mainstation.data.outputs)
      }
      return lines.concat(this.extDevices
        .filter(e => e.oes.componentType === ESO_DISTRIBUTOR_TYPE)
        .flatMap(e => e.oes.data.outputs))
    },
    connections () {
      let items = []
      if (this.data.root !== undefined) {
        items = this.data.root.inputs.concat(this.data.root.outputs)
      }
      return items.concat(this.extDevices
        .filter(e => e.oes.componentType === ESO_DISTRIBUTOR_TYPE)
        .flatMap(e => e.hub.outputs))
    },
    allPorts () {
      return this.connections.flatMap((e) => {
        if (e.connections !== undefined) {
          return e.connections.map(item => ({
            ownport: e,
            ownsubnet: this.oesLines.find(line => line.devaddr === e.address),
            port: item
          }))
        }
        return []
      })
    }
  },

  created () {
  }
}
</script>
