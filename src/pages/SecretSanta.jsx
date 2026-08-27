import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

import SecretSantaHome from "../components/secret-santa/SecretSantaHome";
import SecretSantaCharacterPicker from "../components/secret-santa/SecretSantaCharacterPicker";
import SecretSantaWishlistForm from "../components/secret-santa/SecretSantaWishlistForm";
import SecretSantaSuccess from "../components/secret-santa/SecretSantaSuccess";
import SecretSantaFriends from "../components/secret-santa/SecretSantaFriends";

import "./SecretSanta.css";

function SecretSanta() {
  const [campaign, setCampaign] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [claimedCharacterIds, setClaimedCharacterIds] = useState([]);

  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("home");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const [savedEntry, setSavedEntry] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, []);

  async function fetchCampaign() {
    setLoading(true);

    const { data: campaignData, error: campaignError } = await supabase
  .from("secret_santa_campaigns")
  .select("*")
  .eq("slug", "secret-santa-2026")
  .in("status", ["open", "matched"])
  .single();

    if (campaignError) {
      console.error("Error fetching Secret Santa campaign:", campaignError);

      setLoading(false);
      return;
    }

    setCampaign(campaignData);

    await fetchCharacters(campaignData.id);
  }

  async function fetchCharacters(campaignId) {
    const { data: charactersData, error: charactersError } = await supabase
      .from("secret_santa_characters")
      .select("*")
      .order("name", { ascending: true });

    if (charactersError) {
      console.error("Error fetching Secret Santa characters:", charactersError);

      setLoading(false);
      return;
    }

    const { data: entriesData, error: entriesError } = await supabase
      .from("secret_santa_public_entries")
      .select("character_id")
      .eq("campaign_id", campaignId);

    if (entriesError) {
      console.error("Error fetching Secret Santa entries:", entriesError);
    }

    setCharacters(charactersData || []);

    setClaimedCharacterIds(
      (entriesData || []).map((entry) => entry.character_id),
    );

    setLoading(false);
  }

  function startAddingWishlist() {
  if (campaign?.status !== "open") return;

  setSelectedCharacter(null);
  setSavedEntry(null);
  setMode("choose");
}

  function selectCharacter(character) {
    if (claimedCharacterIds.includes(character.id)) {
      return;
    }

    setSelectedCharacter(character);
    setMode("wishlist");
  }

  function handleWishlistSaved(entry) {
    setSavedEntry(entry);

    setClaimedCharacterIds((current) => [...current, entry.character.id]);

    setMode("success");
  }

async function selectEditCharacter(character) {
  if (campaign?.status !== "open") return;

  const { data, error } = await supabase
    .from("secret_santa_public_entries")
    .select("*")
    .eq("campaign_id", campaign.id)
    .eq("character_id", character.id)
    .single();

  if (error) {
    console.error(
      "Error fetching Secret Santa wishlist:",
      error
    );
    return;
  }

  setSelectedCharacter(character);

  setSavedEntry({
    id: data.id,
    character,
    wishlist_1: data.wishlist_1 || "",
    wishlist_2: data.wishlist_2 || "",
    wishlist_3: data.wishlist_3 || "",
  });

  setMode("edit");
}

 function startEditingWishlist() {
  if (campaign?.status !== "open") return;

  setSelectedCharacter(null);
  setSavedEntry(null);
  setMode("edit-choose");
}

  function goHome() {
    setSelectedCharacter(null);
    setSavedEntry(null);
    setMode("home");
  }
 

  return (
    <>
      <Navbar />

      <main className="secret-santa-page">
        <header className="secret-santa-header">
          <p className="eyebrow">HYDERABAD BOOKWORMS</p>

          <h1>Secret Santa</h1>

          <p className="secret-santa-intro">
            Pick a character, make your wishlist, and see what your friends are
            wishing for.
          </p>
        </header>

        {loading ? (
          <p>Loading Secret Santa...</p>
        ) : !campaign ? (
          <p>Secret Santa isn't open right now.</p>
        ) : (
          <>
          {mode === "home" && (
  <SecretSantaHome
    onAdd={
      campaign.status === "open"
        ? startAddingWishlist
        : undefined
    }
    onEdit={
      campaign.status === "open"
        ? startEditingWishlist
        : undefined
    }
    onFriends={() => setMode("friends")}
    campaignStatus={campaign.status}
  />
)}

            {mode === "choose" && (
              <SecretSantaCharacterPicker
                characters={characters}
                claimedCharacterIds={claimedCharacterIds}
                onSelect={selectCharacter}
                onBack={goHome}
              />
            )}
            {mode === "edit-choose" && (
              <SecretSantaCharacterPicker
                characters={characters}
                claimedCharacterIds={claimedCharacterIds}
                mode="edit"
                onSelect={selectEditCharacter}
                onBack={goHome}
              />
            )}

            {mode === "wishlist" && selectedCharacter && (
              <SecretSantaWishlistForm
                campaign={campaign}
                character={selectedCharacter}
                onBack={() => {
                  setSelectedCharacter(null);
                  setMode("choose");
                }}
                onSaved={handleWishlistSaved}
              />
            )}

            {mode === "edit" && selectedCharacter && savedEntry && (
              <SecretSantaWishlistForm
                campaign={campaign}
                character={selectedCharacter}
                existingEntry={savedEntry}
                onBack={() => {
                  setSelectedCharacter(null);
                  setSavedEntry(null);
                  setMode("edit-choose");
                }}
                onSaved={handleWishlistSaved}
              />
            )}

            {mode === "success" && savedEntry && (
              <SecretSantaSuccess
                entryId={savedEntry.entryId}
                character={savedEntry.character}
              />
            )}

            {mode === "friends" && (
              <SecretSantaFriends campaign={campaign} onBack={goHome} />
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default SecretSanta;
