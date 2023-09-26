<%
  import os

  import pdoc
  from pdoc.html_helpers import extract_toc, glimpse, to_html as _to_html, format_git_link


  def link(dobj: pdoc.Doc, name=None):
    name = name or dobj.qualname + ('()' if isinstance(dobj, pdoc.Function) else '')
    if isinstance(dobj, pdoc.External) and not external_links:
        return name
    url = dobj.url(link_prefix=link_prefix, top_ancestor=not show_inherited_members).replace('.html','')
    ## Replace "." with "_" because Docusarus doesn't seem to like "." in custom heading ids.
    return f'<a title="{dobj.refname}" href={{useBaseUrl("{url.replace("h2o_wave/", "").replace(".", "_")}")}}>{name}</a>'


  def to_html(text):
    return _to_html(text, docformat=docformat, module=module, link=link, latex_math=latex_math).replace('<h2 ','<h5 ').replace('</h2>','</h5>').replace('<strong>','').replace('</strong>', '')


  def get_annotation(bound_method, sep=':'):
    annot = show_type_annotations and bound_method(link=link) or ''
    if annot:
        annot = ' ' + sep + '\N{NBSP}' + annot
    return annot
%>

<%def name="ident(name)"><span className="ident">${name}</span></%def>

<%def name="show_desc(d, short=False)">
  <%
  inherits = ' inherited' if d.inherits else ''
  docstring = glimpse(d.docstring) if short or inherits else d.docstring
  %>
  % if d.inherits:
*Inherited from:*
          % if hasattr(d.inherits, 'cls'):
<code>${link(d.inherits.cls)}</code>.<code>${link(d.inherits, d.name)}</code>
          % else:
<code>${link(d.inherits)}</code>
          % endif
  % endif
${docstring | to_html}
</%def>

<%def name="show_module(module)">
  <%
  variables = module.variables(sort=sort_identifiers)
  classes = module.classes(sort=sort_identifiers)
  functions = module.functions(sort=sort_identifiers)
  submodules = module.submodules()
  %>

  <%def name="show_func(f, is_method=False)">
<div className='api'>

    % if is_method:
${"####"} <span id="${f.refname}">${f.name}</span>

    % else:
${"###"} <span id="${f.refname}">${f.name}</span>
    % endif

        <%
            params = ', '.join(f.params(annotate=show_type_annotations, link=link))
            return_type = get_annotation(f.return_annotation, '\N{non-breaking hyphen}>')
        %>

<div className='api__body'>
<div className='api__signature'>
${f.funcdef()} ${ident(f.name)}(${params})${return_type}
</div>

<div className='api__description'>
${show_desc(f)}
</div>
</div>

</div>
  </%def>

---
title: ${'Namespace' if module.is_namespace else  \
                      'Package' if module.is_package and not module.supermodule else \
                      'Module'} ${module.name}
---
import useBaseUrl from '@docusaurus/useBaseUrl';

${module.docstring | to_html}

    % if submodules:
<h2 className="section-title" id="header-submodules">Sub-modules</h2>
<dl>
    % for m in submodules:
<dt><code className="name">${link(m)}</code></dt>
<dd>${show_desc(m, short=True)}</dd>
    % endfor
</dl>
    % endif

    % if variables:
<h2 className="section-title" id="header-variables">Global variables</h2>
<dl>
    % for v in variables:
      <% return_type = get_annotation(v.type_annotation) %>
<dt id="${v.refname}"><code className="name">var ${ident(v.name)}${return_type}</code></dt>
<dd>${show_desc(v)}</dd>
    % endfor
</dl>
    % endif

    % if functions:
${"##"} Functions
    % for f in functions:
      ${show_func(f)}
    % endfor
    % endif

    % if classes:

${"##"} Classes

    % for c in classes:
      <%
      class_vars = c.class_variables(show_inherited_members, sort=sort_identifiers)
      smethods = c.functions(show_inherited_members, sort=sort_identifiers)
      inst_vars = c.instance_variables(show_inherited_members, sort=sort_identifiers)
      methods = c.methods(show_inherited_members, sort=sort_identifiers)
      mro = c.mro()
      subclasses = c.subclasses()
      params = ', '.join(c.params(annotate=show_type_annotations, link=link))
      %>

<div className='api'>

${"###"} ${c.name} ${"{#" + c.refname.replace('.', '_') + "}"}

<div className='api__body'>

<div className='api__signature'>
          % if params:
class ${ident(c.name)}(${params})
          % else:
class ${ident(c.name)}
          % endif
</div>


<div className='api__description'>
${show_desc(c)}
</div>


      % if class_vars:
${"####"} Class variables

<div className='api__body'>

          % for v in class_vars:
              <% return_type = get_annotation(v.type_annotation) %>

<div id="${v.refname}" className='api__signature'>
var ${ident(v.name)}${return_type}
</div>

<div className='api__description'>
${show_desc(v)}
</div>

          % endfor

</div>

      % endif

      % if smethods:

${"####"} Static methods

<div className='api__body'>


          % for f in smethods:
              ${show_func(f, True)}
          % endfor

</div>

      % endif

      % if inst_vars:

${"####"} Instance variables

<div className='api__body'>

          % for v in inst_vars:
              <% return_type = get_annotation(v.type_annotation) %>
<div id="${v.refname}" className='api__signature'>
var ${ident(v.name)}${return_type}
</div>

<div className='api__description'>
${show_desc(v)}
</div>
          % endfor

</div>

      % endif

      % if methods:

${"####"} Methods

<div className='api__body'>


          % for f in methods:
              ${show_func(f, True)}
          % endfor

</div>

      % endif


      % if mro:
${"####"} Ancestors

          % for cls in mro:
- ${link(cls)}
          % endfor

      %endif

      % if subclasses:
${"####"} Subclasses

          % for sub in subclasses:
- ${link(sub)}
          % endfor

      % endif

      % if not show_inherited_members:
          <%
              members = c.inherited_members()
          %>
          % if members:

${"####"} Inherited members

              % for cls, mems in members:
- ${link(cls)}:
                          % for m in mems:
    - ${link(m, name=m.name)}
                          % endfor
              % endfor

          % endif
      % endif



</div>

</div>
    % endfor
    % endif
</%def>


${show_module(module)}

