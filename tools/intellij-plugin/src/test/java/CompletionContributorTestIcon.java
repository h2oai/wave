import com.intellij.testFramework.fixtures.LightPlatformCodeInsightFixture4TestCase;
import org.junit.Test;

public class CompletionContributorTestIcon extends LightPlatformCodeInsightFixture4TestCase {

    @Test
    public void inlineCompletion() {
        myFixture.configureByText("test.py", "");
        myFixture.type("ui.button(icon='')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);
        assert myFixture.completeBasic().length != 0;
    }

    @Test
    public void noCompletionOutsideWave() {
        myFixture.configureByText("test.py", "");
        myFixture.type("random_function(icon='')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);
        assert myFixture.completeBasic().length == 0;
    }
}
