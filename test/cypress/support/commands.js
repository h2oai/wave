// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const commands = {
  locate: (name, opts) => cy.get(name.split(/\s+/g).map(t => `[data-test="${t}"]`).join(' '), opts),
};

(() => { for (const k in commands) Cypress.Commands.add(k, commands[k]) })()

Cypress.Commands.overwrite("type", (originalFn, element, text, options) => {
  if (!options) options = { delay: 500 }
  if (!options.delay) options = { ...options, delay: 500 }

  return originalFn(element, text, options)
})