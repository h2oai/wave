import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import * as ts from 'typescript'

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
  readonly type: string
}
interface RepeatedMember extends MemberBase {
  readonly t: MemberT.Repeated
  readonly type: string
}
type Member = EnumMember | SingularMember | RepeatedMember
interface Type {
  readonly name: string
  readonly members: Member[]
}
interface File {
  readonly name: string
  readonly types: Type[]
}
interface Protocol {
  readonly files: File[]
}

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
                              return { t: MemberT.Repeated, name: memberName, type: t.getText(), optional, comment }
                            }
                          default:
                            throw new Error(`unsupported element type on ${component}.${typename}.${memberName}: ${m.getText()}`)
                        }
                      }
                    case ts.SyntaxKind.TypeReference:
                      {
                        const t = memberType as ts.TypeReferenceNode
                        return { t: MemberT.Singular, name: memberName, type: t.getText(), optional, comment }
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
          file.types.push({ name: typename, members })
      }
    })
  },
  processFile = (protocol: Protocol, filepath: string) => {
    console.log(`Translating ${filepath}`)
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
  }

const protocol: Protocol = { files: [] }
processDir(protocol, process.argv[2])
console.log(util.inspect(protocol, { depth: null }))