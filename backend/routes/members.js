const express = require('express')
const router  = express.Router();

const members = [
    {
        id: 1, 
        name: 'Warren Kavanagh',
        email: 'C16463344@MYTudublin.ie',
        status: 'Online'
    },
    {
        id: 2, 
        name: 'John Bob',
        email: 'John@MYTudublin.ie',
        status: 'Offline'
    }
];


router.get('/',(req,res) => {
    res.json(members);
})

export default router;