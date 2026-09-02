import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./AdminManager.css";

function AdminSecretSanta() {
  const [campaign, setCampaign] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [finalizing, setFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState("");

  useEffect(() => {
    fetchSecretSanta();
  }, []);

  async function handleFinalizeAssignments() {
    if (!campaign) return;

    const confirmed = window.confirm(
      "Are you sure you want to finalize the assignments? " +
        "Participants will no longer be able to edit their wishlists, " +
        "and assignments can no longer be changed.",
    );

    if (!confirmed) return;

    setFinalizing(true);
    setFinalizeError("");

    const { error } = await supabase.rpc("finalize_secret_santa_assignments", {
      campaign_uuid: campaign.id,
    });

    if (error) {
      console.error("Error finalizing Secret Santa assignments:", error);

      setFinalizeError(error.message || "Could not finalize assignments.");

      setFinalizing(false);
      return;
    }

    // Update the UI immediately.
    setCampaign((current) => ({
      ...current,
      status: "matched",
    }));

    setFinalizing(false);
  }

  async function handleAssignmentChange(giverId, recipientId) {
    if (!campaign) return;

    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("secret_santa_entries")
      .update({
        assigned_to_entry_id: recipientId || null,
      })
      .eq("id", giverId)
      .eq("campaign_id", campaign.id);

    if (error) {
      console.error("Error saving assignment:", error);
      setError(error.message || "Could not save assignment.");
      setSaving(false);
      return;
    }

    setAssignments((current) =>
      current.map((assignment) => {
        if (assignment.id !== giverId) {
          return assignment;
        }

        const recipient = current.find(
          (candidate) => candidate.id === recipientId,
        );

        return {
          ...assignment,
          assignedTo: recipient?.character || null,
        };
      }),
    );

    setSaving(false);
  }

  async function fetchSecretSanta() {
    setLoading(true);
    // Fetch the latest Secret Santa campaign
    const { data: campaignData, error: campaignError } = await supabase
      .from("secret_santa_campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (campaignError) {
      console.error("Error fetching Secret Santa campaign:", campaignError);
      setLoading(false);
      return;
    }

    setCampaign(campaignData);
    // Fetch all participants
    const { data: entriesData, error: entriesError } = await supabase
      .from("secret_santa_entries")
      .select(
        `
          id,
          character_id,
          assigned_to_entry_id,
          wishlist_1,
          wishlist_2,
          wishlist_3,
          email,
          character:secret_santa_characters!secret_santa_entries_character_id_fkey (
            id,
            name,
            image,
            phrase
          )
        `,
      )
      .eq("campaign_id", campaignData.id)
      .order("created_at", { ascending: true });
    if (entriesError) {
      console.error("Error fetching Secret Santa entries:", entriesError);
      setLoading(false);
      return;
    }
    // Get the entries that participants have been assigned to
    const assignedEntryIds = entriesData
      .map((entry) => entry.assigned_to_entry_id)
      .filter(Boolean);
    let assignedEntries = [];
    if (assignedEntryIds.length > 0) {
      const { data, error } = await supabase
        .from("secret_santa_entries")
        .select(
          `
          id,
          character:secret_santa_characters!secret_santa_entries_character_id_fkey (
            id,
            name,
            image,
            phrase
          )
        `,
        )
        .in("id", assignedEntryIds);
      if (error) {
        console.error("Error fetching assigned entries:", error);
      } else {
        assignedEntries = data || [];
      }
    }
    const assignedMap = new Map(
      assignedEntries.map((entry) => [entry.id, entry.character]),
    );
    const formattedAssignments = entriesData.map((entry) => ({
      id: entry.id,
      character: entry.character,
      assignedTo: assignedMap.get(entry.assigned_to_entry_id) || null,
      email: entry.email,
      wishlist_1: entry.wishlist_1,
      wishlist_2: entry.wishlist_2,
      wishlist_3: entry.wishlist_3,
    }));
    setAssignments(formattedAssignments);
    setLoading(false);
  }

  const assignedCount = assignments.filter(
    (assignment) => assignment.assignedTo,
  ).length;

  function isRecipientTaken(recipientId, giverId) {
    return assignments.some(
      (assignment) =>
        assignment.id !== giverId &&
        assignment.assignedTo &&
        assignment.assignedTo.id === recipientId,
    );
  }

  return (
    <main className="admin-manager">
      <header className="admin-manager-header">
        <div>
          <p className="eyebrow">ADMIN / SECRET SANTA</p>
          <h1>{campaign?.name || "Secret Santa"}</h1>
          <p>Manage participants and Secret Santa assignments.</p>
        </div>

        <Link to="/admin" className="admin-back">
          ← Dashboard
        </Link>
      </header>

      {loading ? (
        <div className="admin-status">Loading Secret Santa...</div>
      ) : !campaign ? (
        <div className="admin-status">No Secret Santa campaign found.</div>
      ) : (
        <>
          {/* SUMMARY */}
          <section className="admin-form-card">
            <div className="secret-santa-admin-summary">
              <div>
                <p className="eyebrow">STATUS</p>
                <strong>{campaign.status}</strong>
              </div>

              <div>
                <p className="eyebrow">PARTICIPANTS</p>
                <strong>{assignments.length}</strong>
              </div>

              <div>
                <p className="eyebrow">ASSIGNMENTS</p>
                <strong>
                  {assignedCount} / {assignments.length}
                </strong>
              </div>
            </div>

            {campaign.status === "open" && (
              <div className="secret-santa-admin-finalize">
                <button
                  className="admin-primary-button"
                  type="button"
                  onClick={handleFinalizeAssignments}
                  disabled={
                    finalizing ||
                    assignments.length < 2 ||
                    assignedCount !== assignments.length
                  }
                >
                  {finalizing ? "Finalizing..." : "Finalize Assignments"}
                </button>

                {finalizeError && (
                  <p className="admin-error">{finalizeError}</p>
                )}
              </div>
            )}
          </section>

          {/* ASSIGNMENTS */}
          <section className="admin-list">
            <div className="admin-list-header">
              <h2>Assignments</h2>
              <span className="admin-list-count">
                {assignments.length} participants
              </span>
            </div>

            {assignments.length === 0 ? (
              <div className="admin-status">No participants yet.</div>
            ) : (
              assignments.map((assignment) => {
                const currentRecipientId =
                  assignments.find(
                    (candidate) =>
                      candidate.character?.id === assignment.assignedTo?.id,
                  )?.id || "";

                return (
                  <article className="admin-item" key={assignment.id}>
                    <div className="admin-item-main">
                      <h3>
                        {assignment.character?.name || "Unknown character"}
                      </h3>

                      <div className="secret-santa-admin-wishlist">
                        <p>
                          <strong>Wishlist:</strong>
                        </p>

                        {assignment.wishlist_1 && (
                          <p>• {assignment.wishlist_1}</p>
                        )}

                        {assignment.wishlist_2 && (
                          <p>• {assignment.wishlist_2}</p>
                        )}

                        {assignment.wishlist_3 && (
                          <p>• {assignment.wishlist_3}</p>
                        )}
                      </div>
                    </div>

                    <div className="admin-item-actions">
                      <label>
                        Assigned to
                        <select
                          value={
                            assignments.find(
                              (candidate) =>
                                candidate.character?.id ===
                                assignment.assignedTo?.id,
                            )?.id || ""
                          }
                          onChange={(event) =>
                            handleAssignmentChange(
                              assignment.id,
                              event.target.value,
                            )
                          }
                          disabled={campaign.status !== "open"}
                        >
                          <option value="">Select recipient</option>

                          {assignments.map((candidate) => {
                            const isSelf = candidate.id === assignment.id;

                            const isTaken =
                              candidate.id !== assignment.id &&
                              assignments.some(
                                (otherAssignment) =>
                                  otherAssignment.id !== assignment.id &&
                                  otherAssignment.assignedTo?.id ===
                                    candidate.character?.id,
                              );

                            return (
                              <option
                                key={candidate.id}
                                value={candidate.id}
                                disabled={isSelf || isTaken}
                              >
                                {candidate.character?.name}
                                {isSelf ? " (yourself)" : ""}
                                {isTaken ? " (already assigned)" : ""}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default AdminSecretSanta;
