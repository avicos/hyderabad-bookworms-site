function SecretSantaHome({ onAdd, onEdit, onFriends }) {
  return (
    <section className="secret-santa-home">
      <div className="secret-santa-actions">
        <button type="button" onClick={onAdd}>
          Add your wishlist
        </button>

        <button type="button" onClick={onEdit}>
          Edit your wishlist
        </button>

        <button type="button" onClick={onFriends}>
          See what your friends have added
        </button>
      </div>
    </section>
  );
}

export default SecretSantaHome;