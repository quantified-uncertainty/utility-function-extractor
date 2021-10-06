import crypto from "crypto"

export const hashString = (string) => crypto.createHash('md5').update(string).digest('hex');

export const transformSliderValueToActualValue = value => 10 ** value //>= 2 ? Math.round(10 ** value) : Math.round(10 * 10 ** value) / 10
export const toLocale = x => Number(x).toLocaleString()
export const truncateValueForDisplay = value => value > 10 ? Number(Math.round(value).toPrecision(2)) : Math.round(value * 10) / 10
export const transformSliderValueToPracticalValue = value => truncateValueForDisplay(transformSliderValueToActualValue(value))
