import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./SecretSanta.css";

function SecretSanta() {
  const [characters, setCharacters] = useState([]);
  const [claimedCharacterIds, setClaimedCharacterIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showAddWishlist, setShowAddWishlist] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const [wishlist, setWishlist] = useState({
    wishlist_1: "",
    wishlist_2: "",
    wishlist_3: "",
  });

  const [savingWishlist, setSavingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [wishlistSuccess, setWishlistSuccess] = useState(false);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
  fetchCampaign();
}, []);

async function fetchCampaign() {
  setLoading(true);

  const { data: campaignData, error: campaignError } =
    await supabase
      .from("secret_santa_campaigns")
      .select("*")
      .eq("slug", "secret-santa-2026")
      .eq("status", "open")
      .single();

  if (campaignError) {
    console.error(
      "Error fetching Secret Santa campaign:",
      campaignError
    );

    setLoading(false);
    return;
  }

  setCampaign(campaignData);

  await fetchCharacters(campaignData.id);
}

 async function fetchCharacters(campaignId) {
  const {
    data: charactersData,
    error: charactersError,
  } = await supabase
    .from("secret_santa_characters")
    .select("*")
    .order("name", { ascending: true });

  if (charactersError) {
    console.error(
      "Error fetching Secret Santa characters:",
      charactersError
    );

    setLoading(false);
    return;
  }

  const {
    data: entriesData,
    error: entriesError,
  } = await supabase
    .from("secret_santa_entries")
    .select("character_id")
    .eq("campaign_id", campaignId);

  if (entriesError) {
    console.error(
      "Error fetching Secret Santa entries:",
      entriesError
    );
  }

  setCharacters(charactersData || []);

  setClaimedCharacterIds(
    (entriesData || []).map(
      (entry) => entry.character_id
    )
  );

  setLoading(false);
}
  async function handleWishlistSubmit(event) {
    event.preventDefault();

    if (!selectedCharacter) return;

    setSavingWishlist(true);
    setWishlistError("");

    const { error } = await supabase
  .from("secret_santa_entries")
  .insert([
    {
      campaign_id: campaign.id,
      character_id: selectedCharacter.id,
      wishlist_1: wishlist.wishlist_1.trim(),
      wishlist_2: wishlist.wishlist_2.trim(),
      wishlist_3: wishlist.wishlist_3.trim(),
    },
  ]);

    if (error) {
      console.error("Secret Santa wishlist error:", error);

      if (error.code === "23505") {
        setWishlistError(
          "Someone has already chosen this character. Please choose another one.",
        );
      } else {
        setWishlistError("Something went wrong. Please try again.");
      }

      setSavingWishlist(false);
      return;
    }

    setWishlistSuccess(true);

    setClaimedCharacterIds((current) => [...current, selectedCharacter.id]);

    setSavingWishlist(false);
  }

  function handleWishlistChange(event) {
    setWishlist({
      ...wishlist,
      [event.target.name]: event.target.value,
    });
  }
  function handleAddWishlist() {
    setShowAddWishlist(true);

    setSelectedCharacter(null);
  }

  function handleSelectCharacter(character) {
    if (claimedCharacterIds.includes(character.id)) {
      return;
    }

    setSelectedCharacter(character);
  }

  function handleBack() {
    setSelectedCharacter(null);
  }

  return (
    <>
      <Navbar />

      <main className="secret-santa-page">
        <header className="secret-santa-header">
          <p className="eyebrow">HYDERABAD BOOKWORMS</p>

          <h1>Secret Santa</h1>

          <p className="secret-santa-intro">
            Pick a character, make your wishlist, and see what your friends are
            wishing for.
          </p>
        </header>

        {!showAddWishlist && (
          <section className="secret-santa-actions">
            <button type="button" onClick={handleAddWishlist}>
              Add your wishlist
            </button>

            <button type="button">Edit your wishlist</button>

            <button type="button">See what your friends have added</button>
          </section>
        )}

        {showAddWishlist && !selectedCharacter && (
          <section className="secret-santa-character-section">
            <button
              className="secret-santa-back"
              type="button"
              onClick={() => setShowAddWishlist(false)}
            >
              ← Back
            </button>

            <p className="eyebrow">ADD YOUR WISHLIST</p>

            <h2>Choose your character</h2>

            <p className="secret-santa-section-intro">
              Pick the character you'd like to be for Secret Santa.
            </p>

            {loading ? (
              <p>Loading characters...</p>
            ) : characters.length === 0 ? (
              <p>No characters available yet.</p>
            ) : (
              <div className="secret-santa-character-grid">
                {characters.map((character) => {
                  const claimed = claimedCharacterIds.includes(character.id);

                  return (
                    <button
                      className={`secret-santa-character ${
                        claimed ? "claimed" : ""
                      }`}
                      key={character.id}
                      type="button"
                      disabled={claimed}
                      onClick={() => handleSelectCharacter(character)}
                    >
                      <div className="secret-santa-character-image">
                        {character.image ? (
                          <img src={character.image} alt={character.name} />
                        ) : (
                          <span>?</span>
                        )}

                        {claimed && (
                          <div className="secret-santa-character-claimed">
                            Already chosen
                          </div>
                        )}
                      </div>

                      <span>{character.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {showAddWishlist && selectedCharacter && (
          <section className="secret-santa-wishlist">
            <button
              className="secret-santa-back"
              type="button"
              onClick={() => {
                setSelectedCharacter(null);
                setWishlist({
                  wishlist_1: "",
                  wishlist_2: "",
                  wishlist_3: "",
                });
                setWishlistError("");
                setWishlistSuccess(false);
              }}
            >
              ← Choose another character
            </button>

            <div className="secret-santa-wishlist-header">
              <div className="secret-santa-wishlist-character">
                {selectedCharacter.image ? (
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                  />
                ) : (
                  <span>?</span>
                )}
              </div>

              <div>
                <p className="eyebrow">YOUR CHARACTER</p>

                <h2>{selectedCharacter.name}</h2>
              </div>
            </div>

            {!wishlistSuccess ? (
              <form
                className="secret-santa-wishlist-form"
                onSubmit={handleWishlistSubmit}
              >
                <div className="secret-santa-wishlist-field">
                  <label htmlFor="wishlist_1">Something I'd love</label>

                  <textarea
                    id="wishlist_1"
                    name="wishlist_1"
                    value={wishlist.wishlist_1}
                    onChange={handleWishlistChange}
                    placeholder="Books, gifts, ideas..."
                    rows="4"
                  />
                </div>

                <div className="secret-santa-wishlist-field">
                  <label htmlFor="wishlist_2">
                    Something specific I'd like
                  </label>

                  <textarea
                    id="wishlist_2"
                    name="wishlist_2"
                    value={wishlist.wishlist_2}
                    onChange={handleWishlistChange}
                    placeholder="Something you've had your eye on..."
                    rows="4"
                  />
                </div>

                <div className="secret-santa-wishlist-field">
                  <label htmlFor="wishlist_3">Something I'd rather avoid</label>

                  <textarea
                    id="wishlist_3"
                    name="wishlist_3"
                    value={wishlist.wishlist_3}
                    onChange={handleWishlistChange}
                    placeholder="Anything you'd prefer not to receive..."
                    rows="4"
                  />
                </div>

                {wishlistError && (
                  <p className="secret-santa-wishlist-error">{wishlistError}</p>
                )}

                <button
                  className="secret-santa-submit"
                  type="submit"
                  disabled={savingWishlist}
                >
                  {savingWishlist ? "Saving..." : "Save my wishlist"}
                </button>

                <p className="secret-santa-email-note">
                  Afraid you'll forget what you chose?{" "}
                  <button type="button">We can email you about it!</button>
                </p>
              </form>
            ) : (
              <div className="secret-santa-success">
                <p className="eyebrow">WISHLIST SAVED</p>

                <h2>You're all set!</h2>

                <p>
                  Your Secret Santa character is{" "}
                  <strong>{selectedCharacter.name}</strong>.
                </p>

                <p>
                  You can come back later to see what your friends have added.
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default SecretSanta;
