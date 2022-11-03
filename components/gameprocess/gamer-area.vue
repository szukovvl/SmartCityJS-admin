<template>
  <div>
    <InformationPanel :data="data" />
    <UnusedDevicesPanel
      v-if="data.udevices !== undefined"
      :devices="data"
    />
    <div>{{ data }}</div>
  </div>
</template>

<script>
import InformationPanel from '~/components/gameprocess/info-panel.vue'
import UnusedDevicesPanel from '~/components/gameprocess/unused-panel.vue'
export default {
  name: 'GamerAreaComponent',

  components: { InformationPanel, UnusedDevicesPanel },

  props: {
    data: {
      type: Object,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  }),

  computed: {
  },

  created () {
  }
}
</script>
