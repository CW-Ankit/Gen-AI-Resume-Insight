import mongoose from 'mongoose';

const rubricSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    weights: {
        coreTechnical: { type: Number, default: 0.4 },
        experience: { type: Number, default: 0.3 },
        preferredSkills: { type: Number, default: 0.2 },
        softSkills: { type: Number, default: 0.1 }
    },
    goldStandardKeywords: [String],
    description: String,
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Rubric = mongoose.model('Rubric', rubricSchema);
export default Rubric;
