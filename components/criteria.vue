<template>
  <v-card>
    <v-card-title>
      Критерии оценки игры
    </v-card-title>
    <v-card-subtitle>
      За каждый игровой период (сек/мин/час) происходит расчет эффективности ЭЭС (Электроэнергетической системы)
      по критериям &laquo;К&raquo; (&laquo;Баланса мощности энергосистемы&raquo;, &laquo;Экономическая эффективность&raquo;, &laquo;Экологичность&raquo;.
    </v-card-subtitle>
    <v-card-subtitle>
      Критерии оценки  результатов <code>К<sub>оценки</sub>> = К<sub>БМ</sub> + К<sub>ЭЭ</sub> +К<sub>СО2</sub>> = 60% + 40% + 10% = 100%</code>.
      Игрок набравший Коценки - победитель.
    </v-card-subtitle>
    <v-card-subtitle class="font-weight-bold">
      Баланс мощности
    </v-card-subtitle>
    <v-card-text class="pb-0">
      <p>
        Главным условием обеспечения надежного электроснабжения потребителей является
        соблюдение в каждый момент времени баланса мощности системы, т. е.
        выполнение условия равенства потребительской нагрузки (спроса) и мощности,
        с которой в данный момент времени работают все электростанции (предложения).
        Для соблюдения баланса мощности в ЭЭС необходимо иметь в каждый момент времени
        определенные запасы энергетических ресурсов (резерв энергии) и дополнительные энергетические мощности.
      </p>
      <p>
        <sup>(1)</sup> п. 4.4.2 &laquo;Методические рекомендации по проектированию развития энергосистем&raquo;
        СО 153-34.20.118-2003 Рекомендуется принимать значения необходимого резерва мощности процентом от
        максимума нагрузки Европейская секция ЕЭС - 17% (ОЭС Сибири - 12%; ОЭС Востока - 22%).
        п. 4.7. Баланс мощности считается удовлетворительным, если дефицит (избыток)
        (с учетом балансовых перетоков) не превышает половины мощности наиболее крупного агрегата объединения.
      </p>
      <p>
        Баланс мощностей – это тоже что и закона сохранения энергии,
        но для электрической цепи. Баланса мощностей это - сумма мощностей потребляемых приемниками (Pпр),
        равна сумме мощностей отдаваемых источниками (Pисп), <code>Рпр = Рист</code>.
      </p>
      <p>
        Администратор системы самостоятельно устанавливает значимость критерия &laquo;БАЛАНС МОЩНОСТИ&raquo; энергосистемы,
        руководствуясь сценарием игры.
      </p>
    </v-card-text>
    <v-card-text class="pt-0">
      <v-row class="d-inline-flex align-center">
        <v-col>
          Баланс мощности (эффективность) для 1 часа работы  электроэнергетической системы (К<sub>БМ</sub>)
        </v-col>
        <v-col cols="2">
          <v-text-field
            class="right-input"
            type="number"
            suffix="%"
            dense
          />
        </v-col>
      </v-row>
      <p>
        Коэффициенты критерии оценки (К<sub>БМ</sub>)
      </p>
      <v-row class="d-inline-flex">
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="мощность потребления равна мошности генерации баланс (Рпр/Рист = 0)"
            persistent-hint
            dense
            step="0.01"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="мощность потребления больше мощности генерации баланс отрицательный (Рпр/Рист < 0)"
            persistent-hint
            dense
            step="0.01"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="мощность потребления меньше мошности генерации баланс положительный (Рпр/Рист ≦ 0) (17%)"
            persistent-hint
            dense
            step="0.01"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="баланс положительный (Рпр/Рист < 0) (потребления меньше генерации 12%)"
            persistent-hint
            dense
            step="0.01"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-subtitle class="font-weight-bold">
      Экономическая эффективность
    </v-card-subtitle>
    <v-card-text>
      <p>
        Приходная часть  деньги собранные с потребителя
      </p>
      <p>
        Баланс мощностей – это тоже что и закона сохранения энергии,
        но для электрической цепи.
        Баланса мощностей это - сумма мощностей потребляемых приемниками (Pпр),
        равна сумме мощностей отдаваемых источниками (Pисп), <code>Рпр = Рист</code>>.
      </p>
      <v-row class="d-inline-flex align-center">
        <v-col>
          Экономическая эффективность для 1 часа работы  электроэнергетической системы (К<sub>ЭЭ</sub>)
        </v-col>
        <v-col cols="2">
          <v-text-field
            class="right-input"
            type="number"
            suffix="%"
            dense
          />
        </v-col>
      </v-row>
      <p>
        Коэффициенты критерии оценки (К<sub>ЭЭ</sub>)
      </p>
      <v-row class="d-inline-flex">
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="приходная часть равна расходной части баланс (Пприход/Зрасход = 0)"
            persistent-hint
            dense
            step="0.01"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="приходная часть меньше расходной части баланс (Пприход/Зрасход < 0)"
            persistent-hint
            dense
            step="0.01"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="приходная часть больше расходной части баланс (Пприход/Зрасход > 0)"
            persistent-hint
            dense
            step="0.01"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-subtitle class="font-weight-bold">
      Экологичность
    </v-card-subtitle>
    <v-card-text>
      <p>
        Негативного воздействия на окружающую среду источника энергии
      </p>
      <p>
        Баланс мощностей – это тоже что и закона сохранения энергии,
        но для электрической цепи.
        Баланса мощностей это - сумма мощностей потребляемых приемниками (Pпр),
        равна сумме мощностей отдаваемых источниками (Pисп), <code>Рпр = Рист</code>>.
      </p>
      <p>
        Администратор системы самостоятельно устанавливает значимость критерия &laquo;ЭКОЛОГИЧЕСКАЯ ЭФФЕКТИВНОСТЬ&raquo;
        энергосистемы, руководствуясь сценарием игры.
      </p>
      <v-row class="d-inline-flex align-center">
        <v-col>
          Экономическая эффективность для 1 часа работы  электроэнергетической системы (К<sub>CO2</sub>)
        </v-col>
        <v-col cols="2">
          <v-text-field
            class="right-input"
            type="number"
            suffix="%"
            dense
          />
        </v-col>
      </v-row>
      <p>
        Коэффициенты критерии оценки (К<sub>CO2</sub>)
      </p>
      <v-row class="d-inline-flex">
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="выброс гСО2-экв на 1 кВт*ч для ТЭС на уголь/газ/нефть - 684,75"
            persistent-hint
            dense
            step="0.001"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="выброс гСО2-экв на 1 кВт*ч для ЭЭ на Солнце - 18"
            persistent-hint
            dense
            step="0.001"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="выброс гСО2-экв на 1 кВт*ч для ЭЭ на Ветер - 6,9"
            persistent-hint
            dense
            step="0.001"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="выброс гСО2-экв на 1 кВт*ч для ЭЭ на Дизель Генерация - 930"
            persistent-hint
            dense
            step="0.001"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="выброс гСО2-экв на 1 кВт*ч для ЭЭ на Хранилище - 798,9"
            persistent-hint
            dense
            step="0.001"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CriteriaComponent',

  data: () => ({
  })
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
