

// Create Token and saving in cookie
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.SECRET);
    } catch (e) {
        return false;
    }
}



export default generateToken