package org.h2o.utils;

import com.intellij.openapi.project.Project;
import com.intellij.openapi.vfs.VfsUtil;
import com.intellij.openapi.vfs.VirtualFile;

import java.io.IOException;
import java.util.Collection;

import static com.intellij.psi.search.FilenameIndex.getVirtualFilesByName;
import static com.intellij.psi.search.GlobalSearchScope.projectScope;

public class RequirementsSingleton {
    private static String requirementsText = null;
    private static boolean isInitialized = false;

    public static String getRequirementsText(Project project) {
        if (!isInitialized) {
            isInitialized = true;
            Collection<VirtualFile> virtualFiles = getVirtualFilesByName("requirements.txt", projectScope(project));
            try {
                requirementsText = virtualFiles.isEmpty() ? null : VfsUtil.loadText(virtualFiles.stream().findFirst().get());
            } catch (IOException e) {
                System.out.println("No requirements.txt file present.");
            }
        }

        return requirementsText;
    }
}
