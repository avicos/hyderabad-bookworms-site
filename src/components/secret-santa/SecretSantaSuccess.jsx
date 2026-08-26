import { useState } from "react";
import { supabase } from "../../lib/supabase";

function SecretSantaSuccess({ entryId, character }) {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

 function handleEmailSubmit(event) {
  event.preventDefault();

  if (!email.trim()) return;

  setMessage(
    "We'll send you a copy of your wishlist."
  );

  setEmail("");
}

  return (
    <div className="secret-santa-success">
      <p className="eyebrow">WISHLIST SAVED</p>

      <h2>You're all set!</h2>

      <p>
        Your Secret Santa character is{" "}
        <strong>{character.name}</strong>.
      </p>

      <div className="secret-santa-email-section">
        <p className="secret-santa-email-heading">
          Afraid you'll forget what you chose?
        </p>

        <p className="secret-santa-email-description">
          Give us your email and we'll send you a copy
          of your character and wishlist.
        </p>

        <form
          className="secret-santa-email-form"
          onSubmit={handleEmailSubmit}
        >
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            required
          />

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Email me my wishlist"}
          </button>
        </form>

        {message && (
          <p className="secret-santa-email-message">
            {message}
          </p>
        )}
      </div>

      <p className="secret-santa-success-note">
        You can come back later to see what your
        friends have added.
      </p>
    </div>
  );
}

export default SecretSantaSuccess;