import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./SecretSantaFriends.css";

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

      <header className="secret-santa-friends-header">

        <h2>What your friends are wishing for</h2>

        <p>
          Browse the characters and see what they've added to their wishlists.
        </p>
      </header>

      {loading ? (
        <p>Loading wishlists...</p>
      ) : entries.length === 0 ? (
        <p className="secret-santa-empty">
          Nobody has added a wishlist yet.
        </p>
      ) : (
        <div className="secret-santa-friends-list">

          {entries.map((entry) => {
            const wishes = [
              entry.wishlist_1,
              entry.wishlist_2,
              entry.wishlist_3,
              entry.wishlist_4,
            ].filter((wish) => wish?.trim());

            return (
              <article
                className="secret-santa-friend-row"
                key={entry.id}
              >
                <div className="secret-santa-friend-character">
                  <div className="secret-santa-friend-image">
                    {entry.character_image ? (
                      <img
                        src={entry.character_image}
                        alt={entry.character_name}
                      />
                    ) : (
                      <span>?</span>
                    )}
                  </div>

                  <h3>{entry.character_name}</h3>
                </div>

                <div className="secret-santa-friend-wishes">
                  {wishes.length > 0 ? (
                    <ul>
                      {wishes.map((wish, index) => (
                        <li key={index}>{wish}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No wishes added.</p>
                  )}
                </div>
              </article>
            );
          })}

        </div>
      )}
    </section>
  );
}

export default SecretSantaFriends;