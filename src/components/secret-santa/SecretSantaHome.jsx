function SecretSantaHome({
  onAdd,
  onEdit,
  onFriends,
  campaignStatus,
  wishlistOpensAt,
  currentTime,
  canSubmitWishlists,
}) {
  const isMatched = campaignStatus === "matched";
  const timeRemaining = wishlistOpensAt
    ? Math.max(wishlistOpensAt - currentTime, 0)
    : 0;

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  const canSeeFriends = canSubmitWishlists || isMatched;

  return (
    <section className="secret-santa-home">
      {!canSubmitWishlists && !isMatched && wishlistOpensAt && (
        <div className="secret-santa-countdown">
          <p className="eyebrow">SECRET SANTA 2026</p>

          <h2>Wishlists will be open in...</h2>

          <div className="countdown-timer">
            <span>{days}d</span>
            <span>{hours}h</span>
            <span>{minutes}m</span>
            <span>{seconds}s</span>
          </div>
        </div>
      )}

      {isMatched && (
        <div className="secret-santa-matched-message">
          <p className="eyebrow">SECRET SANTA</p>

          <h2>The assignments are in!</h2>

          <p>
            The wishlists are in and the Secret Santa assignments have been
            finalized.
          </p>
        </div>
      )}

      <div className="secret-santa-actions">
        {canSubmitWishlists && (
          <>
            <button type="button" onClick={onAdd}>
              Add your wishlist
            </button>

            <button type="button" onClick={onEdit}>
              Edit your wishlist
            </button>
          </>
        )}

        {canSeeFriends && (
          <button type="button" onClick={onFriends}>
            See what your friends wished for...
          </button>
        )}
      </div>
    </section>
  );
}

export default SecretSantaHome;
