import { Card, connect, on, Page, WaveErrorCode, WaveEventType } from 'h2o-wave'
import * as Handlebars from 'handlebars'

type Template = {
  hash: string,
  render: HandlebarsTemplateDelegate<any>,
}

const
  init = () => {
    const
      root = document.getElementById('root') || document.getElementsByTagName('body')[0],
      templates: { [name: string]: Template } = {},
      isMeta = (card: Card) => card.name === '__meta__',
      renderPage = (page: Page) => {
        const
          all = page.items(),
          meta = all.find(card => isMeta(card)),
          cards = all.filter(card => !isMeta(card))

        if (!meta) return

        renderCard(meta)
        on(meta.changed, () => {
          renderCard(meta)
          cards.forEach(renderCard)
        })
        cards.forEach(card => {
          renderCard(card)
          on(card.changed, () => renderCard(card))
        })
      },
      renderCard = (card: Card) => {
        let t = templates[card.name]
        const template = card.state.__template__ as string
        if (!t || (t && t.hash !== template)) { // TODO optimize
          t = templates[card.name] = {
            hash: template,
            render: Handlebars.compile(template),
          }
        }
        if (t) {
          const content = t.render(card.state)
          if (isMeta(card)) {
            root!.innerHTML = content
          } else {
            root!.querySelector(`#${card.name}`)!.innerHTML = content
          }
        }
      },
      handleError = (message: string) => {
        root!.innerText = message
      }

    connect(e => {
      switch (e.t) {
        case WaveEventType.Page:
          const { page } = e
          renderPage(page)
          on(page.changed, () => renderPage(page))
          break
        case WaveEventType.Error:
          switch (e.code) {
            case WaveErrorCode.PageNotFound:
              handleError('Page not found')
              break
            default:
              handleError('Unknown remote error')
          }
          break
        case WaveEventType.Exception:
          handleError(`Unhandled exception: ${e.error}`)
          break
        case WaveEventType.Disconnect:
          handleError(`Disconnected. Reconnecting in ${e.retry}s`)
          break
        case WaveEventType.Reset:
          window.location.reload()
          break
      }
    })
  }

document.addEventListener('DOMContentLoaded', init)
