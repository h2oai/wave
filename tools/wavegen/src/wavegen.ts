// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//
// WaveGen
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
// @ts-ignore
import { toXML } from 'jstoxml'

const licenseLines = `Copyright 2020 H2O.ai, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`.split('\n')

interface Dict<T> { [key: string]: T } // generic object
const packedT = 'Packed' // name of marker parametric type to indicate if an attributed could be packed.
type B = boolean
type U = number
// type I = number
// type F = number
type S = string

interface OneOf {
  name: S
  type: Type
}

interface Tag {
  name: S
  value: any
}

enum MemberT { Enum, Singular, Repeated }
interface MemberBase {
  readonly name: S
  readonly comments: S[]
  readonly isOptional: B
  readonly tags: Tag[]
}
interface EnumMember extends MemberBase {
  readonly t: MemberT.Enum
  readonly values: S[]
}
interface PackableMember extends MemberBase {
  readonly typeName: S
  readonly isPacked: B
}
interface SingularMember extends PackableMember {
  readonly t: MemberT.Singular
}
interface RepeatedMember extends PackableMember {
  readonly t: MemberT.Repeated
}
type Member = EnumMember | SingularMember | RepeatedMember
interface Type {
  readonly name: S
  readonly file: S
  readonly comments: S[]
  readonly members: Member[]
  readonly isRoot: B
  readonly areAllMembersOptional: B
  readonly tags: Tag[]
  isUnion: B
  oneOf?: OneOf
}
interface Protocol {
  readonly lookup: Dict<Type>
  readonly types: Type[]
}
interface File {
  readonly name: S
  readonly types: Type[]
}

enum Declaration { Forward, Declared }

const codeGenErrorT = 'CodeGenError'
class CodeGenError extends Error {
  constructor(message: S) {
    super(message)
    this.name = codeGenErrorT
  }
}

let warnings = 0

const
  titlecase = (s: S) => s.replace(/_/g, ' ').replace(/\b./g, s => s.toUpperCase()).replace(/\s+/g, ''),
  snakeCase = (s: S) => s.replace(/[A-Z]/g, s => '_' + s.toLowerCase()).substr(1),
  warn = (s: S) => {
    console.warn(`Warning: ${s}`)
    warnings++
  },
  reservedWords = ['view', 'box'],
  boxComment = 'A string indicating how to place this component on the page.',
  boxTags: Tag[] = [{ name: 't', value: 'box' }, { name: 'value', value: JSON.stringify({ zone: 'Body' }) }],
  commandsComment = 'Contextual menu commands for this component.',
  noComment = 'No documentation available.',
  toLookup = (xs: S[]): Dict<B> => {
    const d: Dict<B> = {}
    for (const x of xs) d[x] = true
    return d
  },
  collectSingularType = (type: ts.TypeNode): S | null => {
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
  collectRepeatedType = (type: ts.TypeNode): S | null => {
    if (type.kind === ts.SyntaxKind.ArrayType) {
      const
        t = type as ts.ArrayTypeNode,
        et = collectSingularType(t.elementType)
      if (et) return et
    }
    return null
  },
  collectEnumType = (type: ts.TypeNode): S[] | null => {
    if (type.kind === ts.SyntaxKind.UnionType) {
      const
        t = type as ts.UnionTypeNode,
        values = t.types.map((t): S => {
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
  flatten = <T>(xss: T[][]): T[] => {
    const ys: T[] = []
    for (const xs of xss) ys.push(...xs)
    return ys
  },
  segregate = <T>(xs: T[], p: (x: T) => boolean): [T[], T[]] => {
    const a: T[] = [], b: T[] = []
    for (const x of xs) {
      if (p(x)) {
        a.push(x)
      } else {
        b.push(x)
      }
    }
    return [a, b]
  },
  parseComments = (node: any): [S[], Tag[]] => {
    const
      lines: S[] = ((node as any).jsDoc?.map((c: any) => c?.comment) || []), // FIXME Undocumented API
      nonEmpty = flatten(lines.filter(c => !!c).map(c => c.split(/\n/g).map(c => c.trim()))),
      [tagged, comments] = segregate(nonEmpty, x => x.charAt(0) === ':'),
      tags = tagged.map((x): Tag => {
        const m = x.match(/^:\s*(.+?)\s+(.+)/) // :key json_value
        if (!m) throw Error(`bad tag: ${x}`)
        return { name: m[1], value: JSON.parse(m[2]) }
      })
    return [comments, tags]
  },
  collectMember = (component: S, typename: S, member: ts.TypeElement): Member => {
    if (member.kind === ts.SyntaxKind.PropertySignature) {
      const
        m = member as ts.PropertySignature,
        optional = m.questionToken ? true : false,
        memberName = m.name.getText(),
        memberType = m.type,
        [comments, tags] = parseComments(m)

      for (const w of reservedWords) if (memberName === w) throw new CodeGenError(`${component}.${typename}.${memberName}: "${w}" is a reserved name`)

      if (!memberType) throw new CodeGenError(`want type declared on ${component}.${typename}.${memberName}: ${m.getText()}`)

      if (!comments.length) {
        warn(`Doc missing on member ${component}.${typename}.${memberName}.`)
        comments.push(noComment)
      }

      let tt: S | null = null
      const pt = collectPackedType(memberType)
      if (pt) {
        tt = collectRepeatedType(pt)
        if (tt) {
          return { t: MemberT.Repeated, name: memberName, typeName: tt, isOptional: optional, comments, tags, isPacked: true }
        }
        tt = collectSingularType(pt)
        if (tt) {
          return { t: MemberT.Singular, name: memberName, typeName: tt, isOptional: optional, comments, tags, isPacked: true }
        }
      }

      tt = collectRepeatedType(memberType)
      if (tt) {
        return { t: MemberT.Repeated, name: memberName, typeName: tt, isOptional: optional, comments, tags, isPacked: false }
      }
      tt = collectSingularType(memberType)
      if (tt) {
        return { t: MemberT.Singular, name: memberName, typeName: tt, isOptional: optional, comments, tags, isPacked: false }
      }
      const values = collectEnumType(memberType)
      if (values) {
        comments.push(`One of ${values.map(v => `'${v}'`).join(', ')}. See enum h2o_wave.ui.${typename}${titlecase(memberName)}.`)
        return { t: MemberT.Enum, name: memberName, values, isOptional: optional, comments, tags }
      }
    }
    throw new CodeGenError(`unsupported member kind on ${component}.${typename}`)
  },
  collectTypes = (component: S, file: File, sourceFile: ts.SourceFile) => {
    ts.forEachChild(sourceFile, (node) => {
      switch (node.kind) {
        case ts.SyntaxKind.InterfaceDeclaration: {
          const
            n = node as ts.InterfaceDeclaration,
            nodeName = n.name.getText(),
            isRoot = nodeName === 'State',
            typeName = isRoot ? titlecase(`${file.name}_card`) : nodeName,
            members = n.members.map(m => collectMember(component, typeName, m)),
            [comments, tags] = parseComments(n)

          if (!comments.length) {
            comments.push(noComment)
            warn(`Doc missing on type ${component}.${typeName}.`)
          }

          // All cards must have a box defined.
          if (isRoot) members.unshift({ t: MemberT.Singular, name: 'box', typeName: 'S', isOptional: false, comments: [boxComment], tags: boxTags, isPacked: false })

          // All cards can optionally have a contextual menu.
          if (isRoot) members.push({ t: MemberT.Repeated, name: 'commands', typeName: 'Command', isOptional: true, comments: [commandsComment], tags: [], isPacked: false })

          const areAllMembersOptional = !members.filter(m => !m.isOptional).length // all members are optional?
          file.types.push({ name: typeName, file: file.name, comments, tags, members, isRoot, areAllMembersOptional, isUnion: false })
        }
      }
    })
  },
  processFile = (files: File[], filepath: S) => {
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
  processDir = (files: File[], dirpath: S) => {
    const
      ignored = toLookup(fs.readFileSync(path.join(dirpath, '.wavegen'), 'utf8').split('\n').map(x => x.trim())),
      filenames = fs.readdirSync(dirpath)
    for (const filename of filenames) {
      if (ignored[filename]) continue
      const filepath = path.join(dirpath, filename)
      if (fs.statSync(filepath).isFile()) processFile(files, filepath)
    }
  },
  pyTypeMappings: Dict<S> = {
    Id: 'str',
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
  tranlateToPy = (protocol: Protocol): [S, S] => {
    const
      lines: S[] = [],
      p = (line: S) => lines.push(line),
      printLicense = () => { for (const line of licenseLines) p(line ? `# ${line}` : '#') },
      flush = (): S => { const s = lines.join('\n'); lines.length = 0; return s },
      classes: Dict<Declaration> = {},
      apis: Dict<B> = {},
      knownTypes = ((): Dict<Type> => {
        const d: Dict<Type> = {}
        for (const type of protocol.types) {
          d[type.name] = type
        }
        return d
      })(),
      maybeForwardDeclare = (t: S): S => {
        const d = classes[t]
        return d === Declaration.Forward ? `'${t}'` : t
      },
      mapType = (t: S): S => {
        const pt = pyTypeMappings[t]
        if (pt) return pt
        if (knownTypes[t]) return maybeForwardDeclare(t)
        throw new CodeGenError(`cannot map type ${t} to Python`)
      },
      genType = (m: Member): S => {
        switch (m.t) {
          case MemberT.Enum:
            return 'str'
          case MemberT.Singular:
            return mapType(m.typeName)
          case MemberT.Repeated:
            return `List[${mapType(m.typeName)}]`
        }
      },
      genPackedType = (m: Member): S => {
        if ((m.t === MemberT.Repeated || m.t === MemberT.Singular) && m.isPacked) {
          return `Union[${genType(m)}, str]`
        }
        return genType(m)
      },
      genOptType = (m: Member): S => {
        const t = genPackedType(m)
        return m.isOptional ? `Optional[${t}]` : t
      },
      genSig = (m: Member): S => `${m.name}: ${genOptType(m)}`,
      getSigWithDefault = (m: Member): S => genSig(m) + (m.isOptional ? ' = None' : ''),
      getKnownTypeOf = (m: Member): Type | null => {
        switch (m.t) {
          case MemberT.Singular: return knownTypes[m.typeName] || null
          case MemberT.Repeated: return knownTypes[m.typeName] || null
        }
        return null
      },
      genComments = (comments: S[], padding: S): S => comments.map(c => (padding + c).trimRight()).join('\n').trim(),
      mapValidationType = (t: S, forDeserialization: B): S[] | null => {
        switch (t) {
          case 'Id':
          case 'S':
            return ['str']
          case 'F':
            return ['float', 'int'] // allow ints, since JS doesn't care.
          case 'I':
          case 'U':
            return ['int']
          case 'B':
            return ['bool']
          case 'V':
          case 'Rec':
          case 'Recs':
          case 'Data':
            return null // TODO handle properly
        }
        return forDeserialization ? ['dict'] : [knownTypes[t].name]
      },
      toPyBool = (b: B) => b ? 'True' : 'False',
      guardValue = (t: Type, m: Member, variable: S, forDeserialization: B) => {
        switch (m.t) {
          case MemberT.Singular:
          case MemberT.Repeated:
            {
              const vts = mapValidationType(m.typeName, forDeserialization)
              if (vts) {
                p(`        _guard_${m.t === MemberT.Singular ? 'scalar' : 'vector'}('${t.name}.${m.name}', ${variable}, (${vts.join(', ')},), ${toPyBool(m.typeName === 'Id')}, ${toPyBool(m.isOptional)}, ${toPyBool(m.isPacked)})`)
              }
            }
            break
          case MemberT.Enum:
            p(`        _guard_enum('${t.name}.${m.name}', ${variable}, _${t.name}${titlecase(m.name)}, ${m.isOptional ? 'True' : 'False'})`)
            break
        }
      },
      genClass = (type: Type) => {
        if (classes[type.name] === Declaration.Declared || classes[type.name] === Declaration.Forward) return

        // Ensure all components have a name parameter
        if (!type.isUnion && !type.members.some(m => m.name === 'name')) {
          type.members.push({
            name: 'name',
            t: MemberT.Singular,
            typeName: 'S',
            isOptional: true,
            isPacked: false,
            comments: ['An identifying name for this component.'],
          } as Member)
        }

        classes[type.name] = Declaration.Forward

        // generate member types first so that we don't have to forward-declare.
        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genClass(memberType)
        }

        console.log(`Generating ${type.name}...`)

        for (const m of type.members) {
          if (m.t == MemberT.Enum) {
            const enumName = `${type.name}${titlecase(m.name)}`
            p('')
            p(`_${enumName} = [${m.values.map(v => `'${v}'`).join(', ')}]`)
            p('')
            p('')
            p(`class ${enumName}:`)
            for (const v of m.values) {
              p(`    ${v.toUpperCase().replace(/-/, '_')} = '${v}'`)
            }
            p('')
          }
        }

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
        for (const m of type.members) guardValue(type, m, m.name, false)

        for (const m of type.members) {
          p(`        self.${m.name} = ${m.name}`)
          p(`        """${m.comments.join(' ')}"""`)
        }
        p('')
        p(`    def dump(self) -> Dict:`)
        p(`        """Returns the contents of this object as a dict."""`)

        for (const m of type.members) guardValue(type, m, `self.${m.name}`, false)

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
          guardValue(type, m, rval, true)
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
      genClasses = (): S => {
        p('#')
        p('# THIS FILE IS GENERATED; DO NOT EDIT')
        p('#')
        p('')
        printLicense()
        p('')
        p('from typing import Any, Optional, Union, Dict, List')
        p('from .core import Data')
        p('')
        p('Value = Union[str, float, int]')
        p('PackedRecord = Union[dict, str, Data]')
        p('PackedRecords = Union[List[dict], str]')
        p('PackedData = Union[Data, str]') // special-cased during packing, Go allocation and unpacking.
        p('')
        p('')
        p('def _dump(**kwargs): return {k: v for k, v in kwargs.items() if v is not None}')
        p('')
        p('')
        p('def _guard_scalar(name: str, value: Any, types, non_empty: bool, optional: bool, packed: bool):')
        p('    if optional and (value is None):')
        p('        return')
        p('    if packed and isinstance(value, str):')
        p('        return')
        p('    if not isinstance(value, types):')
        p("        raise ValueError(f'{name}: want one of {types}, got {type(value)}')")
        p('    if non_empty and len(value) == 0:')
        p("        raise ValueError(f'{name}: must be non-empty')")
        p('')
        p('')
        p('def _guard_vector(name: str, values: Any, types, non_empty: bool, optional: bool, packed: bool):')
        p('    if optional and (values is None):')
        p('        return')
        p('    if packed and isinstance(values, str):')
        p('        return')
        p('    if not isinstance(values, list):')
        p("        raise ValueError(f'{name}: want list of {types}, got {type(values)}')")
        p('    for value in values:')
        p("        _guard_scalar(f'{name} element', value, types, False, non_empty, False)")
        p('')
        p('')
        p('def _guard_enum(name: str, value: str, values: List[str], optional: bool):')
        p('    if optional and (value is None):')
        p('        return')
        p('    if value not in values:')
        p("        raise ValueError(f'{name}: want one of {values}, got {value}')")
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

        // Ensure all components have a name parameter
        if (!type.isUnion && !type.members.some(m => m.name === 'name')) {
          type.members.push({
            name: 'name',
            t: MemberT.Singular,
            typeName: 'S',
            isOptional: true,
            isPacked: false,
            comments: ['An identifying name for this component.'],
          } as Member)
        }

        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genAPI(memberType)
        }

        // Don't generate API function for discriminated unions
        if (type.isUnion) return

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
        p(`        A \`h2o_wave.types.${type.name}\` instance.`)
        p(`    """`)
        for (const m of type.members) {
          for (const comment of m.comments) {
            if (comment.toLowerCase().indexOf('deprecated') >= 0) {
              p(`    if ${m.name} is not None:`)
              p(`        warnings.warn('The ${m.name} argument is deprecated.')`)
              break
            }
          }
        }
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
      genAPIs = (): S => {
        p('#')
        p('# THIS FILE IS GENERATED; DO NOT EDIT')
        p('#')
        p('')
        printLicense()
        p('')
        p('import warnings')
        p('from .types import *')
        p('from .ui_ext import *')
        p('')

        for (const type of protocol.types) {
          if (type.isRoot) {
            genAPI(type)
          }
        }
        return flush()
      }
    return [genClasses(), genAPIs()]
  },
  rTypeMappings: Dict<S> = {
    Id: 'character',
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
  translateToR = (protocol: Protocol): S => {
    const
      lines: S[] = [],
      p = (line: S) => lines.push(line),
      printLicense = () => { for (const line of licenseLines) p(line ? `# ${line}` : '#') },
      flush = (): S => { const s = lines.join('\n'); lines.length = 0; return s },
      apis: Dict<B> = {},
      knownTypes = ((): Dict<Type> => {
        const d: Dict<Type> = {}
        for (const type of protocol.types) {
          d[type.name] = type
        }
        return d
      })(),
      mapType = (t: S): S => {
        const pt = rTypeMappings[t]
        if (pt) return pt
        throw new CodeGenError(`cannot map type ${t} to R`)
      },
      genSig = (m: Member): S => m.name,
      getSigWithDefault = (m: Member): S => genSig(m) + (m.isOptional ? ' = NULL' : ''),
      getKnownTypeOf = (m: Member): Type | null => {
        switch (m.t) {
          case MemberT.Singular: return knownTypes[m.typeName] || null
          case MemberT.Repeated: return knownTypes[m.typeName] || null
        }
        return null
      },
      genComments = (comments: S[]): S => {
        return comments.map(c => "#' " + c.trimRight()).join('\n').trim()
      },
      layoutParams = (xs: S[], pad: S) => {
        const lines = pad + xs.join(',\n' + pad)
        return '\n' + lines
      },
      genClassName = (t: S) => `Wave${t}`,
      genParamValidation = (n: S, t: S) => p(`  .guard_scalar("${n}", "${t}", ${n})`),
      genRepeatedParamValidation = (n: S, t: S) => p(`  .guard_vector("${n}", "${t}", ${n})`),
      genFunc = (type: Type) => {
        if (apis[type.name]) return
        apis[type.name] = true

        for (const m of type.members) {
          const memberType = getKnownTypeOf(m)
          if (memberType) genFunc(memberType)
        }

        // Don't generate API function for discriminated unions
        if (type.isUnion) return

        p(``)
        p(genComments(type.comments))
        p(`#'`)
        for (const m of type.members) {
          p(`#' @param ${m.name} ` + m.comments.join("\n#'   "))
        }
        p(`#' @return A ${type.name} instance.`)
        p(`#' @export`)
        const
          params = type.members.map(getSigWithDefault),
          assigns = type.members.map(m => `${m.name}=${m.name}`)

        p(`ui_${snakeCase(type.name)} <- function(${layoutParams(params, '  ')}) {`)
        for (const m of type.members) {
          switch (m.t) {
            case MemberT.Singular:
              switch (m.typeName) {
                case 'Id':
                case 'S':
                case 'F':
                case 'I':
                case 'U':
                case 'B':
                  genParamValidation(m.name, mapType(m.typeName))
                  break
                case 'V':
                case 'Rec':
                case 'Recs':
                case 'Data':
                  p(`  # TODO Validate ${m.name}: ${m.typeName}`)
                  break
                default:
                  genParamValidation(m.name, genClassName(m.typeName))
              }
              break
            case MemberT.Repeated:
              switch (m.typeName) {
                case 'Id':
                case 'S':
                case 'F':
                case 'I':
                case 'U':
                case 'B':
                  genRepeatedParamValidation(m.name, mapType(m.typeName))
                  break
                case 'V':
                case 'Rec':
                case 'Recs':
                case 'Data':
                  p(`  # TODO Validate ${m.name}: repeated ${m.typeName}`)
                  break
                default:
                  genRepeatedParamValidation(m.name, genClassName(m.typeName))
              }
              break
            default:
              p(`  # TODO Validate ${m.name}`)
          }
        }
        if (type.isRoot) assigns.push(`view='${type.file}'`)
        if (type.oneOf) {
          p(`  .o <- list(${type.oneOf.name}=list(${layoutParams(assigns, '    ')}))`)
        } else {
          p(`  .o <- list(${layoutParams(assigns, '    ')})`)
        }
        const typeName = type.oneOf ? type.oneOf.type.name : type.name
        p(`  class(.o) <- append(class(.o), c(.wave_obj, "${genClassName(typeName)}"))`)
        p('  return(.o)')
        p('}')
      },
      genFuncs = (): S => {
        p('#')
        p('# THIS FILE IS GENERATED; DO NOT EDIT')
        p('#')
        p('')
        printLicense()
        p('')
        p(`.recursive_null_extractor <- function(x){`)
        p(`     attribute_holder <- attributes(x)$class`)
        p(`     x <- lapply(x,function(y){`)
        p(`          if(is.list(y)){`)
        p(`             return(.recursive_null_extractor(y))`)
        p(`          }`)
        p(`          else {`)
        p(`             return(y)`)
        p(`          }`)
        p(`     })`)
        p(`     x[sapply(x,is.null)] <- NULL`)
        p(`     attributes(x)$class <- attribute_holder`)
        p(` return(x)`)
        p(`}`)
        p(``)
        p(`.to_json <- function(x) {`)
        p(`  x <- .recursive_null_extractor(x)`)
        p(`  jsonlite::toJSON(x, auto_unbox = TRUE)`)
        p(`}`)
        p(``)
        p(`.guard_scalar <- function(n, t, x) {`)
        p(`  if(!is.null(x) && !is(x, t)) {`)
        p(`    stop(sprintf("%s: expected %s", n, t))`)
        p(`  }`)
        p(`}`)
        p(``)
        p(`.guard_vector <- function(n, t, xs) {`)
        p(`  if(!is.null(xs) && (FALSE %in% unlist(lapply(xs, function(x){ is(x, t) })))) {`)
        p(`    stop(sprintf("%s: expected list of %s", n, t))`)
        p(`  }`)
        p(`}`)
        p(`.wave_obj <- "WaveObject"`)
        p(``)
        p(`dump_object <- function(x) {`)
        p(`  if(is(x, .wave_obj)) {`)
        p(`    .to_json(x)`)
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
  translateToTypescript = (protocol: Protocol): S => {
    const
      lines: S[] = [],
      p = (line: S) => lines.push(line),
      defs: any[] = []

    p('//')
    p('// THIS FILE IS GENERATED; DO NOT EDIT')
    p('//')
    p('')

    for (const line of licenseLines) p(line ? `// ${line}` : '//')

    p('')
    p("import { CardDef } from './editing'")
    p('')

    for (const t of protocol.types) {
      if (!t.tags?.length) continue
      const
        def: any = { view: t.file },
        attrs: any[] = []

      for (const { name, value } of t.tags) def[name] = value
      for (const m of t.members) {
        if (!m.tags?.length) continue
        const attr: any = { name: m.name, optional: m.isOptional }
        for (const { name, value } of m.tags) attr[name] = value
        attrs.push(attr)
      }
      def.attrs = attrs
      defs.push(def)
    }
    defs.sort((a, b) => a.view > b.view ? 1 : -1)
    p('export const cardDefs: CardDef[] = ' + JSON.stringify(defs, null, 2))
    return lines.join('\n')
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
      if (type.areAllMembersOptional) {
        let oneOfCount = 0
        for (const m of type.members) {
          if (m.t == MemberT.Singular || m.t === MemberT.Repeated) {
            const mt = lookup[m.typeName]
            if (mt) {
              if (mt.oneOf) {
                throw new CodeGenError(`Union type member ${type.name}.${mt.name} is already used in ${mt.oneOf.type.name}.${mt.oneOf.name}`)
              }
              mt.oneOf = { name: m.name, type }
              oneOfCount++
            }
          }
        }
        type.isUnion = oneOfCount === type.members.length
      }
    }

    return { types, lookup }
  },
  printStats = (protocol: Protocol) => {
    console.log('-----------------------------------------------------')
    console.log('API attribute frequencies:')
    const d: Dict<number> = {}
    for (const t of protocol.types) {
      for (const { name } of t.members) {
        const f = d[name]
        d[name] = f ? f + 1 : 1
      }
    }

    console.log(Object.keys(d).sort().reduce((obj, key) => {
      obj[key] = d[key]
      return obj
    }, {} as any))

    let count = 0
    for (const t of protocol.types) {
      count += t.members.length
    }

    console.log('-----------------------------------------------------')
    console.log('API attribute enums:')
    for (const t of protocol.types) {
      for (const m of t.members) {
        if (m.t === MemberT.Enum) {
          console.log(`${t.name}.${m.name}: ${m.values.join(', ')}`)
        }
      }
    }
    console.log('-----------------------------------------------------')
    console.log(`API surface: ${protocol.types.length} types, ${count} members.`)
  },
  generatePy = (protocol: Protocol, outDir: S) => {
    const [classes, api] = tranlateToPy(protocol)
    fs.writeFileSync(path.join(outDir, 'types.py'), classes, 'utf8')
    fs.writeFileSync(path.join(outDir, 'ui.py'), api, 'utf8')
  },
  generateR = (protocol: Protocol, outDir: S) => {
    const api = translateToR(protocol)
    fs.writeFileSync(path.join(outDir, 'ui.R'), api, 'utf8')
  },
  generateTypescript = (protocol: Protocol, outDir: S) => {
    const api = translateToTypescript(protocol)
    fs.writeFileSync(path.join(outDir, 'defs.ts'), api, 'utf8')
  },
  splitRepeatedAndSingular = (members: Member[]) => members.reduce((acc, m) => {
    m.t === MemberT.Repeated ? acc.repeatedMembers.push(m) : acc.singularMembers.push(m)
    return acc
  }, { singularMembers: [], repeatedMembers: [] } as { singularMembers: Member[], repeatedMembers: Member[] }),
  generatePyCharmSnippets = (protocol: Protocol) => {
    const
      newline = '&#10;',
      snippetJSON = {
        _name: 'templateSet',
        _attrs: {
          group: 'wave-components'
        },
        _content: []
      },
      baseTemplateContent = {
        context: {
          _name: 'option',
          _attrs: { name: 'Python', value: 'true' }
        }
      },
      trailingComma = ({ isRoot }: Type) => isRoot ? '' : ',',
      getSnippetParams = (sm: Member[], rm: Member[]) => sm.map(mapSnippets).join('') + rm.map(mapSnippets).join(''),
      mapVariables = (m: Member) => {
        let defaultValue = m.t === MemberT.Singular && m.typeName === 'B'
          ? 'False'
          : m.t === MemberT.Singular && m.typeName !== 'S' && m.typeName !== 'Id' && m.isOptional
            ? 'None'
            : ''

        defaultValue = m.comments.reduce((defaultVal, cur) => {
          const match = /(.+Defaults to )(.+)(\.)/.exec(cur)
          return match?.length && match.length >= 3 ? `${match[2].replace(/(^['"`])|(['"`]$)/g, '')}` : defaultVal
        }, defaultValue)

        return {
          _name: 'variable',
          _attrs: {
            name: m.name,
            expression: '',
            defaultValue: defaultValue ? `&quot;${defaultValue}&quot;` : '',
            alwaysStopAt: 'true'
          }
        }
      },
      mapSnippets = (m: Member) => {
        let leftSurrounding = '', rightSurrounding = ''
        if (m.t === MemberT.Enum || m.t === MemberT.Singular && (m.typeName === 'S' || m.typeName === 'Id')) {
          leftSurrounding = rightSurrounding = "'"
        }
        else if (m.t === MemberT.Repeated) {
          leftSurrounding = `[${newline}\t`
          rightSurrounding = `\t${newline}]`
        }
        return `${m.name}=${leftSurrounding}$${m.name}$${rightSurrounding},`
      },
      shortTemplates = protocol.types
        .filter(t => !t.areAllMembersOptional && !t.file.includes('.test'))
        .map(t => {
          const
            name = snakeCase(t.name),
            { singularMembers, repeatedMembers } = splitRepeatedAndSingular(t.members.filter(m => !m.isOptional)),
            variables = [...singularMembers.map(mapVariables), ...repeatedMembers.map(mapVariables)]

          return {
            _name: 'template',
            _attrs: {
              name: `w_${name}`,
              value: `ui.${name}(${getSnippetParams(singularMembers, repeatedMembers)})${trailingComma(t)}$END$`.replace(',)', ')'),
              description: `Create a minimal Wave ${t.name}.`,
              toReformat: 'true',
              toShortenFQNames: 'true'
            },
            _content: [...variables, baseTemplateContent]
          }
        }),
      longTemplates = protocol.types
        .filter(t => !t.file.includes('.test'))
        .map(t => {
          const
            name = snakeCase(t.name),
            { singularMembers, repeatedMembers } = splitRepeatedAndSingular(t.members),
            variables = [...singularMembers.map(mapVariables), ...repeatedMembers.map(mapVariables)]

          return {
            _name: 'template',
            _attrs: {
              name: `w_full_${name}`,
              value: `ui.${name}(${getSnippetParams(singularMembers, repeatedMembers)})${trailingComma(t)}$END$`.replace(',)', ')'),
              description: `Create Wave ${t.name} with full attributes.`,
              toReformat: 'true',
              toShortenFQNames: 'true'
            },
            _content: [...variables, baseTemplateContent]
          }
        })
    snippetJSON._content = [...shortTemplates, ...longTemplates] as any

    fs.writeFileSync('../intellij-plugin/src/main/resources/templates/wave-components.xml', toXML(snippetJSON, { indent: '  ' }).replace('\n', ''))
  },
  generateVSCSnippets = (protocol: Protocol) => {
    const
      trailingComma = ({ isRoot }: Type) => isRoot ? '' : ',',
      getDefaultVal = (m: Member) => {
        let defaultValue = m.t === MemberT.Singular && m.typeName === 'B'
          ? 'False'
          : m.t === MemberT.Singular && m.typeName !== 'S' && m.typeName !== 'Id' && m.isOptional
            ? 'None'
            : ''

        defaultValue = m.comments.reduce((defaultVal, cur) => {
          const match = /(.+Defaults to )(.+)(\.)/.exec(cur)

          if (cur.includes('%')) {
            console.log();
          }
          return match?.length && match.length >= 3 ? `${match[2].replace(/(^['"`])|(['"`]$)/g, '')}` : defaultVal
        }, defaultValue)
        return defaultValue
      },
      mapSnippets = (m: Member, idx: U) => {
        let leftSurrounding = '', rightSurrounding = ''
        if (m.t === MemberT.Enum || m.t === MemberT.Singular && (m.typeName === 'S' || m.typeName === 'Id')) {
          leftSurrounding = rightSurrounding = "'"
        }
        else if (m.t === MemberT.Repeated) {
          leftSurrounding = `[\n\t\t`
          rightSurrounding = `\t\t\n]`
        }
        if (m.name === 'pagination') {
          console.log();
        }
        const defaultVal = getDefaultVal(m)
        return `${m.name}=${leftSurrounding}$${defaultVal ? `{${idx + 1}:${defaultVal}}` : idx + 1}${rightSurrounding}, `
      },
      shortTemplates = protocol.types
        .filter(t => !t.areAllMembersOptional && !t.file.includes('.test'))
        .map(t => {
          const
            name = snakeCase(t.name),
            { singularMembers, repeatedMembers } = splitRepeatedAndSingular(t.members.filter(m => !m.isOptional)),
            snippetParams = [...singularMembers, ...repeatedMembers].map(mapSnippets).join('')

          return {
            name: `Wave ${t.name}`,
            prefix: `w_${name}`,
            description: `Create a minimal Wave ${t.name}.`,
            body: [`ui.${name}(${snippetParams})${trailingComma(t)}$0`.replace(', )', ')')],
          }
        }),
      longTemplates = protocol.types
        .filter(t => !t.file.includes('.test'))
        .map(t => {
          const
            name = snakeCase(t.name),
            { singularMembers, repeatedMembers } = splitRepeatedAndSingular(t.members),
            snippetParams = [...singularMembers, ...repeatedMembers].map(mapSnippets).join('')

          return {
            name: `Wave Full ${t.name}`,
            prefix: `w_full_${name}`,
            description: `Create a full Wave ${t.name}.`,
            body: [`ui.${name}(${snippetParams})${trailingComma(t)}$0`.replace(', )', ')')],
          }
        })

    const resultJSON = [...shortTemplates, ...longTemplates].reduce((acc, { name, prefix, body, description }) => {
      acc[name] = { prefix, body, description }
      return acc
    }, {} as { [key: string]: { prefix: S, body: S[], description: S } })

    fs.writeFileSync('../vscode-extension/component-snippets.json', JSON.stringify(resultJSON, null, 2))
  },
  main = (typescriptSrcDir: S, pyOutDir: S, rOutDir: S) => {
    const files: File[] = []
    processDir(files, typescriptSrcDir)
    const protocol = makeProtocol(files)

    generatePy(protocol, pyOutDir)
    generateR(protocol, rOutDir)
    generateTypescript(protocol, typescriptSrcDir)
    generatePyCharmSnippets(protocol)
    generateVSCSnippets(protocol)

    printStats(protocol)
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
