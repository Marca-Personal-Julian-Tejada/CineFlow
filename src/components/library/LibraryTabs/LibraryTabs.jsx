import './LibraryTabs.css';

const TABS = [
  { id: 'vistas', label: 'Vistas' },
  { id: 'favoritas', label: 'Favoritas' },
  { id: 'pendientes', label: 'Pendientes' },
];

const LibraryTabs = ({ activeTab, counts, onTabChange }) => (
  <div className="library-tabs" role="tablist" aria-label="Secciones de mi biblioteca">
    {TABS.map((tab) => (
      <button
        key={tab.id}
        role="tab"
        id={`tab-${tab.id}`}
        aria-selected={activeTab === tab.id}
        aria-controls={`panel-${tab.id}`}
        className={`library-tab${activeTab === tab.id ? ' library-tab--active' : ''}`}
        onClick={() => onTabChange(tab.id)}
        type="button"
      >
        {tab.label}
        {counts[tab.id] > 0 && (
          <span className="library-tab__count" aria-label={`${counts[tab.id]} películas`}>
            {counts[tab.id]}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default LibraryTabs;
