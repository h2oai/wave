import io.gitlab.arturbosch.detekt.Detekt
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

fun properties(key: String) = project.findProperty(key).toString()

plugins {
    // Java support
    id("java")
    // Kotlin support
    id("org.jetbrains.kotlin.jvm") version "1.6.0"
    // gradle-intellij-plugin - read more: https://github.com/JetBrains/gradle-intellij-plugin
    id("org.jetbrains.intellij") version "1.3.1"
    // detekt linter - read more: https://detekt.github.io/detekt/gradle.html
    id("io.gitlab.arturbosch.detekt") version "1.19.0"
    // ktlint linter - read more: https://github.com/JLLeitschuh/ktlint-gradle
    id("org.jlleitschuh.gradle.ktlint") version "10.2.0"
}

// Configure project's dependencies
repositories {
    mavenCentral()
    jcenter()
}
dependencies {
    detektPlugins("io.gitlab.arturbosch.detekt:detekt-formatting:1.18.1")
}

// Configure gradle-intellij-plugin plugin.
// Read more: https://github.com/JetBrains/gradle-intellij-plugin
intellij {
    pluginName.set(properties("pluginName"))
    version.set(properties("platformVersion"))
    type.set(properties("platformType"))
    intellij.updateSinceUntilBuild.set(false)

    // Plugin Dependencies. Uses `platformPlugins` property from the gradle.properties file.
    plugins.set(properties("platformPlugins").split(',').map(String::trim).filter(String::isNotEmpty))
}

// Configure detekt plugin.
// Read more: https://detekt.github.io/detekt/kotlindsl.html
detekt {
    config = files("./detekt-config.yml")
    buildUponDefaultConfig = true
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
        version.set(System.getenv("VERSION") ?: properties("pluginVersion"))
        sinceBuild.set(properties("pluginSinceBuild"))
        doFirst {
            mergeSnippets()
        }
        outputs.upToDateWhen { false }
    }

    publishPlugin {
        token.set(System.getenv("JETBRAINS_PUBLISH_TOKEN"))
    }
}

fun mergeSnippets() {
    val waveBlocks = File("$rootDir/src/main/resources/templates/wave-blocks.xml").readLines().drop(1).dropLast(1)
    val waveComponents = File("$rootDir/src/main/resources/templates/wave-components.xml").readLines().drop(1).dropLast(1)
    val resultFile = File("$rootDir/src/main/resources/templates/wave.xml")

    resultFile.writeText("<templateSet group=\"Wave\">\n")
    resultFile.appendText(waveBlocks.fold(StringBuilder()) { acc, string -> acc.append(string).append("\n") }.toString())
    resultFile.appendText("<!-- Generated snippets start here. -->\n")
    resultFile.appendText(waveComponents.fold(StringBuilder()) { acc, string -> acc.append(string).append("\n") }.toString())
    resultFile.appendText("</templateSet>")
}
