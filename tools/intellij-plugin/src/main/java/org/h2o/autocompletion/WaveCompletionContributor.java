package org.h2o.autocompletion;

import com.intellij.codeInsight.completion.*;
import com.intellij.patterns.PlatformPatterns;
import com.intellij.psi.PsiElement;
import com.intellij.psi.PsiFile;
import com.intellij.util.ProcessingContext;
import com.jetbrains.python.PyTokenTypes;
import com.jetbrains.python.PythonLanguage;
import com.jetbrains.python.psi.*;
import com.jetbrains.python.psi.impl.PyStringLiteralExpressionImpl;
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
                            if (!file.getContainingFile().getText().contains("ui.layout")) return;

                            findChildrenOfType(file, PyCallExpression.class)
                                    .stream()
                                    .filter(expr -> expr.getText().startsWith("ui.zone"))
                                    .forEach(expr -> {
                                        PsiElement zoneName = expr.getArguments()[0].getLastChild();
                                        if (!(zoneName instanceof PyFormattedStringElement) && zoneName.getParent() instanceof PyStringLiteralExpression) {
                                            zoneName = zoneName.getParent();
                                        }
                                        if (zoneName instanceof PyStringLiteralExpression) {
                                            addToCompletion(result, ((PyStringLiteralExpression) zoneName).getStringValue(), "");
                                        }
                                    });
                        };
                        fillCompletions(position.getContainingFile(), RequirementsSingleton.getRequirementsText(position.getProject()), new HashMap<>(), f);
                    }
                }
        );

        extend(
                CompletionType.BASIC,
                psiElement(PyTokenTypes.IDENTIFIER)
                        .withParent(psiElement(PyReferenceExpression.class)
                                .withFirstChild(psiElement(PyReferenceExpression.class)
                                        .withFirstChild(psiElement(PyReferenceExpression.class).withText("q.events"))
                                )
                        )
                        .withLanguage(PythonLanguage.INSTANCE),
                new CompletionProvider<CompletionParameters>() {
                    @Override
                    protected void addCompletions(@NotNull CompletionParameters parameters, @NotNull ProcessingContext context, @NotNull CompletionResultSet result) {
                        PsiElement position = parameters.getPosition();
                        Function f = file -> findChildrenOfType(file, PyCallExpression.class)
                                .stream()
                                .filter(expr -> expr.getText().startsWith("ui."))
                                .forEach(expr -> {
                                    PyExpression eventsArg = expr.getKeywordArgument("events");
                                    if (eventsArg instanceof PyListLiteralExpression) {
                                        Arrays.stream(((PyListLiteralExpression) eventsArg).getElements()).forEach(event -> {
                                            if (event instanceof PyStringLiteralExpression && !(event.getFirstChild() instanceof PyFormattedStringElement)) {
                                                addToCompletion(result, ((PyStringLiteralExpression) event).getStringValue(), "");
                                            }
                                        });
                                    }
                                });
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
                        Function f = (file) -> findChildrenOfType(file, PyCallExpression.class)
                                .stream()
                                .filter(expr -> expr.getText().startsWith("ui.") && (expr.getKeywordArgument("events") != null || expr.getKeywordArgument("pagination") != null))
                                .forEach(expr -> {
                                    PyExpression nameArg = expr.getKeywordArgument("name");
                                    if (nameArg == null) {
                                        nameArg = expr.getArgument(0, PyStringLiteralExpression.class);
                                    }
                                    if (nameArg != null) {
                                        addToCompletion(result, ((PyStringLiteralExpressionImpl) nameArg).getStringValue(), "");
                                    }
//                                        TODO: Handle edgecase when name not present?
                                });
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
                        Function f = file -> findChildrenOfType(file, PyCallExpression.class)
                                .stream()
                                .filter(Utils::isValidNameArg)
                                .map(expr -> ((PyStringLiteralExpression)expr.getKeywordArgument("name")))
                                .forEach(nameArg -> addToCompletion(result, nameArg.getStringValue(), ""));
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
        Function f = file -> {
            if (!file.getText().contains(stateType)) return;

            findChildrenOfAnyType(file, PyTargetExpression.class, PyReferenceExpression.class)
                    .stream()
                    .filter(el -> isStateExpr(el, stateType))
                    .forEach(el -> {
                        String name = el.getName();
                        if (name != null && !name.equals("IntellijIdeaRulezzz"))
                            addToCompletion(result, name, "Expando");
                    });
        };
        fillCompletions(position.getContainingFile(), RequirementsSingleton.getRequirementsText(position.getProject()), new HashMap<>(), f);
    }
}
