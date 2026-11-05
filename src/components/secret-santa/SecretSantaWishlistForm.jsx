import { useState } from "react";
import { supabase } from "../../lib/supabase";

function SecretSantaWishlistForm({
  campaign,
  character,
  existingEntry = null,
  onBack,
  onSaved,
}) {
  const [wishlist, setWishlist] = useState({
    wishlist_1: existingEntry?.wishlist_1 || "",
    wishlist_2: existingEntry?.wishlist_2 || "",
    wishlist_3: existingEntry?.wishlist_3 || "",
    wishlist_4: existingEntry?.wishlist_4 || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setWishlist({
      ...wishlist,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

   if (!campaign || !character) return;

// Require at least one non-empty wish
const hasAtLeastOneWish = Object.values(wishlist).some(
  (wish) => wish.trim().length > 0
);

if (!hasAtLeastOneWish) {
  setError("Please add at least one wish before saving.");
  return;
}

    setSaving(true);
    setError("");

    const wishlistData = {
      wishlist_1: wishlist.wishlist_1.trim(),
      wishlist_2: wishlist.wishlist_2.trim(),
      wishlist_3: wishlist.wishlist_3.trim(),
      wishlist_4: wishlist.wishlist_4.trim(),
    };

    let error = null;
    let entryId = null;

    /*
     * EDIT EXISTING WISHLIST
     */
    if (existingEntry) {
      const { data, error: functionError } = await supabase.rpc(
        "update_secret_santa_wishlist",
        {
          entry_uuid: existingEntry.id,
          new_wishlist_1: wishlist.wishlist_1.trim(),
          new_wishlist_2: wishlist.wishlist_2.trim(),
          new_wishlist_3: wishlist.wishlist_3.trim(),
          new_wishlist_4: wishlist.wishlist_4.trim(),
        },
      );

      error = functionError;
      entryId = existingEntry.id;

      if (!error && data !== true) {
        error = {
          code: "UPDATE_FAILED",
          message: "Wishlist could not be updated.",
        };
      }
    } else {
      const { error: insertError } = await supabase
        .from("secret_santa_entries")
        .insert({
          campaign_id: campaign.id,
          character_id: character.id,
          ...wishlistData,
        });

      error = insertError;

      // Retrieve the entry ID through the public view
      if (!error) {
        const { data, error: lookupError } = await supabase
          .from("secret_santa_public_entries")
          .select("id")
          .eq("campaign_id", campaign.id)
          .eq("character_id", character.id)
          .single();

        if (lookupError) {
          error = lookupError;
        } else {
          entryId = data.id;
        }
      }
    }

    /*
     * HANDLE ERRORS
     */
    if (error) {
      console.error("Secret Santa wishlist error:", error);

      if (error.code === "23505") {
        setError(
          "Someone has already chosen this character. Please choose another one.",
        );
      } else if (error.code === "42501") {
        setError("You don't have permission to make this change.");
      } else {
        setError("Something went wrong. Please try again.");
      }

      setSaving(false);
      return;
    }

    /*
     * SUCCESS
     */
    setSaving(false);

    onSaved({
      entryId,
      character,
      ...wishlistData,
    });
  }

  return (
    <section className="secret-santa-wishlist">
      <button className="secret-santa-back" type="button" onClick={onBack}>
        ← Choose another character
      </button>

      <div className="secret-santa-wishlist-header">
        <div className="secret-santa-wishlist-character">
          {character.image ? (
            <img src={character.image} alt={character.name} />
          ) : (
            <span>?</span>
          )}
        </div>

        <div>
          <p className="eyebrow">YOU'RE GOING TO BE...</p>

          <h2>{character.name}</h2>
        </div>
      </div>

      <form className="secret-santa-wishlist-form" onSubmit={handleSubmit}>
        <div className="secret-santa-wishlist-field">
          <label htmlFor="wishlist_1">First Wish</label>

          <textarea
            id="wishlist_1"
            name="wishlist_1"
            value={wishlist.wishlist_1}
            onChange={handleChange}
            placeholder="Something you'd love..."
            rows="4"
          />
        </div>

        <div className="secret-santa-wishlist-field">
          <label htmlFor="wishlist_2">Second Wish</label>

          <textarea
            id="wishlist_2"
            name="wishlist_2"
            value={wishlist.wishlist_2}
            onChange={handleChange}
            placeholder="Something you've had your eye on..."
            rows="4"
          />
        </div>

        <div className="secret-santa-wishlist-field">
          <label htmlFor="wishlist_3">Third Wish</label>

          <textarea
            id="wishlist_3"
            name="wishlist_3"
            value={wishlist.wishlist_3}
            onChange={handleChange}
            placeholder="That old classic you wanted to read..."
            rows="4"
          />
        </div>

        <div className="secret-santa-wishlist-field">
          <label htmlFor="wishlist_4">Fourth Wish</label>

          <textarea
            id="wishlist_4"
            name="wishlist_4"
            value={wishlist.wishlist_4}
            onChange={handleChange}
            placeholder="The latest bestseller, perhaps..."
            rows="4"
          />
        </div>

        {error && <p className="secret-santa-wishlist-error">{error}</p>}

        <button className="secret-santa-submit" type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : existingEntry
              ? "Update my wishlist"
              : "Save my wishlist"}
        </button>
      </form>
    </section>
  );
}

export default SecretSantaWishlistForm;
