import com.intellij.codeInsight.completion.CompletionType;
import com.intellij.codeInsight.lookup.LookupElement;
import com.intellij.testFramework.fixtures.LightPlatformCodeInsightFixture4TestCase;
import org.junit.Test;

import java.util.List;

public class CompletionContributorTestZone extends LightPlatformCodeInsightFixture4TestCase {

    @Test
    public void boxRegularParam() {
        // HACK: define multiple zones to prevent auto-insertion.
        myFixture.configureByText("test.py", "ui.layout(zones=[ui.zone('zone1'),ui.zone('zone2')])");
        myFixture.type("ui.card(box='')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);

        assert myFixture.completeBasic().length == 2;
        assert myFixture.completeBasic()[0].getLookupString().equals("zone1");
        assert myFixture.completeBasic()[1].getLookupString().equals("zone2");
    }

    @Test
    public void boxKeywordParam() {
        // HACK: define multiple zones to prevent auto-insertion.
        myFixture.configureByText("test.py", "ui.layout(zones=ui.zone(name='zone1')\nui.zone(name='zone2'))");
        myFixture.type("ui.card(box='')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);

        assert myFixture.completeBasic()[0].getLookupString().equals("zone1");
    }

    @Test
    public void regularBoxesKeywordParam() {
        // HACK: define multiple zones to prevent auto-insertion.
        myFixture.configureByText("test.py", "ui.layout(zones=ui.zone(name='zone1')\nui.zone(name='zone2'))");
        myFixture.type("ui.card(box=ui.boxes(zone='')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);

        assert myFixture.completeBasic()[0].getLookupString().equals("zone1");
    }

    @Test
    public void keywordBoxesKeywordParam() {
        // HACK: define multiple zones to prevent auto-insertion.
        myFixture.configureByText("test.py", "ui.layout(zones=ui.zone(name='zone1')\nui.zone(name='zone2'))");
        myFixture.type("ui.card(box=ui.boxes('')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);

        assert myFixture.completeBasic()[0].getLookupString().equals("zone1");
    }

    @Test
    public void keywordBoxesRegularParam() {
        // HACK: define multiple zones to prevent auto-insertion.
        myFixture.configureByText("test.py", "ui.layout(zones=ui.zone('zone1')\nui.zone('zone2'))");
        myFixture.type("ui.card(box=ui.boxes(zone='')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);

        assert myFixture.completeBasic()[0].getLookupString().equals("zone1");
    }

    @Test
    public void regularBoxesRegularParam() {
        // HACK: define multiple zones to prevent auto-insertion.
        myFixture.configureByText("test.py", "ui.layout(zones=ui.zone('zone1')\nui.zone('zone2'))");
        myFixture.type("ui.card(box=ui.boxes('')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);

        assert myFixture.completeBasic()[0].getLookupString().equals("zone1");
    }

    @Test
    public void fromImport() {
        // HACK: define multiple zones to prevent auto-insertion.
        myFixture.addFileToProject("utils.py", "def func():\n\tui.layout(zones=ui.zone(name='zone1')\nui.zone(name='zone2'))");
        myFixture.configureByText("test.py", "from utils import func");
        myFixture.type("ui.card(box=ui.boxes('')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);

        assert myFixture.completeBasic()[0].getLookupString().equals("zone1");
    }

    @Test
    public void importedFile() {
        // HACK: define multiple zones to prevent auto-insertion.
        myFixture.addFileToProject("utils.py", "def func():\n\tui.layout(zones=ui.zone(name='zone1')\nui.zone(name='zone2'))");
        myFixture.configureByText("test.py", "import utils");
        myFixture.type("ui.card(box=ui.boxes('')");
        myFixture.getEditor().getCaretModel().getCurrentCaret().moveCaretRelatively(-2, 0, false, false);

        assert myFixture.completeBasic()[0].getLookupString().equals("zone1");
    }
}
