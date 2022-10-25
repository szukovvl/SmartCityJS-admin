<template>
  <v-card
    :class="attrib.cardClass"
    outlined
  >
    <v-card-title class="d-flex flex-nowrap text-no-wrap">
      <v-avatar
        class="mr-2"
        tile
        :color="attrib.color"
      >
        <v-icon dark>
          {{ attrib.avatar }}
        </v-icon>
      </v-avatar>
      &laquo;{{ oes.identy !== undefined ? oes.identy : '' }}&raquo;
    </v-card-title>
  </v-card>
</template>

<script>
import {
  ESO_DISTRIBUTOR_TYPE,
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,
  ESO_CONSUMER_TYPE,
  ESO_GREENGENERATION_TYPE_SOLAR,
  ESO_CONSUMER_TYPE_INDUSTRY,
  ESO_CONSUMER_TYPE_HOSPITAL
} from '~/assets/helpers'

export default {
  name: 'SchemeMissedOesCard',

  props: {
    oes: {
      type: Object,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  }),

  computed: {
    attrib () {
      switch (this.oes.componentType) {
        case ESO_DISTRIBUTOR_TYPE: return {
          cardClass: 'consumer-card',
          avatar: 'mdi-home-lightning-bolt',
          color: '#FF8F00'
        }
        case ESO_STORAGE_TYPE: return {
          cardClass: 'generator_card',
          avatar: 'mdi-battery-charging-70',
          color: '#008000'
        }
        case ESO_GENERATOR_TYPE: return {
          cardClass: 'generator_card',
          avatar: 'mdi-engine-outline',
          color: '#008000'
        }
        case ESO_GREEGENERATOR_TYPE: {
          if (this.oes.data.generation_type !== undefined) {
            if (this.oes.data.generation_type === ESO_GREENGENERATION_TYPE_SOLAR) {
              return {
                cardClass: 'generator_card',
                avatar: 'mdi-solar-power-variant-outline',
                color: '#008000'
              }
            }
            return {
              cardClass: 'generator_card',
              avatar: 'mdi-wind-power-outline',
              color: '#008000'
            }
          }
          return {
            cardClass: 'generator_card',
            avatar: 'mdi-timeline-question-outline',
            color: '#008000'
          }
        }
        case ESO_CONSUMER_TYPE: {
          if (this.oes.data.consumertype !== undefined) {
            switch (this.oes.data.consumertype) {
              case ESO_CONSUMER_TYPE_INDUSTRY: return {
                cardClass: 'consumer-card',
                avatar: 'mdi-factory',
                color: '#FF8F00'
              }
              case ESO_CONSUMER_TYPE_HOSPITAL: return {
                cardClass: 'consumer-card',
                avatar: 'mdi-hospital-building',
                color: '#FF8F00'
              }
              default: return {
                cardClass: 'consumer-card',
                avatar: 'mdi-home-city',
                color: '#FF8F00'
              }
            }
          }
          return {
            cardClass: 'consumer-card',
            avatar: 'mdi-timeline-question-outline',
            color: '#FF8F00'
          }
        }
      }
      return {
        cardClass: 'unknown_card',
        avatar: 'mdi-timeline-question-outline',
        color: '#F9A825'
      }
    }
  }
}
</script>

<style scoped>
.consumer-card.v-sheet.v-card {
  border: 2px solid #FF8F00;
  border-radius: 8px;
  background-color: #FFECB3;
}
.generator_card.v-sheet.v-card {
  border: 2px solid #008000;
  border-radius: 8px;
  background-color: #C8E6C9;
}
.unknown_card.v-sheet.v-card {
  border: 2px solid #F9A825;
  border-radius: 8px;
  background-color: #FFF9C4;
}
</style>
