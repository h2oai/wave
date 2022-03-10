package org.h2o.utils;

import com.intellij.codeInsight.completion.CompletionResultSet;
import com.intellij.codeInsight.lookup.LookupElementBuilder;
import com.intellij.openapi.util.IconLoader;
import com.intellij.patterns.ElementPattern;
import com.intellij.patterns.PlatformPatterns;
import com.intellij.psi.PsiElement;
import com.intellij.psi.PsiFile;
import com.intellij.usageView.UsageInfo;
import com.jetbrains.python.PyTokenTypes;
import com.jetbrains.python.PythonLanguage;
import com.jetbrains.python.psi.*;
import com.jetbrains.python.psi.resolve.RatedResolveResult;
import org.jetbrains.annotations.NotNull;

import javax.swing.*;
import java.util.*;
import java.util.stream.Collectors;

import static com.intellij.codeInsight.completion.PrioritizedLookupElement.withPriority;
import static com.intellij.patterns.PlatformPatterns.psiElement;
import static com.intellij.psi.util.PsiTreeUtil.*;
import static com.jetbrains.python.codeInsight.PyPsiIndexUtil.findUsages;

public class Utils {
    public static final Icon icon = IconLoader.getIcon("/icons/pluginIcon.svg", Utils.class);

    public static boolean isStateExpr(PsiElement el, String stateType) {
        return el.getText().startsWith(stateType) && el.getFirstChild().getText().equals(stateType);
    }

    public static boolean isValidNameArg(PyCallExpression callExpression) {
        PyExpression nameArg = callExpression.getKeywordArgument("name");

        boolean excludeFromCompletion = !(nameArg instanceof PyStringLiteralExpression)
                || callExpression.getKeywordArgument("events") != null
                || nameArg.getFirstChild() instanceof PyFormattedStringElement;
        if (excludeFromCompletion) return false;

        String exprText = callExpression.getText();
        return exprText != null && exprText.startsWith("ui.") && !exprText.startsWith("ui.zone");
    }

    public static boolean shouldBeScanned(String name, String requirementsContent) {
        return name != null && !name.equals("h2o_wave") && (requirementsContent == null || !requirementsContent.contains(name));
    }

    public static void addToCompletion(CompletionResultSet result, String str, String typeText) {
        if (!str.startsWith("#") && !str.isEmpty()) {
            result.addElement(withPriority(LookupElementBuilder.create(str).withIcon(icon).withTypeText(typeText), 10));
        }
    }

    public static @NotNull ElementPattern<PsiElement> getParamAutocompletePatterns(String param) {
        return psiElement(PyTokenTypes.SINGLE_QUOTED_STRING)
                .withParent(psiElement(PyStringLiteralExpression.class).withParent(psiElement(PyKeywordArgument.class).withName(param)))
                .withLanguage(PythonLanguage.INSTANCE);
    }

    public static @NotNull ElementPattern<PsiElement> getExpressionAutocompletePatterns(String expr) {
        return PlatformPatterns.or(
                psiElement(PyTokenTypes.IDENTIFIER)
                        .withParent(psiElement(PyReferenceExpression.class)
                                .withFirstChild(psiElement(PyReferenceExpression.class).withText(expr))
                        )
                        .withLanguage(PythonLanguage.INSTANCE),
                psiElement(PyTokenTypes.SINGLE_QUOTED_STRING)
                        .withParent(psiElement(PyStringLiteralExpression.class)
                                .withParent(psiElement(PySubscriptionExpression.class)
                                        .withFirstChild(psiElement(PyReferenceExpression.class).withText(expr))
                                )
                        )
                        .withLanguage(PythonLanguage.INSTANCE)
        );
    }

    @NotNull
    public static List<PsiFile> getFileDependencies(PsiFile file, String requirementsContent) {
        List<PsiFile> importingFiles = findUsages(file.getOriginalFile(), false)
                .stream()
                .map(UsageInfo::getFile)
                .collect(Collectors.toList());
        List<PsiFile> importedFiles = findChildrenOfType(file, PyImportStatement.class)
                .stream()
                .map(imp -> Arrays.stream(imp.getImportElements())
                        .filter(el -> {
                            List<RatedResolveResult> resolveResults = el.multiResolve();
                            return resolveResults.size() > 0
                                    && resolveResults.get(0).getElement() instanceof PsiFile
                                    && shouldBeScanned(el.getName(), requirementsContent);
                        })
                        .map(el -> (PsiFile) el.multiResolve().get(0).getElement()).collect(Collectors.toList()))
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
        List<PsiFile> fromImportedFiles = findChildrenOfType(file, PyFromImportStatement.class)
                .stream()
                .filter(imp -> imp.getImportSource() != null && shouldBeScanned(imp.getImportSource().getName(), requirementsContent))
                .filter(imp -> imp.resolveImportSource() instanceof PsiFile)
                .map(imp -> (PsiFile) imp.resolveImportSource())
                .collect(Collectors.toList());

        List<PsiFile> files = new ArrayList<>();
        files.addAll(importingFiles);
        files.addAll(importedFiles);
        files.addAll(fromImportedFiles);
        return files;
    }
}
