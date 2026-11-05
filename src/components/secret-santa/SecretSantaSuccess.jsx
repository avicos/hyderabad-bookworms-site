import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import "./SecretSantaSuccess.css";

function SecretSantaSuccess({ entryId, character, onHome, onFriends }) {
  const [wishlist, setWishlist] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      const { data, error } = await supabase
        .from("secret_santa_public_entries")
        .select("wishlist_1, wishlist_2, wishlist_3, wishlist_4")
        .eq("id", entryId)
        .single();

      if (error) {
        console.error("Error fetching saved wishlist:", error);
      } else {
        setWishlist(data);
      }

      setWishlistLoading(false);
    }

    if (entryId) {
      fetchWishlist();
    } else {
      setWishlistLoading(false);
    }
  }, [entryId]);

  const wishlistItems = [
    wishlist?.wishlist_1,
    wishlist?.wishlist_2,
    wishlist?.wishlist_3,
    wishlist?.wishlist_4,
  ].filter((item) => item?.trim());

  return (
    <div className="secret-santa-success">
      <p className="eyebrow">WISHLIST SAVED</p>

      <h2>You're all set!</h2>

      <p>
        Your Secret Santa character is <strong>{character?.name}</strong>.
      </p>

      {!wishlistLoading && wishlistItems.length > 0 && (
        <div className="secret-santa-success-wishlist">
          <h3>These are your wishes...</h3>

          <ul>
            {wishlistItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="secret-santa-success-note">
        Take screenshot for safekeeping!
      </p>

      <div className="secret-santa-success-actions">
        <button
          type="button"
          className="secret-santa-success-secondary"
          onClick={onFriends}
        >
          See what your friends have added
        </button>

        <button
          type="button"
          className="secret-santa-success-primary"
          onClick={onHome}
        >
          Take me home
        </button>
      </div>
    </div>
  );
}

export default SecretSantaSuccess;
