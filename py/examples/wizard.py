# Wizard
# Create a multi-step #wizard using #form cards.
# ---
from h2o_wave import Q, ui, main, app, cypress, Cypress, data


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.plot_card(
        box='1 1 4 5',
        title='Label Customization',
        data=data('profession salary', 10, rows=[
            ('medicine', 33000),
            ('fire fighting', 18000),
            ('pedagogy', 24000),
            ('psychology', 22500),
            ('computer science', 36000),
        ]),
        plot=ui.plot([
            ui.mark(
                type='interval',
                x='=profession',
                y='=salary', y_min=0,
                label='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
                label_offset=0, label_position='middle', label_rotation='-90', label_fill_color='#fff',
                label_font_weight='bold'
            )
        ])
    )

    await q.page.save()


@cypress('Walk through the wizard')
def try_walk_through(cy: Cypress):
    cy.visit('/demo')
    cy.locate('step1').click()
    cy.locate('text').should('contain.text', 'What is your name?')
    cy.locate('nickname').clear().type('Fred')
    cy.locate('step2').click()
    cy.locate('text').should('contain.text', 'Hi Fred! How do you feel right now?')
    cy.locate('feeling').clear().type('quirky')
    cy.locate('step3').click()
    cy.locate('text').should(
        'contain.text', 'What a coincidence, Fred! I feel quirky too!'
    )
