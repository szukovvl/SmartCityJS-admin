<template>
  <v-card outlined>
    <v-card-title :class="decor.titleClass">
      <v-avatar
        class="mr-2"
        tile
        :color="decor.color"
      >
        <v-icon dark>
          {{ decor.avatar }}
        </v-icon>
      </v-avatar>
      &laquo;{{ device.identy }}&raquo;
    </v-card-title>
    <v-card-text
      v-if="isCreditable"
      class="d-flex flex-nowrap justify-end text-caption deep-orange--text"
    >
      <div>{{ rent }}</div>
      <v-icon
        x-small
        color="deep-orange"
      >
        mdi-currency-rub
      </v-icon>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,
  ESO_DISTRIBUTOR_TYPE,
  ESO_CONSUMER_TYPE,

  ESO_GREENGENERATION_TYPE_SOLAR,

  ESO_CONSUMER_TYPE_HOSPITAL,
  ESO_CONSUMER_TYPE_INDUSTRY,

  roundToTwoAsStr
} from '~/assets/helpers'

export default {
  name: 'UnusedDeviceCard',

  props: {
    device: {
      type: Object,
      default () {
        return { }
      }
    },
    lots: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data: () => ({
  }),

  computed: {
    decor () {
      const res = {
        avatar: 'mdi-timeline-question-outline',
        color: 'blue-grey',
        titleClass: 'd-flex flex-nowrap text-no-wrap blue-grey--text'
      }
      if (this.device.componentType !== undefined) {
        switch (this.device.componentType) {
          case ESO_STORAGE_TYPE:
            res.avatar = 'mdi-battery-charging-70'
            res.color = 'deep-orange'
            res.titleClass = 'd-flex flex-nowrap text-no-wrap deep-orange--text'
            break
          case ESO_GREEGENERATOR_TYPE:
            res.color = 'deep-orange'
            res.titleClass = 'd-flex flex-nowrap text-no-wrap deep-orange--text'
            if (this.device.data.generation_type === ESO_GREENGENERATION_TYPE_SOLAR) {
              res.avatar = 'mdi-solar-power-variant-outline'
            } else {
              res.avatar = 'mdi-wind-power-outline'
            }
            break
          case ESO_GENERATOR_TYPE:
            res.avatar = 'mdi-engine-outline'
            res.color = 'deep-orange'
            res.titleClass = 'd-flex flex-nowrap text-no-wrap deep-orange--text'
            break
          case ESO_DISTRIBUTOR_TYPE:
            res.avatar = 'mdi-home-lightning-bolt'
            break
          case ESO_CONSUMER_TYPE:
            switch (this.device.data.consumertype) {
              case ESO_CONSUMER_TYPE_HOSPITAL:
                res.avatar = 'mdi-hospital-building'
                break
              case ESO_CONSUMER_TYPE_INDUSTRY:
                res.avatar = 'mdi-factory'
                break
              default:
                res.avatar = 'mdi-home-city'
                break
            }
            break
        }
      }
      return res
    },
    rent () {
      if ((this.device.componentType !== undefined) &&
      (this.device.componentType === ESO_GENERATOR_TYPE ||
      this.device.componentType === ESO_GREEGENERATOR_TYPE ||
      this.device.componentType === ESO_STORAGE_TYPE)) {
        const lot = this.lots !== undefined ? this.lots.find(e => e.key === this.device.devaddr) : undefined
        return lot !== undefined ? roundToTwoAsStr(lot.price) : undefined
      }
      return undefined
    },
    isCreditable () {
      return this.rent !== undefined
    }
  },

  created () {
  }
}
</script>
