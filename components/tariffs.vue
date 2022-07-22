<template>
  <v-card>
    <v-card-title>Тарифы на электрическую энергию</v-card-title>
    <v-card-text class="py-2 px-4">
      <p>
        Оптовый рынок электрической энергии и мощности (ОРЭМ) – сфера обращения особых товаров (электрической энергии и мощности)
        в рамках Единой энергетической системы России в границах единого экономического пространства Российской Федерации.
        Правовые основы функционирования оптового рынка устанавливаются Федеральным законом от
        26.03.2003 № 35-ФЗ «Об электроэнергетике», Правилами оптового рынка электрической энергии и мощности
        (постановление Правительства Российской Федерации от 27.12.2010 №1172) и иными нормативными правовыми актами,
        предусмотренными правилами оптового рынка.
      </p>
      <p>
        Ценообразование тарифов на электрическую энергию для потребителей формируются на основании стоимости электроэнергии
        (далее - ЭЭ) на:
      </p>
      <body>
        <ul>
          <li>
            оптовом рынке (стоимость производства ЭЭ или стоимость установленная в результате "торгов" между потребителем и генерацией. Нерегулируемая. Доля 40% );
          </li>
          <li>
            тарифа на услуги передачи ЭЭ (надбавка к стоимости ЭЭ на оптовом рынке устанавливается государством, так называемые "котловые". Регулируемая. Доля 55%);
          </li>
          <li>
            сбытовой надбавки продавца ЭЭ на розничном рынке (величина надбавки к стоимости ЭЭ на оптовом рынке устанавливается государством. Регулируемая. Доля 4,9%);
          </li>
          <li>
            прочие услуги инфраструктуры рынка ЭЭ (величина установлена государством. Регулируемая. Доля 0,1%).
          </li>
        </ul>
      </body>
      <p>&nbsp;</p>
      <v-row class="d-inline-flex">
        <v-col>
          <p>
            Администратор системы самостоятельно устанавливает тариф
            <span class="blue--text text--accent-4"><b>T0</b></span>
            на электрическую энергию для оптового
            рынка для региона где проходит игра, руководствуясь информацией о ее стоимости на оптовых рынках
            РФ (например с ресурса
            <a href="https://enerone.ru/analytics/ore_prices/" target="_blank">https://enerone.ru/analytics/ore_prices/</a>>
            или
            <a href="WWW.atsenergo.ru" target="_blank">WWW.atsenergo.ru</a>).
            Далее Программа автоматически рассчитывает тарифы для конечных потребителей (Завод, Больница, Микрорайон).
          </p>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="trade_price"
            class="right-input"
            type="number"
            hint="Стоимость ЭЭ на оптовом рынке (Т0), руб./МВт*ч"
            persistent-hint
            suffix="руб./МВт*ч"
            dense
            step="0.01"
            :error-messages="trade_priceErrors"
            @input="$v.trade_price.$touch()"
            @blur="$v.trade_price.$touch()"
          />
        </v-col>
      </v-row>
      <div class="d-inline-flex">
        <v-card
          class="mx-1"
          outlined
        >
          <v-card-subtitle class="font-weight-bold">
            Сбытовая надбавка продавца ЭЭ (Т<sup>СН</sup>):
          </v-card-subtitle>
          <v-card-text>
            <ul>
              <li>
                уровень мощности до 670 кВт,
                <span class="blue--text text--accent-4"><b>Т<sup>СН</sup><sub>small</sub>: {{ sales_allowance.tch_small }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень мощности от 670 кВт до 10 мВт,
                <span class="blue--text text--accent-4"><b>Т<sup>СН</sup><sub>medium</sub>: {{ sales_allowance.tch_avg }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень мощности свыше 10 мВт,
                <span class="blue--text text--accent-4"><b>Т<sup>СН</sup><sub>large</sub>: {{ sales_allowance.tch_large }}</b></span> руб./МВт*ч;
              </li>
              <li>
                усредненная Сбытовая надбавка продавца ЭЭ,
                <span class="blue--text text--accent-4"><b>Т<sup>СН</sup><sub>средний</sub>: {{ sales_allowance.tch_mid }}</b></span> руб./МВт*ч.
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card
          class="mx-1"
          outlined
        >
          <v-card-subtitle class="font-weight-bold">
            Тариф (котловой) услуги передачи  ЭЭ (Т<sup>К</sup>):
          </v-card-subtitle>
          <v-card-text>
            <ul>
              <li>
                уровень напряжения ВН (110 кВ),
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>ВН</sub>: {{ tariff.tk_high }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень напряжения СН 1 (35 кВ),
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>СН1</sub>: {{ tariff.tk_avg_1 }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень напряжения СН 2 (3 кВ),
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>СН2</sub>: {{ tariff.tk_avg_2 }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень напряжения НН (0,4 кВ),
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>НН</sub>: {{ tariff.tk_low }}</b></span> руб./МВт*ч;
              </li>
              <li>
                Усредненный Тариф (котловой) услуги передачи  ЭЭ,
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>средний</sub>: {{ tariff.tk_mid }}</b></span> руб./МВт*ч.
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </div>
    </v-card-text>
    <v-card-text class="pa-0 px-4">
      <v-card
        class="mx-1"
        outlined
      >
        <v-card-subtitle class="font-weight-bold">
          Инфраструктурный платеж за услуги
          <span class="blue--text text--accent-4"><b>Т<sup>УСЛ</sup>: {{ t_service }}</b></span>  руб./МВт*ч.
        </v-card-subtitle>
      </v-card>
    </v-card-text>
    <v-card-subtitle class="font-weight-bold">
      Итого Конечная Средняя стоимость ЭЭ на розничном рынке,
      <span class="blue--text text--accent-4">Т<sup>Розница</sup><sub>средний</sub> {{ t_total }}</span>  руб./МВт*ч.
    </v-card-subtitle>
    <v-card-title>
      Тарифы дифференцированные по времени (зонам) суток
    </v-card-title>
    <v-card-text>
      <p>
        Дифференцированные по зонам суток тарифы на электроэнергию на потребительском рынке устанавливаются
        с целью регулирования суточного графика нагрузки энергосистемы.
        Потребность в таком регулировании возникает либо в связи с недостатком пиковых мощностей,
        либо вследствие трудностей прохождения ночного провала графика электрической нагрузки.
        Дифференцированные по зонам суток тарифы должны соответственно стимулировать потребителей к
        снижению нагрузки в пиковой зоне графика и заполнению зоны ночного провала.
      </p>
      <p>
        При ценообразовании дифференцированного по зонам суток тарифа на электроэнергию необходимо исходить из следующих положений:
      </p>
      <body>
        <ul>
          <li>
            суммарная плата за потребляемую энергию при исходном режиме ее использования не
            должна изменяться при переходе от действующих (планируемых) одно-
            или двухставочный тарифов к дифференцированным по зонам времени (суток);
          </li>
          <li>
            дифференциация тарифов может осуществляться как по трем, так и по двум зонам суток
            с расчетом тарифных ставок для каждого конкретного промышленного потребителя;
          </li>
          <li>
            для непромышленных потребителей и населения могут устанавливаться дифференцированные по
            зонам суток тарифные ставки для соответствующей группы в целом;
          </li>
          <li>
            для промышленных и приравненных к ним потребителей с присоединенной мощностью 750 кВА
            и выше может устанавливаться дифференцированная плата за 1 кВт*ч потребленной электроэнергии в пиковой,
            полупиковой и ночной зонах как с сохранением платы за 1 кВт заявленной мощности, так и без нее.
          </li>
        </ul>
      </body>
    </v-card-text>
    <v-card-text>
      <div class="d-inline-flex">
        <v-card
          class="mx-1"
          outlined
        >
          <v-card-subtitle class="font-weight-bold">
            Тариф дифференцированный по трем зонам суток (Т<sup>Д3</sup>)
            <v-tooltip
              right
              max-width="600"
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  class="align-self-start"
                  color="blue"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <p class="px-0 ma-0 py-2">
                <ul>
                  <li>
                    Тариф пиковой зоны суток
                    <b>Т<sup>Д3</sup><sub>пик</sub></b>
                    (Т1) - пиковая зона суток (тариф). Тариф с наибльшей ценой в зоне суток с 7:00 до 10:00 и с 17:00 до 21:00.
                  </li>
                  <li>
                    Тариф ночной зоны суток
                    <b>Т<sup>Д3</sup><sub>ночь</sub></b>
                    (Т2) - ночная зона суток (тариф). Тариф с наименьшей ценой в ночной период с 23:00 до 7:00 утра.
                  </li>
                  <li>
                    Тариф полупиковой зоны суток
                    <b>Т<sup>Д3</sup><sub>пп</sub></b>
                    (Т3) - полупиковый зона суток (тариф). Тариф со средней ценой с 10:00 до 17:00 и с 21:00 до 23:00.
                  </li>
                </ul>
              </p>
            </v-tooltip>
          </v-card-subtitle>
          <v-card-text>
            <ul>
              <li>
                Тариф пиковой зоны суток,
                <span class="blue--text text--accent-4"><b>Т<sup>Д3</sup><sub>пик</sub>: {{ t_zone_3.peak }}</b></span> руб./кВт*ч;
              </li>
              <li>
                Тариф полупиковой зоны суток,
                <span class="blue--text text--accent-4"><b>Т<sup>Д3</sup><sub>пп</sub>: {{ t_zone_3.pp }}</b></span> руб./кВт*ч;
              </li>
              <li>
                Тариф ночной зоны суток,
                <span class="blue--text text--accent-4"><b>Т<sup>Д3</sup><sub>ночь</sub>: {{ t_zone_3.night }}</b></span> руб./кВт*ч;
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card
          class="mx-1"
          outlined
        >
          <v-card-subtitle class="font-weight-bold">
            Тариф дифференцированный по двум зонам суток (Т<sup>Д2</sup>)
            <v-tooltip
              right
              max-width="600"
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  class="align-self-start"
                  color="blue"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <p class="px-0 ma-0 py-2">
                <ul>
                  <li>
                    Тариф дневной зоны суток
                    <b>Т<sup>Д2</sup><sub>день</sub></b>
                    (Т1) - с 7 до 23 часов.
                  </li>
                  <li>
                    Тариф ночной зоны суток
                    <b>Т<sup>Д2</sup><sub>ночь</sub></b>
                    (Т2) - с 23:00 до 7:00 утра.
                  </li>
                </ul>
              </p>
            </v-tooltip>
          </v-card-subtitle>
          <v-card-text>
            <ul>
              <li>
                Тариф дневной зоны суток,
                <span class="blue--text text--accent-4"><b>Т<sup>Д2</sup><sub>день</sub>: {{ t_zone_2.day }}</b></span> руб./кВт*ч;
              </li>
              <li>
                Тариф ночной зоны суток,
                <span class="blue--text text--accent-4"><b>Т<sup>Д2</sup><sub>ночь</sub>: {{ t_zone_2.night }}</b></span> руб./кВт*ч;
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </div>
    </v-card-text>
    <v-card-title>
      Тарифы на генерацию ЭЭ от солнца, ветра и хранилища
    </v-card-title>
    <v-card-text>
      <p>
        Пример расчета стоимости ЭЭ выработанной ДГ при 100% нагрузке:
        <code>(Расход л/час) * (Цена дизеля руб./л) *  (Мощность ДГ кВт*ч) = (Стоимость руб./кВт*ч)</code>.
        Без учета стоимости генератора (при учете стоимости необходимо добавит стоимость работы ДГ путем деления <code>(Стоимость ДГ)/(Моточасы))</code>.
      </p>
      <p>
        Администратор системы самостоятельно устанавливает тариф
        Т<sub>ДГ</sub>, Т<sub>СГ</sub>, Т<sub>ВГ</sub> и Т<sub>ХР</sub>
        за выработанную ЭЭ генераторами (дизельными, солнечными, ветряными и хранилищем)
        руководствуясь информацией о стоимости ресурсов в регионах РФ.
      </p>
      <v-row>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="Стоимость ЭЭ выработанной Дизель-Генератором при 100% загрузке (ТДГ)"
            persistent-hint
            suffix="руб/кВт"
            dense
            step="0.01"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="Стоимость ЭЭ выработанной Солнечным-Генератором (ТСГ)"
            persistent-hint
            suffix="руб/кВт"
            dense
            step="0.01"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="Стоимость ЭЭ выработанной Ветро-Генератором (ТВГ)"
            persistent-hint
            suffix="руб/кВт"
            dense
            step="0.01"
          />
        </v-col>
        <v-col>
          <v-text-field
            class="right-input"
            type="number"
            hint="Стоимость ЭЭ запасенной в Хранилище (ТХР)"
            persistent-hint
            suffix="руб/кВт"
            dense
            step="0.01"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-title>Тарифы на технологическое присоединение объектов потребления к электрическим сетям </v-card-title>
    <v-card-text>
      <p>
        Технологическое присоединение - услуга,
        оказываемая сетевыми организациями заявителям для создания технической возможности потребления электрической энергии.
        Она предусматривает фактическое присоединение энергопринимающих устройств потребителя к
        объектам электросетевого хозяйства сетевых организаций.
        Данная услуга платная и осуществляется путем заключения Договора на технологическое присоединение.
        Стоимость услуги устанавливается государством и является регулируемым тарифом.
        Тариф устанавливается за единицу присоединяемой максимальной мощности объекта потребления имеет размерность руб/кВт (рублей за киловатт).
      </p>
      <v-row class="d-inline-flex">
        <v-col>
          <p>
            Администратор системы самостоятельно устанавливает тариф Т<sup>ТП</sup>
            за технологическое присоединение объектов потребителей (игроков) к сетям,
            руководствуясь информацией о стоимости услуги в регионах РФ.
          </p>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="tech_price"
            class="right-input"
            type="number"
            hint="Стоимость технологического присоединения потребителей к сетям (ТТП)"
            persistent-hint
            suffix="руб/кВт"
            dense
            step="0.01"
            :error-messages="tech_priceErrors"
            @input="$v.tech_price.$touch()"
            @blur="$v.tech_price.$touch()"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal } from 'vuelidate/lib/validators'
import { roundToTwoAsStr } from '~/assets/helpers'

Vue.use(Vuelidate)

const checkGtZeroDec = value => value !== undefined && value !== null && value >= 0.0

export default {
  name: 'TariffsComponent',

  data: () => ({
    trade_price: undefined,
    tech_price: undefined,

    tariff: {
      tk_high: undefined,
      tk_avg_1: undefined,
      tk_avg_2: undefined,
      tk_low: undefined,
      tk_mid: undefined
    },
    sales_allowance: {
      tch_small: undefined,
      tch_avg: undefined,
      tch_large: undefined,
      tch_mid: undefined
    },
    t_service: undefined,
    t_total: undefined,
    t_zone_3: {
      peak: undefined,
      pp: undefined,
      night: undefined
    },
    t_zone_2: {
      day: undefined,
      night: undefined
    }
  }),

  validations: {
    trade_price: { required, decimal, checkGtZeroDec },
    tech_price: { required, decimal, checkGtZeroDec }
  },

  computed: {
    trade_priceErrors () {
      const errors = []
      if (!this.$v.trade_price.$dirty) {
        return errors
      }
      !this.$v.trade_price.decimal && errors.push('Задается вещественным числом')
      !this.$v.trade_price.checkGtZeroDec && errors.push('Не может быть отрицательным')
      !this.$v.trade_price.required && errors.push('Необходимо определить')
      return errors
    },
    tech_priceErrors () {
      const errors = []
      if (!this.$v.tech_price.$dirty) {
        return errors
      }
      !this.$v.tech_price.decimal && errors.push('Задается вещественным числом')
      !this.$v.tech_price.checkGtZeroDec && errors.push('Не может быть отрицательным')
      !this.$v.tech_price.required && errors.push('Необходимо определить')
      return errors
    }
  },

  watch: {
    trade_price (v) {
      this.doCalcTariffs(v)
    }
  },

  created () {
    /* eslint-disable no-console */
    console.info('tariff: created')
    /* eslint-enable no-console */
    this.doCalcTariffs(undefined)
  },

  methods: {
    doCalcTariffs (v) {
      const val = Number(v)
      if (Number.isNaN(val)) {
        this.tariff.tk_high = 0.0
        this.tariff.tk_avg_1 = this.tariff.tk_high
        this.tariff.tk_avg_2 = this.tariff.tk_high
        this.tariff.tk_low = this.tariff.tk_high
        this.tariff.tk_mid = this.tariff.tk_high
        //
        this.sales_allowance.tch_small = this.tariff.tk_high
        this.sales_allowance.tch_avg = this.tariff.tk_high
        this.sales_allowance.tch_large = this.tariff.tk_high
        this.sales_allowance.tch_mid = this.tariff.tk_high
        //
        this.t_service = this.tariff.tk_high
        //
        this.t_total = this.tariff.tk_high
        //
        this.t_zone_3.peak = this.tariff.tk_high
        this.t_zone_3.pp = this.tariff.tk_high
        this.t_zone_3.night = this.tariff.tk_high
        //
        this.t_zone_2.day = this.tariff.tk_high
        this.t_zone_2.night = this.tariff.tk_high
      } else {
        this.tariff.tk_high = val * 0.55
        this.tariff.tk_avg_1 = this.tariff.tk_high * 1.55
        this.tariff.tk_avg_2 = this.tariff.tk_high * 2.21
        this.tariff.tk_low = this.tariff.tk_high * 2.31
        this.tariff.tk_mid = (this.tariff.tk_high + this.tariff.tk_avg_1 + this.tariff.tk_avg_2 + this.tariff.tk_low) / 4.0
        //
        this.sales_allowance.tch_small = (val * 0.049) * 2.61
        this.sales_allowance.tch_avg = (val * 0.049) * 1.12
        this.sales_allowance.tch_large = val * 0.049
        this.sales_allowance.tch_mid = (this.sales_allowance.tch_small + this.sales_allowance.tch_avg + this.sales_allowance.tch_large) / 3.0
        //
        this.t_service = val * 0.001
        //
        this.t_total = this.tariff.tk_mid + this.sales_allowance.tch_mid + this.t_service + val
        //
        this.t_zone_3.peak = this.t_total / 1000.0 * 1.25
        this.t_zone_3.pp = this.t_total / 1000.0
        this.t_zone_3.night = this.t_total / 1000.0 * 0.7
        //
        this.t_zone_2.day = this.t_total / 1000.0 * 1.15
        this.t_zone_2.night = this.t_total / 1000.0 * 0.7
      }
      //
      this.tariff.tk_high = roundToTwoAsStr(this.tariff.tk_high)
      this.tariff.tk_avg_1 = roundToTwoAsStr(this.tariff.tk_avg_1)
      this.tariff.tk_avg_2 = roundToTwoAsStr(this.tariff.tk_avg_2)
      this.tariff.tk_low = roundToTwoAsStr(this.tariff.tk_low)
      this.tariff.tk_mid = roundToTwoAsStr(this.tariff.tk_mid)
      //
      this.sales_allowance.tch_small = roundToTwoAsStr(this.sales_allowance.tch_small)
      this.sales_allowance.tch_avg = roundToTwoAsStr(this.sales_allowance.tch_avg)
      this.sales_allowance.tch_large = roundToTwoAsStr(this.sales_allowance.tch_large)
      this.sales_allowance.tch_mid = roundToTwoAsStr(this.sales_allowance.tch_mid)
      //
      this.t_service = roundToTwoAsStr(this.t_service)
      //
      this.t_total = roundToTwoAsStr(this.t_total)
      //
      this.t_zone_3.peak = roundToTwoAsStr(this.t_zone_3.peak)
      this.t_zone_3.pp = roundToTwoAsStr(this.t_zone_3.pp)
      this.t_zone_3.night = roundToTwoAsStr(this.t_zone_3.night)
      //
      this.t_zone_2.day = roundToTwoAsStr(this.t_zone_2.day)
      this.t_zone_2.night = roundToTwoAsStr(this.t_zone_2.night)
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
