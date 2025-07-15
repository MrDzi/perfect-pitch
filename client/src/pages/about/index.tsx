import React, { ReactElement, useEffect } from "react";
import PageWrapper from "../../components/page-wrapper";
import "./about.scss";

const About = (): ReactElement => {
  useEffect(() => {
    document.title = "About | CheckYourPitch";
    // Update meta description for this page
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn about CheckYourPitch - the free online pitch training platform. Discover our ear training games, music theory tools, and how we help musicians develop their musical ear."
      );
    }
  }, []);
  return (
    <PageWrapper>
      <div className="about-page">
        <div className="container">
          <h1>About Check Your Pitch – and Why Pitch Matters</h1>

          <section className="about-section">
            <h2>What is Voice Pitch and Why Does it Matter?</h2>
            <p>
              Voice pitch refers to how high or low a sound is. In music, pitch is the foundation of melody and harmony
              — it’s what allows us to recognize a song even when played on different instruments. Training your pitch
              perception helps you:
            </p>
            <ul>
              <li>Sing more accurately and confidently</li>
              <li>Tune instruments by ear</li>
              <li>Identify chords, intervals, and melodies more easily</li>
              <li>Develop stronger overall musicality</li>
            </ul>
            <p>
              Whether you’re a singer, instrumentalist, or simply someone who loves music, a sharper sense of pitch
              opens up a whole new level of understanding and enjoyment.
            </p>
          </section>

          <section className="about-section">
            <h2>What is Perfect Pitch?</h2>
            <p>
              Perfect pitch (also called absolute pitch) is the rare ability to identify or reproduce a musical note
              without any reference. While not everyone develops perfect pitch, <strong>relative pitch</strong> — the
              ability to recognize intervals and relationships between notes — can be trained. That’s exactly what{" "}
              <em>Check Your Pitch</em> helps you do through interactive, fun exercises.
            </p>
          </section>

          <section className="about-section">
            <h2>How &quot;Check Your Pitch&quot; Helps</h2>
            <p>Our interactive games are designed to turn ear training into a fun daily habit:</p>
            <ul>
              <li>
                <strong>Listening Game:</strong> Challenge yourself to distinguish subtle pitch differences
              </li>
              <li>
                <strong>Singing Practice:</strong> Use your microphone to practice pitch accuracy with real-time
                feedback
              </li>
              <li>
                <strong>Pitchle:</strong> A daily melody‑guessing game inspired by Wordle
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Who Can Benefit?</h2>
            <p>These exercises aren’t just for professional musicians. They’re great for:</p>
            <ul>
              <li>Beginner singers learning to stay in tune</li>
              <li>Choir members wanting to blend better</li>
              <li>Instrument players tuning by ear</li>
              <li>Anyone curious about improving their musical ear</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>How It Works</h2>
            <p>
              Our application uses audio processing to analyze pitches in real-time. We provide immediate feedback to
              help you develop your musical ear in a fun and interactive way.
            </p>
          </section>

          <section className="about-section">
            <h2>Get Started</h2>
            <p>
              Ready to begin your pitch‑training journey? Head back to the <a href="/">home page</a> and choose a game.
              Remember, developing your ear takes practice and patience — every expert was once a beginner!
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};

export default About;
