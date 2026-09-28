// Formulaire unique de création ET modification d'un produit (le mode dépend de la présence
// d'un :id dans l'URL). Toutes les sections médias avancées (vidéo, 360°, documents,
// caractéristiques) sont optionnelles : un champ laissé vide n'est pas enregistré, ce qui
// garantit que la fiche produit publique n'affichera jamais de section vide ou factice.
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { getProductById, getCategories, addProduct, updateProduct } from '@/services/productService';
import { slugify } from '@/utils/format';
import { useToast } from '@/context/ToastContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import EmptyState from '@/components/EmptyState';

// Options de badge marketing proposées dans le formulaire.
const BADGE_OPTIONS = [
  { value: '', label: 'Aucun badge' },
  { value: 'promo', label: 'Promo' },
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'populaire', label: 'Populaire' },
];

// État initial d'un formulaire vierge (mode création). Les listes dynamiques (images,
// caractéristiques, documents...) démarrent avec une ligne vide prête à être remplie.
const emptyForm = {
  name: '', brand: '', model: '', sku: '', slug: '',
  categorySlug: '', price: '', oldPrice: '', stock: '', badge: '',
  description: '', shortDescription: '',
  images: [{ url: '', alt: '' }],
  videoUrl: '',
  view360: [''],
  specifications: [{ key: '', value: '' }],
  documents: [{ name: '', url: '' }],
};

/** Convertit un produit existant (venu du service) en état de formulaire éditable. */
function productToForm(product) {
  return {
    name: product.name,
    brand: product.brand || '',
    model: product.model || '',
    sku: product.sku || '',
    slug: product.slug,
    categorySlug: product.categorySlug,
    price: String(product.price),
    oldPrice: product.oldPrice ? String(product.oldPrice) : '',
    stock: String(product.stock),
    badge: product.badge || '',
    description: product.description,
    shortDescription: product.shortDescription,
    images: product.images?.length ? product.images.map((img) => ({ url: img.url, alt: img.alt })) : [{ url: '', alt: '' }],
    videoUrl: product.videoUrl || '',
    view360: product.view360?.length ? product.view360 : [''],
    specifications: Object.keys(product.specifications || {}).length
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }],
    documents: product.documents?.length ? product.documents.map((d) => ({ name: d.name, url: d.url })) : [{ name: '', url: '' }],
  };
}

/**
 * Affiche le formulaire de création ou de modification d'un produit.
 */
export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const categories = getCategories();

  useDocumentTitle(isEdit ? 'Modifier un produit | Administration AgriMarket' : 'Ajouter un produit | Administration AgriMarket');

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  // true si on est en mode édition et que l'identifiant de l'URL ne correspond à aucun produit.
  const [notFound, setNotFound] = useState(false);

  // Charge le produit existant une fois au montage, en mode édition.
  useEffect(() => {
    if (!isEdit) return;
    const product = getProductById(id);
    if (!product) {
      setNotFound(true);
      return;
    }
    setForm(productToForm(product));
  }, [id, isEdit]);

  /** Met à jour un champ simple du formulaire. */
  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  /** Met à jour un élément d'une liste dynamique (images, spécifications, documents, 360°). */
  function setListItem(listName, index, patch) {
    setForm((f) => ({
      ...f,
      [listName]: f[listName].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  /** Ajoute une ligne vide à une liste dynamique. */
  function addListItem(listName, emptyItem) {
    setForm((f) => ({ ...f, [listName]: [...f[listName], emptyItem] }));
  }

  /** Retire une ligne d'une liste dynamique (toujours au moins une ligne conservée à l'écran). */
  function removeListItem(listName, index) {
    setForm((f) => ({
      ...f,
      [listName]: f[listName].length > 1 ? f[listName].filter((_, i) => i !== index) : f[listName],
    }));
  }

  /** Vérifie les champs obligatoires avant enregistrement. */
  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    if (!form.categorySlug) newErrors.categorySlug = 'La catégorie est requise';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
    if (form.stock === '' || Number(form.stock) < 0) newErrors.stock = 'Le stock doit être un nombre positif ou nul';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const category = categories.find((c) => c.slug === form.categorySlug);

    // Ne conserve que les lignes réellement renseignées : un champ laissé vide ne doit
    // jamais produire une section factice sur la fiche produit publique.
    const images = form.images
      .filter((img) => img.url.trim())
      .map((img, idx) => ({ url: img.url.trim(), alt: img.alt.trim() || `${form.name} — photo ${idx + 1}`, order: idx + 1 }));
    const view360 = form.view360.map((url) => url.trim()).filter(Boolean);
    const specifications = form.specifications.reduce((acc, { key, value }) => {
      if (key.trim() && value.trim()) acc[key.trim()] = value.trim();
      return acc;
    }, {});
    const documents = form.documents
      .filter((d) => d.name.trim() && d.url.trim())
      .map((d) => ({ name: d.name.trim(), url: d.url.trim() }));

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || undefined,
      model: form.model.trim() || undefined,
      sku: form.sku.trim() || undefined,
      slug: form.slug.trim() || slugify(form.name),
      category: category?.name || form.categorySlug,
      categorySlug: form.categorySlug,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock),
      badge: form.badge || undefined,
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim() || form.description.trim().slice(0, 120),
      images,
      videoUrl: form.videoUrl.trim() || undefined,
      view360: view360.length > 0 ? view360 : undefined,
      specifications,
      documents: documents.length > 0 ? documents : undefined,
    };

    if (isEdit) {
      updateProduct(id, payload);
      showToast(`${payload.name} a été mis à jour`, 'success');
    } else {
      addProduct({ ...payload, rating: 0, reviews: 0 });
      showToast(`${payload.name} a été ajouté au catalogue`, 'success');
    }
    navigate('/admin/produits');
  }

  if (notFound) {
    return (
      <EmptyState
        title="Produit introuvable"
        description="Ce produit n'existe pas ou a déjà été supprimé."
        actionLabel="Retour aux produits"
        actionLink="/admin/produits"
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <Link to="/admin/produits" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Retour aux produits
      </Link>
      <h1 className="mt-3 text-xl font-bold text-neutral-900 sm:text-2xl">
        {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl space-y-6">
        {/* Informations générales */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Informations générales</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Nom du produit <span className="text-error-500">*</span></label>
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} className={`input ${errors.name ? 'border-error-400' : ''}`} placeholder="Ex. Motoculteur Professionnel 7 CV" />
              {errors.name && <p className="mt-1 text-xs text-error-600">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Marque</label>
              <input value={form.brand} onChange={(e) => setField('brand', e.target.value)} className="input" placeholder="Optionnel" />
            </div>
            <div>
              <label className="label">Modèle</label>
              <input value={form.model} onChange={(e) => setField('model', e.target.value)} className="input" placeholder="Optionnel" />
            </div>
            <div>
              <label className="label">Référence (SKU)</label>
              <input value={form.sku} onChange={(e) => setField('sku', e.target.value)} className="input" placeholder="Générée automatiquement si vide" />
            </div>
            <div>
              <label className="label">Catégorie <span className="text-error-500">*</span></label>
              <select value={form.categorySlug} onChange={(e) => setField('categorySlug', e.target.value)} className={`input ${errors.categorySlug ? 'border-error-400' : ''}`}>
                <option value="">Sélectionner...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              {errors.categorySlug && <p className="mt-1 text-xs text-error-600">{errors.categorySlug}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Slug (URL)</label>
              <input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className="input" placeholder="Généré automatiquement depuis le nom si vide" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description courte</label>
              <input value={form.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} className="input" placeholder="Résumé affiché dans les cartes produit" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description complète</label>
              <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} className="input min-h-[100px] resize-y" placeholder="Usage, avantages, contexte d'utilisation..." />
            </div>
          </div>
        </section>

        {/* Prix et stock */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Prix et stock</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Prix (FCFA) <span className="text-error-500">*</span></label>
              <input type="number" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} className={`input ${errors.price ? 'border-error-400' : ''}`} />
              {errors.price && <p className="mt-1 text-xs text-error-600">{errors.price}</p>}
            </div>
            <div>
              <label className="label">Ancien prix (FCFA)</label>
              <input type="number" min="0" value={form.oldPrice} onChange={(e) => setField('oldPrice', e.target.value)} className="input" placeholder="Optionnel, pour afficher une promotion" />
            </div>
            <div>
              <label className="label">Quantité en stock <span className="text-error-500">*</span></label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setField('stock', e.target.value)} className={`input ${errors.stock ? 'border-error-400' : ''}`} />
              {errors.stock && <p className="mt-1 text-xs text-error-600">{errors.stock}</p>}
            </div>
            <div>
              <label className="label">Badge marketing</label>
              <select value={form.badge} onChange={(e) => setField('badge', e.target.value)} className="input">
                {BADGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Galerie photo</h2>
          <p className="mt-1 text-xs text-neutral-400">La première image sert de photo principale. Utilisez des photographies réelles du produit.</p>
          <div className="mt-4 space-y-3">
            {form.images.map((img, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={img.url} onChange={(e) => setListItem('images', idx, { url: e.target.value })} className="input flex-1" placeholder="URL de l'image" />
                <input value={img.alt} onChange={(e) => setListItem('images', idx, { alt: e.target.value })} className="input w-48" placeholder="Texte alternatif (optionnel)" />
                <button type="button" onClick={() => removeListItem('images', idx)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:bg-error-50 hover:text-error-600" aria-label="Retirer cette image">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem('images', { url: '', alt: '' })} className="btn-ghost text-sm">
              <Plus className="h-4 w-4" /> Ajouter une image
            </button>
          </div>
        </section>

        {/* Médias avancés */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Médias avancés</h2>
          <p className="mt-1 text-xs text-neutral-400">Laissez vide si le média n'existe pas : la section correspondante n'apparaîtra pas sur la fiche produit.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">URL de la vidéo de présentation</label>
              <input value={form.videoUrl} onChange={(e) => setField('videoUrl', e.target.value)} className="input" placeholder="https://..." />
            </div>
            <div>
              <label className="label">Séquence d'images pour la vue à 360°</label>
              <div className="space-y-2">
                {form.view360.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={url}
                      onChange={(e) => setForm((f) => ({ ...f, view360: f.view360.map((u, i) => (i === idx ? e.target.value : u)) }))}
                      className="input flex-1"
                      placeholder={`URL image ${idx + 1}`}
                    />
                    <button type="button" onClick={() => removeListItem('view360', idx)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:bg-error-50 hover:text-error-600" aria-label="Retirer cette image">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addListItem('view360', '')} className="btn-ghost text-sm">
                  <Plus className="h-4 w-4" /> Ajouter une image à la séquence
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Caractéristiques techniques */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Caractéristiques techniques</h2>
          <p className="mt-1 text-xs text-neutral-400">Les champs varient librement selon le type de produit (un tracteur et une pompe n'ont pas les mêmes caractéristiques).</p>
          <div className="mt-4 space-y-3">
            {form.specifications.map((spec, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={spec.key} onChange={(e) => setListItem('specifications', idx, { key: e.target.value })} className="input flex-1" placeholder="Ex. Puissance" />
                <input value={spec.value} onChange={(e) => setListItem('specifications', idx, { value: e.target.value })} className="input flex-1" placeholder="Ex. 75 CV" />
                <button type="button" onClick={() => removeListItem('specifications', idx)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:bg-error-50 hover:text-error-600" aria-label="Retirer cette caractéristique">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem('specifications', { key: '', value: '' })} className="btn-ghost text-sm">
              <Plus className="h-4 w-4" /> Ajouter une caractéristique
            </button>
          </div>
        </section>

        {/* Documentation */}
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Documentation</h2>
          <div className="mt-4 space-y-3">
            {form.documents.map((doc, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={doc.name} onChange={(e) => setListItem('documents', idx, { name: e.target.value })} className="input w-48" placeholder="Ex. Fiche technique" />
                <input value={doc.url} onChange={(e) => setListItem('documents', idx, { url: e.target.value })} className="input flex-1" placeholder="URL du document (PDF...)" />
                <button type="button" onClick={() => removeListItem('documents', idx)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:bg-error-50 hover:text-error-600" aria-label="Retirer ce document">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem('documents', { name: '', url: '' })} className="btn-ghost text-sm">
              <Plus className="h-4 w-4" /> Ajouter un document
            </button>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link to="/admin/produits" className="btn-outline">Annuler</Link>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Enregistrer les modifications' : 'Ajouter le produit'}
          </button>
        </div>
      </form>
    </div>
  );
}
