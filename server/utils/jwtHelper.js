// Helper function to generate JWT and send response with cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true, // Cookie cannot be accessed by client side scripts (XSS protection)
  };

  // Enable secure cookies in production (requires HTTPS)
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'none'; 
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });
};

module.exports = sendTokenResponse;
