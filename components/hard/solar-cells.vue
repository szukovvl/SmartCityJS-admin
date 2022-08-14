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
        @click="doCalibrate"
      >
        <v-icon color="amber darken-4">
          mdi-vanity-light
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text
      v-if="cells.length !== 0"
      class="d-flex flex-wrap justify-space-around px-0"
    >
      <SolarCellItemCmp
        v-for="item in cells"
        :key="item.identy"
        :solar="item"
      />
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
import SolarCellItemCmp from '~/components/hard/solar-cell-item.vue'
import {
  API_ENERGY_SERVICE_FIND,
  API_SUN_SERVICE_CALIBRATE
} from '~/assets/helpers'

const ELEMENT_TYPE = 'GREEGENERATOR'
const CELL_TYPE = 'SOLAR'

export default {
  name: 'SolarCellsControl',

  components: { SolarCellItemCmp },

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
    },
    doCalibrate () {
      const items = this.cells.filter(e => this.$store.state.timeSlices[e.devaddr] !== undefined)
      if (items.length === 0) {
        return
      }

      this.$axios.$post(API_SUN_SERVICE_CALIBRATE, undefined, { progress: false })
        // .then((v) => {})
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
