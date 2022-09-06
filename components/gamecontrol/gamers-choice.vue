<template>
  <div>
    <v-card flat>
      <v-card-subtitle>
        Доступные потребители
      </v-card-subtitle>
      <v-card-text
        v-if="allconsumers.length !== 0"
        class="d-flex flex-wrap"
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
    </v-card>
  </div>
</template>

<script>
import OesShortCard from '~/components/gamecontrol/oes-short-card.vue'
import {
  ESO_CONSUMER_TYPE
} from '~/assets/helpers'

export default {
  name: 'GamersChoiceView',

  components: { OesShortCard },

  data: () => ({
  }),

  computed: {
    aregiven () { // даны организатором
      /* eslint-disable no-console */
      console.log('ресурсы игры', this.$store.state.game.gameResources)
      /* eslint-enable no-console */
      return []
    },
    allconsumers () {
      const consumers = this.$store.state.game.gameResources
      const allitems = this.$store.state.game.choiceAll
      if (allitems !== undefined && consumers !== undefined && consumers[ESO_CONSUMER_TYPE] !== undefined) {
        return consumers[ESO_CONSUMER_TYPE]
          .filter(e => allitems.includes(e.devaddr))
          .sort((x, y) => x.data.consumertype.localeCompare(y.data.consumertype))
      }
      return []
    }
  }
}
</script>
