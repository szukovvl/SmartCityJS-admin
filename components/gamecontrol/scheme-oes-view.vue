<template>
  <div>
    <p>
      {{ data }}
    </p>
  </div>
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
