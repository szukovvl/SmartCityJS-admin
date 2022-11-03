<template>
  <div class="d-flex">
    <div
      v-for="item in missedItems"
      :key="item.devaddr"
    >
      <UnusedDeviceCard
        class="ma-1"
        :device="item"
        :lots="data.adevices"
      />
    </div>
  </div>
</template>

<script>
import UnusedDeviceCard from '~/components/gameprocess/unused-device-card.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,
  ESO_CONSUMER_TYPE,
  ESO_DISTRIBUTOR_TYPE
} from '~/assets/helpers'

export default {
  name: 'UnusedDevicesPanel',

  components: { UnusedDeviceCard },

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
    consumers () {
      const items = this.$store.state.game.gameResources[ESO_CONSUMER_TYPE]
      return items !== undefined ? items : []
    },
    distributors () {
      const items = this.$store.state.game.gameResources[ESO_DISTRIBUTOR_TYPE]
      return items !== undefined ? items : []
    },

    oesItems () {
      return this.distributors.concat(
        this.resourceGenerators,
        this.resourceAlternations,
        this.resourceStorages,
        this.consumers
      )
    },
    missedItems () {
      const items = this.data.udevices !== undefined ? this.data.udevices : []
      return this.oesItems.filter(e => items.includes(e.devaddr))
    }
  },

  created () {
  }
}
</script>
