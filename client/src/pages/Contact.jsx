import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const { showToast } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message details are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await API.post('/enquiries', formData);
      showToast('Enquiry message sent successfully! We will contact you soon.', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      showToast('Failed to submit enquiry. Please check connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Get in Touch</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Have queries about fees, syllabus structure, or admission schedules? Ask our expert counselors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info and Map */}
        <div className="space-y-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Apex Academy Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span>102, Academic Plaza, Knowledge Park, New Delhi, India</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                <Clock className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM <br /> Sunday: Closed</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <span>info@apexacademy.edu</span>
              </div>
            </div>
          </div>

          {/* Embedded Map Stub */}
          <div className="h-64 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-900">
            {/* Embedded Google Maps link or premium visual stub */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112117.92543977553!2d77.12781488107914!3d28.580662709230554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0xd57ab34954497e68!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              className="w-full h-full border-none opacity-85 dark:invert dark:opacity-75"
              allowFullScreen=""
              loading="lazy"
              title="Location map"
            ></iframe>
          </div>

        </div>

        {/* Enquiry Contact Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <MessageSquare className="w-5 h-5" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send counselor enquiry</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                placeholder="John Doe"
              />
              {errors.name && <span className="text-xs font-semibold text-rose-500">{errors.name}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                  placeholder="name@example.com"
                />
                {errors.email && <span className="text-xs font-semibold text-rose-500">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                  placeholder="9876543210"
                />
                {errors.phone && <span className="text-xs font-semibold text-rose-500">{errors.phone}</span>}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">How can we help you?</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-slate-950 dark:text-white"
                placeholder="Ask about batch timings, fee installments, scholarship syllabus, or program selection..."
              ></textarea>
              {errors.message && <span className="text-xs font-semibold text-rose-500">{errors.message}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Sending enquiry...' : 'Submit Enquiry'}</span>
              <Send className="w-4 h-4" />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
