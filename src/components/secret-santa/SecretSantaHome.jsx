function SecretSantaHome({
  onAdd,
  onEdit,
  onFriends,
  campaignStatus,
  wishlistOpensAt,
  currentTime,
  canSubmitWishlists,
  assignmentsHaveBeenRevealed,
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
    <h2>
  Do you know what you want for this Christmas?
  <br />
  You only have so much time to decide...
</h2>

    <div className="countdown-timer">
      <div className="countdown-unit">
        <span className="countdown-number">
          {String(days).padStart(2, "0")}
        </span>
        <span className="countdown-label">Days</span>
      </div>

      <div className="countdown-separator">:</div>

      <div className="countdown-unit">
        <span className="countdown-number">
          {String(hours).padStart(2, "0")}
        </span>
        <span className="countdown-label">Hours</span>
      </div>

      <div className="countdown-separator">:</div>

      <div className="countdown-unit">
        <span className="countdown-number">
          {String(minutes).padStart(2, "0")}
        </span>
        <span className="countdown-label">Minutes</span>
      </div>

      <div className="countdown-separator">:</div>

      <div className="countdown-unit">
        <span className="countdown-number">
          {String(seconds).padStart(2, "0")}
        </span>
        <span className="countdown-label">Seconds</span>
      </div>
    </div>
  </div>
)}
      {isMatched && (
        <div className="secret-santa-matched-message">
          <p className="eyebrow">SECRET SANTA</p>

          <h2>The assignments are in!</h2>

          {assignmentsHaveBeenRevealed ? (
            <p>Your Secret Santa pairing is ready to be revealed! 🎁</p>
          ) : (
            <p>
              Your Secret Santa buddy has been chosen. You'll find out who they
              are in a day or so...
            </p>
          )}
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
