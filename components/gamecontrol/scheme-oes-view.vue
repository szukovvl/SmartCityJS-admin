<template>
  <p>
    {{ data }}
  </p>
</template>

<script>
export default {
  name: 'SchemeOesView',

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
