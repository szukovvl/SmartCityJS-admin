<template>
  <div>
    <v-card flat>
      <v-card-subtitle>
        Доступные потребители
      </v-card-subtitle>
      <v-card-text
        v-if="allconsumers.length !== 0"
        class="d-flex flex-wrap ma-0 pa-0"
      >
        <div
          v-for="item in allconsumers"
          :key="item.identy"
        >
          <OesShortCard :consumer="item" />
        </div>
      </v-card-text>
      <v-card-text v-else>
        нет доступных потребителей
      </v-card-text>
      <v-row class="mt-2">
        <v-col
          v-for="(data, index) in scenesData"
          :key="data.mainstation"
        >
          <div class="blue-grey lighten-5 pa-2 text-center">
            {{ 'Игрок ' + (index + 1) }}
          </div>
          <GamerChoiceView :gamer-key="data.mainstation" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import OesShortCard from '~/components/gamecontrol/oes-short-card.vue'
import GamerChoiceView from '~/components/gamecontrol/gamer-choice-view.vue'
import {
  ESO_CONSUMER_TYPE
} from '~/assets/helpers'

export default {
  name: 'GamersChoiceView',

  components: { OesShortCard, GamerChoiceView },

  data: () => ({
  }),

  computed: {
    allconsumers () {
      const consumers = this.$store.state.game.gameResources
      const allitems = this.$store.state.game.choiceAll
      if (allitems !== undefined && consumers !== undefined && consumers[ESO_CONSUMER_TYPE] !== undefined) {
        return consumers[ESO_CONSUMER_TYPE]
          .filter(e => allitems.includes(e.devaddr))
          .sort((x, y) => x.data.consumertype.localeCompare(y.data.consumertype))
      }
      return []
    },
    scenesData () {
      const items = this.$store.state.game.scenesData
      return items != null ? items : []
    }
  }
}
</script>
