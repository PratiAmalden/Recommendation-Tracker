import { useEffect, useState } from "react";

export default function ShareRecommendation({ itemName, onCreateShare, onClose }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true; // Tracks if component is still mounted

    const generateLink = async () => {
        try{
            const url = await onCreateShare();
            if (active) setShareUrl(url)
        } catch (shareError) {
            if (active) setError(shareError.message || "Could not create share link.");
        } finally {
            if (active) setLoading(false)
        }
    }

    generateLink();

    return () => {
      active = false;
    };
  }, [onCreateShare]);

  // Copy the generated link to the user's clipboard
  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  // Safe URL encoding for social media and email links
  const encodedText = encodeURIComponent(`Check out this recommendation: ${itemName}`);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="w-full max-w-md rounded-lg border border-primary bg-neutral p-6 text-base-content shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <h2 id="share-title" className="font-jersey text-3xl text-primary">Share recommendation</h2>
        <p className="mt-4 text-lg font-semibold">{itemName}</p>
        <p className="mt-3 text-sm text-accent">Anyone with this link can view this recommendation.</p>

        {loading && <p className="mt-5 text-sm text-accent" role="status">Creating link...</p>}
        {error && <p className="mt-5 text-sm text-error" role="alert">{error}</p>}
        {shareUrl && (
          <>
            <p className="mt-5 break-all rounded border border-primary/40 bg-black/30 p-3 text-sm">{shareUrl}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" className="btn btn-primary" onClick={copyLink}>Copy link</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigator.share?.({ title: itemName, url: shareUrl })}>Share</button>
              <a className="btn btn-outline border-primary text-accent" href={`https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noreferrer">Post on X</a>
              <a className="btn btn-outline border-primary text-accent" href={`mailto:?subject=${encodeURIComponent(itemName)}&body=${encodedText}%20${encodedUrl}`}>Email</a>
            </div>
            {copied && <p className="mt-3 text-center text-sm text-success" role="status">Link copied!</p>}
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button type="button" className="btn btn-ghost text-accent" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  );
}