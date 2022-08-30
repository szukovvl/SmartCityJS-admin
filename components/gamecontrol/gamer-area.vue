<template>
  <div>
    <div class="blue-grey lighten-5 pa-2 text-center">
      {{ title }}
    </div>
    <MainStationMonitorControl :mainstation="mainstation" />
    <SubstationCardControl :station="substation" />
    <ObjectAllocationControl :title="title" :gamer-key="itemSceneData.mainstation" />
  </div>
</template>

<script>
import MainStationMonitorControl from '~/components/gamecontrol/main-station-monitor.vue'
import ObjectAllocationControl from '~/components/gamecontrol/object-allocations.vue'
import SubstationCardControl from '~/components/gamecontrol/substation-card.vue'
import {
  ESO_MAINSTATION_TYPE,
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
    itemSceneData: {
      type: Object,
      default: undefined
    }
  },

  data: () => ({
  }),

  computed: {
    mainstation () {
      if (this.itemSceneData === undefined) {
        return undefined
      }
      return this.$store.state.game.gameResources[ESO_MAINSTATION_TYPE]
        .find(e => e.devaddr === this.itemSceneData.mainstation)
    },
    substation () {
      if (this.itemSceneData === undefined) {
        return undefined
      }
      return this.$store.state.game.gameResources[ESO_DISTRIBUTOR_TYPE]
        .find(e => e.devaddr === this.itemSceneData.substation)
    }
  },

  created () {
  }
}
</script>
