import React, { ReactElement, useEffect } from "react";
import PageWrapper from "../../components/page-wrapper";
import "./terms-conditions.scss";

const TermsConditions = (): ReactElement => {
  useEffect(() => {
    document.title = "Terms & Conditions | CheckYourPitch";
    // Update meta description for this page
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Read CheckYourPitch's Terms & Conditions. Learn about the rules and guidelines for using our free pitch training games and educational content."
      );
    }
  }, []);

  return (
    <PageWrapper withBackButton>
      <div className="terms-conditions-page">
        <div className="container">
          <h1>Terms & Conditions</h1>

          <section className="terms-section">
            <h2>Welcome to CheckYourPitch</h2>
            <p>
              These Terms & Conditions (&quot;T&C&quot;) govern your use of CheckYourPitch.com (the &quot;Website&quot;
              or &quot;Service&quot;) operated by CheckYourPitch (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>
            <p>
              By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of
              these terms, then you may not access the Service.
            </p>
          </section>

          <section className="terms-section">
            <h2>Acceptance of Terms</h2>
            <p>
              By using this website, you certify that you are at least 13 years of age. If you are under 18, you confirm
              that you have your parent&#39;s or guardian&#39;s permission to use this website.
            </p>
          </section>

          <section className="terms-section">
            <h2>Description of Service</h2>
            <p>CheckYourPitch provides:</p>
            <ul>
              <li>Free online pitch training games and exercises</li>
              <li>Educational content about music theory and ear training</li>
              <li>Interactive tools for improving musical abilities</li>
              <li>Blog content related to music education</li>
            </ul>
            <p>Our services are provided free of charge and are supported by advertising through Google AdSense.</p>
          </section>

          <section className="terms-section">
            <h2>Acceptable Use</h2>
            <p>You agree to use our website for lawful purposes only. You agree NOT to:</p>
            <ul>
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Use any automated systems or software to extract data from our website</li>
              <li>Interfere with or disrupt the website&#39;s functionality</li>
              <li>Upload or transmit malicious code, viruses, or other harmful content</li>
              <li>Use the website for commercial purposes without our written permission</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>Intellectual Property Rights</h2>
            <p>
              The content, features, and functionality of CheckYourPitch, including but not limited to text, graphics,
              logos, audio content, games, and software, are owned by CheckYourPitch and are protected by copyright,
              trademark, and other intellectual property laws.
            </p>
            <p>
              You may use our website for personal, non-commercial purposes. You may not reproduce, distribute, modify,
              or create derivative works without our express written permission.
            </p>
          </section>

          <section className="terms-section">
            <h2>User-Generated Content</h2>
            <p>
              While using our pitch detection games, audio may be processed locally in your browser. We do not store or
              retain any audio recordings you make while using our services.
            </p>
            <p>
              Any feedback, suggestions, or ideas you provide to us become our property and may be used to improve our
              services without compensation to you.
            </p>
          </section>

          <section className="terms-section">
            <h2>Privacy and Data Collection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
              website, to understand our practices regarding your personal information.
            </p>
            <p>
              We use Google Analytics and Google AdSense, which may collect anonymous usage data and serve personalized
              advertisements based on your browsing behavior.
            </p>
          </section>

          <section className="terms-section">
            <h2>Disclaimers</h2>
            <p>
              Our website and services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make
              no warranties, expressed or implied, regarding:
            </p>
            <ul>
              <li>The accuracy or reliability of our content</li>
              <li>The uninterrupted or error-free operation of our website</li>
              <li>The results you may achieve from using our training exercises</li>
              <li>The compatibility with all devices or browsers</li>
            </ul>
            <p>
              Musical training results vary by individual. Our games and exercises are educational tools and should not
              replace professional music instruction.
            </p>
          </section>

          <section className="terms-section">
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, CheckYourPitch shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not limited to loss of profits, data, or other
              intangible losses.
            </p>
            <p>
              Our total liability to you for any claims related to the website shall not exceed the amount you paid us
              (which is $0 for our free services).
            </p>
          </section>

          <section className="terms-section">
            <h2>Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services (such as Google services) that are not
              owned or controlled by CheckYourPitch. We are not responsible for the content, privacy policies, or
              practices of third-party websites.
            </p>
          </section>

          <section className="terms-section">
            <h2>Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting
              to this page. Your continued use of the website after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>Termination</h2>
            <p>
              We may terminate or suspend your access to our website immediately, without prior notice, if you breach
              these Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with applicable laws. Any disputes shall be
              resolved in the appropriate courts.
            </p>
          </section>

          <section className="terms-section">
            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:{" "}
              <a href="mailto:checkyourpitch@gmail.com">checkyourpitch@gmail.com</a>
            </p>
          </section>

          <div className="last-updated">
            <p>
              <em>Last updated: November 9, 2024</em>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TermsConditions;
