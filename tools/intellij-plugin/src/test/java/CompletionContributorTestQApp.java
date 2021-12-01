import com.intellij.codeInsight.lookup.LookupElement;
import com.intellij.openapi.editor.Caret;
import com.intellij.testFramework.fixtures.LightPlatformCodeInsightFixture4TestCase;
import org.junit.Test;

import java.util.Arrays;


public class CompletionContributorTestQApp extends LightPlatformCodeInsightFixture4TestCase {

    @Test
    public void noCompletionInNonPythonFile(){
        myFixture.configureByText("test.txt", "q.app.app1");
        myFixture.type("q.app.");

        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void inline() {
        myFixture.configureByText("test.py", "q.app.app1");
        myFixture.type("q.app.");

        assert myFixture.completeBasic()[0].getLookupString().equals("app1");
    }

    @Test
    public void bracketNotation() {
        // HACK: define multiple names to prevent auto-insertion.
        myFixture.configureByText("test.py", "q.app.app1\nq.app.app2");
        myFixture.type("q.app['']");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);
        assert myFixture.completeBasic()[0].getLookupString().equals("app1");
    }
    
    @Test
    public void importFile() {
        myFixture.addFileToProject("utils.py", "q.app.app1");
        myFixture.configureByText("test.py", "import utils\n");
        myFixture.type("q.app.");

        assert myFixture.completeBasic()[0].getLookupString().equals("app1");
    }

    @Test
    public void fromImport() {
        myFixture.addFileToProject("utils.py", "def func():\n\tq.app.app");
        myFixture.configureByText("test.py", "from utils import func");
        myFixture.type("q.app.");

        assert myFixture.completeBasic()[0].getLookupString().equals("app");
    }

    @Test
    public void importedFile() {
        // HACK: Single autocomplete suggestions is automatically submitted so include at least 2.
        myFixture.addFileToProject("utils.py", "import test\nq.app.app1 = ''\nq.app.app2 = ''");
        myFixture.configureByText("test.py", "");
        myFixture.type("q.app.");

        assert myFixture.completeBasic()[0].getLookupString().equals("app1");
    }

    @Test
    public void fromImportedFile() {
        // HACK: Single autocomplete suggestions is automatically submitted so include at least 2.
        myFixture.addFileToProject("utils.py", "from test import var\nq.app.app1 = ''\nq.app.app2 = ''");
        myFixture.configureByText("test.py", "var='var'");
        myFixture.type("q.app.");

        assert myFixture.completeBasic()[0].getLookupString().equals("app1");
    }

    @Test
    public void autocompleteContinue() {
        myFixture.configureByText("test.py", "q.app.app1");
        myFixture.type("q.app.ap");
        // Simulate returning back to original autocomplete.
        Caret currentCaret = myFixture.getEditor().getCaretModel().getCurrentCaret();
        int offset = currentCaret.getOffset();
        currentCaret.moveToOffset(0);
        currentCaret.moveToOffset(offset);

        LookupElement[] lookupElements = myFixture.completeBasic();
        assert lookupElements.length == 2; // There are 2 suggestions because 1 is from IntelliJ itself.
        assert lookupElements[0].getLookupString().equals("app1");
    }

    @Test
    public void autocompleteStop() {
        myFixture.configureByText("test.py", "q.app.app1");
        myFixture.type("q.app.app1.");
        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void autocompleteStopBracketNotation() {
        // HACK: define multiple names to prevent auto-insertion.
        myFixture.configureByText("test.py", "q.app.app\nq.app.app");
        myFixture.type("q.app['']['']");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);
        assert myFixture.completeBasic().length == 0;
    }

    @Test
    public void correctParsing() {
        myFixture.configureByText("test.py", "q.app.app1\nq.app.app1.add()");
        myFixture.type("q.app.");

        LookupElement[] lookupElements = myFixture.completeBasic();
        assert lookupElements.length == 2; // There are 2 suggestions because 1 is from IntelliJ itself.
        assert lookupElements[0].getLookupString().equals("app1");
        assert Arrays.stream(lookupElements).noneMatch(e -> e.getLookupString().equals("add"));
    }
}
