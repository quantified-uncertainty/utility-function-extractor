import crypto from "crypto"

export const hashString = (string) => crypto.createHash('md5').update(string).digest('hex');

export const transformSliderValueToActualValue = value => 10 ** value //>= 2 ? Math.round(10 ** value) : Math.round(10 * 10 ** value) / 10
export const toLocale = x => Number(x).toLocaleString()
export const truncateValueForDisplay = value => {
    if(value > 10){
        return Number(Math.round(value).toPrecision(2))
    }else if(value > 1){
        return Math.round(value * 10) / 10
    } else if(value < 1){
        
    }
}
export const transformSliderValueToPracticalValue = value => truncateValueForDisplay(transformSliderValueToActualValue(value))
