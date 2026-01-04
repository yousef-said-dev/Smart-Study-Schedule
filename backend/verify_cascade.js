import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Subject from './models/Subject.js';
import StudySession from './models/StudySession.js';
import { deleteSubject } from './controllers/subjectController.js';

dotenv.config();

const verifyCascade = async () => {
    try {
        console.log('🔌 Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        // 1. Create Test User
        console.log('👤 Creating test user...');
        const user = await User.create({
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        });
        console.log(`✅ User created: ${user._id}`);

        // 2. Create Test Subject
        console.log('📚 Creating test subject...');
        const subject = await Subject.create({
            userId: user._id,
            name: 'Test Subject',
            difficulty: 3,
            totalHours: 10,
            examDate: new Date(Date.now() + 86400000) // Tomorrow
        });
        console.log(`✅ Subject created: ${subject._id}`);

        // 3. Create Test Session
        console.log('📝 Creating test session...');
        const session = await StudySession.create({
            userId: user._id,
            subjectId: subject._id,
            scheduleId: new mongoose.Types.ObjectId(), // Dummy schedule ID
            title: 'Test Session',
            date: new Date(),
            duration: 1
        });
        console.log(`✅ Session created: ${session._id}`);

        // 4. Verify Session Exists
        const sessionCheck1 = await StudySession.findById(session._id);
        if (!sessionCheck1) throw new Error('Session creation failed');
        console.log('✅ Session exists in DB.');

        // 5. Delete Subject (Simulate Controller Action)
        console.log('🗑️ Deleting subject...');
        // We need to mock req and res for the controller
        const req = {
            params: { id: subject._id },
            user: { _id: user._id }
        };
        const res = {
            status: (code) => ({
                json: (data) => {
                    console.log(`Response Status: ${code}`);
                    // console.log('Response Data:', data);
                }
            })
        };
        const next = (err) => console.error('Next called with error:', err);

        await deleteSubject(req, res, next);

        // 6. Verify Cascade Delete
        console.log('🔍 Verifying cascade delete...');
        const sessionCheck2 = await StudySession.findById(session._id);
        if (sessionCheck2) {
            console.error('❌ Session still exists! Cascade delete FAILED.');
        } else {
            console.log('✅ Session deleted! Cascade delete SUCCESS.');
        }

        const subjectCheck = await Subject.findById(subject._id);
        if (subjectCheck) {
            console.error('❌ Subject still exists! Delete FAILED.');
        } else {
            console.log('✅ Subject deleted.');
        }

        // Cleanup User
        await User.findByIdAndDelete(user._id);
        console.log('🧹 Cleanup complete.');

    } catch (error) {
        console.error('❌ Verification failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

verifyCascade();
