<template>
  <div>
    <div class="blue-grey lighten-5 pa-2 text-center">
      {{ title }}
    </div>
    <MainStationMonitorControl :mainstation="mainstation !== undefined ? mainstation.data : undefined" />
    <SubstationCardControl :station="substation" />
    <ObjectAllocationControl />
  </div>
</template>

<script>
import MainStationMonitorControl from '~/components/gamecontrol/main-station-monitor.vue'
import ObjectAllocationControl from '~/components/gamecontrol/object-allocations.vue'
import SubstationCardControl from '~/components/gamecontrol/substation-card.vue'
import {
  ESO_DISTRIBUTOR_TYPE
} from '~/assets/helpers'

export default {
  name: 'GamerAreaComponent',

  components: { MainStationMonitorControl, ObjectAllocationControl, SubstationCardControl },

  props: {
    title: {
      type: String,
      required: true
    },
    gamerIndex: {
      type: Number,
      required: true
    },
    mainstation: {
      type: Object,
      default: undefined
    }
  },

  data: () => ({
  }),

  computed: {
    substation () {
      const items = this.$store.state.game.gameResources[ESO_DISTRIBUTOR_TYPE]
      if (items !== undefined && items.length > this.gamerIndex) {
        return items[this.gamerIndex].data
      }
      return undefined
    }
  }
}
</script>
