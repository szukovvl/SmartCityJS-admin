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
  { text: 'Вторая Ценовая Категория ЦК 2 для двух зон суток', value: 'CATEGORY_2_2' },
  { text: 'Вторая Ценовая Категория ЦК 2 для трех зон суток', value: 'CATEGORY_2_3' }
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
const WS_API_BASE_URL = '/wsapi'
export const WS_API_INFO_SERVICE = WS_API_BASE_URL + '/common'

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
export const API_FORECAST_UPLOAD_SERVICE = API_FORECAST_SERVICE + '/upload'
export const API_FORECAST_EXPORT_SERVICE = API_FORECAST_SERVICE + '/export'

export const API_SUN_SERVICE = REST_API_URL + '/sun'
export const API_SUN_SERVICE_POWER = API_SUN_SERVICE + '/power'
export const API_SUN_SERVICE_ON = API_SUN_SERVICE + '/on'
export const API_SUN_SERVICE_OFF = API_SUN_SERVICE + '/off'
export const API_SUN_SERVICE_FORECAST = API_SUN_SERVICE + '/forecast'
export const API_SUN_SERVICE_FORECAST_ALL = API_SUN_SERVICE_FORECAST + '/all'
export const API_SUN_SERVICE_INTERPOLATE = API_SUN_SERVICE + '/interpolate'

export const API_WIND_SERVICE = REST_API_URL + '/wind'
export const API_WIND_SERVICE_ON = API_WIND_SERVICE + '/on'
export const API_WIND_SERVICE_OFF = API_WIND_SERVICE + '/off'
export const API_WIND_SERVICE_SETPOWER = API_WIND_SERVICE + '/power'
export const API_WIND_SERVICE_SETURL = API_WIND_SERVICE + '/url'
export const API_WIND_SERVICE_RECONNECT = API_WIND_SERVICE + '/reconnect'
export const API_WIND_SERVICE_FORECAST = API_WIND_SERVICE + '/forecast'
export const API_WIND_SERVICE_FORECAST_ALL = API_WIND_SERVICE_FORECAST + '/all'
export const API_WIND_SERVICE_INTERPOLATE = API_WIND_SERVICE + '/interpolate'

export const API_STAND_SERVICE = REST_API_URL + '/stand'
export const API_STAND_SERVICE_START = API_STAND_SERVICE + '/service/start'
export const API_STAND_SERVICE_STOP = API_STAND_SERVICE + '/service/stop'
export const API_STAND_SERVICE_RESTART = API_STAND_SERVICE + '/service/restart'
export const API_STAND_SERVICE_CONTROLDATA = API_STAND_SERVICE + '/control'
export const API_STAND_SERVICE_PORTNAMES = API_STAND_SERVICE + '/ports'

export const API_TARIFFS_SERVICE = API_COMMON_INFO_SERVICE + '/tariffs'
export const API_CRITERIA_SERVICE = API_COMMON_INFO_SERVICE + '/criteria'

//
export const DELAY_BEFORE_SAVE_CHANGES = 500

//
export const DELAY_BEFORE_CHECK_VALUE = 3000

//
export const roundToTwoAsStr = val => (Math.round(val * 100.0) / 100.0).toFixed(2).replace('.', ',')

export function round (value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}
