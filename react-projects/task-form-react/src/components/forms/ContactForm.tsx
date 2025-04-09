import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormSchema, contactFormSchema } from '../../types/formTypes';

const ContactForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    },
    mode: 'onChange'
  });

  const onSubmit = (data: ContactFormSchema) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormData(data);
      setIsModalOpen(true);
      setIsSubmitting(false);
      console.log('Form submitted:', data);
    }, 800);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset(); // Reset the form after submission
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2 className="form-title">Get in Touch</h2>
        <p className="form-subtitle">We'd love to hear from you. Fill out the form below.</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name <span className="required-mark">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            {...register('name')}
            className={`form-control ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email <span className="required-mark">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            {...register('email')}
            className={`form-control ${errors.email ? 'error' : ''}`}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone <span className="required-mark">*</span>
          </label>
          <input
            id="phone"
            type="text"
            placeholder="Your phone number"
            {...register('phone')}
            className={`form-control ${errors.phone ? 'error' : ''}`}
          />
          {errors.phone && <p className="error-message">{errors.phone.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message <span className="required-mark">*</span>
          </label>
          <textarea
            id="message"
            placeholder="Your message here..."
            {...register('message')}
            rows={5}
            className={`form-control ${errors.message ? 'error' : ''}`}
          />
          {errors.message && <p className="error-message">{errors.message.message}</p>}
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="form-button"
          >
            {isSubmitting ? (
              <>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </form>

      {formData && isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Thank You!</h3>
              <button className="modal-close" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>
                  Thank you for contacting us, <span style={{ fontWeight: 600, color: 'var(--color-teal-700)' }}>{formData.name}</span>!
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  We've received your message and will get back to you at <span style={{ fontWeight: 600, color: 'var(--color-teal-700)' }}>{formData.email}</span> as soon as possible.
                </p>
                <p style={{ color: 'var(--color-gray-600)' }}>Have a wonderful day!</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="form-button" onClick={closeModal} style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;