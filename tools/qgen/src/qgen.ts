//
// QGen
// =======
//
// This tool scans the Typescript src directory for interface definitions and
// generates the corresponding definitions in the target language.
//
// The translation is done is two passes:
// - In the first pass, the tools scans and collects all interface definitions.
// - In the second pass, all interfaces named "State" and their corresponding
//   dependencies exported to the target language.
//
// By convention, the presence of an interface named "State" in a file indicates
// that the file defines a card, and is renamed to the titlecased filename.
//
// WARNING: The compiler API is not fully documented, and this tool makes use
// of undocumented JSDoc features. Might break at any time.
//
// References:
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
// https://ts-ast-viewer.com/

import * as fs from 'fs'
import * as path from 'path'
import ts from 'typescript'

export interface Dict<T> { [key: string]: T } // generic object
const packedT = 'Packed' // name of marker parametric type to indicate if an attributed could be packed.

interface OneOf {
  name: string
  type: Type
}

enum MemberT { Enum, Singular, Repeated }
interface MemberBase {
  readonly name: string
  readonly comments: string[]
  readonly isOptional: boolean
}
interface EnumMember extends MemberBase {
  readonly t: MemberT.Enum
  readonly values: string[]
}
interface PackableMember extends MemberBase {
  readonly typeName: string
  readonly isPacked: boolean
}
interface SingularMember extends PackableMember {
  readonly t: MemberT.Singular
}
interface RepeatedMember extends PackableMember {
  readonly t: MemberT.Repeated
}
type Member = EnumMember | SingularMember | RepeatedMember
interface Type {
  readonly name: string
  readonly file: string
  readonly comments: string[]
  readonly members: Member[]
  readonly isRoot: boolean
  readonly isUnion: boolean
  oneOf?: OneOf
}
interface Protocol {
  readonly lookup: Dict<Type>
  readonly types: Type[]
}
interface File {
  readonly name: string
  readonly types: Type[]
}

enum Declaration { Forward, Declared }

const codeGenErrorT = 'CodeGenError'
class CodeGenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = codeGenErrorT
  }
}

let warnings = 0

const
  titlecase = (s: string) => s.replace(/_/g, ' ').replace(/\b./g, s => s.toUpperCase()).replace(/\s+/g, ''),
  snakeCase = (s: string) => s.replace(/[A-Z]/g, s => '_' + s.toLowerCase()).substr(1),
  warn = (s: string) => {
    console.warn(`Warning: ${s}`)
    warnings++
  },
  reservedWords = ['view', 'box', 'commands'],
  boxComment = 'A string indicating how to place this component on the page.',
  commandsComment = 'Contextual menu commands for this component.',
  noComment = 'No documentation available.',
  toLookup = (xs: string[]): Dict<boolean> => {
    const d: Dict<boolean> = {}
    for (const x of xs) d[x] = true
    return d
  },
  collectSingularType = (type: ts.TypeNode): string | null => {
    if (type.kind === ts.SyntaxKind.TypeReference) {
      const t = type as ts.TypeReferenceNode
      return t.typeName.getText()
    }
    return null
  },
  collectPackedType = (type: ts.TypeNode): ts.TypeNode | null => {
    if (type.kind === ts.SyntaxKind.TypeReference) {
      const t = type as ts.TypeReferenceNode
      if (t.typeArguments && t.typeName.getText() === packedT) {
        return t.typeArguments[0]
      }
    }
    return null
  },
  collectRepeatedType = (type: ts.TypeNode): string | null => {
    if (type.kind === ts.SyntaxKind.ArrayType) {
      const
        t = type as ts.ArrayTypeNode,
        et = collectSingularType(t.elementType)
      if (et) return et
    }
    return null
  },
  collectEnumType = (type: ts.TypeNode): string[] | null => {
    if (type.kind === ts.SyntaxKind.UnionType) {
      const
        t = type as ts.UnionTypeNode,
        values = t.types.map((t): string => {
          switch (t.kind) {
            case ts.SyntaxKind.LiteralType:
              {
                const l = t as ts.LiteralTypeNode
                if (l.literal.kind === ts.SyntaxKind.StringLiteral) {
                  return (l.literal as ts.StringLiteral).text
                }
              }
          }
          throw new CodeGenError(`unsupported union type: ${t.getText()}`)
        })
      return values
    }
    return null
  },
  flatten = <T extends {}>(xss: T[][]): T[] => {
    const ys: T[] = []
    for (const xs of xss) ys.push(...xs)
    return ys
  },
  collectComments = (node: any): string[] => {
    const comments: string[] = ((node as any).jsDoc?.map((c: any) => c?.comment) || []) // FIXME Undocumented API
    return flatten(comments.filter(c => !!c).map(c => c.split(/\n/g).map(c => c.trim())))
  },
  collectMember = (component: string, typename: string, member: ts.TypeElement): Member => {
    if (member.kind === ts.SyntaxKind.PropertySignature) {
      const
        m = member as ts.PropertySignature,
        optional = m.questionToken ? true : false,
        memberName = m.name.getText(),
        memberType = m.type,
        comments = collectComments(m)

      for (const w of reservedWords) if (memberName === w) throw new CodeGenError(`${component}.${typename}.${memberName}: "${w}" is a reserved name`)

      if (!memberType) throw new CodeGenError(`want type declared on ${component}.${typename}.${memberName}: ${m.getText()}`)

      if (!comments.length) {
        warn(`Doc missing on member ${component}.${typename}.${memberName}.`)
        comments.push(noComment)
      }

      let tt: string | null = null
      const pt = collectPackedType(memberType)
      if (pt) {
        tt = collectRepeatedType(pt)
        if (tt) {
          return { t: MemberT.Repeated, name: memberName, typeName: tt, isOptional: optional, comments, isPacked: true }
        }
        tt = collectSingularType(pt)
        if (tt) {
          return { t: MemberT.Singular, name: memberName, typeName: tt, isOptional: optional, comments, isPacked: true }
        }
      }

      tt = collectRepeatedType(memberType)
      if (tt) {
        return { t: MemberT.Repeated, name: memberName, typeName: tt, isOptional: optional, comments, isPacked: false }
      }
      tt = collectSingularType(memberType)
      if (tt) {
        return { t: MemberT.Singular, name: memberName, typeName: tt, isOptional: optional, comments, isPacked: false }
      }
      const values = collectEnumType(memberType)
      if (values) {
        comments.push(`One of ${values.map(v => `'${v}'`).join(', ')}.`)
        return { t: MemberT.Enum, name: memberName, values, isOptional: optional, comments }
      }
    }
    throw new CodeGenError(`unsupported member kind on ${component}.${typename}`)
  },
  collectTypes = (component: string, file: File, sourceFile: ts.SourceFile) => {
    ts.forEachChild(sourceFile, (node) => {
      switch (node.kind) {
        case ts.SyntaxKind.InterfaceDeclaration:
          const
            n = node as ts.InterfaceDeclaration,
            nodeName = n.name.getText(),
            isRoot = nodeName === 'State',
            typeName = isRoot ? titlecase(`${file.name}_card`) : nodeName,
            members = n.members.map(m => collectMember(component, typeName, m)),
            comments = collectComments(n)

          if (!comments.length) {
            comments.push(noComment)
            warn(`Doc missing on type ${component}.${typeName}.`)
          }

          // All cards must have a box defined.
          if (isRoot) members.unshift({ t: MemberT.Singular, name: 'box', typeName: 'S', isOptional: false, comments: [boxComment], isPacked: false })

          // All cards can optionally have a contextual menu.
          if (isRoot) members.push({ t: MemberT.Repeated, name: 'commands', typeName: 'Command', isOptional: true, comments: [commandsComment], isPacked: false })

          const isUnion = !members.filter(m => !m.isOptional).length // all members are optional?
          file.types.push({ name: typeName, file: file.name, comments, members, isRoot, isUnion })
      }
    })
  },
  processFile = (files: File[], filepath: string) => {
    console.log(`Parsing ${filepath}`)
    const
      component = path.parse(filepath).name,
      file: File = { name: component, types: [] },
      sourceFile = ts.createSourceFile(
        filepath,
        fs.readFileSync(filepath, 'utf8'),
        ts.ScriptTarget.ES2015,
        true
      )
    collectTypes(component, file, sourceFile)
    files.push(file)
  },
  processDir = (files: File[], dirpath: string) => {
    const
      ignored = toLookup(fs.readFileSync(path.join(dirpath, '.qgen'), 'utf8').split('\n').map(x => x.trim())),
      filenames = fs.readdirSync(dirpath)
    for (const filename of filenames) {
      if (ignored[filename]) continue
      const filepath = path.join(dirpath, filename)
      if (fs.statSync(filepath).isFile()) processFile(files, filepath)
    }
  },
  pyTypeMappings: Dict<string> = {
    S: 'str',
    F: 'float',
    I: 'int',
    U: 'int',
    B: 'bool',
    V: 'Value',
    Rec: 'PackedRecord',
    Recs: 'PackedRecords',
    Data: 'PackedData',
  },
  tranlateToPy = (protocol: Protocol): [string, string] => {
    const
      lines: string[] = [],
      p = (line: string) => lines.push(line),
      flush = (): string => { const s = lines.join('\n'); lines.length = 0; return s },
      classes: Dict<Declaration> = {},
      apis: Dict<boolean> = {},
      knownTypes = ((): Dict<Type> => {
        const d: Dict<Type> = {}
        for (const type of protocol.types) {
          d[type.name] = type
        }
        return d
      })(),
      maybeForwardDeclare = (t: string): string => {
        const d = classes[t]
        return d === Declaration.Forward ? `'${t}'` : t
      },
      mapType = (t: string): string => {
        const pt = pyTypeMappings[t]
        if (pt) return pt
        if (knownTypes[t]) return maybeForwardDeclare(t)
        throw new CodeGenError(`cannot map type ${t} to Python`)
      },
      genType = (m: Member): string => {
        switch (m.t) {
          case MemberT.Enum:
            return 'str'
          case MemberT.Singular:
            return mapType(m.typeName)
          case MemberT.Repeated:
            return `List[${mapType(m.typeName)}]`
        }
      },
      genPackedType = (m: Member): string => {
        if ((m.t === MemberT.Repeated || m.t === MemberT.Singular) && m.isPacked) {
          return `Union[${genType(m)}, str]`
        }
        return genType(m)
      },
      genOptType = (m: Member): string => {
        const t = genPackedType(m)
        return m.isOptional ? `Optional[${t}]` : t
      },
      genSig = (m: Member): string => `${m.name}: ${genOptType(m)}`,
      getSigWithDefault = (m: Member): string => genSig(m) + (m.isOptional ? ' = None' : ''),
      getKnownTypeOf = (m: Member): Type | null => {
        switch (m.t) {
          case MemberT.Singular: return knownTypes[m.typeName] || null
          case MemberT.Repeated: return knownTypes[m.typeName] || null
        }
        return null
      },
      genComments = (comments: string[], padding: string): string => {
        return comments.map(c => (padding + c).trimRight()).join('\n').trim()
      },
      genClass = (type: Type) => {
        if (classes[type.name] === Declaration.Declared || classes[type.name] === Declaration.Forward) return

        classes[type.name] = Declaration.Forward

        // generate member types first so that we don't have to forward-declare.
        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genClass(memberType)
        }

        console.log(`Generating ${type.name}...`)
        p('')
        p(`class ${type.name}:`)
        p(`    """` + genComments(type.comments, '    '))
        p(`    """`)
        p(`    def __init__(`)
        p(`            self,`)
        for (const m of type.members) {
          p(`            ${getSigWithDefault(m)},`)
        }
        p(`    ):`)
        for (const m of type.members) {
          p(`        self.${m.name} = ${m.name}`)
          p(`        """${m.comments.join(' ')}"""`)
        }
        p('')
        p(`    def dump(self) -> Dict:`)
        p(`        """Returns the contents of this object as a dict."""`)
        for (const m of type.members) { // guard
          if (!m.isOptional) {
            p(`        if self.${m.name} is None:`)
            p(`            raise ValueError('${type.name}.${m.name} is required.')`)
            if (m.t === MemberT.Enum) {
              p(`        if self.${m.name} not in (${m.values.map(v => `'${v}'`).join(', ')}):`)
              p(`            raise ValueError(f'Invalid value "{self.${m.name}}" for ${type.name}.${m.name}.')`)
            }
          }
        }
        p(`        return _dump(`)
        if (type.isRoot) {
          p(`            view='${type.file}',`)
        }
        for (const m of type.members) { // pack
          if (getKnownTypeOf(m)) {
            if (m.t === MemberT.Repeated || m.t === MemberT.Singular) {
              let code = m.t === MemberT.Repeated
                ? `[__e.dump() for __e in self.${m.name}]`
                : `self.${m.name}.dump()`
              if (m.isPacked) code = `self.${m.name} if isinstance(self.${m.name}, str) else ` + code
              if (m.isOptional) code = `None if self.${m.name} is None else ` + code
              p(`            ${m.name}=${code},`)
            }
          } else {
            p(`            ${m.name}=self.${m.name},`)
          }
        }
        p(`        )`)
        p('')
        p(`    @staticmethod`)
        p(`    def load(__d: Dict) -> '${type.name}':`)
        p(`        """Creates an instance of this class using the contents of a dict."""`)
        for (const m of type.members) {
          const rval = `__d_${m.name}`
          p(`        ${rval}: Any = __d.get('${m.name}')`)
          if (!m.isOptional) {
            p(`        if ${rval} is None:`)
            p(`            raise ValueError('${type.name}.${m.name} is required.')`)
          }
        }
        for (const m of type.members) {
          const rval = `__d_${m.name}`
          const memberType = getKnownTypeOf(m)
          if (memberType) {
            if (m.t === MemberT.Repeated || m.t === MemberT.Singular) {
              let code = m.t === MemberT.Repeated
                ? `[${memberType.name}.load(__e) for __e in ${rval}]`
                : `${memberType.name}.load(${rval})`
              if (m.isOptional) code = `None if ${rval} is None else ` + code
              // TODO this should call unpack(__d_foo) if str
              if (m.isPacked) code = `${rval} if isinstance(${rval}, str) else ` + code
              p(`        ${genSig(m)} = ${code}`)
            }
          } else {
            p(`        ${genSig(m)} = ${rval}`)
          }
        }
        p(`        return ${type.name}(`)
        for (const m of type.members) {
          p(`            ${m.name},`)
        }
        p(`        )`)
        p('')

        classes[type.name] = Declaration.Declared
      },
      genClasses = (): string => {
        p('#')
        p('# THIS FILE IS GENERATED; DO NOT EDIT')
        p('#')
        p('')
        p('from typing import Any, Optional, Union, Dict, List')
        p('from .core import Data')
        p('')
        p('Value = Union[str, float, int]')
        p('PackedRecord = Union[dict, str]')
        p('PackedRecords = Union[List[dict], str]')
        p('PackedData = Union[Data, str]') // special-cased during packing, Go allocation and unpacking.
        p('')
        p('')
        p('def _dump(**kwargs): return {k: v for k, v in kwargs.items() if v is not None}')
        p('')
        for (const type of protocol.types) {
          if (type.isRoot) { // Only export root types (State interface) and their dependencies.
            genClass(type)
          }
        }
        return flush()
      },
      genAPI = (type: Type) => {
        if (apis[type.name]) return
        apis[type.name] = true

        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genAPI(memberType)
        }

        p('')
        p(`def ${snakeCase(type.name)}(`)
        for (const m of type.members) {
          p(`        ${getSigWithDefault(m)},`)
        }
        if (type.oneOf) {
          p(`) -> ${type.oneOf.type.name}:`)
        } else {
          p(`) -> ${type.name}:`)
        }
        p(`    """` + genComments(type.comments, '    '))
        p(``)
        p(`    Args:`)
        for (const m of type.members) {
          p(`        ${m.name}: ` + m.comments.join(' '))
        }
        p(`    Returns:`)
        p(`        A \`h2o_q.types.${type.name}\` instance.`)
        p(`    """`)
        if (type.oneOf) {
          p(`    return ${type.oneOf.type.name}(${type.oneOf.name}=${type.name}(`)
        } else {
          p(`    return ${type.name}(`)
        }
        for (const m of type.members) {
          p(`        ${m.name},`)
        }
        if (type.oneOf) {
          p(`    ))`)
        } else {
          p(`    )`)
        }
        p('')

      },
      genAPIs = (): string => {
        p('#')
        p('# THIS FILE IS GENERATED; DO NOT EDIT')
        p('#')
        p('')
        p('from .types import *')

        for (const type of protocol.types) {
          if (type.isRoot) {
            genAPI(type)
          }
        }
        return flush()
      }
    return [genClasses(), genAPIs()]
  },
  rTypeMappings: Dict<string> = {
    S: 'character',
    F: 'numeric',
    I: 'numeric',
    U: 'numeric',
    B: 'logical',
    V: '', // XXX
    Rec: 'PackedRecord', // XXX
    Recs: 'PackedRecords', // XXX
    Data: 'PackedData', // XXX
  },
  translateToR = (protocol: Protocol): string => {
    const
      lines: string[] = [],
      p = (line: string) => lines.push(line),
      flush = (): string => { const s = lines.join('\n'); lines.length = 0; return s },
      classes: Dict<Declaration> = {},
      apis: Dict<boolean> = {},
      knownTypes = ((): Dict<Type> => {
        const d: Dict<Type> = {}
        for (const type of protocol.types) {
          d[type.name] = type
        }
        return d
      })(),
      genSig = (m: Member): string => m.name,
      getSigWithDefault = (m: Member): string => genSig(m) + (m.isOptional ? ' = NULL' : ''),
      getKnownTypeOf = (m: Member): Type | null => {
        switch (m.t) {
          case MemberT.Singular: return knownTypes[m.typeName] || null
          case MemberT.Repeated: return knownTypes[m.typeName] || null
        }
        return null
      },
      genComments = (comments: string[]): string => {
        return comments.map(c => "#' " + c.trimRight()).join('\n').trim()
      },
      genClass = (type: Type) => {
        if (classes[type.name] === Declaration.Declared || classes[type.name] === Declaration.Forward) return

        classes[type.name] = Declaration.Forward

        // generate member types first so that we don't have to forward-declare.
        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genClass(memberType)
        }

        console.log(`Generating ${type.name}...`)
        p('')
        p(`class ${type.name}:`)
        p(`    """` + genComments(type.comments))
        p(`    """`)
        p(`    def __init__(`)
        p(`            self,`)
        for (const m of type.members) {
          p(`            ${getSigWithDefault(m)},`)
        }
        p(`    ):`)
        for (const m of type.members) {
          p(`        self.${m.name} = ${m.name}`)
          p(`        """${m.comments.join(' ')}"""`)
        }
        p('')
        p(`    def dump(self) -> Dict:`)
        p(`        """Returns the contents of this object as a dict."""`)
        for (const m of type.members) { // guard
          if (!m.isOptional) {
            p(`        if self.${m.name} is None:`)
            p(`            raise ValueError('${type.name}.${m.name} is required.')`)
            if (m.t === MemberT.Enum) {
              p(`        if self.${m.name} not in (${m.values.map(v => `'${v}'`).join(', ')}):`)
              p(`            raise ValueError(f'Invalid value "{self.${m.name}}" for ${type.name}.${m.name}.')`)
            }
          }
        }
        p(`        return _dump(`)
        if (type.isRoot) {
          p(`            view='${type.file}',`)
        }
        for (const m of type.members) { // pack
          if (getKnownTypeOf(m)) {
            if (m.t === MemberT.Repeated || m.t === MemberT.Singular) {
              let code = m.t === MemberT.Repeated
                ? `[__e.dump() for __e in self.${m.name}]`
                : `self.${m.name}.dump()`
              if (m.isPacked) code = `self.${m.name} if isinstance(self.${m.name}, str) else ` + code
              if (m.isOptional) code = `None if self.${m.name} is None else ` + code
              p(`            ${m.name}=${code},`)
            }
          } else {
            p(`            ${m.name}=self.${m.name},`)
          }
        }
        p(`        )`)
        p('')
        p(`    @staticmethod`)
        p(`    def load(__d: Dict) -> '${type.name}':`)
        p(`        """Creates an instance of this class using the contents of a dict."""`)
        for (const m of type.members) {
          const rval = `__d_${m.name}`
          p(`        ${rval}: Any = __d.get('${m.name}')`)
          if (!m.isOptional) {
            p(`        if ${rval} is None:`)
            p(`            raise ValueError('${type.name}.${m.name} is required.')`)
          }
        }
        for (const m of type.members) {
          const rval = `__d_${m.name}`
          const memberType = getKnownTypeOf(m)
          if (memberType) {
            if (m.t === MemberT.Repeated || m.t === MemberT.Singular) {
              let code = m.t === MemberT.Repeated
                ? `[${memberType.name}.load(__e) for __e in ${rval}]`
                : `${memberType.name}.load(${rval})`
              if (m.isOptional) code = `None if ${rval} is None else ` + code
              // TODO this should call unpack(__d_foo) if str
              if (m.isPacked) code = `${rval} if isinstance(${rval}, str) else ` + code
              p(`        ${genSig(m)} = ${code}`)
            }
          } else {
            p(`        ${genSig(m)} = ${rval}`)
          }
        }
        p(`        return ${type.name}(`)
        for (const m of type.members) {
          p(`            ${m.name},`)
        }
        p(`        )`)
        p('')

        classes[type.name] = Declaration.Declared
      },
      layoutParams = (xs: string[], pad: string) => {
        const lines = pad + xs.join(',\n' + pad)
        return '\n' + lines
      },
      genFunc = (type: Type) => {
        if (apis[type.name]) return
        apis[type.name] = true

        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genFunc(memberType)
        }

        p(``)
        p(genComments(type.comments))
        p(`#'`)
        for (const m of type.members) {
          p(`#' @param ${m.name} ` + m.comments.join("\n#'   "))
        }
        p(`#' @return A ${type.name} instance.`)
        const
          params = type.members.map(getSigWithDefault),
          assigns = type.members.map(m => `${m.name}=${m.name}`)

        p(`ui_${snakeCase(type.name)} <- function(${layoutParams(params, '  ')}) {`)
        for (const m of type.members) {
          switch (m.t) {
            case MemberT.Singular:
              switch (m.typeName) {
                case 'S':
                case 'F':
                case 'I':
                case 'U':
                case 'B':
                  p(`  if(!is.null(${m.name})) {`)
                  p(`    if(!is(${m.name}, "${rTypeMappings[m.typeName]}")) {`)
                  p(`      stop("${m.name}: expected ${rTypeMappings[m.typeName]}")`)
                  p(`    }`)
                  p(`  }`)
                  break
                default:
                  p(`  # TODO Validate ${m.name}: ${m.typeName}`)
              }
              break
            case MemberT.Repeated:
              switch (m.typeName) {
                case 'S':
                case 'S':
                case 'F':
                case 'I':
                case 'U':
                case 'B':
                  p(`  if(!is.null(${m.name})) {`)
                  p(`    if(FALSE %in% unlist(lapply(${m.name},function(x){ is(x, "${rTypeMappings[m.typeName]}") }))) {`)
                  p(`       stop("${m.name}: expected list of ${rTypeMappings[m.typeName]}")`)
                  p(`    }`)
                  p(`  }`)
                  break
                default:
                  p(`  # TODO Validate ${m.name}: repeated ${m.typeName}`)
              }
              break
            default:
              p(`  # TODO Validate ${m.name}`)
          }
        }
        if (type.oneOf) {
          p(`  .o <- list(${type.oneOf.name}=list(${layoutParams(assigns, '    ')}))`)
        } else {
          p(`  .o <- list(${layoutParams(assigns, '    ')})`)
        }
        const typeName = type.oneOf ? type.oneOf.type.name : type.name
        p(`  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_${typeName}"))`)
        p('  return(.o)')
        p('}')

      },
      genFuncs = (): string => {
        p('#')
        p('# THIS FILE IS GENERATED; DO NOT EDIT')
        p('#')
        p('')
        p(`.to_json <- function(x) {`)
        p(`  # TODO: Eliminate NULL-valued entries from x first.`)
        p(`  jsonlite::toJSON(x, auto_unbox = TRUE)`)
        p(`}`)
        p(``)
        p(`.h2oq_obj <- "h2oq_Object"`)
        p(``)
        p(`dump_object <- function(x) {`)
        p(`  if(is(x, .h2oq_obj)) {`)
        p(`    to_json(x)`)
        p(`  } else {`)
        p(`    stop("cannot dump")`)
        p(`  }`)
        p(`}`)
        p(``)

        for (const type of protocol.types) {
          if (type.isRoot) {
            genFunc(type)
          }
        }
        return flush()
      }
    return genFuncs()
  },
  makeProtocol = (files: File[]): Protocol => {
    // Build type lookup
    const
      types: Type[] = [],
      lookup: Dict<Type> = {}

    for (const file of files) {
      for (const type of file.types) {
        const existing = lookup[type.name]
        if (existing) {
          throw new CodeGenError(`Type ${file.name}.${type.name} already declared as ${existing.file}.${type.name}`)
        }
        lookup[type.name] = type
        types.push(type)
      }
    }

    // Mark union members
    for (const typeName in lookup) {
      const type = lookup[typeName]
      if (type.isUnion) {
        for (const m of type.members) {
          if (m.t == MemberT.Singular || m.t === MemberT.Repeated) {
            const mt = lookup[m.typeName]
            if (mt) {
              if (mt.oneOf) {
                throw new CodeGenError(`Union type member ${type.name}.${mt.name} is already used in ${mt.oneOf.type.name}.${mt.oneOf.name}`)
              }
              mt.oneOf = { name: m.name, type }
            }
          }
        }
      }
    }

    return { types, lookup }
  },
  measureStats = (protocol: Protocol) => {
    let n = 0
    for (const t of protocol.types) {
      n += t.members.length
    }
    return [protocol.types.length, n]
  },
  generatePy = (protocol: Protocol, outDir: string) => {
    const [classes, api] = tranlateToPy(protocol)
    fs.writeFileSync(path.join(outDir, 'types.py'), classes, 'utf8')
    fs.writeFileSync(path.join(outDir, 'ui.py'), api, 'utf8')
  },
  generateR = (protocol: Protocol, outDir: string) => {
    const api = translateToR(protocol)
    fs.writeFileSync(path.join(outDir, 'ui.R'), api, 'utf8')
  },
  main = (typescriptSrcDir: string, pyOutDir: string, rOutDir: string) => {
    const files: File[] = []
    processDir(files, typescriptSrcDir)
    // console.log(JSON.stringify(protocol, null, 2))
    const protocol = makeProtocol(files)

    generatePy(protocol, pyOutDir)
    generateR(protocol, rOutDir)

    const [typeCount, memberCount] = measureStats(protocol)
    console.log(`API surface: ${typeCount} types, ${memberCount} members.`)
  }


try {
  main(process.argv[2], process.argv[3], process.argv[4])
  console.log(`Success! Code generation complete. ${warnings} warnings.`)
} catch (e) {
  if (e.name === codeGenErrorT) {
    console.log(`***Error: code generation failed: ${e.message}***`)
    process.exit(1)
  }
  throw e
}
