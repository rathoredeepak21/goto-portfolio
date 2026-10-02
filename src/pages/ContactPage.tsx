import React, { useState } from 'react';
import { WebsiteContent, SocialLink } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { SocialIcon } from '../components/SocialIcons';

interface ContactPageProps {
  content: WebsiteContent['contact'];
  socialLinks: SocialLink[];
  onSendMessage: (name: string, email: string, message: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  content,
  socialLinks,
  onSendMessage,
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSendMessage(formData.name, formData.email, formData.message);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };


  return (
    <div className="contact-page-view section-spacing">
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="section-header">
          <span className="section-badge">
            <Sparkles size={14} />
            <span>Connect</span>
          </span>
          <h1 className="section-title">{content.heading || 'Get In Touch'}</h1>
          <p className="section-subtitle gradient-text-cyan-purple" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            {content.subheading || "Let's Work Together"}
          </p>
        </div>

        {/* Two-Column Grid matching Panel 7 */}
        <div className="contact-grid">
          {/* Left Column: Contact Info & Socials */}
          <div className="contact-info-col neon-card">
            <p className="contact-intro">{content.description}</p>

            <div className="contact-details-list">
              <div className="contact-info-row">
                <div className="info-icon-bubble">
                  <Mail size={20} color="#38bdf8" />
                </div>
                <div className="info-texts">
                  <span className="info-lbl">Email</span>
                  <a href={`mailto:${content.email}`} className="info-val">
                    {content.email}
                  </a>
                </div>
              </div>

              {content.phone && (
                <div className="contact-info-row">
                  <div className="info-icon-bubble">
                    <Phone size={20} color="#10b981" />
                  </div>
                  <div className="info-texts">
                    <span className="info-lbl">Phone</span>
                    <a href={`tel:${content.phone}`} className="info-val">
                      {content.phone}
                    </a>
                  </div>
                </div>
              )}

              {content.location && (
                <div className="contact-info-row">
                  <div className="info-icon-bubble">
                    <MapPin size={20} color="#ec4899" />
                  </div>
                  <div className="info-texts">
                    <span className="info-lbl">Location</span>
                    <span className="info-val">{content.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="contact-social-row">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="contact-social-btn"
                  title={s.label}
                  aria-label={s.label}
                >
                  <SocialIcon name={s.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="contact-form-col neon-card">
            <h2 className="form-card-title">Send Message</h2>

            {submitted ? (
              <div className="success-banner">
                <CheckCircle2 size={32} color="#10b981" />
                <div>
                  <h4>Thank You!</h4>
                  <p>Your message has been sent successfully. I will get back to you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-field">
                  <label htmlFor="contact-name" className="field-label">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-email" className="field-label">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="field-label">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Describe your project, app idea, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary submit-btn"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2.5rem;
          align-items: flex-start;
        }

        .contact-info-col,
        .contact-form-col {
          padding: 2.5rem;
          border-radius: var(--radius-lg);
        }

        .contact-intro {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin-bottom: 2.25rem;
        }

        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .contact-info-row {
          display: flex;
          align-items: center;
          gap: 1.1rem;
        }

        .info-icon-bubble {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-texts {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .info-lbl {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          font-weight: 600;
        }

        .info-val {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-main);
          transition: color var(--transition-fast);
        }

        .info-val:hover {
          color: var(--neon-cyan);
        }

        .contact-social-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-subtle);
        }

        .contact-social-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .contact-social-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.12);
          transform: translateY(-3px);
          box-shadow: var(--glow-cyan);
        }

        /* Form Column */
        .form-card-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: var(--text-main);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .field-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .form-input,
        .form-textarea {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1.1rem;
          color: var(--text-main);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--neon-cyan);
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
        }

        .submit-btn {
          width: 100%;
          padding: 0.95rem;
          font-size: 1.05rem;
          margin-top: 0.75rem;
        }

        .success-banner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-md);
          color: #ffffff;
        }

        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
