export const validateFileName = (val: string): string =>
  /^\w+$/.test(val) ? '' : 'File name can contain only word characters, numbers and underscore ("_")'