<template>
  <v-card flat>
    <v-card-text>
      <v-text-field
        hint="название команды/игрока"
        persistent-hint
        dense
        placeholder="назови свою команду"
        filled
      />
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-textarea
        hint="девиз команды"
        persistent-hint
        placeholder="придумай правильный девиз и победи!"
        rows="2"
        auto-grow
        filled
      />
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-row class="align-center">
        <v-col cols="1">
          Участник 1
        </v-col>
        <v-col cols="2">
          <v-text-field
            hint="роль"
            persistent-hint
            dense
            filled
          />
        </v-col>
        <v-col>
          <v-text-field
            hint="имя участника"
            persistent-hint
            dense
            placeholder="имя участника"
            filled
          />
        </v-col>
        <v-col>
          <v-text-field
            hint="от куда ты"
            persistent-hint
            dense
            placeholder="от куда ты"
            filled
          />
        </v-col>
        <v-col cols="1">
          <v-icon>
            mdi-close
          </v-icon>
          <v-icon>
            mdi-close
          </v-icon>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-textarea
        hint="дополнительно"
        persistent-hint
        placeholder="можно что-то написать..."
        auto-grow
        filled
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GamerCardComponent',

  data: () => ({
  })
}
</script>
