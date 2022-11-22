<template>
  <div class="d-flex align-center teal lighten-4">
    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon>
        mdi-leaf
      </v-icon>
      <div class="mx-2 px-2">
        {{ ecology }}
      </div>
    </div>

    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon>
        mdi-fuel-cell
      </v-icon>
      <div class="mx-2 px-2">
        {{ balance }}
      </div>
    </div>

    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon>
        mdi-pencil-box-multiple-outline
      </v-icon>
      <div class="mx-2 px-2">
        {{ economic }}
      </div>
    </div>

    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon>
        mdi-scale-unbalanced
      </v-icon>
      <div class="mx-2 px-2">
        {{ scores }}
      </div>
    </div>
  </div>
</template>

<script>
import { roundToTwoAsStr } from '~/assets/helpers'

export default {
  name: 'CriteriaPanel',

  props: {
    dataset: {
      type: Object,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  }),

  computed: {
    scoresData () {
      return this.dataset.scores !== undefined
        ? this.dataset.scores
        : {
            scores: 0,
            balance: 0,
            economic: 0,
            ecology: 0
          }
    },
    scores () { return roundToTwoAsStr(this.scoresData.scores) },
    balance () { return roundToTwoAsStr(this.scoresData.balance) },
    economic () { return roundToTwoAsStr(this.scoresData.economic) },
    ecology () { return roundToTwoAsStr(this.scoresData.ecology) }
  },

  created () {
  },

  methods: {
  }
}
</script>
