from h2o_q import Test, with_app


class TestWizard(Test):
    @with_app("examples/wizard")
    def test_wizard(self):
        self.visit("/demo")
        self.click('button[data-test="step1"]')
        self.assert_text("What is your name?")
        self.type('input[data-test="nickname"]', "Fred\n")
        self.slow_click('button[data-test="step2"]')
        self.assert_text("Hi Fred! How do you feel right now?")
        self.type('input[data-test="feeling"]', "quirky\n")
        self.slow_click('button[data-test="step3"]')
        self.assert_text("What a coincidence, Fred! I feel quirky too!")
