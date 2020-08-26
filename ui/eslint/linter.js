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
                context.report(node, `${varName} should be suffixed with B since it is a boxed.`)
              }
            }
          })
        }
      })
    }
  }
}