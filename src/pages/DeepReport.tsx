import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

// Removes <script>, <style> tags and inline event attributes before setting innerHTML.
// renderMarkdown already calls esc() on all text content so there is no direct
// path for user-supplied HTML to leak through; this is belt-and-suspenders.
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '');
}

function renderMarkdown(md: string): string {
  const P = { accent: '#7c3aed', head: '#1c1a16', muted: '#7c756a', line: '#ece7df' };
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function inline(t: string): string {
    t = esc(t);
    t = t.replace(/\*\*(.+?)\*\*/g, `<strong style="color:${P.head}">$1</strong>`);
    t = t.replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>');
    t = t.replace(/`([^`]+?)`/g, `<code style="background:#f0ebe3;padding:1px 6px;border-radius:4px;font-size:90%">$1</code>`);
    return t;
  }

  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let i = 0;
  let inUl = false, inOl = false;

  const closeLists = () => {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { closeLists(); i++; continue; }

    let m: RegExpMatchArray | null;
    if ((m = line.match(/^###\s+(.*)/))) { closeLists(); out.push(`<h3>${inline(m[1])}</h3>`); i++; continue; }
    if ((m = line.match(/^##\s+(.*)/)))  { closeLists(); out.push(`<h2>${inline(m[1])}</h2>`); i++; continue; }
    if ((m = line.match(/^#\s+(.*)/)))   { closeLists(); out.push(`<h1>${inline(m[1])}</h1>`); i++; continue; }
    if (/^\s*([-*_])\1\1+\s*$/.test(line)) { closeLists(); out.push('<hr>'); i++; continue; }
    if ((m = line.match(/^>\s?(.*)/))) { closeLists(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); i++; continue; }

    if ((m = line.match(/^\s*[-*+]\s+(.*)/))) {
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push(`<li>${inline(m[1])}</li>`); i++; continue;
    }
    if ((m = line.match(/^\s*\d+\.\s+(.*)/))) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      out.push(`<li>${inline(m[1])}</li>`); i++; continue;
    }

    closeLists();
    let para = line; i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|>\s?|\s*[-*+]\s|\s*\d+\.\s)/.test(lines[i])) {
      para += ' ' + lines[i]; i++;
    }
    out.push(`<p>${inline(para)}</p>`);
  }
  closeLists();
  return out.join('\n');
}

export default function DeepReport() {
  const { id } = useParams<{ id: string }>();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error: err } = await supabase.rpc('get_deep_report', { p_id: id });
      if (err || !data || data.length === 0) {
        setError('Plano não encontrado.');
      } else {
        setHtml(renderMarkdown(data[0].report_md));
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
        <p className="text-[#7c756a]">Carregando seu plano…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
      <div className="text-center space-y-4 max-w-sm px-6">
        <p className="text-[#2a2620] font-semibold">{error}</p>
        <Link to="/" className="text-purple-600 underline text-sm">Voltar ao início</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-xs tracking-widest uppercase text-purple-600 font-semibold mb-6">
          Plano de Reinvenção · Jornada Reinventar
        </div>
        <div
          className="prose-reinventar bg-white rounded-2xl shadow-sm p-8 md:p-12"
          dangerouslySetInnerHTML={{ __html: sanitize(html) }}
        />
        <div className="mt-8 text-center text-xs text-[#7c756a]">
          AlquimiaZen · reinventar.simplesescolhas.com.br
        </div>
      </div>
    </div>
  );
}
