import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      role: 'admin',
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { 
      httpOnly: true, 
      secure: true,
      
      
     }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// logout

const logoutUser = (req,res) => {
  res.clearCookie('token').json({
    success: true,
    message: "Logged out successfully!",

  })
}


//auth middleware
const authMiddleware = async(req,res,next) => {
  
  const token = req.headers.authorization?.replace("Bearer ", "");
  if(!token) return res.status(401).json({

    success: false,
      message: "Unauthorised user!",

  })

  try {

    const decoded = jwt.verify(token,"CLIENT_SECRET_KEY");
    req.user = decoded;
    next()


  }catch(error){
    res.status(401).json({

      success: false,
      message: "Unauthorised user!",

    })
  }


}




export { registerUser, loginUser, logoutUser, authMiddleware };