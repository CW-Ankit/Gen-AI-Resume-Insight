import mongoose from 'mongoose';
import config from './src/config/config.js';
import Rubric from './src/models/rubricModel.js';

async function seedRubrics() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        const initialRubrics = [
            {
                category: 'Full-Stack Developer',
                weights: {
                    coreTechnical: 0.4,
                    experience: 0.3,
                    preferredSkills: 0.2,
                    softSkills: 0.1
                },
                goldStandardKeywords: ['TypeScript', 'React', 'Node.js', 'Microservices', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB'],
                description: 'Standard rubric for Senior Full-Stack roles'
            },
            {
                category: 'Frontend Developer',
                weights: {
                    coreTechnical: 0.5,
                    experience: 0.2,
                    preferredSkills: 0.2,
                    softSkills: 0.1
                },
                goldStandardKeywords: ['Next.js', 'Tailwind CSS', 'TypeScript', 'State Management', 'Web Vitals', 'Accessibility'],
                description: 'Frontend specialized rubric'
            },
            {
                category: 'Backend Developer',
                weights: {
                    coreTechnical: 0.5,
                    experience: 0.2,
                    preferredSkills: 0.2,
                    softSkills: 0.1
                },
                goldStandardKeywords: ['Distributed Systems', 'Redis', 'Kafka', 'gRPC', 'SQL Optimization', 'Security Best Practices'],
                description: 'Backend specialized rubric'
            },
            {
                category: 'Default',
                weights: {
                    coreTechnical: 0.4,
                    experience: 0.3,
                    preferredSkills: 0.2,
                    softSkills: 0.1
                },
                goldStandardKeywords: ['Communication', 'Problem Solving', 'Technical Proficiency'],
                description: 'Fallback rubric for unknown roles'
            }
        ];

        for (const rubric of initialRubrics) {
            await Rubric.findOneAndUpdate(
                { category: rubric.category },
                rubric,
                { upsert: true, new: true }
            );
        }

        console.log("Successfully seeded rubrics!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seedRubrics();
