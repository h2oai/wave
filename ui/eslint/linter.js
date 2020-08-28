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
    "data-test-on-component": {
      meta: {
        type: 'suggestion',
      },
      create: context => ({
        VariableDeclaration: node => {
          if (!node.declarations) return

          node.declarations.forEach(({ init, id }) => {
            if (init && id.name === 'render' && init.body.body) {
              const { argument } = init.body.body.find(({ type }) => type === 'ReturnStatement')
              const found =
                argument.type === 'JSXElement' &&
                argument.openingElement.attributes &&
                argument.openingElement.attributes.length &&
                argument.openingElement.attributes.find((({ name }) => name.name === 'data-test'))

              if (!found) context.report(node, `Wrapper component in render must have a data-test attribute.`)
            }
          })
        }
      })
    },
  }
}