const User = require("../models/user");

exports.updateName = async (req, res) => {
  try {

    const name = req.body.name?.trim();
    
    if(!name){
        return res.status(400).json({
            message: "Name is Require for Edit"
        });
    }

    const user = await User.findByIdAndUpdate(
        req.userId,
        {name: name},
        { new: true, runValidators: true }
    ).select("-password")

     if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
     res.status(200).json({
      message: "Name updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
