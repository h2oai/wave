import { F } from "../core"

export const
  averageChannels = (channel1: Float32Array, channel2?: Float32Array) => {
    if (!channel2) return channel1
    const result = new Float32Array(channel1.length)
    for (let i = 0; i < channel1.length; i++) {
      result[i] = (channel1[i] + channel2[i]) / 2
    }
    return result
  },
  parseAudioData = (samples: F, rawData: Float32Array) => {
    if (!samples) return []

    const blockSize = Math.floor(rawData.length / samples)
    const filteredData = new Array<F>(samples)
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i // the location of the first sample in the block
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      filteredData[i] = sum / blockSize // divide the sum by the block size to get the average
    }
    const multiplier = Math.pow(Math.max(...filteredData), -1)
    return filteredData.map(n => n * multiplier)
  }