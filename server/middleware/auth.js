const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes middleware
exports.protect = async (req, res, next) => {
  let token;

  // Check header for authorization token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } 
  // Else check if token exists in cookies (cookie name matches what authController sets)
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Auth Debug] Token verified for user ID: ${decoded.id}`);
    }
    
    // Fetch the user from DB or Mock
    const userRepository = require('../repositories/userRepository');
    req.user = await userRepository.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('User not found with this token', 401));
    }
    
    console.log("Authenticated user:", req.user._id);
    
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
