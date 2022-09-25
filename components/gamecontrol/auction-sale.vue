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

    <div v-if="unsoldsLots.length !== 0">
      <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
        Отказники
      </div>
      <div class="d-flex flex-wrap">
        <GenerationShortCard
          v-for="item in unsoldsLots"
          :key="item.identy"
          :oes="item"
        />
      </div>
    </div>

    <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
      Торги
    </div>

    <AuctionLotForm />

    <v-row class="mt-2">
      <v-col
        v-for="(data, index) in scenesData"
        :key="data.mainstation"
      >
        <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
          {{ 'Игрок ' + (index + 1) }}
        </div>
        <div>
          <AuctionGamerLots :gamer-key="data.mainstation" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GenerationShortCard from '~/components/gamecontrol/generation-short-card.vue'
import AuctionLotForm from '~/components/gamecontrol/auction-lot-form.vue'
import AuctionGamerLots from '~/components/gamecontrol/auction-gamer-lots.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE
} from '~/assets/helpers'

export default {
  name: 'AuctionSaleViewer',

  components: {
    GenerationShortCard,
    AuctionLotForm,
    AuctionGamerLots
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
    },
    unsolds () {
      return this.$store.state.game.auction.unsolds !== undefined
        ? this.$store.state.game.auction.unsolds
        : []
    },
    unsoldsLots () {
      return this.allGenerators.filter(e => this.unsolds.includes(e.devaddr))
    },

    scenesData () {
      const items = this.$store.state.game.scenesData
      return items != null ? items : []
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
