import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import * as ts from 'typescript'

export interface Dict<T> { [key: string]: T } // generic object

// References:
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
// https://ts-ast-viewer.com/

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
}
interface RepeatedMember extends MemberBase {
  readonly t: MemberT.Repeated
  typeName: string
}
type Member = EnumMember | SingularMember | RepeatedMember
interface Type {
  name: string
  readonly members: Member[]
  readonly isRoot: boolean
}
interface File {
  readonly name: string
  readonly types: Type[]
}
interface Protocol {
  readonly files: File[]
}

enum Declaration { Forward, Declared }

const
  collectTypes = (component: string, file: File, sourceFile: ts.SourceFile) => {
    ts.forEachChild(sourceFile, (node) => {
      switch (node.kind) {
        case ts.SyntaxKind.InterfaceDeclaration:
          const
            n = node as ts.InterfaceDeclaration,
            typename = n.name.getText(),
            members = n.members.map((member): Member => {
              switch (member.kind) {
                case ts.SyntaxKind.PropertySignature:
                  const
                    m = member as ts.PropertySignature,
                    optional = m.questionToken ? true : false,
                    memberName = m.name.getText(),
                    memberType = m.type,
                    comment = (m as any).jsDoc?.map((c: any) => c?.comment).join('\n') || '' // FIXME Undocumented API

                  if (!memberType) throw new Error(`want type declared on ${component}.${typename}.${memberName}: ${m.getText()}`)

                  switch (memberType.kind) {
                    case ts.SyntaxKind.ArrayType:
                      {
                        const
                          t = memberType as ts.ArrayTypeNode,
                          elementType = t.elementType
                        switch (elementType.kind) {
                          case ts.SyntaxKind.TypeReference:
                            {
                              const t = elementType as ts.TypeReferenceNode
                              return { t: MemberT.Repeated, name: memberName, typeName: t.getText(), optional, comment }
                            }
                          default:
                            throw new Error(`unsupported element type on ${component}.${typename}.${memberName}: ${m.getText()}`)
                        }
                      }
                    case ts.SyntaxKind.TypeReference:
                      {
                        const t = memberType as ts.TypeReferenceNode
                        return { t: MemberT.Singular, name: memberName, typeName: t.getText(), optional, comment }
                      }
                    case ts.SyntaxKind.UnionType:
                      {
                        const
                          t = memberType as ts.UnionTypeNode,
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
                            throw new Error(`unsupported union type on ${component}.${typename}.${memberName}: ${m.getText()}`)
                          })
                        return { t: MemberT.Enum, name: memberName, values, optional, comment }
                      }
                    default:
                      throw new Error(`unsupported type on ${component}.${typename}.${memberName}: ${m.getText()}`)
                  }
              }
              throw new Error(`unsupported member kind on ${component}.${typename}`)
            })
          file.types.push({ name: typename, members, isRoot: typename === 'State' })
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
    const filenames = fs.readdirSync(dirpath)
    for (const filename of filenames) {
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
  newPyGen = (protocol: Protocol) => {
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
      mapPyType = (t: string): string => {
        const pt = pyTypeMappings[t]
        if (pt) return pt
        if (knownTypes[t]) return maybeForwardDeclare(t)
        throw new Error(`cannot map type ${t} to Python`)
      },
      genPyType = (m: Member): string => {
        switch (m.t) {
          case MemberT.Enum:
            return 'str'
          case MemberT.Singular:
            return mapPyType(m.typeName)
          case MemberT.Repeated:
            return `Repeated[${mapPyType(m.typeName)}]`
        }
      },
      genPyOptType = (m: Member): string => {
        const t = genPyType(m)
        return m.optional ? `Optional[${t}]` : t
      },
      genPySig = (m: Member): string => `${m.name}: ${genPyOptType(m)}`,
      getPySigWithDefault = (m: Member): string => genPySig(m) + (m.optional ? ' = None' : ''),
      getKnownTypeOf = (m: Member): Type | null => {
        switch (m.t) {
          case MemberT.Singular: return knownTypes[m.typeName] || null
          case MemberT.Repeated: return knownTypes[m.typeName] || null
        }
        return null
      },
      genPyClass = (type: Type) => {
        if (declarations[type.name] === Declaration.Declared || declarations[type.name] === Declaration.Forward) return

        declarations[type.name] = Declaration.Forward

        // generate member types first so that we don't have to forward-declare.
        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genPyClass(memberType)
        }

        console.log(`Generating ${type.name}...`)
        p('')
        p(`class ${type.name}:`)
        p(`    def __init__(`)
        p(`            self,`)
        for (const m of type.members) {
          p(`            ${getPySigWithDefault(m)},`)
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
        for (const m of type.members) { // pack
          if (getKnownTypeOf(m)) {
            if (m.t === MemberT.Repeated) {
              p(`            ${m.name}=[__e.dump() for __e in self.${m.name}],`)
            } else {
              p(`            ${m.name}=self.${m.name}.dump(),`)
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
              p(`        ${genPySig(m)} = [${memberType.name}.load(__e) for __e in __d_${m.name}]`)
            } else {
              p(`        ${genPySig(m)} = ${memberType.name}.load(__d_${m.name})`)
            }
          } else {
            p(`        ${genPySig(m)} = __d_${m.name}`)
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
            if (type.isRoot) {
              genPyClass(type)
            }
          }
        }
        return lines.join('\n')
      }
    return { generate }
  },
  titlecase = (s: string) => s.replace(/_/g, ' ').replace(/\b./g, s => s.toUpperCase()).replace(/\s+/g, ''),
  scopeNames = (protocol: Protocol) => {
    const scopedNames: Dict<string> = {}
    for (const file of protocol.files) {
      const scope = titlecase(file.name)
      for (const type of file.types) {
        const scopedName = type.isRoot ? scope : scope + type.name
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
    fs.writeFileSync(pyCardsFilepath, newPyGen(protocol).generate(), 'utf8')
  }

main(process.argv[2], process.argv[3])
