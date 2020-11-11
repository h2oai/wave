export const validateFileName = (val: string, takenValues: string[]): string => {
  return takenValues.some(v => v === `${val}.py`)
    ? 'File with such name already exists.'
    : /^\w+$/.test(val)
      ? ''
      : 'File name can contain only word characters, numbers and underscore ("_").'
}

export const validateAppName = (val: string, takenValues: string[]): string => {
  return takenValues.some(v => v === val)
    ? 'App with such name already exists.'
    : /^\w+$/.test(val)
      ? ''
      : 'App name can contain only word characters, numbers and underscore ("_").'
}
