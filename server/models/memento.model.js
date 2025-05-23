import {Schema, model} from "mongoose";

const mementoSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        visitedLocation:{
            type: [String],
            default: []
        },
        isFavourite:{
            type: Boolean,
            default: false
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        createdOn:{
            type: Date,
            default: Date.now
        },
        imageUrl: {
            type: String,
            required: true
        },
        visitedDate:{
            type: Date,
            required: true
        },
        public_id: {
            type: String,
            default: null
        },
    },{timestamps: true}
)

export const Memento = model("Memento", mementoSchema);