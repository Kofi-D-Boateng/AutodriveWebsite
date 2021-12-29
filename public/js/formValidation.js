$("#submitButton").on("click", () => {
  if (
    $("#username").val().length == "" &&
    $("#company").val().length == "" &&
    $("#position").val().length == "" &&
    $("#location").val().length == ""
  ) {
    return false;
  } else {
    return true;
  }
});
