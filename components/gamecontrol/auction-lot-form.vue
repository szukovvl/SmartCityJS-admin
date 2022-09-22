<template>
  <v-card outlined>
    <div class="d-flex flex-wrap justify-space-around">
      <v-card flat>
        <v-card-text v-if="hasAdmin">
          <div>
            <v-btn
              v-if="lot === undefined"
              class="ma-2"
              color="info"
              :disabled="!putEnabled"
              @click="putLot"
            >
              Выставить лот
            </v-btn>
          </div>
          <div>
            <v-btn
              v-if="lot !== undefined"
              class="ma-2"
              color="warning"
              :disabled="!cancelEnabled"
              @click="cancelLot"
            >
              Прервать торги
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-card flat>
        <div v-if="oes !== undefined">
          <div class="d-flex flex-row">
            <h2 v-if="lotTime !== undefined">
              {{ lotTime }} сек.
            </h2>
            <v-spacer />
            <h2 v-if="lot !== undefined">
              {{ price }} руб.
            </h2>
          </div>
          <component
            :is="template"
            :generator="oes"
          />
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import SolarCardComponent from '~/components/gamecontrol/solar-card.vue'
import WindCardComponent from '~/components/gamecontrol/wind-card.vue'
import GeneratorCardComponent from '~/components/gamecontrol/generator-card.vue'
import StorageCardComponent from '~/components/gamecontrol/storage-card.vue'
import {
  ESO_GENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GREEGENERATOR_TYPE,
  ESO_GREENGENERATION_TYPE_SOLAR,

  roundToTwoAsStr
} from '~/assets/helpers'

export default {
  name: 'AuctionLotForm',

  components: {
    SolarCardComponent,
    WindCardComponent,
    GeneratorCardComponent,
    StorageCardComponent
  },

  data: () => ({
  }),

  computed: {
    lot () {
      return this.$store.state.game.auction.current
    },
    price () {
      return roundToTwoAsStr(this.lot !== undefined ? this.lot.price : 0)
    },
    settings () {
      return this.$store.state.game.auction.settings
    },
    hasAdmin () {
      return this.$store.state.game.hasAdmin
    },
    putEnabled () {
      return this.$store.state.game.auction.lots !== undefined
        ? this.$store.state.game.auction.lots.length !== 0
        : false
    },
    lotTime () {
      return this.lot !== undefined ? this.$store.state.game.lotTime : undefined
    },
    cancelEnabled () {
      return this.lotTime !== undefined && this.lotTime > 2
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
    oes () {
      return this.lot !== undefined ? this.allGenerators.find(e => e.devaddr === this.lot.key) : undefined
    },
    template () {
      if (this.oes !== undefined) {
        switch (this.oes.componentType) {
          case ESO_STORAGE_TYPE:
            return StorageCardComponent
          case ESO_GREEGENERATOR_TYPE: {
            if (this.oes.data.generation_type === ESO_GREENGENERATION_TYPE_SOLAR) {
              return SolarCardComponent
            }
            return WindCardComponent
          }
          default:
            return GeneratorCardComponent
        }
      }
      return undefined
    }
  },

  created () {
    if (process.client && this.settings === undefined) {
      this.$store.dispatch('game/requestActionData')
    }
  },

  methods: {
    putLot () {
      this.$store.dispatch('game/auctionPutLot')
    },
    cancelLot () {
      this.$store.dispatch('game/auctionCancelLot')
    }
  }
}
</script>
