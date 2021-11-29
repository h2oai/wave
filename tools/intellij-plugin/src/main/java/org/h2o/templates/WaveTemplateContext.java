package org.h2o.templates;

import com.intellij.codeInsight.template.TemplateActionContext;
import com.intellij.codeInsight.template.TemplateContextType;
import org.jetbrains.annotations.NotNull;

public class WaveTemplateContext extends TemplateContextType {
    protected WaveTemplateContext() {
        super("WAVE", "Wave");
    }

    @Override
    public boolean isInContext(@NotNull TemplateActionContext templateActionContext) {
        return templateActionContext.getFile().getName().endsWith(".py");
    }

}