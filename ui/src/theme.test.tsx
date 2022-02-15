import { border, centerMixin, clas, cssVar, dashed, margin, padding, pc, px, rem } from "./theme"

describe('Theme util functions', () => {

  it('returns string ending with px', () => {
    expect(px(10)).toEqual('10px')
  })

  it('returns string ending with %', () => {
    expect(pc(10)).toEqual('10%')
  })

  it('returns string ending with rem', () => {
    expect(rem(10)).toEqual('10rem')
  })

  it('returns single joined string', () => {
    expect(clas('class-a', 'class-b')).toEqual('class-a class-b')
  })

  it('returns a valid solid border string', () => {
    expect(border(2, 'red')).toEqual('2px solid red')
  })

  it('returns a valid dashed border string', () => {
    expect(dashed(2, 'red')).toEqual('2px dashed red')
  })

  it('returns a valid padding string', () => {
    expect(padding(2)).toEqual('2px')
    expect(padding(2, 2)).toEqual('2px 2px')
    expect(padding(2, 2, 2)).toEqual('2px 2px 2px')
    expect(padding(2, 2, 2, 2)).toEqual('2px 2px 2px 2px')
  })

  it('returns a valid margin string', () => {
    expect(margin(2)).toEqual('2px')
    expect(margin(2, 2)).toEqual('2px 2px')
    expect(margin(2, 2, 2)).toEqual('2px 2px 2px')
    expect(margin(2, 2, 2, 2)).toEqual('2px 2px 2px 2px')
  })

  it('returns expected flex centering obj', () => {
    expect(centerMixin()).toMatchObject({ display: 'flex', alignItems: 'center', justifyContent: 'center' })
  })

  describe('CSS var func', () => {

    it('returns gray theme color by default', () => {
      expect(cssVar()).toEqual('var(--gray, var(--gray))')
    })

    it('returns theme color if prefixed with $', () => {
      expect(cssVar('$red')).toEqual('var(--red, var(--gray))')
    })

    it('returns regular CSS color if not prefixed with $', () => {
      expect(cssVar('red')).toEqual('red')
    })
  })
})