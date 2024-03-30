const {
    Schema,
    model
  } = require("mongoose");
  
  const UserSchema = new Schema({
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    username: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true,
    },
  });
  
  const UserModel = model("user", UserSchema)
  
  export default UserModel