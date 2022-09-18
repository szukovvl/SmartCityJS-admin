<template>
  <div>
    <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
      Доступные лоты
    </div>
    <div
      v-if="generatorLots.length !== 0"
      class="d-flex flex-wrap"
    >
      <GenerationShortCard
        v-for="item in generatorLots"
        :key="item.identy"
        :oes="item"
      />
    </div>
    <div v-else>
      нет доступных лотов
    </div>

    <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
      Лот торга
    </div>

    <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
      Отказники
    </div>
  </div>
</template>

<script>
import GenerationShortCard from '~/components/gamecontrol/generation-short-card.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE
} from '~/assets/helpers'

export default {
  name: 'AuctionSaleViewer',

  components: {
    GenerationShortCard
  },

  data: () => ({
  }),

  computed: {
    auctionLots () {
      return this.$store.state.game.auction !== undefined && this.$store.state.game.auction.lots !== undefined
        ? this.$store.state.game.auction.lots
        : []
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
      return this.resourceGenerators.concat(this.resourceAlternations, this.resourceStorages)
    },
    generatorLots () {
      return this.allGenerators.filter(e => this.auctionLots.includes(e.devaddr))
    }
  },

  created () {
    if (process.client) {
      if (this.$store.state.game.auction === undefined || this.$store.state.game.auction.lots === undefined) {
        this.$store.dispatch('game/requestActionData')
      }
    }
  }
}
</script>
