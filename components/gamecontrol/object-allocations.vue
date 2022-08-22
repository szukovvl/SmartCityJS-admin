<template>
  <v-card
    outlined
    tile
  >
    <v-card-text>пока объектов нет</v-card-text>
    <v-menu
      open-on-hover
      top
      offset-y
      :close-on-content-click="false"
    >
      <template #activator="{ on, attrs }">
        <v-card-text
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Выбрать объекты ЭС
        </v-card-text>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card>
</template>

<script>
export default {
  name: 'ObjectAllocationControl',

  data: () => ({
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me 2' }
    ]
  })
}
</script>
