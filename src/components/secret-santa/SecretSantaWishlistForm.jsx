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

    setSaving(true);
    setError("");

    const wishlistData = {
      wishlist_1: wishlist.wishlist_1.trim(),
      wishlist_2: wishlist.wishlist_2.trim(),
      wishlist_3: wishlist.wishlist_3.trim(),
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
    }
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

    /*
     * CREATE NEW WISHLIST
     */
      const result = await supabase.from("secret_santa_entries").insert([
        {
          campaign_id: campaign.id,
          character_id: character.id,
          ...wishlistData,
        },
      ]);

      error = result.error;
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
          <p className="eyebrow">YOUR CHARACTER</p>

          <h2>{character.name}</h2>
        </div>
      </div>

      <form className="secret-santa-wishlist-form" onSubmit={handleSubmit}>
        <div className="secret-santa-wishlist-field">
          <label htmlFor="wishlist_1">Something I'd love</label>

          <textarea
            id="wishlist_1"
            name="wishlist_1"
            value={wishlist.wishlist_1}
            onChange={handleChange}
            placeholder="Books, gifts, ideas..."
            rows="4"
          />
        </div>

        <div className="secret-santa-wishlist-field">
          <label htmlFor="wishlist_2">Something specific I'd like</label>

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
          <label htmlFor="wishlist_3">Something I'd rather avoid</label>

          <textarea
            id="wishlist_3"
            name="wishlist_3"
            value={wishlist.wishlist_3}
            onChange={handleChange}
            placeholder="Anything you'd prefer not to receive..."
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

        <p className="secret-santa-email-note">
          Afraid you'll forget what you chose?{" "}
          <button type="button">We can email you about it!</button>
        </p>
      </form>
    </section>
  );
}

export default SecretSantaWishlistForm;
