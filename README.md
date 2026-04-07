# 🎮 Goriki-Game

> Combien de Pokémon es-tu capable de nommer de mémoire ?

Goriki-Game est un jeu de quiz Pokémon inspiré de Jetpunk. Tape le nom d'un Pokémon, il apparaît dans ton tableau de progression. Simple, addictif, redoutable.

---

## ✨ Fonctionnalités

- **Saisie libre** — tape le nom d'un Pokémon pour le valider, en français, anglais ou japonais
- **Filtres personnalisables** — choisis les générations, les types, ou des catégories (Starters, Légendaires, Mythiques, Pseudo-légendaires, Bébés, Fossiles)
- **Timer flexible** — fixe ta limite de temps ou joue en mode infini
- **Tableau de progression** — se remplit au fur et à mesure, triable par numéro, nom ou type
- **Mini fiche Pokémon** — clique sur un Pokémon deviné pour voir son sprite, ses types et ses noms dans toutes les langues
- **Multilingue** — interface disponible en Français, Anglais et Japonais
- **Révélation finale** — à la fin du timer, tous les Pokémon non devinés sont révélés

---

## 🛠️ Stack technique

- **React + Vite**
- **PokéAPI** (https://pokeapi.co) — données et sprites
- **Context API + Hooks custom** — gestion de l'état

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

---

## 📁 Structure du projet

```
src/
├── screens/        # HomeScreen, GameScreen, ResultScreen
├── components/     # FilterPanel, InputGuess, PokemonGrid, PokemonSheet...
├── hooks/          # usePokeAPI, useTimer, useGameState
├── utils/          # normalize, categories, i18n
└── styles/
```

---

## 🗺️ Roadmap

- [x] Architecture du projet
- [ ] Fetch et cache PokéAPI
- [ ] Écran d'accueil + filtres
- [ ] Écran de jeu (saisie + progression)
- [ ] Tableau de progression + mini fiche
- [ ] Écran de résultats
- [ ] Support multilingue (FR / EN / JP)

---

## 📜 Licence

MIT
