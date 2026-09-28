// Jeu de données statique : liste des catégories de produits affichées sur le site.
// (Dans une vraie application, ces données viendraient d'une base de données ou d'une API.)

/** @type {import('@/types').Category[]} */
export const categories = [
  {
    id: 'cat-1',
    name: 'Machines agricoles',
    slug: 'machines-agricoles',
    description: 'Tracteurs, motoculteurs, motopompes et débroussailleuses pour vos travaux agricoles.',
    icon: 'Tractor',
    image: 'https://images.pexels.com/photos/162371/tractor-round-baler-custom-work-hay-162371.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'cat-2',
    name: 'Irrigation',
    slug: 'irrigation',
    description: 'Pompes, tuyaux, arroseurs et kits goutte-à-goutte pour optimiser votre arrosage.',
    icon: 'Droplets',
    image: 'https://images.pexels.com/photos/39290448/pexels-photo-39290448.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'cat-3',
    name: 'Traitement',
    slug: 'traitement',
    description: 'Pulvérisateurs manuels, à dos et électriques pour le traitement de vos cultures.',
    icon: 'SprayCan',
    image: 'https://images.pexels.com/photos/37218952/pexels-photo-37218952.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'cat-4',
    name: 'Outils',
    slug: 'outils',
    description: 'Houes, pelles, râteaux, sécateurs et machettes pour le travail quotidien.',
    icon: 'Wrench',
    image: 'https://images.pexels.com/photos/16680733/pexels-photo-16680733.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'cat-5',
    name: 'Protection',
    slug: 'protection',
    description: 'Bottes, gants, combinaisons et masques pour votre sécurité au travail.',
    icon: 'ShieldCheck',
    image: 'https://images.pexels.com/photos/978808/pexels-photo-978808.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];
