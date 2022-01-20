import jwt from 'jsonwebtoken'
const jwt = require("jsonwebtoken");

function signTokenAndSetCookie(userId) {
    return jwt.sign(
        {
            userId,
        },
        process.env.SECRET,
        { expiresIn: "30d" }
    );
}

export default signTokenAndSetCookie 