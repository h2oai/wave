//
// Telegen
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
// By convention, the interface named "State" is assigned the name of the card,
// and all the dependency interfaces are prefixed with the name of the card.
//
// There is one exception: these conventions do not apply to interfaces in the
// files named "shared.*". Those interfaces are exported as-is.
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
import * as util from 'util'

export interface Dict<T> { [key: string]: T } // generic object
const packedT = 'Packed' // name of marker parametric type to indicate if an attributed could be packed.

enum MemberT { Enum, Singular, Repeated }
interface MemberBase {
  readonly name: string
  readonly comment: string
  readonly optional: boolean
}
interface EnumMember extends MemberBase {
  readonly t: MemberT.Enum
  readonly values: string[]
}
interface SingularMember extends MemberBase {
  readonly t: MemberT.Singular
  typeName: string
  readonly packed: boolean
}
interface RepeatedMember extends MemberBase {
  readonly t: MemberT.Repeated
  typeName: string
  readonly packed: boolean
}
type Member = EnumMember | SingularMember | RepeatedMember
interface Type {
  name: string
  readonly members: Member[]
  readonly card: string | null
}
interface File {
  readonly name: string
  readonly types: Type[]
}
interface Protocol {
  readonly files: File[]
}

enum Declaration { Forward, Declared }

const codeGenErrorT = 'CodeGenError'
class CodeGenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = codeGenErrorT
  }
}

const
  reservedWords = ['view', 'box'],
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
  collectMember = (component: string, typename: string, member: ts.TypeElement): Member => {
    if (member.kind === ts.SyntaxKind.PropertySignature) {
      const
        m = member as ts.PropertySignature,
        optional = m.questionToken ? true : false,
        memberName = m.name.getText(),
        memberType = m.type,
        comment = (m as any).jsDoc?.map((c: any) => c?.comment).join('\n') || '' // FIXME Undocumented API

      for (const w of reservedWords) if (memberName === w) throw new CodeGenError(`${component}.${typename}.${memberName}: "${w}" is a reserved name`)

      if (!memberType) throw new CodeGenError(`want type declared on ${component}.${typename}.${memberName}: ${m.getText()}`)

      let tt: string | null = null
      const pt = collectPackedType(memberType)
      if (pt) {
        tt = collectRepeatedType(pt)
        if (tt) {
          return { t: MemberT.Repeated, name: memberName, typeName: tt, optional, comment, packed: true }
        }
        tt = collectSingularType(pt)
        if (tt) {
          return { t: MemberT.Singular, name: memberName, typeName: tt, optional, comment, packed: true }
        }
      }


      tt = collectRepeatedType(memberType)
      if (tt) {
        return { t: MemberT.Repeated, name: memberName, typeName: tt, optional, comment, packed: false }
      }
      tt = collectSingularType(memberType)
      if (tt) {
        return { t: MemberT.Singular, name: memberName, typeName: tt, optional, comment, packed: false }
      }
      const values = collectEnumType(memberType)
      if (values) {
        return { t: MemberT.Enum, name: memberName, values, optional, comment }
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
            typename = n.name.getText(),
            card = typename === 'State' ? file.name : null,
            members = n.members.map(m => collectMember(component, typename, m))
          // All cards must have a box defined.
          if (card) members.unshift({ t: MemberT.Singular, name: 'box', typeName: 'S', optional: false, comment: '', packed: false })
          file.types.push({ name: typename, members, card })
      }
    })
  },
  processFile = (protocol: Protocol, filepath: string) => {
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
    protocol.files.push(file)
  },
  processDir = (protocol: Protocol, dirpath: string) => {
    const
      ignored = toLookup(fs.readFileSync(path.join(dirpath, '.telegen'), 'utf8').split('\n').map(x => x.trim())),
      filenames = fs.readdirSync(dirpath)
    for (const filename of filenames) {
      if (ignored[filename]) continue
      const filepath = path.join(dirpath, filename)
      if (fs.statSync(filepath).isFile()) processFile(protocol, filepath)
    }
  },
  pyTypeMappings: Dict<string> = {
    S: 'str',
    F: 'float',
    I: 'int',
    U: 'int',
    B: 'bool',
    V: 'Union[str, float, int]',
    Rec: 'dict',
    TupleSet: 'TupleSet', // special-cased during packing, Go allocation and unpacking.
  },
  translateToPython = (protocol: Protocol) => {
    const
      lines: string[] = [],
      p = (line: string) => lines.push(line),
      declarations: Dict<Declaration> = {},
      knownTypes = ((): Dict<Type> => {
        const d: Dict<Type> = {}
        for (const file of protocol.files) {
          for (const type of file.types) {
            d[type.name] = type
          }
        }
        return d
      })(),
      maybeForwardDeclare = (t: string): string => {
        const d = declarations[t]
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
            return `Repeated[${mapType(m.typeName)}]`
        }
      },
      genOptType = (m: Member): string => {
        const t = genType(m)
        return m.optional ? `Optional[${t}]` : t
      },
      genSig = (m: Member): string => `${m.name}: ${genOptType(m)}`,
      getSigWithDefault = (m: Member): string => genSig(m) + (m.optional ? ' = None' : ''),
      getKnownTypeOf = (m: Member): Type | null => {
        switch (m.t) {
          case MemberT.Singular: return knownTypes[m.typeName] || null
          case MemberT.Repeated: return knownTypes[m.typeName] || null
        }
        return null
      },
      genClass = (type: Type) => {
        if (declarations[type.name] === Declaration.Declared || declarations[type.name] === Declaration.Forward) return

        declarations[type.name] = Declaration.Forward

        // generate member types first so that we don't have to forward-declare.
        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genClass(memberType)
        }

        console.log(`Generating ${type.name}...`)
        p('')
        p(`class ${type.name}:`)
        p(`    def __init__(`)
        p(`            self,`)
        for (const m of type.members) {
          p(`            ${getSigWithDefault(m)},`)
        }
        p(`    ):`)
        for (const m of type.members) {
          p(`        self.${m.name} = ${m.name}`)
        }
        p('')
        p(`    def dump(self) -> Dict:`)
        for (const m of type.members) { // guard
          if (!m.optional) {
            p(`        if self.${m.name} is None:`)
            p(`            raise ValueError('${type.name}.${m.name} is required.')`)
            if (m.t === MemberT.Enum) {
              p(`        if self.${m.name} not in (${m.values.map(v => `'${v}'`).join(', ')}):`)
              p(`            raise ValueError(f'Invalid value "{self.${m.name}}" for ${type.name}.${m.name}.')`)
            }
          }
        }
        p(`        return dict(`)
        if (type.card) {
          p(`            view='${type.card}',`)
        }
        for (const m of type.members) { // pack
          if (getKnownTypeOf(m)) {
            if (m.t === MemberT.Repeated) {
              if (m.optional) {
                p(`            ${m.name}=None if self.${m.name} is None else [__e.dump() for __e in self.${m.name}],`)
              } else {
                p(`            ${m.name}=[__e.dump() for __e in self.${m.name}],`)
              }
            } else {
              if (m.optional) {
                p(`            ${m.name}=None if self.${m.name} is None else self.${m.name}.dump(),`)
              } else {
                p(`            ${m.name}=self.${m.name}.dump(),`)
              }
            }
          } else {
            p(`            ${m.name}=self.${m.name},`)
          }
        }
        p(`        )`)
        p('')
        p(`    @staticmethod`)
        p(`    def load(__d: Dict) -> '${type.name}':`)
        for (const m of type.members) {
          p(`        __d_${m.name}: Any = __d.get('${m.name}')`)
          if (!m.optional) {
            p(`        if __d_${m.name} is None:`)
            p(`            raise ValueError('${type.name}.${m.name} is required.')`)
          }
        }
        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) {
            if (m.t === MemberT.Repeated) {
              if (m.optional) {
                p(`        ${genSig(m)} = [${memberType.name}.load(__e) for __e in __d_${m.name}] if __d_${m.name} else None`)
              } else {
                p(`        ${genSig(m)} = [${memberType.name}.load(__e) for __e in __d_${m.name}]`)
              }
            } else {
              if (m.optional) {
                p(`        ${genSig(m)} = ${memberType.name}.load(__d_${m.name}) if __d_${m.name} else None`)
              } else {
                p(`        ${genSig(m)} = ${memberType.name}.load(__d_${m.name})`)
              }
            }
          } else {
            p(`        ${genSig(m)} = __d_${m.name}`)
          }
        }
        p(`        return ${type.name}(`)
        for (const m of type.members) {
          p(`            ${m.name},`)
        }
        p(`        )`)
        p('')

        declarations[type.name] = Declaration.Declared
      },
      generate = (): string => {
        p('from typing import Any, Optional, Union, Dict, List as Repeated')
        p('from .core import TupleSet')
        p('')
        for (const file of protocol.files) {
          for (const type of file.types) {
            if (type.card) { // Only export root types (State interface) and their dependencies.
              genClass(type)
            }
          }
        }
        return lines.join('\n')
      }
    return generate()
  },
  titlecase = (s: string) => s.replace(/_/g, ' ').replace(/\b./g, s => s.toUpperCase()).replace(/\s+/g, ''),
  scopeNames = (protocol: Protocol) => {
    const scopedNames: Dict<string> = {}
    for (const file of protocol.files) {
      // Types in shared.ts don't get a scope prefix.
      const scope = file.name === 'shared' ? '' : titlecase(file.name)
      for (const type of file.types) {
        const scopedName = type.card ? scope : scope + type.name
        type.name = scopedNames[type.name] = scopedName
      }
    }
    for (const file of protocol.files) {
      for (const type of file.types) {
        for (const m of type.members) {
          switch (m.t) {
            case MemberT.Singular:
              {
                const scopedName = scopedNames[m.typeName]
                if (scopedName) m.typeName = scopedName
              }
              break
            case MemberT.Repeated:
              {
                const scopedName = scopedNames[m.typeName]
                if (scopedName) m.typeName = scopedName
              }
              break
          }
        }
      }
    }
  },
  main = (cardsDir: string, pyCardsFilepath: string) => {
    const protocol: Protocol = { files: [] }
    processDir(protocol, cardsDir)
    scopeNames(protocol)
    console.log(util.inspect(protocol, { depth: null }))
    fs.writeFileSync(pyCardsFilepath, translateToPython(protocol), 'utf8')
  }

try {
  main(process.argv[2], process.argv[3])
} catch (e) {
  if (e.name === codeGenErrorT) {
    console.log(`Error: code generation failed: ${e.message}`)
    process.exit(1)
  }
  throw e
}
