import com.intellij.codeInsight.lookup.LookupElement;
import com.intellij.openapi.editor.Caret;
import com.intellij.testFramework.fixtures.LightPlatformCodeInsightFixture4TestCase;
import org.junit.Test;


public class CompletionContributorTestQArgs extends LightPlatformCodeInsightFixture4TestCase {

    @Test
    public void notInPythonFile() {
        myFixture.configureByText("test.txt", "ui.button(name='btn')");
        myFixture.type("q.args.");

        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void inline() {
        myFixture.configureByText("test.py", "ui.button(name='btn')");
        myFixture.type("q.args.");

        assert myFixture.completeBasic()[0].getLookupString().equals("btn");
    }

    @Test
    public void noCompletion() {
        myFixture.configureByText("test.py", "ui.button(name='btn')");
        myFixture.type("q.");

        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void noFormattedFStrings() {
        myFixture.configureByText("test.py", "ui.button(name=f'btn')\nui.button(name='btn2')");
        myFixture.type("q.args.");

        assert myFixture.completeBasic()[0].getLookupString().equals("btn2");
    }

    @Test
    public void noConcatenatedStrings() {
        myFixture.configureByText("test.py", "ui.button(name='btn' + 'btn')\nui.button(name='btn2')");
        myFixture.type("q.args.");

        assert myFixture.completeBasic()[0].getLookupString().equals("btn2");
    }

    @Test
    public void multiline() {
        myFixture.configureByText("test.py", "ui.button(\n\t\tname='btn'\n)");
        myFixture.type("q.args.");

        assert myFixture.completeBasic()[0].getLookupString().equals("btn");
    }

    @Test
    public void noRouteHashes() {
        myFixture.configureByText("test.py", "ui.button(name='#btn')");
        myFixture.type("q.args.");

        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void bracketNotation() {
        // HACK: define multiple names to prevent auto-insertion.
        myFixture.configureByText("test.py", "ui.button(name='btn')\nui.button(name='btn2')\n");
        myFixture.type("q.args['']");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);
        assert myFixture.completeBasic()[0].getLookupString().equals("btn");
    }

    @Test
    public void importedFile() {
        // HACK: Single autocomplete suggestions is automatically submitted so include at least 2.
        myFixture.addFileToProject("utils.py", "import test\nui.button(name='btn')\nui.button(name='btn1')");
        myFixture.configureByText("test.py", "");
        myFixture.type("q.args.");

        assert myFixture.completeBasic()[0].getLookupString().equals("btn");
    }

    @Test
    public void fromImportedFile() {
        // HACK: Single autocomplete suggestions is automatically submitted so include at least 2.
        myFixture.addFileToProject("utils.py", "from test import var\nui.button(name='btn')\nui.button(name='btn1')");
        myFixture.configureByText("test.py", "var='var'");
        myFixture.type("q.args.");

        assert myFixture.completeBasic()[0].getLookupString().equals("btn");
    }

    @Test
    public void autocompleteContinue() {
        myFixture.configureByText("test.py", "ui.button(name='btn1')");
        myFixture.type("q.args.bt");
        // Simulate returning back to original autocomplete.
        Caret currentCaret = myFixture.getEditor().getCaretModel().getCurrentCaret();
        int offset = currentCaret.getOffset();
        currentCaret.moveToOffset(0);
        currentCaret.moveToOffset(offset);

        assert myFixture.completeBasic()[0].getLookupString().equals("btn1");
    }
}
