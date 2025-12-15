const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issueId: {
        type: String,
        unique: true,
    },
    reporterName: String,
    email: String,
    issueType: String,
    subject: String,
    description: String,
    issueImage: {
        data: Buffer,
        contentType: String
    },
    urgencyLevel: String,
    address: String,
    status: {
        type: String,
        enum: ['New', 'Under Review', 'In Progress', 'Resolved'],
        default: 'New'
    },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate a unique issueId
issueSchema.pre('save', async function(next) {
    if (this.isNew) {
        let uniqueId = false;
        let generatedId;
        while (!uniqueId) {
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            generatedId = `CC${randomNum}`;
            const existingIssue = await this.constructor.findOne({ issueId: generatedId });
            if (!existingIssue) {
                uniqueId = true;
            }
        }
        this.issueId = generatedId;
    }
    next();
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
