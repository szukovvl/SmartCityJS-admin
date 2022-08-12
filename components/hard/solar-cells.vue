<template>
  <v-card
    tile
    flat
  >
    <v-card-title class="teal lighten-4">
      Солнечные элементы
      <v-spacer />
      <v-btn
        icon
      >
        <v-icon color="amber darken-4">
          mdi-vanity-light
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text
      v-if="cells.length !== 0"
      class="d-inline-flex px-0"
    >
      <v-card
        v-for="item in cells"
        :key="item.identy"
        class="ma-1"
        outlined
      >
        <v-card-text class="text-h6">
          {{ item.identy }}
        </v-card-text>
        <v-card-text>
          текущее значение
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-card-text
      v-else
      class="grey--text text--lighten-1 ms-4 text-h5 d-flex justify-center font-weight-medium"
    >
      элементы не найдены
    </v-card-text>
  </v-card>
</template>

<script>
import { API_ENERGY_SERVICE_FIND } from '~/assets/helpers'

const ELEMENT_TYPE = 'GREEGENERATOR'
const CELL_TYPE = 'SOLAR'

export default {
  name: 'SolarCellsControl',

  data: () => ({
    cells: []
  }),

  created () {
    if (!this.$isServer) {
      this.doLoadCells()
    }
  },

  methods: {
    doLoadCells () {
      this.$axios.$get(API_ENERGY_SERVICE_FIND + '/' + ELEMENT_TYPE, { progress: false })
        .then((v) => {
          this.cells = v.filter(e => e.data.generation_type === CELL_TYPE)
        })
        .catch((error) => {
          /* eslint-disable no-console */
          if (error.response) {
            console.error('ошибка %d: %s', error.response.status, error.response.data)
          }
          /* eslint-enable no-console */
        })
    }
  }
}
</script>
