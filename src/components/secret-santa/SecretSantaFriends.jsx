import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function SecretSantaFriends({ campaign, onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaign) return;

    fetchEntries();
  }, [campaign]);

  async function fetchEntries() {
    setLoading(true);

    const { data, error } = await supabase
      .from("secret_santa_public_entries")
      .select("*")
      .eq("campaign_id", campaign.id)
      .order("character_name", { ascending: true });

    if (error) {
      console.error("Error fetching Secret Santa wishlists:", error);
    } else {
      setEntries(data || []);
    }

    setLoading(false);
  }

  return (
    <section className="secret-santa-friends">
      <button className="secret-santa-back" type="button" onClick={onBack}>
        ← Back
      </button>

      <div className="secret-santa-friends-header">
        <p className="eyebrow">SECRET SANTA</p>

        <h2>What your friends are wishing for</h2>

        <p>
          Browse the characters and see what they've added to their wishlists.
        </p>
      </div>

      {loading ? (
        <p>Loading wishlists...</p>
      ) : entries.length === 0 ? (
        <p className="secret-santa-empty">Nobody has added a wishlist yet.</p>
      ) : (
        <div className="secret-santa-friends-grid">
          {entries.map((entry) => (
            <article className="secret-santa-friend-card" key={entry.id}>
              <div className="secret-santa-friend-image">
                {entry.character_image ? (
                  <img src={entry.character_image} alt={entry.character_name} />
                ) : (
                  <span>?</span>
                )}
              </div>

              <h3>{entry.character_name}</h3>

              <div className="secret-santa-friend-wishlist">
                {entry.wishlist_1 && (
                  <div>
                    <h4>Something I'd love</h4>
                    <p>{entry.wishlist_1}</p>
                  </div>
                )}

                {entry.wishlist_2 && (
                  <div>
                    <h4>Something specific</h4>
                    <p>{entry.wishlist_2}</p>
                  </div>
                )}

                {entry.wishlist_3 && (
                  <div>
                    <h4>Something I'd rather avoid</h4>
                    <p>{entry.wishlist_3}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SecretSantaFriends;
