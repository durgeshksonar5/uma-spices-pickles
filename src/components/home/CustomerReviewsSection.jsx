import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { TestimonialCard } from './TestimonialCard';

export const CustomerReviewsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Meenakshi Sundaram",
      location: "Chennai, Tamil Nadu",
      rating: 5,
      review: "The Salem Turmeric and Traditional Mango Pickle taste exactly like what my mother used to prepare at home. The WhatsApp ordering was super fast!",
      initials: "MS"
    },
    {
      id: 2,
      name: "Rajesh Kulkarni",
      location: "Pune, Maharashtra",
      rating: 5,
      review: "Goda Masala and Garam Masala quality is unmatched. You can immediately smell the fresh essential oils when you open the jar. Highly recommended!",
      initials: "RK"
    },
    {
      id: 3,
      name: "Pooja Sharma",
      location: "New Delhi",
      rating: 5,
      review: "Stuffed Green Chilli Pickle is addictive! Perfectly spicy and tangy without being overly salty. Packaging was completely leakproof with inner foil seal.",
      initials: "PS"
    },
    {
      id: 4,
      name: "Vikramjit Singh",
      location: "Chandigarh",
      rating: 5,
      review: "Ordered the 4-pack Flavour Box for festival gifting. All my family members loved the taste of Kashmiri Red Chilli and Tangy Lemon Pickle.",
      initials: "VS"
    }
  ];

  return (
    <section className="py-16 bg-[#FFFBF5] border-b border-[#E8DDCF]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Real Feedback"
          title="What Our Customers Say"
          subtitle="Over 5,000+ happy households enjoy Gajanan Pure & Homemade Services every day."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
};
