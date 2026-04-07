# 🎮 Goriki-Game

> Combien de Pokémon es-tu capable de nommer de mémoire ?

Goriki-Game est un jeu de quiz Pokémon inspiré de Jetpunk. Tape le nom d'un Pokémon, il apparaît dans ton tableau de progression. Simple, addictif, redoutable.

---

## ✨ Fonctionnalités

- **Saisie libre** — tape le nom d'un Pokémon pour le valider, en français, anglais ou japonais
- **Filtres personnalisables** — choisis les générations, les types, ou des catégories (Starters, Légendaires, Mythiques, Pseudo-légendaires, Bébés, Fossiles)
- **Timer flexible** — fixe ta limite de temps (1 min à 1h) ou joue en mode infini
- **Tableau de progression** — se remplit au fur et à mesure, triable par numéro, nom ou type
- **Mini fiche Pokémon** — clique sur un Pokémon deviné pour voir son sprite, ses types et ses noms FR/EN/JP
- **Multilingue** — interface disponible en Français, Anglais et Japonais
- **Révélation finale** — à la fin du timer, tous les Pokémon non devinés sont révélés en gris
- **Cache local** — les données PokéAPI sont mises en cache, le jeu se charge instantanément après la première visite

---

## 🛠️ Stack technique

- **React + Vite**
- **PokéAPI** (https://pokeapi.co) — données et sprites, ~1025 Pokémon
- **Context API + Hooks custom** — gestion de l'état sans lib externe
- **localStorage** — cache des données pour éviter les requêtes répétées

---

## 🚀 Lancer le projet en local

```bash
# Cloner le repo
git clone https://github.com/ton-username/goriki-game.git
cd goriki-game

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

> ⚠️ Le premier lancement charge les 1025 Pokémon depuis la PokéAPI (1-2 minutes). Les lancements suivants sont instantanés grâce au cache.

---

## 📁 Structure du projet

```
src/
├── App.jsx                   # Orchestration générale
├── main.jsx                  # Point d'entrée React
├── screens/
│   ├── HomeScreen.jsx        # Écran d'accueil + config
│   ├── GameScreen.jsx        # Écran de jeu principal
│   └── ResultScreen.jsx      # Écran de fin avec révélation
├── components/
│   ├── FilterPanel.jsx       # Sélection gén / type / catégorie
│   ├── TimerSetup.jsx        # Config du timer
│   ├── InputGuess.jsx        # Champ de saisie
│   ├── ProgressBar.jsx       # Compteur + pourcentage
│   ├── PokemonGrid.jsx       # Tableau de progression
│   ├── PokemonCard.jsx       # Case individuelle
│   └── PokemonSheet.jsx      # Mini fiche au clic
├── hooks/
│   ├── usePokeAPI.js         # Fetch + cache PokéAPI
│   ├── useTimer.js           # Logique du countdown
│   └── useGameState.js       # État global du jeu
└── styles/
    └── index.css             # Thème dark global
```

---

## 🗺️ Roadmap

- [x] Fetch et cache PokéAPI (1025 Pokémon)
- [x] Écran d'accueil + filtres (générations, types, catégories)
- [x] Config du timer (presets + slider + mode infini)
- [x] Écran de jeu (saisie + progression)
- [x] Tableau de progression triable + mini fiche Pokémon
- [x] Écran de résultats avec révélation
- [x] Support multilingue (FR / EN / JP)
- [x] Thème dark complet + responsive mobile
- [ ] Formes régionales (Alola, Galar, Hisui, Paldea)
- [ ] Déploiement (Vercel / GitHub Pages)
- [ ] Statistiques et historique des parties
- [ ] Mode multijoueur

---

## 📜 Licence

MIT
