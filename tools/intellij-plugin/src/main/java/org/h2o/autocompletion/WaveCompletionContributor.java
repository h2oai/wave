package org.h2o.autocompletion;

import com.intellij.codeInsight.completion.*;
import com.intellij.patterns.PlatformPatterns;
import com.intellij.psi.PsiElement;
import com.intellij.psi.PsiFile;
import com.intellij.util.ProcessingContext;
import com.jetbrains.python.PyTokenTypes;
import com.jetbrains.python.PythonLanguage;
import com.jetbrains.python.psi.*;
import org.h2o.utils.RequirementsSingleton;
import org.h2o.utils.Utils;
import org.h2o.utils.UtilsResources;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.HashMap;

import static com.intellij.patterns.PlatformPatterns.psiElement;
import static com.intellij.psi.util.PsiTreeUtil.*;
import static com.jetbrains.python.codeInsight.PyPsiIndexUtil.isNotUnderSourceRoot;
import static org.h2o.utils.Utils.*;

interface Function {
    void execute(PsiFile file);
}

public class WaveCompletionContributor extends CompletionContributor {

    public WaveCompletionContributor() {
        extend(
                CompletionType.BASIC,
                getParamAutocompletePatterns("theme"),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        if (findFirstParent(parameters.getPosition(), e -> e.getText().startsWith("ui")) != null) {
                            Arrays.stream(UtilsResources.THEMES).forEach(i -> addToCompletion(result, i, ""));
                        }
                    }
                }
        );

        extend(
                CompletionType.BASIC,
                getParamAutocompletePatterns("icon"),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        if (findFirstParent(parameters.getPosition(), e -> e.getText().startsWith("ui")) != null) {
                            Arrays.stream(UtilsResources.FLUENT_ICONS).forEach(i -> addToCompletion(result, i, ""));
                        }
                    }
                }
        );

        // Responsive layout autocompletion.
        extend(
                CompletionType.BASIC,
                psiElement(PyTokenTypes.SINGLE_QUOTED_STRING)
                        .withParent(psiElement(PyStringLiteralExpression.class).withParent(
                                PlatformPatterns.or(
                                        psiElement(PyKeywordArgument.class).withName("box"),
                                        psiElement(PyKeywordArgument.class).withName("zone").withAncestor(5, psiElement(PyKeywordArgument.class).withName("box")),
                                        psiElement(PyArgumentList.class).withAncestor(5, psiElement(PyKeywordArgument.class).withName("box"))
                                ))
                        )
                        .withLanguage(PythonLanguage.INSTANCE),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        PsiElement position = parameters.getPosition();
                        Function f = (file) -> {
                            findChildrenOfType(file, PyKeywordArgument.class)
                                    .stream()
                                    .filter(arg -> isValidKeywordArg(arg, "name", "ui.zone"))
                                    .forEach(arg -> {
                                        PsiElement str = arg.getChildren()[0];
                                        if (str instanceof PyStringLiteralExpression) {
                                            addToCompletion(result, ((PyStringLiteralExpression) str).getStringValue(), "");
                                        }
                                    });

                            findChildrenOfType(file, PyStringLiteralExpression.class)
                                    .stream()
                                    .filter(Utils::isValidZoneString)
                                    .forEach(arg -> addToCompletion(result, arg.getStringValue(), ""));
                        };
                        fillCompletions(position.getContainingFile(), RequirementsSingleton.getRequirementsText(position.getProject()), new HashMap<>(), f);
                    }
                }
        );

        extend(
                CompletionType.BASIC,
                getExpressionAutocompletePatterns("q.events"),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        PsiElement position = parameters.getPosition();
                        Function f = (file) -> findChildrenOfType(file, PyKeywordArgument.class)
                                .stream()
                                .filter(arg -> isValidKeywordArg(arg, "events", null))
                                .forEach(arg -> Arrays.stream(arg.getChildren()).forEach(argChild -> {
                                    if (argChild instanceof PyListLiteralExpression) {
                                        Arrays.stream(((PyListLiteralExpression) argChild).getElements()).forEach(argElement -> {
                                            if (argElement instanceof PyStringLiteralExpression && isSimpleString(argElement)) {
                                                addToCompletion(result, ((PyStringLiteralExpression) argElement).getStringValue(), "");
                                            }
                                        });
                                    }
                                }));
                        fillCompletions(position.getContainingFile(), RequirementsSingleton.getRequirementsText(position.getProject()), new HashMap<>(), f);
                    }
                }
        );

        extend(
                CompletionType.BASIC,
                getExpressionAutocompletePatterns("q.args"),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        PsiElement position = parameters.getPosition();
                        Function f = (file) -> findChildrenOfType(file, PyStringLiteralExpression.class)
                                .stream()
                                .filter(Utils::isValidNameArg)
                                .forEach(name -> addToCompletion(result, name.getStringValue(), ""));
                        fillCompletions(position.getContainingFile(), RequirementsSingleton.getRequirementsText(position.getProject()), new HashMap<>(), f);
                    }
                }
        );

        extend(
                CompletionType.BASIC,
                getExpressionAutocompletePatterns("q.client"),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        fillStateCompletions(result, parameters.getPosition(), "q.client");
                    }
                }
        );

        extend(
                CompletionType.BASIC,
                getExpressionAutocompletePatterns("q.app"),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        fillStateCompletions(result, parameters.getPosition(), "q.app");
                    }
                }
        );

        extend(
                CompletionType.BASIC,
                getExpressionAutocompletePatterns("q.user"),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        fillStateCompletions(result, parameters.getPosition(), "q.user");
                    }
                }
        );
    }

    private void fillCompletions(PsiFile file, String requirementsContent, HashMap<String, Boolean> visited, Function func) {
        if (visited.get(file.getName()) != null) return;
        visited.put(file.getName(), true);
        if (isNotUnderSourceRoot(file.getProject(), file)) return;
        func.execute(file);
        getFileDependencies(file, requirementsContent).forEach(f -> fillCompletions(f, requirementsContent, visited, func));
    }

    private void fillStateCompletions(CompletionResultSet result, PsiElement position, String stateType) {
        Function f = (file) -> findChildrenOfAnyType(file, PyTargetExpression.class, PyReferenceExpression.class)
                .stream()
                .filter(el -> isStateExpr(el, stateType))
                .forEach(el -> {
                    String name = el.getName();
                    if (name != null && !name.equals("IntellijIdeaRulezzz")) addToCompletion(result, name, "Expando");
                });
        fillCompletions(position.getContainingFile(), RequirementsSingleton.getRequirementsText(position.getProject()), new HashMap<>(), f);
    }
}
