<template>
  <v-card flat>
    <v-card-subtitle>
      <v-avatar
        class="mr-2"
        tile
        color="amber darken-3"
      >
        <v-icon dark>
          {{ avatar }}
        </v-icon>
      </v-avatar>
      &laquo;{{ consumer.identy }}&raquo;
    </v-card-subtitle>
  </v-card>
</template>

<script>
import {
  ESO_CONSUMER_TYPE_DISTRICT,
  ESO_CONSUMER_TYPE_INDUSTRY
} from '~/assets/helpers'

export default {
  name: 'OesShortCard',

  props: {
    consumer: {
      type: Object,
      required: true
    }
  },

  data: () => ({
  }),

  computed: {
    avatar () {
      switch (this.consumer.data.consumertype) {
        case ESO_CONSUMER_TYPE_DISTRICT: return 'mdi-home-city'
        case ESO_CONSUMER_TYPE_INDUSTRY: return 'mdi-factory'
        default: return 'mdi-hospital-building'
      }
    }
  }
}
</script>
