<template>
  <v-card flat>
    <v-card-text>
      Команда <strong>{{ commandname }}</strong>
    </v-card-text>
    <v-divider />
    <v-card-text v-if="slogan !== undefined">
      {{ slogan }}
    </v-card-text>
    <v-divider />
    <v-card-text v-if="partners.length !== 0">
      <div
        v-for="(item, index) in partners"
        :key="'part_' + index"
        class="d-flex flex-row align-center mr-2"
      >
        <div class="mr-2">
          {{ index + 1 }}.
        </div>
        <div
          v-if="item.role !== undefined"
          class="mr-2"
        >
          {{ item.role }}
        </div>
        <div class="mr-2">
          {{ item.name }}
        </div>
        <div v-if="item.youfrom !== undefined">
          {{ item.youfrom }}
        </div>
      </div>
    </v-card-text>
    <v-divider />
    <v-card-text v-if="notice !== undefined">
      <i>{{ notice }}</i>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GamerCardComponent',

  props: {
    gamerCard: {
      type: Object,
      default: undefined
    }
  },

  data: () => ({
  }),

  computed: {
    commandname () {
      return this.gamerCard !== undefined
        ? this.gamerCard.sceneidentify !== undefined
          ? this.gamerCard.sceneidentify.commandname
          : 'нет данных'
        : 'нет данных'
    },
    slogan () {
      return this.gamerCard !== undefined
        ? this.gamerCard.sceneidentify !== undefined
          ? this.gamerCard.sceneidentify.slogan
          : undefined
        : undefined
    },
    partners () {
      return this.gamerCard !== undefined
        ? this.gamerCard.sceneidentify !== undefined
          ? this.gamerCard.sceneidentify.partners !== undefined
            ? this.gamerCard.sceneidentify.partners
            : []
          : []
        : []
    },
    notice () {
      return this.gamerCard !== undefined
        ? this.gamerCard.sceneidentify !== undefined
          ? this.gamerCard.sceneidentify.notice
          : undefined
        : undefined
    }
  }
}
</script>
