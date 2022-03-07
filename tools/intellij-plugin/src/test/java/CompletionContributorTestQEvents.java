import com.intellij.codeInsight.lookup.LookupElement;
import com.intellij.openapi.editor.Caret;
import com.intellij.testFramework.fixtures.LightPlatformCodeInsightFixture4TestCase;
import org.junit.Test;


public class CompletionContributorTestQEvents extends LightPlatformCodeInsightFixture4TestCase {

    @Test
    public void notInPythonFile() {
        myFixture.configureByText("test.txt", "ui.plot(events=['event1'])");
        myFixture.type("q.events.");

        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void nameCompletion() {
        myFixture.configureByText("test.py", "ui.plot(name='plot', events=['event1'])");
        myFixture.type("q.events.");

        LookupElement[] lookupElements = myFixture.completeBasic();
        assert lookupElements.length == 1;
        assert lookupElements[0].getLookupString().equals("plot");
    }

    @Test
    public void inline() {
        myFixture.configureByText("test.py", "ui.plot(name='plot', events=['event1'])");
        myFixture.type("q.events.plot.");

        LookupElement[] lookupElements = myFixture.completeBasic();
        assert lookupElements.length == 1;
        assert lookupElements[0].getLookupString().equals("event1");
    }

    @Test
    public void noCompletion() {
        myFixture.configureByText("test.py", "ui.plot(events=['event1'])");
        myFixture.type("q.");

        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void multiline() {
        myFixture.configureByText("test.py", "ui.plot(\n\t\tevents=['event1']\n, name='plot')");
        myFixture.type("q.events.plot.");

        LookupElement[] lookupElements = myFixture.completeBasic();
        assert lookupElements.length == 1;
        assert lookupElements[0].getLookupString().equals("event1");
    }

    @Test
    public void noFormattedFStrings() {
        myFixture.configureByText("test.py", "ui.plot(\n\t\tevents=[f'event{var}']\n, name='plot')");
        myFixture.type("q.events.plot.");

        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void noConcatenatedStrings() {
        myFixture.configureByText("test.py", "ui.plot(\n\t\tevents=['event' + 'var']\n, name='plot')");
        myFixture.type("q.events..plot.");

        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void fromImportFunction() {
        myFixture.addFileToProject("utils.py", "def func():\n\tui.plot(name='plot', events=['event1'])");
        myFixture.configureByText("test.py", "from utils import func");
        myFixture.type("q.events.plot.");

        assert myFixture.completeBasic()[0].getLookupString().equals("event1");
    }

    @Test
    public void importedFile() {
        // HACK: Single autocomplete suggestions is automatically submitted so include at least 2.
        myFixture.addFileToProject("utils.py", "import test\nui.plot(name='plot', events=['event1'])\nui.plot(events=['event2'])");
        myFixture.configureByText("test.py", "");
        myFixture.type("q.events.plot.");

        LookupElement[] lookupElements = myFixture.completeBasic();
        assert lookupElements.length == 2;
        assert lookupElements[0].getLookupString().equals("event1");
    }

    @Test
    public void fromImportedFile() {
        // HACK: Single autocomplete suggestions is automatically submitted so include at least 2.
        myFixture.addFileToProject("utils.py", "from test import var\nui.plot(name='plot', events=['event1', 'event2'])");
        myFixture.configureByText("test.py", "var='var'");
        myFixture.type("q.events.plot.");

        LookupElement[] lookupElements = myFixture.completeBasic();
        assert lookupElements.length == 2;
        assert lookupElements[0].getLookupString().equals("event1");
    }

    @Test
    public void autocompleteContinue() {
        myFixture.configureByText("test.py", "ui.plot(name='plot', events=['event1'])");
        myFixture.type("q.events.plot.ev");
        // Simulate returning back to original autocomplete.
        Caret currentCaret = myFixture.getEditor().getCaretModel().getCurrentCaret();
        int offset = currentCaret.getOffset();
        currentCaret.moveToOffset(0);
        currentCaret.moveToOffset(offset);

        LookupElement[] lookupElements = myFixture.completeBasic();
        assert lookupElements.length == 1;
        assert lookupElements[0].getLookupString().equals("event1");
        assert myFixture.completeBasic()[0].getLookupString().equals("event1");
    }

    @Test
    public void autocompleteStop() {
        myFixture.configureByText("test.py", "ui.plot(name='plot', events=['event1'])");
        myFixture.type("q.events.plot.event1.");
        assert myFixture.completeBasic().length == 0;
    }
}
