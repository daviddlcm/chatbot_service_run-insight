
const verifyInternalToken = (req, res, next) => {
    try{
    const internalToken = req.headers['x-internal-token'];
    if (!internalToken) {
        return res.status(401).json({ message: 'Internal token is required' }); 
    }
    if (internalToken !== process.env.INTERNAL_TOKEN) {
        return res.status(403).json({ message: 'Forbidden: Invalid internal token' });
    }
    
    next();

    }catch(e){
        return res.status(500).json({message: "Internal server error"})
    }
}

module.exports = {
    verifyInternalToken
}