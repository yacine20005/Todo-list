let express = require('express');
let router = express.Router();
const Firestore = require('@google-cloud/firestore');
const fs = require('fs');
const path = require('path');

const firestoreConfig = {
    projectId: process.env.FIRESTORE_PROJECT_ID || 'cours-angular-263913',
};

const envKeyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : null;
const defaultKeyFilePath = path.resolve(__dirname, '../firestore-owner.json');
const keyFilePath = envKeyFilePath || defaultKeyFilePath;

if (keyFilePath && fs.existsSync(keyFilePath)) {
    firestoreConfig.keyFilename = keyFilePath;
}

const db = new Firestore(firestoreConfig);

router.get('/', async function (req, res, next) {
    const delay = req.query.delay;
    if (delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    const docArrays = await db.collection('todos').listDocuments();
    const todos = [];
    for (const doc of docArrays) {
        const docRef = await doc.get();
        todos.push({
            label: docRef.get('label'),
            done: docRef.get('done'),
            creationDate: docRef.get('creationDate'),
            id: doc.id
        })
    }
    res.json({
        todos: todos
    });
});

router.post('/', function (req, res, next) {
    const label = req.body.label;
    if (label == null || typeof label == 'undefined') {
        res.status(400).end();
    } else {
        db.collection('todos').add({
            label: label,
            done: false,
            creationDate: new Date().valueOf()
        }).then(async todoDoc => {
            const docSnap = await todoDoc.get();
            res.json({
                label: docSnap.get('label'),
                done: docSnap.get('done'),
                creationDate: docSnap.get('creationDate'),
                id: todoDoc.id
            })
        })
    }
});

router.put('/:id', async function (req, res, next) {
    const label = req.body.label;
    const isDone = req.body.done;
    if (label == null || typeof label == 'undefined' || isDone == null || typeof isDone == 'undefined') {
        res.status(400).end();
    } else {
        const doc = await fetchDocWithId(req.params.id);
        if (doc == null) {
            res.status(404).end();
            return;
        }
        await doc.update({
            label: label,
            done: isDone
        });
        const docSnap = await db.collection('todos').doc(req.params.id).get();
        res.json({
            label: docSnap.get('label'),
            done: docSnap.get('done'),
            creationDate: docSnap.get('creationDate'),
            id: doc.id
        })
    }
});

router.delete('/:id', async function (req, res, next) {
    await db.collection('todos').doc(req.params.id).delete();
    res.status(200).end()
});

async function fetchDocWithId(id) {
    return await db.collection('todos').doc(id);
}


router.get('/:username/todos', function (req, res, next) {
    db.collection('todos').doc(req.params.username).collection('todos').get().then(snapshot => {
        res.json({
            todos: snapshot.docs.map(todoDoc => todoDoc.data())
        })
    });
});

module.exports = router;
