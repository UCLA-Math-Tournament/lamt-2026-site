type ArchiveMaterial = {
  name: string;
  href: string;
  type: string;
};

type ArchiveGroup = {
  category: string;
  items: ArchiveMaterial[];
};

const categoryCopy: Record<string, string> = {
  Problems: 'Contest papers',
  Solutions: 'Solutions',
  Results: 'Results',
  Info: 'Schedule, rules, notice',
};

export default function ArchiveMaterialGrid({ groups }: { groups: ArchiveGroup[] }) {
  return (
    <div className="archive-index" aria-label="LAMT archive materials">
      {groups.map((group) => (
        <section key={group.category} className="archive-index-group">
          <div className="archive-index-heading">
            <h3>{group.category}</h3>
            <p>{categoryCopy[group.category] ?? 'Published materials'}</p>
          </div>

          <ul className="archive-index-links">
            {group.items.map((item) => {
              const opensNewTab = item.type === 'PDF' || item.href.startsWith('http');

              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={opensNewTab ? '_blank' : undefined}
                    rel={opensNewTab ? 'noreferrer' : undefined}
                    className="archive-index-link"
                  >
                    <span>{item.name}</span>
                    {' '}
                    <em>{item.type}</em>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
