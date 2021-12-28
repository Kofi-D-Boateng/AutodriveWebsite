$("#newPassword, #confirmedPassword").on("keyup", function () {
  if ($("#newPassword").val() == $("#confirmedPassword").val()) {
    $("#confirmedPassword").css("border-color", "green");
  } else $("#confirmedPassword").css("border-color", "red");
});
