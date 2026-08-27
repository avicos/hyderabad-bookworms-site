function SecretSantaHome({
  onAdd,
  onEdit,
  onFriends,
  campaignStatus,
}) {
  const isOpen = campaignStatus === "open";
  const isMatched = campaignStatus === "matched";

  return (
    <section className="secret-santa-home">
      {isMatched && (
        <div className="secret-santa-matched-message">
          <p className="eyebrow">SECRET SANTA</p>

          <h2>The assignments are in!</h2>

          <p>
            The wishlists are in and the Secret Santa
            assignments have been finalized.
          </p>
        </div>
      )}

      <div className="secret-santa-actions">
        {isOpen && (
          <>
            <button type="button" onClick={onAdd}>
              Add your wishlist
            </button>

            <button type="button" onClick={onEdit}>
              Edit your wishlist
            </button>
          </>
        )}

        <button type="button" onClick={onFriends}>
          See what your friends wished for...
        </button>
      </div>
    </section>
  );
}

export default SecretSantaHome;