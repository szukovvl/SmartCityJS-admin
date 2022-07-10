<template>
  <v-card>
    <v-toolbar
      outlined
      flat
    >
      <v-toolbar-title>Объекты энергосистемы</v-toolbar-title>
      <v-spacer />
      <v-select
        v-model="selectedType"
        :items="objectTypes"
        dense
        return-object
      />
      <v-spacer />
      <v-select
        v-if="extSelection"
        v-model="extSelected"
        :items="extSelections"
        dense
        return-object
      />
    </v-toolbar>
    <v-card-text>
      <div v-if="resultItems !== undefined && resultItems.length !== 0">
        <div
          v-for="(item, index) in resultItems"
          :key="item.identy"
        >
          <v-divider v-if="index != 0" />
          <v-container fluid>
            <component :is="tempates[item.componentType]" :element="item" />
          </v-container>
        </div>
      </div>
      <div v-else>
        <v-skeleton-loader
          boilerplate
          type="table-heading, list-item-two-line"
        />
        <div class="grey--text text--lighten-1 ms-4 text-h5 d-flex justify-center font-weight-medium">
          список не содержит элементов
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { CONSUMER_BY_TYPES, ALTERNATION_BY_TYPES, API_ENERGY_SERVICE_FIND } from '~/assets/helpers'
import ConsumerObjet from '~/components/energy/consumer.vue'
import DistributorObjet from '~/components/energy/distributor.vue'
import GeneratorObjet from '~/components/energy/generator.vue'
import StorageObjet from '~/components/energy/storage.vue'
import AlternateObjet from '~/components/energy/alternate.vue'
import MainStationObjet from '~/components/energy/main-station.vue'

export default {
  name: 'PowerSystemComponent',

  components: { ConsumerObjet, DistributorObjet, GeneratorObjet, StorageObjet, AlternateObjet, MainStationObjet },

  data: () => ({
    objectTypes: [
      { text: 'потребители', value: 'CONSUMER' },
      { text: 'генераторы', value: 'GENERATOR' },
      { text: 'хранение', value: 'STORAGE' },
      { text: 'альтернативная энергетика', value: 'GREEGENERATOR' },
      { text: 'мини-подстанции', value: 'DISTRIBUTOR' },
      { text: 'главная подстанция', value: 'MAINSUBSTATION' }
    ],
    selectedType: undefined,
    extSelection: false,
    extSelected: undefined,
    extSelections: undefined,
    cachedItems: undefined,
    resultItems: undefined,
    tempates: {
      CONSUMER: ConsumerObjet,
      GENERATOR: GeneratorObjet,
      DISTRIBUTOR: DistributorObjet,
      STORAGE: StorageObjet,
      GREEGENERATOR: AlternateObjet,
      MAINSUBSTATION: MainStationObjet
    }
  }),

  watch: {
    selectedType (newval, oldval) {
      if (newval !== undefined) {
        this.extSelection = newval.value === 'CONSUMER' || newval.value === 'GREEGENERATOR'
        if (newval.value === 'CONSUMER') {
          this.extSelected = undefined
          this.extSelections = CONSUMER_BY_TYPES
          this.extSelected = this.extSelections[0]
        } else if (newval.value === 'GREEGENERATOR') {
          this.extSelected = undefined
          this.extSelections = ALTERNATION_BY_TYPES
          this.extSelected = this.extSelections[0]
        } else {
          this.extSelected = undefined
          this.extSelections = undefined
        }

        this.cachedItems = undefined
        this.$axios.$get(API_ENERGY_SERVICE_FIND + '/' + newval.value, { progress: false })
          .then((v) => {
            this.cachedItems = v
            if (this.extSelected !== undefined) {
              this.resultItems = this.filterByExtension(this.cachedItems, this.selectedType.value, this.extSelected.value)
            } else {
              this.resultItems = this.cachedItems
            }
          })
          .catch(() => {
            this.resultItems = undefined
          })
      } else {
        this.extSelection = false
      }
    },
    extSelected (newval, oldval) {
      if (newval !== undefined && this.cachedItems !== undefined) {
        this.resultItems = this.filterByExtension(this.cachedItems, this.selectedType.value, newval.value)
      }
    }
  },

  created () {
    this.selectedType = this.objectTypes[0]
  },

  methods: {
    filterByExtension (items, maintype, exttype) {
      if (maintype === 'CONSUMER') {
        return items.filter(e => e.data.consumertype === exttype)
      }
      return items.filter(e => e.data.generation_type === exttype)
    }
  }
}
</script>
