// Page de contact : coordonnées de la boutique, accès rapide WhatsApp et formulaire de message.
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { buildWhatsAppUrl } from '@/utils/format';
import Breadcrumb from '@/components/Breadcrumb';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Affiche la page de contact avec les coordonnées de la boutique et un formulaire.
 */
export default function ContactPage() {
  useDocumentTitle('Contact | AgriMarket', 'Contactez AgriMarket par téléphone, email ou WhatsApp pour toute question sur nos produits.');
  const { showToast } = useToast();
  // Champs contrôlés du formulaire de contact.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Messages d'erreur de validation, indexés par nom de champ.
  const [errors, setErrors] = useState({});

  /**
   * Vérifie que tous les champs obligatoires sont correctement remplis.
   * @returns {boolean} true si le formulaire est valide, false sinon.
   */
  function validate() {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Le nom est requis';
    if (!email.trim()) newErrors.email = "L'email est requis";
    // Vérification simple du format d'un email (présence d'un @ et d'un point après).
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email invalide';
    if (!message.trim()) newErrors.message = 'Le message est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Gère la soumission du formulaire : valide les champs puis affiche une confirmation.
   * @param {import('react').FormEvent} e - L'événement de soumission.
   */
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    // Ici, aucune API n'est appelée (projet vitrine) : on se contente d'informer l'utilisateur.
    showToast('Votre message a été envoyé. Nous vous répondrons rapidement.', 'success');
    // Réinitialise le formulaire après envoi.
    setName('');
    setEmail('');
    setMessage('');
  }

  /**
   * Ouvre WhatsApp avec un message pré-rempli reprenant le nom et le message saisis.
   */
  function handleWhatsApp() {
    const msg = `Bonjour AgriMarket,\n\nJe souhaite vous contacter.\n\nNom : ${name || '...'}\nMessage : ${message || '...'}`;
    window.open(buildWhatsAppUrl(msg), '_blank');
  }

  // Liste des blocs de coordonnées affichés en haut de la page.
  const contactInfo = [
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+229 01 97 00 00 00',
      href: 'tel:+2290197000000',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@agrimarket.bj',
      href: 'mailto:contact@agrimarket.bj',
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: 'Cotonou, Bénin',
      href: null,
    },
    {
      icon: Clock,
      label: 'Horaires',
      value: 'Lundi - Samedi : 8h - 18h',
      href: null,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container-app py-6">
          <Breadcrumb items={[{ label: 'Contact' }]} />
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">Contactez-nous</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Une question ? Besoin d'un conseil ? Notre équipe est à votre écoute.
          </p>
        </div>
      </div>

      <div className="container-app py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Colonne gauche : coordonnées + accès rapide WhatsApp */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Nos coordonnées</h2>
            <p className="mt-2 text-sm text-neutral-500">
              N'hésitez pas à nous contacter par téléphone, email ou via WhatsApp pour toute question concernant nos produits.
            </p>

            {/* Grille des blocs de coordonnées (téléphone, email, adresse, horaires) */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="card p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{info.label}</h3>
                  {info.href ? (
                    <a href={info.href} className="mt-1 block text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-neutral-900">{info.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Bloc d'action rapide vers WhatsApp */}
            <div className="mt-6 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/20 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366] text-white">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">WhatsApp</h3>
                  <p className="text-xs text-neutral-500">Le moyen le plus rapide de nous joindre</p>
                </div>
              </div>
              <button onClick={handleWhatsApp} className="btn mt-4 w-full bg-[#25D366] text-white hover:bg-[#1da851] text-sm">
                <MessageCircle className="h-4 w-4" /> Discuter sur WhatsApp
              </button>
            </div>
          </div>

          {/* Colonne droite : formulaire de contact */}
          <div className="card p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-neutral-900">Envoyez-nous un message</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="label">Nom complet <span className="text-error-500">*</span></label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`input ${errors.name ? 'border-error-400' : ''}`}
                  placeholder="Jean Dupont"
                />
                {errors.name && <p className="mt-1 text-xs text-error-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="label">Email <span className="text-error-500">*</span></label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input ${errors.email ? 'border-error-400' : ''}`}
                  placeholder="jean.dupont@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-error-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="message" className="label">Message <span className="text-error-500">*</span></label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`input min-h-[120px] resize-y ${errors.message ? 'border-error-400' : ''}`}
                  placeholder="Votre message..."
                  rows={5}
                />
                {errors.message && <p className="mt-1 text-xs text-error-600">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send className="h-4 w-4" /> Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
