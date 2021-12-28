if (
  $("#username").val().length < 3 &&
  $("#company").val().length < 3 &&
  $("#position").val().length < 3 &&
  $("#location").val().length < 3
) {
  $(".updateForm").submit((e) => {
    e.preventDefault();
    return false;
  });
}
