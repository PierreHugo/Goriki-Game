const TYPE_COLORS = {
  normal: "#A8A878",   fire: "#F08030",    water: "#6890F0",
  electric: "#F8D030", grass: "#78C850",   ice: "#98D8D8",
  fighting: "#C03028", poison: "#A040A0",  ground: "#E0C068",
  flying: "#A890F0",   psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038",     ghost: "#705898",   dragon: "#7038F8",
  dark: "#705848",     steel: "#B8B8D0",   fairy: "#EE99AC",
};

const NAME_KEY = { fr: "nameFr", en: "nameEn", ja: "nameJa" };

export default function PokemonCard({
  pokemon,
  isGuessed,
  isRevealed,
  language,
  onClick,
}) {
  const visible = isGuessed || isRevealed;
  const nameKey = NAME_KEY[language] ?? "nameFr";
  const mainType = pokemon.types[0];
  const typeColor = TYPE_COLORS[mainType] ?? "#888";

  if (!visible) {
    return <div className="pokemon-card empty" />;
  }

  return (
    <div
      className={`pokemon-card ${isGuessed ? "guessed" : "revealed"}`}
      style={{ borderTopColor: typeColor }}
      onClick={onClick}
      title={pokemon[nameKey]}
    >
      <div className="card-left">
        <span className="card-id">#{String(pokemon.id).padStart(4, "0")}</span>
        <span className="card-name">{pokemon[nameKey]}</span>
      </div>
      {isGuessed && pokemon.sprite && (
        <img
          src={pokemon.sprite}
          alt={pokemon[nameKey]}
          className="card-sprite"
        />
      )}
    </div>
  );
}
