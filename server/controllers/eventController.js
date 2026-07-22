const Event = require('../models/Event');

exports.getAllEvents = async(req,res)=>{
    try {

        const filters = {};
        if (req.query.category) {
            filters.category = req.query.category;

        }
        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice;
            
        }


        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};


exports.getEventById = async(req,res)=>{
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            res.status(402).json({error:'event not found'});

        }
        res.json(event);
    } catch (error) {
         res.status(402).json({error: error.messsage});

    }
};

exports.createEvent = async(req,res)=>{
    const {title,description,date,location,category,totalSeats,ticketPrice,imageUrl} = req.body;

    try {
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            image
        });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
};

exports.updateEvent = async(req,res)=>{
    const {title,description,date,location,category,totalSeats,ticketPrice,imageUrl} = req.body;

    try {
        const event = await Event.findByIdAndUpdate(req.params.id,{
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            image
        },{new:true});

        if (!event) {
           return res.status(400).json({error:'event not found'});
        }
        res.status(200).json(event);


    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

exports.deleteEvent = async(req,res)=>{
    try {
        const event  = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(400).json({error:'event not found'});
        }
        res.json({messgae:'Event deleted successfully'});
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};