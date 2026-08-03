import React, { useState, useEffect, useRef } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { TestimonialCard } from './TestimonialCard';
import { testimonialApi } from '../../api/testimonialApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CustomerReviewsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      setIsLoading(true);
      try {
        const res = await testimonialApi.getTestimonials();
        if (res?.success && Array.isArray(res.data)) {
          setTestimonials(res.data);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-[#FFFBF5] border-b border-[#E8DDCF]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-center sm:text-left flex-grow">
            <SectionHeading
              badge="Real Feedback"
              title="What Our Customers Say"
              subtitle="Over 5,000+ happy households enjoy Gajanan Pure & Homemade Services every day."
            />
          </div>

          {/* Slider Navigation Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={scrollLeft}
              className="p-3 rounded-full bg-white border border-[#E8DDCF] text-[#5E3718] hover:bg-[#9A6428] hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={scrollRight}
              className="p-3 rounded-full bg-white border border-[#E8DDCF] text-[#5E3718] hover:bg-[#9A6428] hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Smooth Scroll Slider Container */}
        {isLoading ? (
          <div className="flex items-center gap-6 overflow-hidden py-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-80 h-56 shrink-0 bg-[#F9EFDD]/50 rounded-3xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-xs text-[#777166]">No customer reviews currently available.</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex items-stretch gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t) => (
              <div
                key={t._id || t.id}
                className="w-[290px] sm:w-[320px] lg:w-[340px] shrink-0 snap-start"
              >
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
