module.exports = {
  rules: {
    "box-variable-suffix": {
      meta: {
        type: 'suggestion',
      },
      create: context => ({
        VariableDeclaration: node => {
          if (!node.declarations) return

          node.declarations.forEach(({ init, id }) => {
            if (init && init.callee) {
              const isBoxed = init.callee.name === 'box'
              const varName = id.name
              if (isBoxed && !varName.endsWith('B')) {
                context.report(node, `${varName} should be suffixed with B since it is boxed.`)
              }
            }
          })
        }
      })
    },
    "card-variable-name": {
      meta: {
        type: 'suggestion',
      },
      create: context => ({
        ExpressionStatement: node => {
          const expression = node.expression
          if (!expression) return

          const callee = expression.callee
          if (!callee) return

          if (
            callee.object?.name === 'cards' &&
            callee.property?.name === 'register' &&
            expression.arguments.length === 2 &&
            expression.arguments[1]?.name !== 'View'
          ) context.report(expression, `
          Component name should be "View" for card components.
          Replace ${expression.arguments[1].name} with View.
          `)
        }
      })
    },
    "data-test-on-component": {
      meta: {
        type: 'suggestion',
      },
      create: context => ({
        ReturnStatement: node => {
          // TODO: Remove when https://github.com/h2oai/qd/pull/70 will be merged.
          return

          if (!node.argument) return

          const openingEl = node.argument.openingElement
          if (node.argument.type !== 'JSXElement' && openingEl !== 'JSXOpeningElement') return

          const isFormOrCard = (node) => {
            if (!node) return false

            const isCard = node.id && node.id.name === 'View'
            const isFormComponent = node.id && node.id.name.startsWith('X')

            return isCard || isFormComponent || isFormOrCard(node.parent)
          }

          const isWithinRender = (node) => {
            if (!node) return false
            return node.id && node.id.name === 'render' || isWithinRender(node.parent)
          }

          const isWithinMapFunc = (node) => {
            if (!node) return false
            return node.init && node.init.callee && node.init.callee.property && node.init.callee.property.name === 'map' || isWithinMapFunc(node.parent)
          }

          if (
            !isWithinMapFunc(node.parent) &&
            isWithinRender(node.parent) &&
            isFormOrCard(node.parent) &&
            !openingEl.attributes.find(({ name }) => name && name.name === 'data-test')
          ) {
            context.report(openingEl, 'React component wrapper must have data-test attribute specified.')
          }
        }
      })
    },
  }
}