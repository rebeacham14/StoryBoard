// middle ware 
// authentication

import express from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
// compress from 'compression';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';

import * as dashDB from './Database/dashElement';
import * as chatDB from './Database/chatElement';

import * as homeDB from './Database/dashElements/homeElements';

import * as gameplayDB from './Database/dashElements/gameplayElements';
import * as loreDB from './Database/dashElements/loreElements';
import * as novelDB from './Database/dashElements/novelElements';
import * as screenplayDB from './Database/dashElements/screenplayElements';
import * as timelineDB from './Database/dashElements/timelineElements';

import * as gameplayChatDB from './Database/chatElements/gameplayChat';
import * as loreChatDB from './Database/chatElements/loreChat';
import * as novelChatDB from './Database/chatElements/novelChat';
import * as screenplayChatDB from './Database/chatElements/screenplayChat';
import * as timelineChatDB from './Database/chatElements/timelineChat';




dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGO_URL: string = process.env.MONGO_URL!;

if (!MONGO_URL) {
  throw new Error('MONGO_URL environment variable is not defined');
}




mongoose.connect(MONGO_URL);
const app = express();

app.use(express.json()); 


app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));



app.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});



// // Chat Routes
// get all chat
app.get('/chat', async (req, res) => {
    try {
        const chatElements = await chatDB.getChatElements();
        res.status(201).json({chatElements});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new chat 
app.post('/chat', async (req, res) => {
    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await chatDB.createChatElement({
                userContent: newElement.userContent,
                aiContent: newElement.aiContent,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid chat item data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// update a chat 
app.put('/chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await chatDB.updateChatElement(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Chat item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a chat
app.delete('/chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await chatDB.deleteChatElement(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Chat item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// // Gameplay-chat Routes
// get all gameplay chat
app.get('/gameplay-chat', async (req, res) => {
    try {
        const gameplayChat = await gameplayChatDB.getGameplayChat();
        res.status(201).json({gameplayChat});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new gameplay chat
app.post('/gameplay-chat', async (req, res) => {
    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await gameplayChatDB.createGameplayChat({
                userContent: newElement.userContent,
                aiContent: newElement.aiContent,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid gameplay chat data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// update a gameplay chat
app.put('/gameplay-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await gameplayChatDB.updateGameplayChat(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Gameplay chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a gameplay chat
app.delete('/gameplay-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await gameplayChatDB.deleteGameplayChat(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Gameplay chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Lore-chat Routes
// get all lore chat
app.get('/lore-chat', async (req, res) => {
    try {
        const loreChat = await loreChatDB.getLoreChat();
        res.status(201).json({loreChat});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new lore chat
app.post('/lore-chat', async (req, res) => {
    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await loreChatDB.createLoreChat({
                userContent: newElement.userContent,
                aiContent: newElement.aiContent,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid lore chat data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// update a lore chat
app.put('/lore-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await loreChatDB.updateLoreChat(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Lore chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a lore chat
app.delete('/lore-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await loreChatDB.deleteLoreChat(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Lore chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Novel-chat Routes
// get all novel chat
app.get('/novel-chat', async (req, res) => {
    try {
        const novelChat = await novelChatDB.getNovelChat();
        res.status(201).json({novelChat});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new novel chat
app.post('/novel-chat', async (req, res) => {
    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await novelChatDB.createNovelChat({
                userContent: newElement.userContent,
                aiContent: newElement.aiContent,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid novel chat data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// update a novel chat
app.put('/novel-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await novelChatDB.updateNovelChat(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Novel chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a novel chat
app.delete('/novel-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await novelChatDB.deleteNovelChat(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Novel chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Screenplay-chat Routes
// get all screenplay chat
app.get('/screenplay-chat', async (req, res) => {
    try {
        const screenplayChat = await screenplayChatDB.getScreenplayChat();
        res.status(201).json({screenplayChat});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new screenplay chat
app.post('/screenplay-chat', async (req, res) => {
    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await screenplayChatDB.createScreenplayChat({
                userContent: newElement.userContent,
                aiContent: newElement.aiContent,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid screenplay chat data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// update a screenplay chat
app.put('/screenplay-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await screenplayChatDB.updateScreenplayChat(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Screenplay chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a screenplay chat
app.delete('/screenplay-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await screenplayChatDB.deleteScreenplayChat(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Screenplay chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Timeline-chat Routes
// get all timeline chat
app.get('/timeline-chat', async (req, res) => {
    try {
        const timelineChat = await timelineChatDB.getTimelineChat();
        res.status(201).json({timelineChat});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new timeline chat
app.post('/timeline-chat', async (req, res) => {
    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await timelineChatDB.createTimelineChat({
                userContent: newElement.userContent,
                aiContent: newElement.aiContent,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid timeline chat data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// update a timeline chat
app.put('/timeline-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await timelineChatDB.updateTimelineChat(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Timeline chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a timeline chat
app.delete('/timeline-chat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await timelineChatDB.deleteTimelineChat(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Timeline chat not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});











// // Dashboard Routes
// get all dahsboard items
app.get('/dashboard', async (req, res) => {
    try {
        const dashElements = await dashDB.getDashElements();
        res.status(201).json({dashElements});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new dashboard item
app.post('/dashboard', async (req, res) => {

    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await dashDB.createDashElement({
                name: newElement.name,
                icon: newElement.icon,
                visible: newElement.visible,
                title: newElement.title,
                data: newElement.data,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid dashboard item data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

// update a dashboard item
app.put('/dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await dashDB.updateDashElement(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Dashboard item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a dashboard item
app.delete('/dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await dashDB.deleteDashElement(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Dashboard item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Home-dashboard Routes
// get all home items
app.get('/home-dashboard', async (req, res) => {
    try {
        const homeElements = await homeDB.getHomeElements();
        res.status(201).json({homeElements});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new home item
app.post('/home-dashboard', async (req, res) => {

    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await homeDB.createHomeElement({
                name: newElement.name,
                icon: newElement.icon,
                visible: newElement.visible,
                title: newElement.title,
                data: newElement.data,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid home item data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

// update a home item
app.put('/home-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await homeDB.updateHomeElement(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Home item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a home item
app.delete('/home-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await homeDB.deleteHomeElement(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Home item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Gameplay-dashboard Routes
// get all gameplay items
app.get('/gameplay-dashboard', async (req, res) => {
    try {
        const gameplayElements = await gameplayDB.getGameplayElements();
        res.status(201).json({gameplayElements});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new gameplay item
app.post('/gameplay-dashboard', async (req, res) => {

    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await gameplayDB.createGameplayElement({
                name: newElement.name,
                icon: newElement.icon,
                visible: newElement.visible,
                title: newElement.title,
                data: newElement.data,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid gameplay item data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

// update a gameplay item
app.put('/gameplay-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await gameplayDB.updateGameplayElement(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Gameplay item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a gameplay item
app.delete('/gameplay-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await gameplayDB.deleteGameplayElement(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Gameplay item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Lore-dashboard Routes
// get all lore items
app.get('/lore-dashboard', async (req, res) => {
    try {
        const loreElements = await loreDB.getLoreElements();
        res.status(201).json({loreElements});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new lore item
app.post('/lore-dashboard', async (req, res) => {

    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await loreDB.createLoreElement({
                name: newElement.name,
                icon: newElement.icon,
                visible: newElement.visible,
                title: newElement.title,
                data: newElement.data,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid lore item data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

// update a lore item
app.put('/lore-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await loreDB.updateLoreElement(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Lore item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a lore item
app.delete('/lore-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await loreDB.deleteLoreElement(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Lore item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Novel-dashboard Routes
// get all novel items
app.get('/novel-dashboard', async (req, res) => {
    try {
        const novelElements = await novelDB.getNovelElements();
        res.status(201).json({novelElements});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new novel item
app.post('/novel-dashboard', async (req, res) => {

    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await novelDB.createNovelElement({
                name: newElement.name,
                icon: newElement.icon,
                visible: newElement.visible,
                title: newElement.title,
                data: newElement.data,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid novel item data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

// update a novel item
app.put('/novel-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await novelDB.updateNovelElement(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Novel item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a novel item
app.delete('/novel-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await novelDB.deleteNovelElement(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Novel item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Screenplay-dashboard Routes
// get all screenplay items
app.get('/screenplay-dashboard', async (req, res) => {
    try {
        const screenplayElements = await screenplayDB.getScreenplayElements();
        res.status(201).json({screenplayElements});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new screenplay item
app.post('/screenplay-dashboard', async (req, res) => {

    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await screenplayDB.createScreenplayElement({
                name: newElement.name,
                icon: newElement.icon,
                visible: newElement.visible,
                title: newElement.title,
                data: newElement.data,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid screenplay item data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

// update a screenplay item
app.put('/screenplay-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await screenplayDB.updateScreenplayElement(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Screenplay item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a screenplay item
app.delete('/screenplay-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await screenplayDB.deleteScreenplayElement(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Screenplay item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// // Timeline-dashboard Routes
// get all timeline items
app.get('/timeline-dashboard', async (req, res) => {
    try {
        const timelineElements = await timelineDB.getTimelineElements();
        res.status(201).json({timelineElements});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// add a new timeline item
app.post('/timeline-dashboard', async (req, res) => {
    try {
        const newElement = req.body; // sanitize

        if (newElement){
            const result = await timelineDB.createTimelineElement({
                name: newElement.name,
                icon: newElement.icon,
                visible: newElement.visible,
                title: newElement.title,
                data: newElement.data,
            });
            res.status(201).json({ result });
        } else {
            res.status(400).json({ message: 'Invalid timeline item data' });
        }
                
    } catch (error) {
        // Handle errors and pass them to the Express error handler
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

// update a timeline item
app.put('/timeline-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // sanitize

        const updatedElement = await timelineDB.updateTimelineElement(id, updateData);
        if (updatedElement) {
            res.status(200).json({ updatedElement });
        } else {
            res.status(404).json({ message: 'Timeline item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// delete a timeline item
app.delete('/timeline-dashboard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedElement = await timelineDB.deleteTimelineElement(id);
        if (deletedElement) {
            res.status(200).json({ deletedElement });
        } else {
            res.status(404).json({ message: 'Timeline item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});














// Start the server

const PORT = process.env.PORT;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});










