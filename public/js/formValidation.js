$("#newPassword, #confirmedPassword").on("keyup", function () {
  if ($("#newPassword").val() == $("#confirmedPassword").val()) {
    $("#confirmedPassword").css("color", "green");
  } else $("#confirmedPassword").css("color", "red");
});
