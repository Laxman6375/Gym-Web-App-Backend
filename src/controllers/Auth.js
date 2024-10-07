const User = require("../models/User");
const OTP = require("../models/Otp")
const otpGenerator = require("otp-generator");
const sendVerificationEmail = require("../services/sendVerificationEmail");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


exports.signUp = async(req,res)=>{
    try {
        const {firstName,lastName, email, password,weight,height,age} = req.body;
        if(!firstName,!lastName,!email,!password){
            return res.status(400).json({
                sucess: false,
                message: "All feilds marked with * are required"
            });
        }

        const user = await User.findOne({email})

        if(user && user.isVerified){
            return res.status(400).json({
                sucess: false,
                message: "User already exists"
            });
        }
        

        //generate otp
    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      // console.log("otp generated successfully", otp);
  
      //check unique otp or not
      let result = await OTP.findOne({ otp: otp });
  
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        result = await OTP.findOne({ otp: otp });
      }
  
      const otpPayload = { email, otp };
  
      await sendVerificationEmail(otpPayload)

        
      const hashedPassword = await bcrypt.hash(password, 10);

      if (user && !user.isVerified) {
        user.password = hashedPassword;
        await user.save();
    
        // Update OTP for the existing user, make sure to only update based on email, ignore `isVerified`
        await OTP.updateOne(
            { email},   // Query only by email to ensure we target the right document
            { otp},     // Update with new OTP
            { upsert: true } // Use upsert to create a new document if one doesn't exist
        );
    
    } else {
        // Create a new user and insert OTP
        user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            weight,
            height,
            age,
            isVerified:false
        });
        await user.save();
    
        // Insert OTP for the new user
        await OTP.updateOne(
            { email },
            { otp },
            { upsert: true }
        );
    }

        res.json({
            sucess: true,
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

exports.verifyEmail = async(req,res)=>{
    try {
        const {email, otp} = req.body;
        if(!email ||!otp){
            return res.status(400).json({
                sucess: false,
                message: "email and otp are required"
            });
        }

        const user = await User.findOne({ email: email});
        if(!user){
            return res.status(404).json({
                sucess: false,
                message: "User not found"
            });
        }

        const otpExists = await OTP.findOne({email: email});

        if(!otpExists){
            return res.status(404).json({
                sucess: false,
                message: "OTP is expired"
            });
        }

        if(otpExists.otp !== otp){
            return res.status(400).json({
                sucess: false,
                message: "Invalid OTP"
            });
        }

        await OTP.deleteOne({email:email});

        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            sucess: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error
        })
    }
}

exports.login = async(req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email ||!password){
            return res.status(400).json({
                sucess: false,
                message: "email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "User is not Registered with Us , Please SignUp to Continue",
          });
        }

         //generate JWT,after password matching
        if (await bcrypt.compare(password, user.password)) {

            if (!user.isVerified) {
                return res.status(400).json({
                    success: false,
                     message: "Please verify your email first" 
                    });
              }

            const payload = {
            email: user.email,
            id: user._id,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
            });
    
            user.token = token;
            user.password = undefined;
    
            //create cookie and send response
            const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in successfully",
            });
      } else {
            return res.status(401).json({
            success: false,
            message: "Password is Incorrect",
            });
      }

    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error
        })
    }
}