<template>
  <div>
    <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
      Лоты
    </div>
    <v-card
      v-if="generators.length !== 0"
      flat
    >
      <v-card-subtitle>Генераторы</v-card-subtitle>
      <div class="d-flex flex-wrap">
        <GeneratorCardComponent
          v-for="item in generators"
          :key="item.identy"
          :generator="item"
        />
      </div>
    </v-card>

    <v-card
      v-if="storages.length !== 0"
      flat
    >
      <v-card-subtitle>Хранение</v-card-subtitle>
      <div class="d-flex flex-wrap">
        <StorageCardComponent
          v-for="item in storages"
          :key="item.identy"
          :generator="item"
        />
      </div>
    </v-card>

    <v-card
      v-if="greengeneators.length !== 0"
      flat
    >
      <v-card-subtitle>Альтернативная генерация</v-card-subtitle>
      <div
        v-for="item in greengeneators"
        :key="item.itemgroup.value"
      >
        <div class="text-subtitle-2 white--text light-green accent-4 px-2 py-1 d-inline-flex">
          {{ item.itemgroup.text }}
        </div>
        <div class="d-flex flex-wrap">
          <component
            :is="tempates[element.data.generation_type]"
            v-for="element in item.items"
            :key="element.identy"
            :generator="element"
          />
        </div>
      </div>
    </v-card>

    <p v-if="notFound">
      элементы генерации не найдены
    </p>

    <div v-if="unsoldExists">
      <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
        Отказники
      </div>
      <div v-if="unsoldGenerators.length !== 0">
        <div class="text-subtitle-2 white--text light-green accent-4 px-2 py-1 d-inline-flex">
          Генераторы
        </div>
        <div class="d-flex flex-wrap">
          <div
            v-for="item in unsoldGenerators"
            :key="item.identy"
          >
            <GenerationShortCard :oes="item" />
          </div>
        </div>
      </div>
      <div v-if="unsoldStorages.length !== 0">
        <div class="text-subtitle-2 white--text light-green accent-4 px-2 py-1 d-inline-flex">
          Хранение
        </div>
        <div class="d-flex flex-wrap">
          <div
            v-for="item in unsoldStorages"
            :key="item.identy"
          >
            <GenerationShortCard :oes="item" />
          </div>
        </div>
      </div>
      <div v-if="unsoldSolars.length !== 0">
        <div class="text-subtitle-2 white--text light-green accent-4 px-2 py-1 d-inline-flex">
          Солнечная электростанция
        </div>
        <div class="d-flex flex-wrap">
          <div
            v-for="item in unsoldSolars"
            :key="item.identy"
          >
            <GenerationShortCard :oes="item" />
          </div>
        </div>
      </div>
      <div v-if="unsoldWinds.length !== 0">
        <div class="text-subtitle-2 white--text light-green accent-4 px-2 py-1 d-inline-flex">
          Ветрогенерация
        </div>
        <div class="d-flex flex-wrap">
          <div
            v-for="item in unsoldWinds"
            :key="item.identy"
          >
            <GenerationShortCard :oes="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GeneratorCardComponent from '~/components/gamecontrol/generator-card.vue'
import StorageCardComponent from '~/components/gamecontrol/storage-card.vue'
import SolarCardComponent from '~/components/gamecontrol/solar-card.vue'
import WindCardComponent from '~/components/gamecontrol/wind-card.vue'
import GenerationShortCard from '~/components/gamecontrol/generation-short-card.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,
  ALTERNATION_BY_TYPES,
  ESO_GREENGENERATION_TYPE_SOLAR,
  ESO_GREENGENERATION_TYPE_WIND
} from '~/assets/helpers'

export default {
  name: 'AuctionLotsViewer',

  components: {
    GeneratorCardComponent,
    StorageCardComponent,
    SolarCardComponent,
    WindCardComponent,
    GenerationShortCard
  },

  data: () => ({
    tempates: {
      SOLAR: SolarCardComponent,
      WIND: WindCardComponent
    }
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
    generators () {
      return this.resourceGenerators.filter(e => this.auctionLots.includes(e.devaddr))
    },
    greengeneators () {
      return ALTERNATION_BY_TYPES.map(e => ({
        itemgroup: e,
        items: this.resourceAlternations.filter(el => el.data.generation_type === e.value && this.auctionLots.includes(el.devaddr))
      })).filter(e => e.items.length !== 0)
    },
    storages () {
      return this.resourceStorages.filter(e => this.auctionLots.includes(e.devaddr))
    },
    notFound () {
      return this.generators.length === 0 &&
      this.storages.length === 0 &&
      this.greengeneators.length === 0
    },
    auctionUnsolds () {
      return this.$store.state.game.auction !== undefined && this.$store.state.game.auction.unsolds !== undefined
        ? this.$store.state.game.auction.unsolds
        : []
    },
    unsoldGenerators () {
      return this.resourceGenerators.filter(e => this.auctionUnsolds.includes(e.devaddr))
    },
    unsoldAlternations () {
      return this.resourceAlternations.filter(e => this.auctionUnsolds.includes(e.devaddr))
    },
    unsoldSolars () {
      return this.resourceAlternations.filter(e => e.data.generation_type === ESO_GREENGENERATION_TYPE_SOLAR)
    },
    unsoldWinds () {
      return this.resourceAlternations.filter(e => e.data.generation_type === ESO_GREENGENERATION_TYPE_WIND)
    },
    unsoldStorages () {
      return this.resourceStorages.filter(e => this.auctionUnsolds.includes(e.devaddr))
    },
    unsoldExists () {
      return this.unsoldGenerators.length !== 0 || this.unsoldAlternations.length !== 0 || this.unsoldStorages.length !== 0
    }
  }
}
</script>
