import com.intellij.testFramework.fixtures.LightPlatformCodeInsightFixture4TestCase;
import org.h2o.utils.UtilsResources;
import org.junit.Test;

public class CompletionContributorTestTheme extends LightPlatformCodeInsightFixture4TestCase {

    @Test
    public void inlineCompletion() {
        myFixture.configureByText("test.py", "");
        myFixture.type("ui.meta_card(theme='')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);
        assert myFixture.completeBasic().length == UtilsResources.THEMES.length;
    }

}
