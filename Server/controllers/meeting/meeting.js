const MeetingHistory = require("../../model/schema/meeting");
const mongoose = require("mongoose");

const add = async (req, res) => {
  try {
    const meeting = new MeetingHistory(req.body);
    await meeting.save();
    res.status(200).json({ message: "Meeting created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const index = async (req, res) => {
  try {
    const query = { ...req.query, deleted: false };
    const meetings = await MeetingHistory.find(query)
      .populate({ path: "attendes", select: "-__v -deleted" })
      .populate({ path: "attendesLead", select: "-__v -deleted" })
      .populate({ path: "createBy", select: "-__v -deleted" })
      .exec();
    res.status(200).json({ meetings });
  } catch (error) {
    console.log(`Error in meeting index: ${error}`);
    res.status(500).json({ error: error.message || error });
  }
};

const view = async (req, res) => {
  try {
    const meeting = await MeetingHistory.findOne({ _id: req.params.id })
      .populate({ path: "attendes", select: "-__v -deleted" })
      .populate({ path: "attendesLead", select: "-__v -deleted" })
      .populate({ path: "createBy", select: "-__v -deleted" });
    if (!meeting) return res.status(404).json({ message: "No Data Found." });
    res.status(200).json(meeting);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const deleteData = async (req, res) => {
  try {
    const meeting = await MeetingHistory.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.status(200).json({ message: "Meeting deleted successfully", meeting });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

const deleteMany = async (req, res) => {
  try {
    const meetingIds = req.body; // expecting array of IDs
    const result = await MeetingHistory.updateMany(
      { _id: { $in: meetingIds } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "Meetings deleted successfully", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || error });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
