<template>
  <div>
    <div
      v-if="purchasedLots.length !== 0"
      class="d-flex flex-wrap"
    >
      <v-card
        v-for="item in purchasedLots"
        :key="item.oes.identy"
        class="mt-1"
        outlined
      >
        <v-card-text class="pa-0 mt-1 mx-1 text-h6 text-center font-weight-medium">
          {{ item.price }}
          <v-icon small>
            mdi-currency-rub
          </v-icon>
        </v-card-text>
        <v-card-text class="pa-0">
          <GenerationShortCard :oes="item.oes" />
        </v-card-text>
      </v-card>
    </div>
    <div
      v-else
      class="text-center mt-1 mx-1"
    >
      объекты не найдены
    </div>
  </div>
</template>

<script>
import GenerationShortCard from '~/components/gamecontrol/generation-short-card.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,

  roundToTwoAsStr
} from '~/assets/helpers'

export default {
  name: 'AuctionGamerLots',

  components: { GenerationShortCard },

  props: {
    gamerKey: {
      type: Number,
      required: true
    }
  },

  data: () => ({
  }),

  computed: {
    gamerLots () {
      const gamers = this.$store.state.game.auction.gamer
      const item = gamers !== undefined ? gamers.find(e => e.key === this.gamerKey) : undefined
      return item !== undefined ? item.lots : []
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
    purchasedLots () {
      return this.gamerLots.map(e => ({
        oesKey: e.key,
        price: roundToTwoAsStr(e.price),
        oes: this.allGenerators.find(item => item.devaddr === e.key)
      })).filter(e => e.oes !== undefined)
    }
  }
}
</script>
