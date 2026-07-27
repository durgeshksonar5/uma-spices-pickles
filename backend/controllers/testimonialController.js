import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, '../data/db.json');

const DEFAULT_TESTIMONIALS = [
  {
    _id: "testi-1",
    name: "Meenakshi Sundaram",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    review: "The Salem Turmeric and Traditional Mango Pickle taste exactly like what my mother used to prepare at home. The WhatsApp ordering was super fast!",
    initials: "MS",
    createdAt: new Date().toISOString()
  },
  {
    _id: "testi-2",
    name: "Rajesh Kulkarni",
    location: "Pune, Maharashtra",
    rating: 5,
    review: "Goda Masala and Garam Masala quality is unmatched. You can immediately smell the fresh essential oils when you open the jar. Highly recommended!",
    initials: "RK",
    createdAt: new Date().toISOString()
  },
  {
    _id: "testi-3",
    name: "Pooja Sharma",
    location: "New Delhi",
    rating: 5,
    review: "Stuffed Green Chilli Pickle is addictive! Perfectly spicy and tangy without being overly salty. Packaging was completely leakproof with inner foil seal.",
    initials: "PS",
    createdAt: new Date().toISOString()
  },
  {
    _id: "testi-4",
    name: "Vikramjit Singh",
    location: "Chandigarh",
    rating: 5,
    review: "Ordered the 4-pack Flavour Box for festival gifting. All my family members loved the taste of Kashmiri Red Chilli and Tangy Lemon Pickle.",
    initials: "VS",
    createdAt: new Date().toISOString()
  }
];

const getJsonDB = () => {
  if (fs.existsSync(dbJsonPath)) {
    try {
      const data = fs.readFileSync(dbJsonPath, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.testimonials || parsed.testimonials.length === 0) {
        parsed.testimonials = DEFAULT_TESTIMONIALS;
      }
      return parsed;
    } catch (e) {}
  }
  return { testimonials: DEFAULT_TESTIMONIALS };
};

const saveJsonDB = (data) => {
  try {
    fs.writeFileSync(dbJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
};

// GET /api/testimonials
export const getTestimonials = async (req, res, next) => {
  try {
    const db = getJsonDB();
    return res.status(200).json({
      success: true,
      data: db.testimonials || DEFAULT_TESTIMONIALS
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/testimonials
export const createTestimonial = async (req, res, next) => {
  try {
    const { name, location, rating, review } = req.body;
    if (!name || !review) {
      return res.status(400).json({ success: false, message: 'Name and review text are required' });
    }

    const db = getJsonDB();
    if (!db.testimonials) db.testimonials = [];

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newTestimonial = {
      _id: `testi-${Date.now()}`,
      name,
      location: location || 'Verified Customer',
      rating: Number(rating) || 5,
      review,
      initials: initials || 'VC',
      createdAt: new Date().toISOString()
    };

    db.testimonials.unshift(newTestimonial);
    saveJsonDB(db);

    return res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      data: newTestimonial
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/testimonials/:id
export const updateTestimonial = async (req, res, next) => {
  try {
    const { name, location, rating, review } = req.body;
    const db = getJsonDB();

    const index = db.testimonials.findIndex((t) => (t._id || t.id) === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const current = db.testimonials[index];
    const initials = name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : current.initials;

    const updated = {
      ...current,
      name: name || current.name,
      location: location || current.location,
      rating: rating ? Number(rating) : current.rating,
      review: review || current.review,
      initials,
      updatedAt: new Date().toISOString()
    };

    db.testimonials[index] = updated;
    saveJsonDB(db);

    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/testimonials/:id
export const deleteTestimonial = async (req, res, next) => {
  try {
    const db = getJsonDB();
    db.testimonials = db.testimonials.filter((t) => (t._id || t.id) !== req.params.id);
    saveJsonDB(db);

    return res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
