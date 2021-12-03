import io.gitlab.arturbosch.detekt.Detekt
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    // Java support
    id("java")
    // Kotlin support
    id("org.jetbrains.kotlin.jvm") version "1.4.30"
    // gradle-intellij-plugin - read more: https://github.com/JetBrains/gradle-intellij-plugin
    id("org.jetbrains.intellij") version "0.6.5"
    // gradle-changelog-plugin - read more: https://github.com/JetBrains/gradle-changelog-plugin
    id("org.jetbrains.changelog") version "1.1.1"
    // detekt linter - read more: https://detekt.github.io/detekt/gradle.html
    id("io.gitlab.arturbosch.detekt") version "1.15.0"
    // ktlint linter - read more: https://github.com/JLLeitschuh/ktlint-gradle
    id("org.jlleitschuh.gradle.ktlint") version "10.0.0"
}

// Import variables from gradle.properties file
val pluginGroup: String by project
// `pluginName_` variable ends with `_` because of the collision with Kotlin magic getter in the `intellij` closure.
// Read more about the issue: https://github.com/JetBrains/intellij-platform-plugin-template/issues/29
val pluginName_: String by project
val pluginVersion: String by project
val pluginSinceBuild: String by project
val pluginUntilBuild: String by project
val pluginVerifierIdeVersions: String by project

val platformType: String by project
val platformVersion: String by project
val platformPlugins: String by project
val platformDownloadSources: String by project

group = pluginGroup
version = pluginVersion

// Configure project's dependencies
repositories {
    mavenCentral()
    jcenter()
}
dependencies {
    detektPlugins("io.gitlab.arturbosch.detekt:detekt-formatting:1.15.0")
}

// Configure gradle-intellij-plugin plugin.
// Read more: https://github.com/JetBrains/gradle-intellij-plugin
intellij {
    pluginName = pluginName_
    version = platformVersion
    type = platformType
    downloadSources = platformDownloadSources.toBoolean()
    updateSinceUntilBuild = false

    // Plugin Dependencies. Uses `platformPlugins` property from the gradle.properties file.
    setPlugins(*platformPlugins.split(',').map(String::trim).filter(String::isNotEmpty).toTypedArray())
}

// Configure gradle-changelog-plugin plugin.
// Read more: https://github.com/JetBrains/gradle-changelog-plugin
changelog {
    version = pluginVersion
}

// Configure detekt plugin.
// Read more: https://detekt.github.io/detekt/kotlindsl.html
detekt {
    config = files("./detekt-config.yml")
    buildUponDefaultConfig = true

    reports {
        html.enabled = false
        xml.enabled = false
        txt.enabled = false
    }
}

tasks {
    // Set the compatibility versions to 1.8
    withType<JavaCompile> {
        sourceCompatibility = "1.8"
        targetCompatibility = "1.8"
    }
    withType<KotlinCompile> {
        kotlinOptions.jvmTarget = "1.8"
    }

    withType<Detekt> {
        jvmTarget = "1.8"
    }

    patchPluginXml {
        version(pluginVersion)
        sinceBuild(pluginSinceBuild)
        doFirst {
            mergeSnippets()
        }

        outputs.upToDateWhen { false }
        // Get the latest available change notes from the changelog file
        // Temporarily disable changelog generation.
//        changeNotes(
//            closure {
//                changelog.getLatest().toHTML()
//            }
//        )
    }

    runPluginVerifier {
        ideVersions(pluginVerifierIdeVersions)
    }

    publishPlugin {
        dependsOn("patchChangelog")
        token(System.getenv("PUBLISH_TOKEN"))
        // pluginVersion is based on the SemVer (https://semver.org) and supports pre-release labels, like 2.1.7-alpha.3
        // Specify pre-release label to publish the plugin in a custom Release Channel automatically. Read more:
        // https://plugins.jetbrains.com/docs/intellij/deployment.html#specifying-a-release-channel
        channels(pluginVersion.split('-').getOrElse(1) { "default" }.split('.').first())
    }
}

fun mergeSnippets() {
    val waveBlocks = File("$rootDir/src/main/resources/templates/wave-blocks.xml").readLines().drop(1).dropLast(1)
    val waveComponents = File("$rootDir/src/main/resources/templates/wave-components.xml").readLines().drop(2).dropLast(1)
    val resultFile = File("$rootDir/src/main/resources/templates/wave.xml")

    resultFile.writeText("<templateSet group=\"Wave\">\n")
    resultFile.appendText(waveBlocks.fold(StringBuilder()) { acc, string -> acc.append(string).append("\n") }.toString())
    resultFile.appendText("<!-- Generated snippets start here. -->\n")
    resultFile.appendText(waveComponents.fold(StringBuilder()) { acc, string -> acc.append(string).append("\n") }.toString())
    resultFile.appendText("</templateSet>")
}
