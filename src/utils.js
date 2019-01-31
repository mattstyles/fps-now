
export const tail = arr => arr[arr.length - 1]
export const head = arr => arr[0]

export const normalize = (max, curr) => {
  return max - curr / 100 * max
}

export const sum = (a, b) => a + b
export const average = arr => arr.reduce(sum, 0) / arr.length
