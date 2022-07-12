<template>
  <v-card>
    <v-toolbar
      outlined
      flat
    >
      <v-toolbar-title>Шаблоны прогнозов</v-toolbar-title>
      <v-tooltip right>
        <template #activator="{ on, attrs }">
          <v-icon
            class="align-self-start mt-3"
            color="blue"
            small
            v-bind="attrs"
            v-on="on"
          >
            mdi-help-circle-outline
          </v-icon>
        </template>
        <p class="px-0 ma-0 py-2">
          Определяет поведение объекта во времени. Используется в игровом сценарии.
        </p>
      </v-tooltip>
      <v-spacer />
      <v-select
        v-model="selectedType"
        :items="objectTypes"
        dense
        return-object
      />
      <v-spacer />
      <v-btn
        icon
        color="primary"
        @click="createNew"
      >
        <v-icon>
          mdi-file-document-plus-outline
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <div v-if="resultItems !== undefined && resultItems.length !== 0">
        <div
          v-for="(item, index) in resultItems"
          :key="'f_' + (index + 1)"
        >
          <v-divider v-if="index != 0" />
          <v-container fluid>
            <ForecastCard :element="item" :remove-item="onRemoveItem" />
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
import { API_ENERGY_SERVICE_FORECAST, API_FORECAST_SERVICE } from '~/assets/helpers'
import ForecastCard from '~/components/forecast/forecast-card.vue'

export default {
  name: 'ForecastComponent',

  components: { ForecastCard },

  data: () => ({
    objectTypes: [
      { text: 'генераторы', value: 'GENERATOR' },
      { text: 'потребители', value: 'CONSUMER' },
      { text: 'эмитатор ветра', value: 'WIND' },
      { text: 'эмитатор солнца', value: 'SUN' }
    ],
    selectedType: undefined,
    resultItems: undefined,
    toscroll: false,
    scrolloptions: {
      duration: 900,
      offset: 0
      // easing: this.easing,
    },
    scrolltarget: Number(9999)
  }),

  watch: {
    selectedType (newval, oldval) {
      if (newval !== undefined) {
        this.$axios.$get(API_ENERGY_SERVICE_FORECAST + '/' + this.selectedType.value, { progress: false })
          .then((v) => {
            this.resultItems = v
          })
          .catch(() => {
            this.resultItems = undefined
          })
      }
    }
  },

  created () {
    this.selectedType = this.objectTypes[0]
  },
  updated () {
    if (this.toscroll) {
      this.toscroll = false
      this.$vuetify.goTo(this.scrolltarget, this.scrolloptions)
    }
  },

  methods: {
    createNew () {
      if (this.resultItems === undefined) {
        this.resultItems = []
      }
      if (this.resultItems.find(i => i.id < 0) === undefined) {
        this.toscroll = true
        this.resultItems.push({
          id: -1,
          name: undefined,
          fc_type: this.selectedType.value,
          data: []
        })
      }
    },
    onRemoveItem (id) {
      const index = this.resultItems.findIndex(e => e.id === id)
      if (index < 0) {
        return
      }
      this.$axios.$delete(API_FORECAST_SERVICE + '/' + id, { progress: false })
        // .then((v) => {})
        .catch((error) => {
          /* eslint-disable no-console */
          if (error.response) {
            console.error('ошибка %d: %s', error.response.status, error.response.data)
          }
          /* eslint-enable no-console */
        })
      this.resultItems = this.resultItems.filter(e => e.id !== id)
      // this.resultItems.splice(index, 1)
    }
  }
}
</script>
