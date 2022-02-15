package org.h2o.utils;

import com.intellij.openapi.project.Project;
import com.intellij.psi.PsiFile;

import static com.intellij.psi.search.FilenameIndex.getFilesByName;
import static com.intellij.psi.search.GlobalSearchScope.projectScope;

public class RequirementsSingleton {
    private static String requirementsText = null;
    private static boolean isInitialized = false;

    public static String getRequirementsText(Project project ) {
        if (!isInitialized) {
            isInitialized = true;
            PsiFile[] files = getFilesByName(project, "requirements.txt", projectScope(project));
            requirementsText = files.length > 0 ? files[0].getText() : null;
        }

        return requirementsText;
    }
}
