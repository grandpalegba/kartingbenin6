/**
 * Source de vérité : Proposition Technique & Financière AFRIKAFUN Production
 * Client : KOFFI & DIABATÉ
 * Projet : FILM DE PRÉSENTATION ET DE COMMERCIALISATION — PROJET KARTING (BÉNIN)
 * 
 * Toutes les données ci-dessous proviennent strictement du document contractuel officiel.
 */

export interface ProposalSequence {
  number: string;
  title: string;
  timecode: string;
  description: string;
  visualElements: string[];
  audioAtmosphere: string;
}

export interface ProposalBudgetItem {
  id: string;
  prestation: string;
  montantFCFA: number;
  montantFormatted: string;
  category: "preproduction" | "production" | "postproduction" | "management";
}

export interface ProposalWeek {
  week: string;
  title: string;
  description: string;
  deliverables: string[];
}

export const PROPOSAL_DATA = {
  header: {
    agency: "AFRIKAFUN PRODUCTION",
    title: "PROPOSITION TECHNIQUE & FINANCIÈRE",
    subtitle: "FILM DE PRÉSENTATION ET DE COMMERCIALISATION",
    project: "PROJET KARTING",
    location: "BÉNIN",
    client: "KOFFI & DIABATÉ",
    conceptTitle: "DU RÊVE À LA COURSE",
    conceptSignature: "ENTER THE RACE",
    format: "16:9 – UHD / 4K",
    targetDuration: "2’30 à 3’00",
  },

  vision: {
    headline: "DONNER VIE AU PROJET AVANT SA CONSTRUCTION.",
    context:
      "Le futur karting est actuellement en phase de développement et le site est encore en phase de terrassement. Cette situation constitue une contrainte pour une production audiovisuelle classique, mais elle offre également une opportunité créative.",
    coreArgument:
      "À partir de la maquette Revit, des plans DWG, des références architecturales et des informations techniques qui nous seront transmises, AFRIKAFUN propose de créer un film cinématographique photoréaliste, permettant au spectateur de découvrir et surtout de ressentir le futur équipement. L'objectif n'est pas une simple visite virtuelle, mais un véritable film de lancement empruntant les codes du sport automobile haut de gamme et de la bande-annonce.",
    rhythmNarrative: [
      "ÉMOTION",
      "ARCHITECTURE",
      "TECHNOLOGIE",
      "EXPÉRIENCE",
      "VITESSE",
      "COMPÉTITION",
    ],
  },

  technicalPipeline: {
    title: "UNE PRODUCTION HYBRIDE",
    subtitle: "De la maquette technique au film cinématographique 4K",
    steps: [
      {
        step: "01",
        label: "DONNÉES DU PROJET",
        desc: "Maquette Revit, plans DWG, plan masse général, tracé des pistes, bâtiments, espaces accueil, zones techniques, attractions.",
      },
      {
        step: "02",
        label: "CRÉATION NUMÉRIQUE 3D",
        desc: "Préparation des environnements géométriques précis et calage des perspectives architecturales.",
      },
      {
        step: "03",
        label: "INTELLIGENCE ARTIFICIELLE PHOTORÉALISTE",
        desc: "Génération de scènes impossibles à tourner sur un terrain nu : pilotes en combinaison, karts en course, départs sous tension, foules de spectateurs.",
      },
      {
        step: "04",
        label: "COMPOSITING & VFX",
        desc: "Assemblage homogène et continu entre architecture BIM, scènes 3D, motion design et retouche cinématographique.",
      },
      {
        step: "05",
        label: "MASTER 4K UHD",
        desc: "Étalonnage couleur motorsport, sound design spatialisé et mixage final pour diffusion commerciale internationale.",
      },
    ],
  },

  // Les 8 séquences du film (Séquences 01 à 08 détaillées dans le PDF pages 4 à 8)
  filmSequences: [
    {
      number: "SÉQUENCE 01",
      title: "AVANT LA COURSE",
      timecode: "0:00 – 0:25",
      description:
        "Écran noir. Un moteur démarre. Respiration. Gros plan sur un casque, main sur le volant, pied sur la pédale. Roue, pneu, visière. Un premier feu s'allume. La musique commence à monter.",
      visualElements: ["Casque", "Volant", "Pédale", "Roue & Pneu", "Visière", "Premier feu"],
      audioAtmosphere: "Silence tendu, respiration intime, vrombissement lointain, montée harmonique progressive",
    },
    {
      number: "SÉQUENCE 02",
      title: "LE FUTUR CIRCUIT",
      timecode: "0:25 – 0:55",
      description:
        "La caméra quitte progressivement le pilote. Elle découvre le futur complexe. Vue aérienne spectaculaire, architecture, entrée du site, accueil, piste, espaces visiteurs, attractions. Le futur site devient vivant.",
      visualElements: ["Vue aérienne haute", "Lignes architecturales", "Entrée & Accueil", "Tracé du circuit", "Espaces de vie"],
      audioAtmosphere: "Ouverture orchestrale ample, vent marin de l'océan, montée d'énergie",
    },
    {
      number: "SÉQUENCE 03",
      title: "CHOISIR SON EXPÉRIENCE",
      timecode: "0:55 – 1:20",
      description:
        "Présentation dynamique des différentes catégories : ENFANTS, JUNIORS, ADULTES, BIPLACES. Chaque catégorie est mise en scène dans son environnement. Préparation, équipement, casque, installation dans le kart, briefing, sécurité, départ vers la piste.",
      visualElements: ["Catégorie Enfants", "Catégorie Juniors", "Catégorie Adultes", "Catégorie Biplaces", "Briefing de sécurité"],
      audioAtmosphere: "Rythme entraînant, claquement des visières, bruits de stands et d'équipements",
    },
    {
      number: "SÉQUENCE 04",
      title: "LA TECHNOLOGIE",
      timecode: "1:20 – 1:35",
      description:
        "Le film présente les technologies qui rendent l'expérience possible : chronométrage, affichage des temps, classement, gestion des courses, écrans, systèmes de contrôle. Données incrustées en motion design. Un environnement sportif connecté.",
      visualElements: ["Télémétrie live", "Écrans de temps", "Classement temps réel", "Capteurs de boucle", "Contrôle de course"],
      audioAtmosphere: "Effets sonores numériques, bips de franchissement de boucle, pulsation dynamique",
    },
    {
      number: "SÉQUENCE 05",
      title: "LIGHTS OUT",
      timecode: "1:35 – 1:45",
      description:
        "Les karts sont alignés sur la grille. Silence complet. Les cinq feux rouges apparaissent successivement : 1... 2... 3... 4... 5. Noir. Puis : GO. La musique et les moteurs explosent.",
      visualElements: ["Grille d'alignement", "Les 5 feux rouges", "Coupure au noir", "Extinction des feux", "Départ fulgurant"],
      audioAtmosphere: "Silence pesant, 5 bips staccato, puis rupture explosive simultanée des moteurs et du beat",
    },
    {
      number: "SÉQUENCE 06",
      title: "ENTER THE RACE",
      timecode: "1:45 – 2:30",
      description:
        "Rythme maximum. Caméra embarquée, caméra au ras du sol, vue subjective, dépassements serrés, freinage violent, virages à la corde, accélération, travelling, vue aérienne, kart passant à pleine vitesse, réactions enjouées des spectateurs.",
      visualElements: ["Caméra cockpit POV", "Frôlement des vibreurs", "Dépassements millimétrés", "Tribunes enthousiastes", "Travelling pleine vitesse"],
      audioAtmosphere: "Bande-son cinématique rythmée au pic d'intensité, rugissement des moteurs et clameur de la foule",
    },
    {
      number: "SÉQUENCE 07",
      title: "L'EXPÉRIENCE",
      timecode: "2:30 – 2:50",
      description:
        "Le rythme s'ouvre avec générosité. Familles, amis, enfants, adultes, biplaces, spectateurs, espaces de convivialité, terrasses, restauration et attractions. Le film montre que le projet est bien plus qu'une piste : UNE DESTINATION.",
      visualElements: ["Espaces de convivialité", "Terrasse panoramique", "Familles et sourires", "Attractions du site", "Ambiance plage et loisirs"],
      audioAtmosphere: "Thème musical chaleureux et fédérateur, rires, ambiance de fête et de détente",
    },
    {
      number: "SÉQUENCE 08",
      title: "LE FINAL",
      timecode: "2:50 – 3:00",
      description:
        "Dernier virage. Drapeau à damier. Franchissement de la ligne d'arrivée. Silence. Majestueuse vue aérienne du complexe au crépuscule. Apparition du nom du projet. ENTER THE RACE.",
      visualElements: ["Drapeau à damier agité", "Passage de la ligne", "Grande vue aérienne crépusculaire", "Titre : ENTER THE RACE"],
      audioAtmosphere: "Accord final majestueux s'éteignant doucement sur le son du vent et de la mer",
    },
  ],

  // Catégories de karts
  kartCategories: [
    {
      id: "enfants",
      name: "ENFANTS",
      age: "6 à 10 ans",
      description: "Châssis spécialement adapté, volant ergonomique, bridage électronique progressif et arceau intégral avec harnais.",
      focus: "Apprentissage ludique, motricité et sécurité absolue sous encadrement diplômé.",
      specs: "Moteur 120cc 4T bridé · Pédalier réglable · Arceau de sécurité homologué",
    },
    {
      id: "juniors",
      name: "JUNIORS",
      age: "11 à 15 ans",
      description: "Le premier frisson de la véritable course automobile avec un rapport poids/puissance calibré pour l'apprentissage des trajectoires.",
      focus: "Précision de pilotage, initiation aux règles de course et dépassements contrôlés.",
      specs: "Moteur 160cc - 200cc 4T · Freins hydrauliques · Siège baquet compétition",
    },
    {
      id: "adultes",
      name: "ADULTES",
      age: "16 ans et plus",
      description: "Karts de sport haut de gamme offrant des accélérations franches, une vitesse de pointe grisante et une adhérence chirurgicale.",
      focus: "Sensations fortes, chronométrage officiel, grand prix d'entreprises et défis entre amis.",
      specs: "Moteur 270cc - 390cc 4T · Pneus tendres · Système de pesée et de lestage",
    },
    {
      id: "biplaces",
      name: "BIPLACES",
      age: "Tout public / Duo",
      description: "Pour partager l'adrénaline en tandem : un adulte pilote et un passager (enfant ou adulte) pour découvrir la piste en totale confiance.",
      focus: "Partage intergénérationnel, initiation accompagnée et accessibilité universelle.",
      specs: "Double poste / double volant optionnel · Harnais 4 points · Châssis renforcé",
    },
  ],

  // Parcours client
  customerJourney: [
    {
      step: "01",
      title: "ACCUEIL",
      desc: "Arrivée dans le hall architectural, enregistrement digital et attribution du profil pilote.",
    },
    {
      step: "02",
      title: "ÉQUIPEMENT",
      desc: "Vestiaires modernes, remise du casque homologué, cagoule, gants et combinaison sur mesure.",
    },
    {
      step: "03",
      title: "BRIEFING",
      desc: "Salle vidéo climatisée : consignes de sécurité, drapeaux de piste et conseils de trajectoire.",
    },
    {
      step: "04",
      title: "PISTE",
      desc: "Accès à la pitlane, installation dans le kart, réglage du siège et mise en route moteur.",
    },
    {
      step: "05",
      title: "COURSE",
      desc: "Tour de chauffe, départ arrêté feux rouges, confrontation chronométrée et podium final.",
    },
  ],

  // Livrable & Options
  deliverable: {
    format: "16:9 – UHD / 4K",
    duration: "2’30 à 3’00 environ",
    purposes: [
      "Démarches de commercialisation auprès des investisseurs et enseignes",
      "Présentation officielle aux candidats potentiels à l'exploitation",
      "Présentation aux partenaires institutionnels et sponsors",
      "Site internet et plateformes digitales officielles",
      "Événements de lancement et salons professionnels",
      "Supports institutionnels et communication nationale",
    ],
    corrections: "Deux (2) phases de corrections complètes incluses après présentation de la V1.",
  },

  digitalPackOption: {
    title: "OPTION PACK DIGITAL",
    priceFCFA: 1500000,
    priceFormatted: "1 500 000 FCFA HT",
    description: "Pour prolonger la durée de vie du film et optimiser la visibilité sur les réseaux sociaux :",
    items: [
      "1 teaser percutant de 30 secondes (format horizontal 16:9)",
      "3 vidéos verticales optimisées 9:16 de 15 secondes (TikTok, Instagram Reels, Shorts)",
      "3 déclinaisons courtes thématiques issues du film principal",
    ],
  },

  // Planning Prévisionnel (6 à 8 semaines)
  planning: [
    {
      week: "Semaine 1",
      title: "Analyse des données & Conception",
      description: "Étude des maquettes Revit, fichiers DWG et références. Élaboration de la note d'intention et des axes esthétiques.",
      deliverables: ["Analyse technique", "Note d'intention validée"],
    },
    {
      week: "Semaine 2",
      title: "Scénario, Storyboard & Direction Artistique",
      description: "Écriture plan par plan, découpage visuel, cadrages, timecodes et validation formelle de la direction artistique.",
      deliverables: ["Storyboard complet", "Feuille de route artistique"],
    },
    {
      week: "Semaines 3 à 5",
      title: "Production 3D & Séquences IA",
      description: "Modélisation des environnements, intégration BIM Revit, génération des séquences photoréalistes IA et animation des karts.",
      deliverables: ["Environnements 3D calés", "Rendus photoréalistes bruts"],
    },
    {
      week: "Semaines 5 à 6",
      title: "Montage, Compositing & Motion Design",
      description: "Assemblage narratif, incrustation des données de télémétrie, effets visuels et fluidification des transitions.",
      deliverables: ["Premier montage assemblé (Ours)", "Habillage graphique"],
    },
    {
      week: "Semaine 7",
      title: "Sound Design, Musique & Première Version",
      description: "Composition musicale originale, sound design motorsport immersif, mixage audio 5.1/stéréo, étalonnage couleur et livraison V1.",
      deliverables: ["Version 1 complète (Image & Son)", "Ouverture phase correction 1"],
    },
    {
      week: "Semaine 8",
      title: "Corrections, Finalisation & Livraison Master 4K",
      description: "Intégration des retours clients, deuxième passe de finitions et génération des masters UHD/4K finaux.",
      deliverables: ["Master 4K UHD définitif", "Fichiers de diffusion web et événementielle"],
    },
  ],

  // Proposition Financière (exact 8 500 000 FCFA HT de la page 12)
  financialBudget: [
    {
      id: "p01",
      prestation: "Conception, scénario et direction artistique",
      montantFCFA: 700000,
      montantFormatted: "700 000 FCFA",
      category: "preproduction",
    },
    {
      id: "p02",
      prestation: "Analyse et préparation des données Revit / DWG",
      montantFCFA: 700000,
      montantFormatted: "700 000 FCFA",
      category: "preproduction",
    },
    {
      id: "p03",
      prestation: "Storyboard et découpage visuel",
      montantFCFA: 400000,
      montantFormatted: "400 000 FCFA",
      category: "preproduction",
    },
    {
      id: "p04",
      prestation: "Préparation / création des environnements 3D",
      montantFCFA: 1300000,
      montantFormatted: "1 300 000 FCFA",
      category: "production",
    },
    {
      id: "p05",
      prestation: "Production des séquences photoréalistes IA",
      montantFCFA: 2000000,
      montantFormatted: "2 000 000 FCFA",
      category: "production",
    },
    {
      id: "p06",
      prestation: "Motion design / chronométrage / interfaces",
      montantFCFA: 600000,
      montantFormatted: "600 000 FCFA",
      category: "production",
    },
    {
      id: "p07",
      prestation: "Montage / compositing / effets visuels",
      montantFCFA: 950000,
      montantFormatted: "950 000 FCFA",
      category: "postproduction",
    },
    {
      id: "p08",
      prestation: "Musique / sound design / mixage",
      montantFCFA: 700000,
      montantFormatted: "700 000 FCFA",
      category: "postproduction",
    },
    {
      id: "p09",
      prestation: "Étalonnage / finition / master 4K",
      montantFCFA: 450000,
      montantFormatted: "450 000 FCFA",
      category: "postproduction",
    },
    {
      id: "p10",
      prestation: "Direction de production / coordination",
      montantFCFA: 700000,
      montantFormatted: "700 000 FCFA",
      category: "management",
    },
  ],

  totalBaseHT: 8500000,
  totalBaseHTFormatted: "8 500 000 FCFA HT",

  paymentTerms: [
    { percent: 40, label: "À la commande et au lancement de la préproduction" },
    { percent: 40, label: "À la validation du storyboard et au lancement de la production principale" },
    { percent: 20, label: "À la livraison du master final" },
  ],

  ourDifference: [
    { title: "ARCHITECTURE", subtitle: "La fidélité absolue au projet et aux données Revit / DWG de Koffi & Diabaté." },
    { title: "CINÉMA", subtitle: "L'émotion, le souffle dramatique et la mise en scène d'une histoire poignante." },
    { title: "SPORT AUTOMOBILE", subtitle: "La vitesse brute, la tension avant la course et les codes du chronométrage." },
    { title: "INTELLIGENCE ARTIFICIELLE", subtitle: "La possibilité concrète de montrer ce qui n'existe pas encore sur le terrain." },
    { title: "AFRIKAFUN", subtitle: "Une production ambitieuse, pensée depuis l'Afrique et forgée pour son marché." },
  ],

  conclusionQuote:
    "Un bâtiment peut être montré. Une piste peut être représentée. Mais une expérience doit être racontée.",
};
