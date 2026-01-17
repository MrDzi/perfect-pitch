import React, { ReactElement } from "react";
import { Helmet } from "react-helmet";
import PageWrapper from "../../components/page-wrapper";
import "./privacy-policy.scss";

const PrivacyPolicy = (): ReactElement => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | CheckYourPitch</title>
        <meta
          name="description"
          content="Read CheckYourPitch's privacy policy. Learn how we protect your data while you enjoy our free pitch training games and ear training exercises."
        />
        <meta property="og:title" content="Privacy Policy | CheckYourPitch" />
        <meta
          property="og:description"
          content="Read CheckYourPitch's privacy policy. Learn how we protect your data while you enjoy our free pitch training games and ear training exercises."
        />
      </Helmet>
      <PageWrapper withBackButton>
        <div className="privacy-policy-page">
          <div className="container">
            <h1>Privacy Policy</h1>

            <section className="privacy-section">
              <h2>Introduction</h2>
              <p>
                At CheckYourPitch.com, we respect your privacy and are committed to protecting it. This Privacy Policy
                explains what information we collect when you use our website and games, how we use it, and how we keep
                it secure.
              </p>
              <p>By using this website, you agree to the terms of this Privacy Policy.</p>
            </section>

            <section className="privacy-section">
              <h2>Information We Collect</h2>

              <h3>Audio Data</h3>
              <p>
                When you play some of our Pitch Checker game, your microphone input is processed directly in your
                browser.
              </p>
              <p>
                <strong>We do not upload or store your audio recordings on our servers.</strong>
              </p>

              <h3>Usage Data (Analytics)</h3>
              <p>We use Google Analytics to collect anonymized data about how visitors use our website, such as:</p>
              <ul>
                <li>Pages visited</li>
                <li>Time spent on the site</li>
                <li>Browser and device type</li>
                <li>General geographic region (e.g., country)</li>
              </ul>
              <p>This data helps us improve our games and user experience.</p>
              <p>
                Google Analytics may set cookies in your browser. You can learn more here:{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How Google uses data when you use our sites or apps
                </a>
                .
              </p>

              <h3>Stored Melodies</h3>
              <p>
                We store only the melodies used in our games on our servers. These are not linked to any individual
                user.
              </p>

              <h3>Cookies and Local Storage</h3>
              <p>We use cookies and local browser storage to:</p>
              <ul>
                <li>Remember your game preferences (e.g., settings, progress)</li>
                <li>Improve website functionality</li>
                <li>Support personalized advertising through Google AdSense</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>How We Use Information</h2>
              <p>We use collected information to:</p>
              <ul>
                <li>Provide, maintain, and improve our games and website</li>
                <li>Analyze usage to fix bugs and enhance the user experience</li>
                <li>Display relevant ads through Google AdSense</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>Advertising (Google AdSense)</h2>
              <ul>
                <li>We use Google AdSense to serve ads.</li>
                <li>
                  Google, as a third‑party vendor, uses cookies (including the DoubleClick cookie) to serve ads based on
                  your prior visits to this website or other websites.
                </li>
                <li>
                  You can opt out of personalized advertising by visiting{" "}
                  <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
                    Google Ads Settings
                  </a>
                  .
                </li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>Data Security</h2>
              <p>
                We take reasonable steps to protect your information. Since we do not store personal data or audio
                recordings, the risk is minimal, but we follow industry best practices to keep our servers secure.
              </p>
            </section>

            <section className="privacy-section">
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
                updated &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="privacy-section">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{" "}
                <a href="mailto:checkyourpitch@gmail.com">checkyourpitch@gmail.com</a>
              </p>
            </section>

            <div className="last-updated">
              <p>
                <em>Last updated: July 15, 2025</em>
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default PrivacyPolicy;
