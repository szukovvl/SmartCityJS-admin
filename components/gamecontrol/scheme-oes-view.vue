<template>
  <div class="d-flex blue-grey lighten-4 py-2">
    <SchemeMissedOesCard
      v-for="item in missedItems"
      :key="item.identy"
      class="ma-1"
      :oes="item"
    />
  </div>
</template>

<script>
import SchemeMissedOesCard from '~/components/gamecontrol/scheme-missed-oes-card.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,
  ESO_CONSUMER_TYPE,
  ESO_DISTRIBUTOR_TYPE
} from '~/assets/helpers'

export default {
  name: 'SchemeOesView',

  components: { SchemeMissedOesCard },

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
      const items = this.data.missed !== undefined ? this.data.missed : []
      return this.oesItems.filter(e => items.includes(e.devaddr))
    }
  }
}
</script>
