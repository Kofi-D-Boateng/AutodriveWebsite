const User = require("../models/user");
require("passport");
const { uploadFile, getFileStream, deleteFile } = require("../utils/s3");
const util = require("util");
const fs = require("fs");
const unLinkFile = util.promisify(fs.unlink);
const { Parser } = require("json2csv");
const { navbarLoggedIn } = require("../utils/constants");

const profile_index = (req, res) => {
  const flashMessage = req.flash();
  console.log(flashMessage);
  // THE .isAuthenticated calls on passport.js to check for authentication into the site.
  if (req.isAuthenticated()) {
    const { username, company, location, position, createdAt, userimage } =
      req.user;
    const createdDate = createdAt.toString().slice(4, 16);
    // QUERY FOR ORDERS
    let id = req.user.id;
    User.findById(id, async (err, foundUser) => {
      if (foundUser) {
        res.render("profile", {
          flash: flashMessage,
          currentUser: username ? username : "N/A",
          currentCompany: company ? company : "N/A",
          currentLocation: location ? location : "N/A",
          currentPosition: position ? position : "N/A",
          memberStatus: createdDate,
          navbar: navbarLoggedIn,
          userPFP: userimage,
        });
      }
    });
  } else {
    res.redirect("login");
  }
};

const profile_image = async (req, res) => {
  const { key } = req.params;
  if (req.isAuthenticated()) {
    const readStream = getFileStream(key);
    readStream.pipe(res);
  }
};

// UPLOADS PROFILE IMAGE TO AWS S3 BUCKET
const profile_pfp_upload = async (req, res) => {
  const { file } = req;
  const { username } = req.user;

  if (!req.isAuthenticated()) {
    req.destroy();
    res.redirect("/");
    return;
  }

  try {
    const result = await uploadFile(file);
    await User.findOne(
      {
        username: username,
      },
      (err, foundUser) => {
        if (foundUser) {
          // WE ARE SAVING A POINTER TO THE IMAGE IN AWS.
          foundUser.userimage = result.Key;
          foundUser.save((err) => {
            if (err) {
              req.flash("error", "There was an error saving your profile pic");
              res.redirect("/profile");
            }
          });
        }
      }
    );
    // DELETING PHOTOS FROM BEING SAVED ON BACKEND.
    await unLinkFile(file.path);
    res.redirect("/profile");
    req.flash("success", "Successfully uploaded photo.");
  } catch (error) {
    req.flash("error", "Profile picture was not updated.");
    res.redirect("/profile");
  }
};

const profile_profile_update = async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/");
  }
  const { googleId, username } = req.user;
  const { body } = req;
  const newUpdate = {
    username: body.username,
    company: body.company,
    location: body.location,
    position: body.position,
  };
  let count = 0;

  try {
    const doc = await User.findOne({ username: username || googleId });
    while (count < 4) {
      if (
        newUpdate.username.trim().length >= 3 &&
        newUpdate.username !==
          (await User.findOne({ username: newUpdate.username }))
      ) {
        doc.username = newUpdate["username"];
        console.log("made it to -> 1");
      }
      count++;
      if (newUpdate.company.trim().length >= 3) {
        doc.company = newUpdate["company"];
        console.log("made it to -> 2");
      }
      count++;
      if (newUpdate.location.trim().length >= 3) {
        doc.location = newUpdate["location"];
        console.log("made it to -> 3");
      }
      count++;
      if (newUpdate.position.trim().length >= 3) {
        doc.position = newUpdate["position"];
        console.log("made it to -> 4");
      }
      count++;
    }
    await doc.save();
    req.flash("success", "Successfully updated your profile.");
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    req.flash("error", "username is taken");
    res.redirect("/profile");
  }
};
const profile_csv = async (req, res) => {
  if (req.isAuthenticated()) {
    let foundUser = await User.findOne({
      username: req.user.username,
    });
    if (foundUser.purchases.length > 0) {
      const userPurchases = foundUser.purchases;
      const fields = ["name", "order", "duration", "asset"];
      const json2cvsParser = new Parser({
        fields,
      });
      try {
        const csv = json2cvsParser.parse(userPurchases);
        res.attachment(`${req.user.username}-purchases.csv`);
        res.status(200).send(csv);
        req.flash("success", "successfully download");
      } catch (error) {
        req.flash(
          "error",
          "There was an error grabbing the item you requested."
        );
      }
    } else {
      req.flash("error", "You have no purchases as of now.");
      return;
    }
  }
};

const profile_deletion = async (req, res) => {
  const checkedBox = req.body.destroy;
  if (!req.isAuthenticated() || checkedBox !== "on") {
    req.flash("error", "Account was not deleted. Please check the box.");
    req.destroy();
    res.redirect("/");
    return;
  }
  try {
    let query = await User.findOne({
      username: req.user.username,
    });
    const key = await query.userimage;
    if (key !== process.env.PROFILE_PIC_KEY) {
      deleteFile(key);
    }
    await User.findOneAndDelete(
      {
        username: req.user.username,
      } || {
        googleId: req.user.googleId,
      },
      (err) => {
        if (!err) {
          req.flash("success", "Your account was deleted."),
            res.clearCookie("connect.sid");
          req.logout();
          res.redirect("/");
          return;
        }
      }
    );
  } catch (error) {
    req.flash("error", "Account was not deleted. Please check the box.");
    req.destroy();
    res.redirect("/");
  }
};
module.exports = {
  profile_index,
  profile_image,
  profile_pfp_upload,
  profile_profile_update,
  profile_csv,
  profile_deletion,
};
