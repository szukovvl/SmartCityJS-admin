<template>
  <div>
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
      />
    </div>
    <MainStationCard :hub="data.root" />
  </div>
</template>

<script>
import InformationPanel from '~/components/gameprocess/info-panel.vue'
import UnusedDevicesPanel from '~/components/gameprocess/unused-panel.vue'
import MainStationCard from '~/components/gameprocess/main-station-card.vue'
import GeneratorCard from '~/components/gameprocess/generator-card.vue'
import {
  ESO_GENERATOR_TYPE,
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_CONSUMER_TYPE,
  ESO_DISTRIBUTOR_TYPE
} from '~/assets/helpers'

export default {
  name: 'GamerAreaComponent',

  components: {
    InformationPanel,
    UnusedDevicesPanel,
    MainStationCard,
    GeneratorCard
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
    distributors () {
      const items = this.$store.state.game.gameResources[ESO_DISTRIBUTOR_TYPE]
      return items !== undefined ? items : []
    },
    allOes () {
      return this.allGenerators.concat(this.consumers, this.distributors)
    },
    extDevices () {
      return this.devices.map(e => ({
        hub: e,
        oes: this.allGenerators.find(a => a.devaddr === e.address)
      })).filter(e => e.oes !== undefined)
    },
    generators () {
      return this.extDevices.filter(e => e.oes.componentType === ESO_GENERATOR_TYPE ||
        e.oes.componentType === ESO_GREEGENERATOR_TYPE ||
        e.oes.componentType === ESO_STORAGE_TYPE)
    }
  },

  created () {
  }
}
</script>
