import crypto from "crypto"

export const hashString = (string) => crypto.createHash('md5').update(string).digest('hex');
const id = x => x
export const transformSliderValueToActualValue = id
export const transformSliderValueToPracticalValue = id

export const _transformSliderValueToActualValue = value => 10 ** value //>= 2 ? Math.round(10 ** value) : Math.round(10 * 10 ** value) / 10
export const toLocale = x => Number(x).toLocaleString()
export const truncateValueForDisplay = value => {
    if(value > 10){
        return Number(Math.round(value).toPrecision(2))
    }else if(value > 1){
        return Math.round(value * 10) / 10
    } else if(value < 1){
        
    }
}
export const _transformSliderValueToPracticalValue = value => truncateValueForDisplay(transformSliderValueToActualValue(value))

export function numToAlphabeticalString(num){
    // https://stackoverflow.com/questions/45787459/convert-number-to-alphabet-string-javascript/45787487
    num=num+1
    var s = '', t;
    while (num > 0) {
        t = (num - 1) % 26;
        s = String.fromCharCode(65 + t) + s;
        num = (num - t)/26 | 0;
    }
    return `#${s}` || undefined;
}
