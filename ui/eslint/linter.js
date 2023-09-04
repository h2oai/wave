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
            callee.object &&
            callee.object.name === 'cards' &&
            callee.property &&
            callee.property.name === 'register' &&
            expression.arguments.length === 2 &&
            expression.arguments[1] &&
            expression.arguments[1].name !== 'View'
          ) context.report(expression, `
          Component name should be "View" for card components.
          Replace ${expression.arguments[1].name} with View.
          `)
        }
      })
    },
  }
}