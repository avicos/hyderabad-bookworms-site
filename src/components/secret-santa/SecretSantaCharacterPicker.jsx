function SecretSantaCharacterPicker({
  characters,
  claimedCharacterIds,
  onSelect,
  onBack,
  mode = "add",
}) {
  const visibleCharacters =
    mode === "edit"
      ? characters.filter((character) =>
          claimedCharacterIds.includes(character.id)
        )
      : characters.filter(
          (character) =>
            !claimedCharacterIds.includes(character.id)
        );

  return (
    <section className="secret-santa-character-section">
      <button
        className="secret-santa-back"
        type="button"
        onClick={onBack}
      >
        ← Back
      </button>

      <p className="eyebrow">
        {mode === "edit"
          ? "EDIT YOUR WISHLIST"
          : "ADD YOUR WISHLIST"}
      </p>

      <h2>
        {mode === "edit"
          ? "Choose your character"
          : "Choose your character"}
      </h2>

      <p className="secret-santa-section-intro">
        {mode === "edit"
          ? "Choose the character you picked for Secret Santa."
          : "Pick the character you'd like to be for Secret Santa."}
      </p>

      {visibleCharacters.length === 0 ? (
        <p className="secret-santa-empty">
          {mode === "edit"
            ? "You haven't chosen a character yet."
            : "All the characters have been chosen!"}
        </p>
      ) : (
        <div className="secret-santa-character-grid">
          {visibleCharacters.map((character) => (
            <button
              className="secret-santa-character"
              key={character.id}
              type="button"
              onClick={() => onSelect(character)}
            >
              <div className="secret-santa-character-image">
                {character.image ? (
                  <img
                    src={character.image}
                    alt={character.name}
                  />
                ) : (
                  <span>?</span>
                )}
              </div>

              <span>{character.name}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default SecretSantaCharacterPicker;