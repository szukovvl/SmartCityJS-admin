//
export const CONSUMER_BY_TYPES = [
  { text: '1-й категории', value: 'HOSPITAL' },
  { text: '2-й категории', value: 'INDUSTRY' },
  { text: '3-й категории', value: 'DISTRICT' }
]

export const ALTERNATION_BY_TYPES = [
  { text: 'солнечная', value: 'SOLAR' },
  { text: 'ветровая', value: 'WIND' }
]

export const PRICE_CATEGORIES = [
  { text: 'Первая Ценовая Категория ЦК 1', value: 'CATEGORY_1' },
  { text: 'Вторая Ценовая Категория ЦК 2', value: 'CATEGORY_2' },
  { text: 'Третья ценовая категория ЦК 3', value: 'CATEGORY_3' },
  { text: 'Четвертая Ценовая Категория ЦК 4', value: 'CATEGORY_4' },
  { text: 'Пятая Ценовая Категория ЦК 5', value: 'CATEGORY_5' },
  { text: 'Шестая Ценовая Категория ЦК 6', value: 'CATEGORY_6' }
]

export const VOLTAGE_LEVELS = [
  { text: 'Высокое напряжение (ВН) 110 кВ', value: 'HIGH_VOLTAGE' },
  { text: 'Среднее напряжение (СН1) 35 кВ', value: 'AVG_VOLTAGE_1' },
  { text: 'Среднее напряжение (СН2) 3 кВ', value: 'AVG_VOLTAGE_2' },
  { text: 'Низкое напряжение (НН) 0,4 кВ', value: 'LOW_VOLTAGE' }
]

export const GENERATION_USAGE_MODES = [
  { text: 'Непрерывное использование', value: 'ALWAYS' },
  { text: 'Резервная генерация', value: 'RESERVE' }
]

export const ENERGYSTORAGE_CHARGEBEHAVIORS = [
  { text: 'Зарядка в любое время', value: 'ANYTIME' },
  { text: 'Зарядка только при действии низкого тарифа', value: 'LOWTARIFF' }
]

export const ENERGYSTORAGE_STATES = [
  { text: 'Заряжено', value: 'CHARGED' },
  { text: 'Разряжено', value: 'DISCHARGED' }
]

//
const REST_API_URL = '/api'
export const API_COMMON_INFO_SERVICE = REST_API_URL + '/common'
export const API_ENERGY_SERVICE_FIND = REST_API_URL + '/energy/find'
export const API_ENERGY_SERVICE_DATA = REST_API_URL + '/energy/data'
export const API_ENERGY_SERVICE_FORECAST = REST_API_URL + '/energy/forecast'
export const API_ENERGY_SERVICE_INTERPOLATE = REST_API_URL + '/energy/interpolate'
export const API_FORECAST_SERVICE = REST_API_URL + '/forecast'
export const API_FORECAST_SERVICE_INTERPOLATION = REST_API_URL + '/forecast/interpolate'
export const API_FORECAST_SERVICE_RANDOMIZE = REST_API_URL + '/forecast/random'

//
export const DELAY_BEFORE_SAVE_CHANGES = 500
