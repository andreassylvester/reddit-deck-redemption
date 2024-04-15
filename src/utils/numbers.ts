export const formatPossiblyLargeNumber = (num: number): string => {
  if (num >= 1000) {
    const fractionString = `${ num / 1000 }`
    const decimalPosition = fractionString.indexOf(".")
    let returnString = fractionString
    
    if (decimalPosition !== -1) {
      returnString = fractionString.substring(
        0,
        Math.min(decimalPosition + 2, fractionString.length)
      )
    }

    return `${ returnString }k`
  }

  return `${ num }`
}
