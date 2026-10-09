import { BookOpen, ExternalLink } from 'lucide-react';

interface CourseLite {
  id?: number;
  name: string;
  university: string | null;
  link: string | null;
  sort_order?: number;
}

// Convenção do seed: cursos brasileiros usam sort_order 1-3; internacionais 4+.
const isInternational = (c: CourseLite) => (c.sort_order ?? 1) >= 4;

function row(course: CourseLite) {
  return (
    <div key={course.id ?? `${course.name}-${course.university}`} className="flex items-start gap-2 py-2 border-t border-stone-100 first:border-t-0">
      <BookOpen className="w-3.5 h-3.5 text-[var(--color-brand-400)] shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-stone-700 block leading-tight">{course.name}</span>
        {course.university && (
          <span className="text-[11px] text-stone-400 block mt-0.5 leading-snug">{course.university}</span>
        )}
      </div>
      {course.link && (
        <a
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-0.5 text-[11px] text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)] font-medium hover:underline"
        >
          Ver <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>
  );
}

function Group({ title, courses }: { title: string; courses: CourseLite[] }) {
  if (courses.length === 0) return null;
  return (
    <div>
      <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-1">{title}</div>
      <div>{courses.map(row)}</div>
    </div>
  );
}

// Lista de cursos agrupada em "No Brasil" e "No exterior".
export function CourseList({ courses, limitPerGroup }: { courses: CourseLite[]; limitPerGroup?: number }) {
  const br = courses.filter(c => !isInternational(c));
  const intl = courses.filter(isInternational);
  const cap = (arr: CourseLite[]) => (limitPerGroup ? arr.slice(0, limitPerGroup) : arr);
  return (
    <div className="space-y-3">
      <Group title="No Brasil" courses={cap(br)} />
      <Group title="No exterior" courses={cap(intl)} />
    </div>
  );
}
