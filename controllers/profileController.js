const User = require("../models/user");
require("passport");
const { uploadFile, getFileStream } = require("../routes/s3");
const util = require("util");
const fs = require("fs");
const unLinkFile = util.promisify(fs.unlink);
var {
  Parser,
  transforms: { unwind },
} = require("json2csv");

const profile_index = (req, res) => {
  const error = req.flash().error || [];
  if (req.isAuthenticated()) {
    // QUERY FOR ORDERS
    let id = req.user.id;
    User.findById(id, async (err, foundUser) => {
      if (foundUser) {
        let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
        let dateObj = req.user.createdAt;
        let createdDate = dateObj.toString().slice(4, 16);
        const error = req.flash().error || [];

        res.render("profile", {
          error,
          currentUser: req.user.username,
          currentCompany: req.user.company,
          currentLocation: req.user.location,
          currentPosition: req.user.position,
          memberStatus: createdDate,
          navbar: navbarLoggedIn,
          userPFP: req.user.userimage,
        });
      }
    });
  } else {
    res.redirect("login");
  }
};

const profile_image = async (req, res) => {
  if (req.isAuthenticated()) {
    const key = req.params.key;
    const readStream = getFileStream(key);
    readStream.pipe(res);
  }
};

const profile_pfp_upload = async (req, res) => {
  if (req.isAuthenticated()) {
    const file = req.file;
    const result = await uploadFile(file);
    User.findOne({ username: req.user.username }, (err, foundUser) => {
      if (foundUser) {
        foundUser.userimage = result["Key"];
        foundUser.save((err) => {
          if (err) {
            console.log("THIS IS A SAVING ERROR--> " + err);
          }
        });
      }
    });
    await unLinkFile(file.path);
    res.redirect("/profile");
  } else {
    res.flash("error", "Profile picture was not updated.");
    res.redirect("login");
  }
};

const profile_profile_update = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      await User.findOne(
        { username: req.user.username } || { googleId: req.user.googleId },
        (err, foundUser) => {
          if (foundUser) {
            const newUpdate = {
              username: req.body.username,
              company: req.body.company,
              location: req.body.location,
              position: req.body.position,
            };
            while (newUpdate) {
              if (
                newUpdate.username.trim().length >= 3 &&
                newUpdate.username !== User.find({ username: { $ne: null } })
              ) {
                foundUser.username = newUpdate["username"];
              } else {
                req.flash("error", "username is taken");
                res.redirect("/profile");
                return;
              }
              if (newUpdate.company.trim().length >= 3) {
                foundUser.company = newUpdate["company"];
              }
              if (newUpdate.location.trim().length >= 3) {
                foundUser.location = newUpdate["location"];
              }
              if (newUpdate.position.trim().length >= 3) {
                foundUser.position = newUpdate["position"];
              }
              foundUser.save((err) => {
                if (err) {
                  console.log(err);
                }
              });
              break;
            }
            req.flash("error", "username is taken");
            res.redirect("/profile");
          } else {
            res.redirect("/");
          }
        }
      );
    }
  } catch (error) {}
};
const profile_csv = async (req, res) => {
  if (req.isAuthenticated()) {
    let foundUser = await User.findOne({ username: req.user.username });
    if (foundUser) {
      const userPurchases = foundUser.purchases;
      const fields = ["name", "order", "duration", "asset"];
      const json2cvsParser = new Parser({ fields });
      try {
        const csv = await json2cvsParser.parse(userPurchases);
        res.attachment(`${req.user.username}-purchases.csv`);
        res.status(200).send(csv);
        req.flash("success", "successful download");
      } catch (error) {
        console.log("error:", error.message);
        res.status(500).send(error.message);
      }
    }
  }
};
const profile_deletion = async (req, res) => {
  if (req.isAuthenticated()) {
    let checkedBox = req.body.destroy;
    if (checkedBox === "on") {
      await User.findOneAndDelete(
        {
          username: req.user.username,
        } || { googleId: req.user.googleId }
      )
        .then(
          req.flash("success", "Your account was deleted"),
          req.destroy(),
          req.logout(),
          res.redirect("/")
        )
        .catch((err) => req.flash("error", "Something went wrong"));
    }
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
