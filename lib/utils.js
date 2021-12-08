import crypto from "crypto"

export const hashString = (string) => crypto.createHash('md5').update(string).digest('hex');
const id = x => x
export const transformSliderValueToActualValue = id
export const transformSliderValueToPracticalValue = id

export const _transformSliderValueToActualValue = value => 10 ** value //>= 2 ? Math.round(10 ** value) : Math.round(10 * 10 ** value) / 10
export const toLocale = x => Number(x).toLocaleString()
export const truncateValueForDisplay = value => {
    if (value > 10) {
        return Number(Math.round(value).toPrecision(2))
    } else if (value > 1) {
        return Math.round(value * 10) / 10
    } else if (value < 1) {

    }
}
export const _transformSliderValueToPracticalValue = value => truncateValueForDisplay(transformSliderValueToActualValue(value))

export function numToAlphabeticalString(num) {
    // https://stackoverflow.com/questions/45787459/convert-number-to-alphabet-string-javascript/45787487
    num = num + 1
    var s = '', t;
    while (num > 0) {
        t = (num - 1) % 26;
        s = String.fromCharCode(65 + t) + s;
        num = (num - t) / 26 | 0;
    }
    return `#${s}` || undefined;
}

export function formatLargeOrSmall(num) {
    if (num > 1) {
        return toLocale(truncateValueForDisplay(num))
    } else if (num > 0) {
        return num.toFixed(-Math.floor(Math.log(num) / Math.log(10)) + 1);
    } else if (num < -1) {
        return num.toFixed(-Math.floor(Math.log(-num) / Math.log(10)) + 1);
    } else {
        return toLocale(num)//return "~0"

    }
}
const firstFewMaxMergeSortSequence = [0, 0, 1, 3, 5, 8, 11, 14, 17, 21, 25, 29, 33, 37, 41, 45, 49, 54, 59, 64, 69, 74, 79, 84, 89, 94, 99, 104, 109, 114, 119, 124, 129, 135, 141, 147, 153, 159, 165, 171, 177, 183, 189, 195, 201, 207, 213, 219, 225, 231, 237, 243, 249, 255, 261, 267, 273, 279, 285]

export function maxMergeSortSteps(n) {
    if (n < firstFewMaxMergeSortSequence.length) {
        return firstFewMaxMergeSortSequence[n]
    } else {
        return maxMergeSortSteps(Math.floor(n / 2)) + maxMergeSortSteps(Math.ceil(n / 2)) + n - 1
    }
}

export function expectedNumMergeSortSteps(n) {
    // https://cs.stackexchange.com/questions/82862/expected-number-of-comparisons-in-a-merge-step
    // n-2 for each step, so (n-2) + (n-2)/2 + (n-2)/4 + ...
    // ~ 2*(n-2) -1 = 2*n - 3
    if (n == 0) {
        return 0
    } else if (n == 1) {
        return 0
    } else if (n == 2) {
        return 1
    } else if (n == 3) {
        return 2
    } else {
        return Math.ceil((n ** 2) / (n + 2)) + expectedNumMergeSortSteps(Math.ceil(n / 2))
    }
}

export const avg = arr => arr.reduce((a, b) => (a + b), 0) / arr.length
