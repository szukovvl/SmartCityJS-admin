<template>
  <div>
    <div class="blue-grey lighten-5 pa-2 text-center">
      Игрок 1
    </div>
    <MainStationMonitorControl />
    <SubstationCardControl />
    <ObjectAllocationControl />
  </div>
</template>

<script>
import MainStationMonitorControl from '~/components/gamecontrol/main-station-monitor.vue'
import ObjectAllocationControl from '~/components/gamecontrol/object-allocations.vue'
import SubstationCardControl from '~/components/gamecontrol/substation-card.vue'

export default {
  name: 'GamerAreaComponent',

  components: { MainStationMonitorControl, ObjectAllocationControl, SubstationCardControl },

  data: () => ({
  })
}
</script>
