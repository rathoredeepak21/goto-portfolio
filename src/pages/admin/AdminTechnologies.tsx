import React, { useState, useMemo } from 'react';
import { Technology, TechnologyCategory } from '../../types';
import { TechnologyLogo } from '../../components/TechnologyLogo';
import { getOfficialLogoUrl } from '../../utils/logoUtils';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  FolderPlus,
  Home,
  Upload,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';
import { dataService } from '../../services/dataService';

interface AdminTechnologiesProps {
  technologies: Technology[];
  categories: TechnologyCategory[];
  onSaveTechnology: (tech: Technology) => void;
  onDeleteTechnology: (techId: string) => void;
  onReorderTechnologies: (techs: Technology[]) => void;
  onSaveCategory: (cat: TechnologyCategory) => void;
  onDeleteCategory: (catId: string) => void;
}

const PRESET_LOGOS = [
  { name: 'Flutter', url: '/logos/flutter.svg', category: 'Mobile Development', desc: 'Mobile App Development' },
  { name: 'React Native', url: '/logos/react-native.svg', category: 'Mobile Development', desc: 'Cross-Platform Framework' },
  { name: 'React', url: '/logos/react.svg', category: 'Web Development', desc: 'Frontend UI Library' },
  { name: 'Firebase', url: '/logos/firebase.svg', category: 'Backend & Database', desc: 'Cloud Auth & Realtime DB' },
  { name: 'Supabase', url: '/logos/supabase.svg', category: 'Backend & Database', desc: 'PostgreSQL & Realtime Backend' },
  { name: 'Node.js', url: '/logos/nodejs.svg', category: 'Backend & Database', desc: 'JavaScript Runtime & APIs' },
  { name: 'JavaScript', url: '/logos/javascript.svg', category: 'Programming Languages', desc: 'Dynamic Web & App Language' },
  { name: 'TypeScript', url: '/logos/typescript.svg', category: 'Programming Languages', desc: 'Typed JavaScript at Scale' },
  { name: 'Git', url: '/logos/git.svg', category: 'Development Tools', desc: 'Distributed Version Control' },
  { name: 'GitHub', url: '/logos/github.svg', category: 'Development Tools', desc: 'Code Collaboration & CI/CD' },
  { name: 'VS Code', url: '/logos/vscode.svg', category: 'Development Tools', desc: 'Primary Code Editor' },
  { name: 'Android Studio', url: '/logos/androidstudio.svg', category: 'Development Tools', desc: 'Native Android Studio' },
  { name: 'Figma', url: '/logos/figma.svg', category: 'Design & Productivity', desc: 'UI/UX Interface Prototyping' },
  { name: 'Postman', url: '/logos/postman.svg', category: 'Development Tools', desc: 'API Testing & Architecture' },
  { name: 'Docker', url: '/logos/docker.svg', category: 'DevOps / Infrastructure', desc: 'Containerization Platform' },
  { name: 'Linux', url: '/logos/linux.svg', category: 'DevOps / Infrastructure', desc: 'Server OS & Shell Scripting' },
  { name: 'Cloudflare', url: '/logos/cloudflare.svg', category: 'DevOps / Infrastructure', desc: 'Edge CDN & R2 APK Storage' },
  { name: 'Canva', url: '/logos/canva.svg', category: 'Design & Productivity', desc: 'Graphic & Visual Asset Design' },
  { name: 'Dart', url: '/logos/dart.svg', category: 'Programming Languages', desc: 'Client-Optimized Language' },
  { name: 'Python', url: '/logos/python.svg', category: 'Programming Languages', desc: 'Automation & Backend Scripting' },
  { name: 'MongoDB', url: '/logos/mongodb.svg', category: 'Backend & Database', desc: 'NoSQL Document Database' },
  { name: 'Tailwind CSS', url: '/logos/tailwind.svg', category: 'Web Development', desc: 'Utility-First Styling' },
];

export const AdminTechnologies: React.FC<AdminTechnologiesProps> = ({
  technologies,
  categories,
  onSaveTechnology,
  onDeleteTechnology,
  onReorderTechnologies,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Mobile Development');
  const [formDescription, setFormDescription] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formFeaturedOnHome, setFormFeaturedOnHome] = useState<boolean>(true);

  // Filtered List
  const filteredList = useMemo(() => {
    return technologies
      .filter((t) => {
        const matchesCategory =
          filterCategory === 'all' || t.category.toLowerCase() === filterCategory.toLowerCase();
        const matchesSearch =
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
          t.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => a.display_order - b.display_order);
  }, [technologies, filterCategory, search]);

  // Open modal for Create
  const handleAddNew = () => {
    setEditingTech(null);
    setFormName('');
    setFormCategory(categories[0]?.name || 'Mobile Development');
    setFormDescription('');
    setFormLogoUrl('/logos/flutter.svg');
    setFormOrder(technologies.length + 1);
    setFormIsActive(true);
    setFormFeaturedOnHome(true);
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleEdit = (tech: Technology) => {
    setEditingTech(tech);
    setFormName(tech.name);
    setFormCategory(tech.category);
    setFormDescription(tech.description || '');
    setFormLogoUrl(tech.logo_url || getOfficialLogoUrl(tech.name));
    setFormOrder(tech.display_order);
    setFormIsActive(tech.is_active);
    setFormFeaturedOnHome(tech.featured_on_home !== false);
    setModalOpen(true);
  };

  // Select a preset official brand
  const handleSelectPreset = (preset: typeof PRESET_LOGOS[0]) => {
    setFormName(preset.name);
    setFormLogoUrl(preset.url);
    if (!formCategory || formCategory === 'Mobile Development') {
      setFormCategory(preset.category);
    }
    if (!formDescription) {
      setFormDescription(preset.desc);
    }
  };

  // Handle local file upload (uploads to Supabase 'App Icon' bucket)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await dataService.uploadTechnologyIcon(file);
      if (res?.url) {
        setFormLogoUrl(res.url);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const payload: Technology = {
      id: editingTech ? editingTech.id : `tech-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      logo_url: formLogoUrl.trim() || getOfficialLogoUrl(formName),
      display_order: Number(formOrder) || 1,
      is_active: formIsActive,
      featured_on_home: formFeaturedOnHome,
      updated_at: new Date().toISOString(),
    };

    onSaveTechnology(payload);
    setModalOpen(false);
  };

  // Reorder single item up or down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= filteredList.length) return;

    const fullListCopy = [...technologies].sort((a, b) => a.display_order - b.display_order);
    const itemA = filteredList[index];
    const itemB = filteredList[newIdx];

    const idxA = fullListCopy.findIndex((t) => t.id === itemA.id);
    const idxB = fullListCopy.findIndex((t) => t.id === itemB.id);

    if (idxA >= 0 && idxB >= 0) {
      const temp = fullListCopy[idxA].display_order;
      fullListCopy[idxA].display_order = fullListCopy[idxB].display_order;
      fullListCopy[idxB].display_order = temp;
      onReorderTechnologies(fullListCopy);
    }
  };

  return (
    <div className="admin-technologies-page">
      {/* Top Action Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Technologies & Skills</h1>
          <p className="admin-page-subtitle">
            Manage official technology brand logos, categories, ordering, and public display
          </p>
        </div>

        <div className="header-action-buttons">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="btn btn-secondary header-btn"
          >
            <FolderPlus size={16} />
            <span>Categories</span>
          </button>

          <button onClick={handleAddNew} className="btn btn-primary header-btn">
            <Plus size={17} />
            <span>Add Technology</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar neon-card">
        <div className="admin-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search technologies by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="admin-category-filter">
          <label>Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Categories ({technologies.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Technologies Table */}
      <div className="admin-table-container neon-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>Logo</th>
              <th>Name</th>
              <th>Category</th>
              <th>Specialty / Description</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Order</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Status</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Featured</th>
              <th style={{ width: '160px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((tech, idx) => (
              <tr key={tech.id} className={!tech.is_active ? 'row-inactive' : ''}>
                {/* Official Logo */}
                <td>
                  <div className="admin-logo-cell">
                    <TechnologyLogo
                      name={tech.name}
                      logoUrl={tech.logo_url}
                      size={38}
                      className="admin-table-logo"
                    />
                  </div>
                </td>

                {/* Name */}
                <td>
                  <div className="tech-name-cell">
                    <span className="tech-name-text">{tech.name}</span>
                  </div>
                </td>

                {/* Category */}
                <td>
                  <span className="cat-badge">{tech.category}</span>
                </td>

                {/* Specialty */}
                <td>
                  <span className="tech-desc-text">
                    {tech.description || '—'}
                  </span>
                </td>

                {/* Order */}
                <td style={{ textAlign: 'center' }}>
                  <div className="order-cell">
                    <span className="order-number">{tech.display_order}</span>
                    <div className="order-arrows">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="arrow-btn"
                        title="Move Up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === filteredList.length - 1}
                        className="arrow-btn"
                        title="Move Down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                </td>

                {/* Status Toggle */}
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() =>
                      onSaveTechnology({ ...tech, is_active: !tech.is_active })
                    }
                    className={`status-pill ${tech.is_active ? 'pill-active' : 'pill-inactive'}`}
                    title="Click to toggle status"
                  >
                    {tech.is_active ? (
                      <>
                        <CheckCircle size={12} />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={12} />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Featured on Home */}
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() =>
                      onSaveTechnology({
                        ...tech,
                        featured_on_home: tech.featured_on_home === false ? true : false,
                      })
                    }
                    className={`featured-star-btn ${
                      tech.featured_on_home !== false ? 'star-active' : 'star-inactive'
                    }`}
                    title={
                      tech.featured_on_home !== false
                        ? 'Featured on Home (Click to remove)'
                        : 'Not on Home (Click to feature)'
                    }
                  >
                    <Home size={14} />
                  </button>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons-group">
                    <button
                      onClick={() => handleEdit(tech)}
                      className="table-action-btn edit-btn"
                      title="Edit Technology"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${tech.name}"?`)) {
                          onDeleteTechnology(tech.id);
                        }
                      }}
                      className="table-action-btn delete-btn"
                      title="Delete Technology"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredList.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-table-row">
                  No technologies match the filter. Click "+ Add Technology" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Technology Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card neon-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Sparkles size={20} color="#38bdf8" />
                <h2>{editingTech ? `Edit ${editingTech.name}` : 'Add New Technology'}</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              {/* Official Brand Presets Quick-Pick */}
              <div className="form-group">
                <label className="form-label">
                  Quick Select Official Brand Preset:
                </label>
                <div className="brand-presets-scroll">
                  {PRESET_LOGOS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`preset-pill-btn ${formName === p.name ? 'preset-active' : ''}`}
                    >
                      <TechnologyLogo name={p.name} logoUrl={p.url} size={18} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-form-grid">
                {/* Technology Name */}
                <div className="form-group">
                  <label className="form-label">Technology Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Flutter, React, Supabase"
                    className="form-input"
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="form-input"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialty / Description */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Specialty / Short Description
                  </label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="e.g. Mobile App Development, PostgreSQL Backend"
                    className="form-input"
                  />
                </div>

                {/* Logo URL / Path */}
                <div className="form-group full-width">
                  <label className="form-label">Logo URL or SVG Path *</label>
                  <div className="logo-input-row">
                    <input
                      type="text"
                      required
                      value={formLogoUrl}
                      onChange={(e) => setFormLogoUrl(e.target.value)}
                      placeholder="/logos/flutter.svg or https://..."
                      className="form-input"
                    />

                    <label className="upload-file-btn" title="Upload SVG/PNG file">
                      <Upload size={16} />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*,.svg"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="form-group full-width preview-container">
                  <label className="form-label">Live Card Preview:</label>
                  <div className="preview-card-box">
                    <div className="preview-tech-card">
                      <TechnologyLogo
                        name={formName || 'Preview'}
                        logoUrl={formLogoUrl}
                        size={52}
                      />
                      <div className="preview-tech-name">{formName || 'Technology Name'}</div>
                      <div className="preview-tech-desc">
                        {formDescription || formCategory || 'Category'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Order */}
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="form-input"
                    min={1}
                  />
                </div>

                {/* Switches */}
                <div className="form-group toggle-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="toggle-checkbox"
                    />
                    <span>Active on Portfolio</span>
                  </label>

                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={formFeaturedOnHome}
                      onChange={(e) => setFormFeaturedOnHome(e.target.checked)}
                      className="toggle-checkbox"
                    />
                    <span>Feature on Home Page</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTech ? 'Save Changes' : 'Create Technology'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {categoryModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setCategoryModalOpen(false)}>
          <div className="admin-modal-card neon-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Layers size={20} color="#38bdf8" />
                <h2>Manage Technology Categories</h2>
              </div>
              <button onClick={() => setCategoryModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="categories-modal-body">
              <div className="add-category-input-row">
                <input
                  type="text"
                  placeholder="New category name (e.g. AI & Machine Learning)..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCatName.trim()) {
                      onSaveCategory({
                        id: `cat-${Date.now()}`,
                        name: newCatName.trim(),
                        display_order: categories.length + 1,
                      });
                      setNewCatName('');
                    }
                  }}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>

              <div className="categories-list-manage">
                {categories.map((c) => (
                  <div key={c.id} className="category-item-row">
                    <span className="cat-manage-name">{c.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete category "${c.name}"?`)) {
                          onDeleteCategory(c.id);
                        }
                      }}
                      className="cat-delete-btn"
                      title="Delete category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer-actions">
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="btn btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-technologies-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .admin-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-page-title {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;
          margin-bottom: 0.25rem;
        }

        .admin-page-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .header-action-buttons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-btn {
          padding: 0.65rem 1.25rem;
          font-size: 0.9rem;
        }

        .admin-filter-bar {
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .admin-search-wrapper {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .admin-search-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .admin-search-input:focus {
          outline: none;
          border-color: var(--neon-cyan);
        }

        .admin-category-filter {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .admin-select {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.6rem 1rem;
          color: var(--text-main);
          font-size: 0.88rem;
        }

        .admin-table-container {
          overflow-x: auto;
          border-radius: var(--radius-lg);
        }

        .admin-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.92rem;
          text-align: left;
        }

        .admin-data-table th {
          background: var(--bg-tertiary);
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .admin-data-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          vertical-align: middle;
        }

        .admin-data-table tbody tr:hover {
          background: rgba(56, 189, 248, 0.03);
        }

        .row-inactive {
          opacity: 0.55;
        }

        .admin-logo-cell {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-subtle);
        }

        .tech-name-text {
          font-weight: 700;
          color: var(--text-main);
          font-size: 1rem;
        }

        .cat-badge {
          display: inline-block;
          padding: 0.25rem 0.65rem;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.25);
          color: var(--neon-cyan);
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .tech-desc-text {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .order-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .order-number {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--text-main);
        }

        .order-arrows {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .arrow-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          border-radius: 4px;
          padding: 2px 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .arrow-btn:hover:not(:disabled) {
          color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.15);
        }

        .arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pill-active {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.35);
          color: #10b981;
        }

        .pill-inactive {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.35);
          color: #f87171;
        }

        .featured-star-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .star-active {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          color: #f59e0b;
        }

        .star-inactive {
          background: var(--bg-tertiary);
          border-color: var(--border-subtle);
          color: var(--text-muted);
        }

        .action-buttons-group {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .table-action-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-btn {
          color: var(--neon-cyan);
        }

        .edit-btn:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--neon-cyan);
        }

        .delete-btn {
          color: #f87171;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: #ef4444;
        }

        .empty-table-row {
          text-align: center;
          padding: 3rem !important;
          color: var(--text-muted);
        }

        /* Modal Styles */
        .admin-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
        }

        .admin-modal-card {
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow-y: auto;
          background: var(--bg-card);
          color: var(--text-main);
          border: 1px solid var(--border-neon);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.2);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 1.5rem;
        }

        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-title-row h2 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .modal-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .form-input {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-size: 0.92rem;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--neon-cyan);
        }

        .brand-presets-scroll {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          max-height: 110px;
          overflow-y: auto;
          padding: 0.5rem;
          background: var(--bg-input);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .preset-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          color: var(--text-main);
          font-size: 0.76rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-pill-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.1);
        }

        .preset-active {
          border-color: var(--neon-cyan) !important;
          background: rgba(56, 189, 248, 0.2) !important;
          color: var(--neon-cyan) !important;
          font-weight: 700;
        }

        .logo-input-row {
          display: flex;
          gap: 0.5rem;
        }

        .upload-file-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: var(--neon-cyan);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
        }

        .preview-container {
          background: var(--bg-input);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .preview-card-box {
          display: flex;
          justify-content: center;
          padding: 0.5rem 0;
        }

        .preview-tech-card {
          width: 170px;
          background: var(--bg-card);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.4rem;
        }

        .preview-tech-name {
          font-weight: 700;
          color: var(--text-main);
          font-size: 0.95rem;
        }

        .preview-tech-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .toggle-group {
          grid-column: span 2;
          display: flex;
          flex-direction: row;
          gap: 2rem;
          padding-top: 0.5rem;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          font-size: 0.88rem;
          color: var(--text-main);
        }

        .toggle-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--neon-cyan);
        }

        .modal-footer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-subtle);
          margin-top: 0.5rem;
        }

        /* Category Modal */
        .categories-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .add-category-input-row {
          display: flex;
          gap: 0.75rem;
        }

        .categories-list-manage {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 240px;
          overflow-y: auto;
        }

        .category-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .cat-manage-name {
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .cat-delete-btn {
          background: transparent;
          border: none;
          color: #f87171;
          cursor: pointer;
          padding: 0.25rem;
        }
      `}</style>
    </div>
  );
};
