<template>
  <v-card flat>
    <v-card-subtitle>
      <v-avatar
        class="mr-2"
        tile
        color="#008000"
      >
        <v-icon dark>
          {{ avatar }}
        </v-icon>
      </v-avatar>
      &laquo;{{ oes.identy }}&raquo;
    </v-card-subtitle>
  </v-card>
</template>

<script>
import {
  ESO_GENERATOR_TYPE,
  ESO_GREEGENERATOR_TYPE,
  ESO_GREENGENERATION_TYPE_SOLAR
} from '~/assets/helpers'

export default {
  name: 'GenerationShortCard',

  props: {
    oes: {
      type: Object,
      required: true
    }
  },

  data: () => ({
  }),

  computed: {
    avatar () {
      switch (this.oes.componentType) {
        case ESO_GENERATOR_TYPE: return 'mdi-engine-outline'
        case ESO_GREEGENERATOR_TYPE: {
          if (this.oes.data.generation_type === ESO_GREENGENERATION_TYPE_SOLAR) {
            return 'mdi-solar-power-variant-outline'
          }
          return 'mdi-wind-power-outline'
        }
        default: return 'mdi-battery-charging-70'
      }
    }
  }
}
</script>
