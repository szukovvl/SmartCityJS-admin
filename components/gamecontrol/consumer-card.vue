<template>
  <v-card
    flat
    tile
  >
    <v-row>
      <v-col cols="1">
        <v-checkbox
          v-model="uselocal"
          color="success"
          hide-details
        />
      </v-col>
      <v-col>
        <v-card-title>
          <v-avatar
            class="mr-2"
            tile
            color="amber darken-3"
          >
            <v-icon dark>
              {{ avatar }}
            </v-icon>
          </v-avatar>
          &laquo;{{ consumer.data.identy }}&raquo;
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text>{{ consumer }}</v-card-text>
  </v-card>
</template>

<script>
import {
  ESO_CONSUMER_TYPE_DISTRICT,
  ESO_CONSUMER_TYPE_INDUSTRY
} from '~/assets/helpers'

export default {
  name: 'ConsumerCardComponent',

  props: {
    consumer: {
      type: Object,
      required: true
    }
  },

  data: () => ({
  }),

  computed: {
    uselocal: {
      get () {
        return this.consumer.usedefault
      },
      set (value) {
        this.$emit('consumerUseChanged', this.consumer, value)
      }
    },
    avatar () {
      switch (this.consumer.data.data.consumertype) {
        case ESO_CONSUMER_TYPE_DISTRICT: return 'mdi-home-city'
        case ESO_CONSUMER_TYPE_INDUSTRY: return 'mdi-factory'
        default: return 'mdi-hospital-building'
      }
    }
  },

  watch: {
  },

  methods: {
  }
}
</script>
