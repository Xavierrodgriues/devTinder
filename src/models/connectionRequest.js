const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    
    fromUserId: {
        required: true,
        ref: "User", // refrence to the User model
        type: mongoose.Schema.Types.ObjectId
    },
    toUserId: {
        required: true,
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        required: true,
        type: String, // ignored, accpeted, rejected, interested
        enum: {
            values: ["ignored", "rejected", "accepted", "interested"],
            message: `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps: true
})

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this; 
    // CHECK IF THE FORMUSERID IS SAME AS TOUSERID
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You Cannot send connection request to your self");
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;