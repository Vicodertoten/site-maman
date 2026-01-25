# Direction Artistique - Gastronomade

## Vue d'ensemble

**Concept visuel** : "Gourmandise Organique" - Alliance entre nature sauvage, chaleur d'un foyer et professionnalisme d'une offre pour entreprises.

**Ambiance** : Chaleureuse, lumineuse et saine. Style épuré mais pas minimaliste, privilégiant des textures naturelles (lin, bois, papier recyclé).

---

## 1. Identité Visuelle Globale

### Le Concept
- Utilisation des couleurs pour structurer le multi-casquettes de Muriel
- Unité visuelle maintenue grâce au fond crème qui apporte douceur
- Alliance entre nature sauvage et chaleur domestique

### L'Ambiance
- **Chaleureuse** : Couleurs douces, textures naturelles
- **Lumineuse** : Utilisation généreuse de l'espace blanc
- **Saine** : Palette de couleurs naturelles, évocation de produits frais

---

## 2. Système de Couleurs (Mapping UI)

Les couleurs servent de repères de navigation et structurent l'expérience utilisateur.

| Élément | Couleur | Usage Stratégique |
|---------|---------|-------------------|
| **Fond de page** | `--mv-cream` | Couleur de base organique, moins agressif que le blanc |
| **Texte Principal** | `--mv-forest` | Titres et paragraphes - lisibilité "haute couture" |
| **Accents & Boutons** | `--mv-leaf` | Actions positives (Réserver, En savoir plus) - cuisine santé |
| **Éléments d'alerte** | `--mv-coral` | Prix, promotions, notifications "Complet" |
| **Boutons Secondaires** | `--mv-plum` | Sections intimes (Restaurant Éphémère) |

### Palette de Couleurs
```css
--mv-cream: #FBF8F1;  /* Fond doux et organique */
--mv-forest: #2A3D34;  /* Texte principal, autorité */
--mv-leaf: #4A7C59;    /* Actions positives, santé */
--mv-coral: #E85D3A;   /* Alertes, prix */
--mv-plum: #5A2A3D;    /* Sections intimes */
```

---

## 3. Typographie (Le Duo Élégant)

### Titres (H1, H2, H3)
- **Police** : Serif élégante (`Lora` ou `Playfair Display`)
- **Style** : Élégance, tradition culinaire, autorité
- **Couleur** : `--mv-forest`
- **Usage** : Titres principaux, sections importantes

### Corps de texte
- **Police** : Sans-serif moderne (`Inter` ou `Montserrat`)
- **Style** : Modernité, clarté, simplicité d'édition
- **Taille** : Minimum 16px pour lecture mobile
- **Couleur** : `--mv-forest` avec opacité 90% pour texte secondaire

### Configuration VS Code
```css
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

h1, h2, h3, h4, h5, h6 {
  font-family: 'Lora', 'Times New Roman', serif;
  color: var(--mv-forest);
}

body {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
```

---

## 4. Composants UI & Éléments Graphiques

### Les Cartes (Cards)
- **Fond** : Blanc pur sur fond crème pour créer du relief
- **Ombre** : `.mv-shadow` - `rgba(52,78,65,.15)` pour aspect flottant
- **Bords** : Arrondis (`border-radius: 1.5rem`) pour adoucir
- **Structure** : Fond blanc, bordures subtiles `--mv-leaf`

### Boutons (CTA)
- **Forme** : Classe `.mv-pill` pour bords totalement arrondis
- **Bouton Primaire** :
  - Fond : `--mv-forest`
  - Texte : `--mv-cream`
  - Usage : Actions principales (location société)
- **Bouton Secondaire** :
  - Fond : Transparent
  - Bordure : `--mv-leaf`
  - Usage : Actions secondaires

### Séparateurs
- **Style** : Lignes très fines
- **Couleur** : `--mv-leaf` à 30% d'opacité
- **Usage** : Séparation de sections sans rupture visuelle

---

## 5. Layout & Hiérarchie (Grid System)

### Header Permanent
- **Fond** : `--mv-cream` avec léger flou au scroll
- **Logo** : Centré ou à gauche, entouré du nom + "Manger Vrai" + "Gastronomade"
- **Style** : Élégant, discret, toujours visible

### Grille d'Accueil (3 colonnes)
Structure reflétant les priorités de Muriel :

1. **Bloc Pro (Prioritaire)** :
   - Largeur : Plus importante
   - Couleur : `--mv-forest` pour montrer le sérieux
   - Contenu : Offre entreprise, prestations professionnelles

2. **Bloc Privé** :
   - Style : Plus léger et chaleureux
   - Contenu : Photos d'ambiance, événements privés
   - Ton : Intime et accueillant

3. **Bloc Restaurant** :
   - Style : Encadré "Dates" très clair
   - Couleur : `--mv-plum` pour l'aspect éphémère
   - Contenu : Calendrier des événements, réservations

---

## 6. Iconographie & Images

### Icônes
- **Style** : "Line Art" (traits fins)
- **Couleur** : `--mv-leaf`
- **Usage** : Navigation, fonctionnalités, appels à l'action

### Photos
- **Style** : Lumineuses, naturelles
- **Sujets** : Lieu (La Zboum), coin du feu, plats colorés
- **Traitement** : Couleurs vives, lumière naturelle

### Overlay de texte sur images
- **Calque** : Couleur `--mv-forest`
- **Opacité** : 40%
- **Objectif** : Garantir lisibilité optimale

---

## Principes de Mise en Œuvre

### Cohérence
- Appliquer systématiquement la palette MV
- Respecter la hiérarchie des couleurs
- Maintenir l'unité visuelle à travers tous les composants

### Accessibilité
- Contraste suffisant entre texte et fond
- Tailles de police adaptées au mobile
- Icônes et éléments interactifs clairement identifiables

### Performance
- Utiliser des polices Google Fonts optimisées
- Images compressées sans perte de qualité
- CSS optimisé pour le chargement rapide

---

*Document créé le 25 janvier 2026 - Direction Artistique Gastronomade*</content>
<parameter name="filePath">/Users/ryelandt/Documents/site maman/STYLE.md