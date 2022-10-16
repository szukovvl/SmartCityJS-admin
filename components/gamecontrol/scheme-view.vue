<template>
  <div>
    <div class="d-flex justify-center">
      <SchemeMainStationCadr />
    </div>
    <p>
      {{ data }}
    </p>
  </div>
</template>

<script>
import SchemeMainStationCadr from '~/components/gamecontrol/scheme-main-station-card.vue'

export default {
  name: 'SchemeView',

  components: {
    SchemeMainStationCadr
  },

  props: {
    data: {
      type: Object,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  })
}
</script>
