import jwt from "jsonwebtoken"


const authMiddleWare = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            res.status(401).json({ msg: "Invalid Token" });
        }

        const decode = jwt.verify(token, "mySecretKey")
        req.user = decode;
        next()
    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: error })
    }
}
export default authMiddleWare