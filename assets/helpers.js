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
export const API_FORECAST_UPLOAD_SERVICE = API_FORECAST_SERVICE + '/upload'
export const API_FORECAST_EXPORT_SERVICE = API_FORECAST_SERVICE + '/export'

export const API_SUN_SERVICE_ON = REST_API_URL + '/sun/on'
export const API_SUN_SERVICE_OFF = REST_API_URL + '/sun/off'
export const API_SUN_SERVICE_START = REST_API_URL + '/sun/service/start'
export const API_SUN_SERVICE_STOP = REST_API_URL + '/sun/service/stop'
export const API_SUN_SERVICE_RESTART = REST_API_URL + '/sun/service/restart'
export const API_SUN_SERVICE_SETPOWER = REST_API_URL + '/sun'

export const API_WIND_SERVICE = REST_API_URL + '/wind'
export const API_WIND_SERVICE_ON = API_WIND_SERVICE + '/on'
export const API_WIND_SERVICE_OFF = API_WIND_SERVICE + '/off'
export const API_WIND_SERVICE_SETPOWER = API_WIND_SERVICE + '/power'
export const API_WIND_SERVICE_SETURL = API_WIND_SERVICE + '/url'
export const API_WIND_SERVICE_RECONNECT = API_WIND_SERVICE + '/reconnect'

export const API_TARIFFS_SERVICE = API_COMMON_INFO_SERVICE + '/tariffs'
export const API_CRITERIA_SERVICE = API_COMMON_INFO_SERVICE + '/criteria'

//
export const DELAY_BEFORE_SAVE_CHANGES = 500

//
export const DELAY_BEFORE_CHECK_VALUE = 3000

//
export const roundToTwoAsStr = val => (Math.round(val * 100.0) / 100.0).toFixed(2).replace('.', ',')
