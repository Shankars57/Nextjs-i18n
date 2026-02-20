"use client";
import { useState } from "react";

export default function FeedbackWidget() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    // no backend - persist locally
    const all = JSON.parse(localStorage.getItem("feedback") || "[]");
    all.push({ text, date: new Date().toISOString() });
    localStorage.setItem("feedback", JSON.stringify(all));
    setText("");
    setSent(true);
  }

  return (
    <div className="feedback-widget">
      <label htmlFor="feedback-input" className="feedback-label">
        Feedback
      </label>
      <textarea
        id="feedback-input"
        data-testid="feedback-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="feedback-input"
        placeholder="Share what can be improved..."
      />
      <button data-testid="feedback-submit" onClick={submit} className="feedback-submit-btn">
        Submit
      </button>
      {sent && (
        <div data-testid="feedback-success-message" className="feedback-success">
          Thanks for the feedback!
        </div>
      )}
    </div>
  );
}
